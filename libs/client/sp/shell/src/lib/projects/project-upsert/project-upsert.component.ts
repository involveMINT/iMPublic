import { formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ImImagesViewerModalService } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import {
  ConfirmComponentDeactivation,
  parseOneFile,
  parseOneImageFile,
  StatefulComponent,
  StatusService,
} from '@involvemint/client/shared/util';
import {
  EnrollmentSpStoreModel,
  PoiSpStoreModel,
  ProjectSpStoreModel,
  ServePartnerFacade,
} from '@involvemint/client/sp/data-access';
import {
  calculateCreditsEarnedForPoi,
  calculateEnrollmentStatus,
  calculatePoiStatus,
  defaultProjectListingStatus,
  EnrollmentStatus,
  environment,
  ImConfig,
  PoiStatus,
  ProjectDocument,
  ProjectListingStatus,
  Question,
  IProps
} from '@involvemint/shared/domain';
import { parseDate, STATES, tapOnce } from '@involvemint/shared/util';
import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { compareAsc, compareDesc, isAfter } from 'date-fns';
import { merge } from 'rxjs';
import { auditTime, filter, map, skip, switchMap, tap } from 'rxjs/operators';
import * as uuid from 'uuid';

type SavingState = 'unchanged' | 'changed' | 'saving';

interface State {
  project: ProjectSpStoreModel | null;
  enrollments: EnrollmentSpStoreModel[];
  pois: (PoiSpStoreModel & { status: PoiStatus })[];
  savingState: SavingState;
  loaded: boolean;
  activeTabIndex: number;
}

@Component({
  selector: 'sp-project-upsert',
  templateUrl: './project-upsert.component.html',
  styleUrls: ['./project-upsert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectUpsertComponent
  extends StatefulComponent<State>
  implements OnInit, ConfirmComponentDeactivation
{
  readonly projectForm = new FormGroup({
    listingStatus: new FormControl<ProjectListingStatus>(defaultProjectListingStatus, (e) =>
      Validators.required(e)
    ),
    title: new FormControl('', (e) => Validators.required(e)),
    description: new FormControl('', [
      (e) => Validators.required(e),
      Validators.maxLength(ImConfig.maxDescriptionLength),
    ]),
    address1: new FormControl('', (e) => Validators.required(e)),
    address2: new FormControl<string | undefined>(),
    city: new FormControl('', (e) => Validators.required(e)),
    state: new FormControl('', (e) => Validators.required(e)),
    zip: new FormControl('', [(e) => Validators.required(e), Validators.pattern(ImConfig.regex.zipCode)]),
    projectDocuments: new FormArray<ProjectDocument>([]),
    questions: new FormArray<Question>([]),
    preferredScheduleOfWork: new FormControl('', (e) => Validators.required(e)),
    creditsEarned: new FormControl<number>(0, (e) => Validators.required(e)),
    requireLocation: new FormControl(true, (e) => Validators.required(e)),
    requireImages: new FormControl(true, (e) => Validators.required(e)),
    startDate: new FormControl<Date>(new Date(), (e) => Validators.required(e)),
    endDate: new FormControl<Date>(new Date()),
    requireCustomWaiver: new FormControl<boolean>(false, (e) => Validators.required(e)),
    maxChangeMakers: new FormControl<number>(0, [
      (e) => Validators.required(e),
      Validators.pattern(/^[0-9]*[1-9][0-9]*$/),
    ]),
  });

  get EnrollmentStatus() {
    return EnrollmentStatus;
  }

  get PoiStatus() {
    return PoiStatus;
  }

  enrollmentsPage = 1;
  poiPage = 1;

  @ViewChild('waiverInp') waiverInp!: ElementRef<HTMLInputElement>;

  projectId = '';

  readonly maxImagesPerItem = new Array(ImConfig.maxImagesPerItem);

  selectedUSState = '';

  maxCharLen = ImConfig.maxDescriptionLength;

  deepLink = '';

  activeTabIndex = 0;

  readonly listingOptions: ProjectListingStatus[] = ['public', 'private', 'unlisted'];

  readonly USStates = STATES;

  readonly documents = this.projectForm.get('projectDocuments') as FormArray;
  readonly maxDocuments = ImConfig.maxProjectDocuments;

  readonly questions = this.projectForm.get('questions') as FormArray;
  readonly maxQuestions = ImConfig.maxProjectQuestions;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly route: RouteService,
    private readonly sp: ServePartnerFacade,
    private readonly status: StatusService,
    private readonly imgViewer: ImImagesViewerModalService
  ) {
    super({
      savingState: 'unchanged',
      loaded: false,
      activeTabIndex: 0,
      project: null,
      pois: [],
      enrollments: [],
    });

    this.projectForm.setValidators((ac) => {
      const startDate = ac.get('startDate')?.value;
      const endDate = ac.get('endDate')?.value;
      if (!startDate || !endDate) return;
      const notAfter = !isAfter(new Date(endDate), new Date(startDate));
      this.projectForm.controls.endDate.setErrors(notAfter ? { endDateNotAfter: true } : null);
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate() {
    return this.state.savingState === 'unchanged';
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.back();
      return;
    }
    this.projectId = id;

    this.deepLink = `${environment.appUrl}${this.route.rawRoutes.path.projects.ROOT}/${id}`;

    this.effect(() =>
      merge(
        this.sp.projects.actionListeners.updateProject.success,
        this.sp.projects.actionListeners.updateProject.error
      ).pipe(tap(() => this.updateState({ savingState: 'unchanged' })))
    );

    this.effect(() =>
      this.sp.projects.selectors.getProject(id).pipe(
        tap(({ loaded }) => this.updateState({ loaded })),
        filter(({ project, loaded }) => loaded && !!project),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        map(({ project }) => project!),
        tapOnce((project) => {
          const {
            address: { address1, address2, state, zip, city },
            description,
            endDate,
            listingStatus,
            maxChangeMakers,
            preferredScheduleOfWork,
            requireLocation,
            requireImages,
            startDate,
            creditsEarned,
            title,
            requireCustomWaiver,
          } = project;

          this.projectForm.patchValue(
            {
              address1,
              address2,
              state,
              zip,
              city,
              description,
              maxChangeMakers,
              preferredScheduleOfWork,
              requireLocation,
              requireImages,
              creditsEarned: creditsEarned / 100,
              title,
              listingStatus,
              requireCustomWaiver,
              startDate: startDate ? formatDate(parseDate(startDate), 'yyyy-MM-dd', 'en') : '',
              endDate: endDate ? formatDate(parseDate(endDate), 'yyyy-MM-dd', 'en') : '',
            },
            { emitEvent: false }
          );
          project.projectDocuments.forEach((doc) => this.documents.push(this.newDoc(doc)));
          project.questions.forEach((doc) => this.questions.push(this.newQuestion(doc)));
          this.selectedUSState = state;
        }),
        tap((project) =>
          this.updateState({
            project: {
              ...project,
            },
            activeTabIndex: this.activeTabIndex,
          })
        ),
        switchMap(() => this.projectForm.valueChanges),
        auditTime(0),
        skip(1),
        tap(() => this.updateState({ savingState: 'changed' }))
      )
    );
  }

  back() {
    return this.route.back(() => this.route.to.sp.myProjects.ROOT({ animation: 'back' }));
  }

  tabChangeEvent(event: number) {
    if (typeof event !== 'number') {
      return;
    }
    this.activeTabIndex = event;

    if (event === 2) {
      this.updateState({ loaded: false });
      this.effect(() =>
        this.sp.pois.selectors.getPoisByProject(this.projectId).pipe(
          tap(({ pois, projectsLoaded }) => {
            this.updateState({
              pois: pois
                .sort((a, b) => compareDesc(parseDate(a.dateCreated), parseDate(b.dateCreated)))
                .map((poi) => ({ ...poi, status: calculatePoiStatus(poi) })),
              loaded: projectsLoaded.some((p) => p === this.projectId),
            });
          })
        )
      );
    } else if (event === 1) {
      this.updateState({ loaded: false });
      this.effect(() =>
        this.sp.enrollments.selectors.getEnrollmentsByProject(this.projectId).pipe(
          tap(({ enrollments, projectsLoaded }) => {
            this.updateState({
              enrollments: enrollments.sort((a, b) =>
                compareDesc(parseDate(a.dateApplied), parseDate(b.dateApplied))
              ),
              loaded: projectsLoaded.some((p) => p === this.projectId),
            });
          })
        )
      );
    }
  }

  refresh() {
    this.sp.projects.dispatchers.refresh();
  }

  USStateChange(state: Event): void {
    this.projectForm.patchValue({ state: (state as CustomEvent).detail.value }, { emitEvent: true });
  }

  listingStatusChanged(state: Event): void {
    this.projectForm.patchValue({ listingStatus: (state as CustomEvent).detail.value }, { emitEvent: true });
  }

  addDocument() {
    this.documents.push(this.newDoc({ id: uuid.v4(), description: '', infoUrl: '', title: '' }));
  }

  deleteDoc(i: number) {
    this.documents.removeAt(i);
  }

  private newDoc(doc: IProps<ProjectDocument>): FormGroup {
    return new FormGroup<IProps<ProjectDocument>>({
      id: new FormControl(doc.id, (e) => Validators.required(e)),
      title: new FormControl(doc.title, (e) => Validators.required(e)),
      description: new FormControl(doc.description, (e) => Validators.required(e)),
      infoUrl: new FormControl(
        doc.infoUrl,
        Validators.compose([(e) => Validators.required(e), Validators.pattern(ImConfig.regex.url)])
      ),
    });
  }

  addQuestion() {
    this.questions.push(this.newQuestion({ id: uuid.v4(), text: '' }));
  }

  deleteQuestion(i: number) {
    this.questions.removeAt(i);
  }

  private newQuestion(question: IProps<Question>): FormGroup {
    return new FormGroup<IProps<Question>>({
      id: new FormControl(question.id, (e) => Validators.required(e)),
      text: new FormControl(question.text, (e) => Validators.required(e)),
    });
  }

  async editTCEarned() {
    // const amount = await this.amountEditorModalService.open({
    //   amount: this.upsertProjectForm.value.creditsEarned,
    //   mode: 'pricePicker',
    // });
    // if (typeof amount !== 'number') return;
    // this.upsertProjectForm.patchValue({ creditsEarned: amount });
  }

  save(project: ProjectSpStoreModel) {
    this.updateState({ savingState: 'saving' });

    const {
      address1,
      address2,
      state,
      zip,
      city,
      description,
      endDate,
      listingStatus,
      maxChangeMakers,
      projectDocuments,
      preferredScheduleOfWork,
      questions,
      requireLocation,
      requireImages,
      startDate,
      creditsEarned,
      title,
      requireCustomWaiver,
    } = this.projectForm.value;

    this.sp.projects.dispatchers.updateProject({
      projectId: project.id,
      changes: {
        address: {
          id: project.address.id,
          address1: address1.trim(),
          address2: address2?.trim(),
          state: state.trim(),
          zip: zip.trim(),
          city: city.trim(),
        },
        description: description.trim(),
        endDate: new Date(endDate),
        listingStatus,
        maxChangeMakers,
        preferredScheduleOfWork: preferredScheduleOfWork.trim(),
        requireLocation,
        requireImages,
        startDate: new Date(startDate),
        creditsEarned: Number((creditsEarned * 100).toFixed(2)),
        title: title.trim(),
        projectDocuments: projectDocuments,
        questions: questions,
        requireCustomWaiver,
      },
    });
  }

  delete(project: ProjectSpStoreModel) {
    this.sp.projects.dispatchers.deleteProject(project);
  }

  uploadImage(project: ProjectSpStoreModel, event: Event) {
    let file: File | undefined;

    try {
      file = parseOneImageFile(event);
    } catch (error) {
      this.status.presentAlert({ title: 'Error', description: error.message });
    }

    if (!file) return;

    this.sp.projects.dispatchers.uploadImages(project, [file]);
  }

  deleteImage(project: ProjectSpStoreModel, imageIndex: number) {
    this.sp.projects.dispatchers.deleteImage(project, imageIndex);
  }

  // getFormQuestion(index: number) {
  //   return (this.projectForm.controls.questions as any).controls[index]
  //     .controls as FormGroup<ProjectDocument>;
  // }

  // getFormDocument(index: number) {
  //   const g = (this.projectForm.controls.projectDocuments as any).controls[index]
  //     .controls as FormGroup<ProjectDocument>;
  //   console.log(g);
  //   return g;
  // }

  // async viewImages(evt: ImImagesSlidesImageClicked): Promise<void> {
  //   await this.imagesViewer.open(evt);
  // }

  makeCoverImage(project: ProjectSpStoreModel, imageIndex: number) {
    const newCover = project.imagesFilePaths[imageIndex];
    this.sp.projects.dispatchers.updateProject({
      projectId: project.id,
      changes: {
        imagesFilePaths: [newCover, ...project.imagesFilePaths.filter((i) => i !== newCover)],
      },
    });
  }

  calculateEnrollmentStatus(enrollment: EnrollmentSpStoreModel) {
    return calculateEnrollmentStatus(enrollment);
  }

  calculateCreditsEarnedForPoi(poi: PoiSpStoreModel) {
    return calculateCreditsEarnedForPoi(poi);
  }

  processEnrollmentApplication(
    enrollment: EnrollmentSpStoreModel,
    project: ProjectSpStoreModel,
    approve: boolean
  ) {
    this.sp.enrollments.dispatchers.processEnrollmentApplication(enrollment, approve);
  }

  revertBackToPending(enrollment: EnrollmentSpStoreModel) {
    this.sp.enrollments.dispatchers.revertBackToPending(enrollment);
  }

  retire(enrollment: EnrollmentSpStoreModel) {
    this.sp.enrollments.dispatchers.retireEnrollment(enrollment);
  }

  viewImages(urls: string[], index: number) {
    this.imgViewer.open({ imagesFilePaths: urls, slideIndex: index });
  }

  approvePoi(poi: PoiSpStoreModel) {
    this.sp.pois.dispatchers.approve(poi);
  }

  getPausedResumedTimes(poi: PoiSpStoreModel) {
    return [
      ...poi.pausedTimes.map((t) => ({ date: t, type: 'paused' })),
      ...poi.resumedTimes.map((t) => ({ date: t, type: 'resumed' })),
    ].sort((a, b) => compareAsc(parseDate(a.date), parseDate(b.date)));
  }

  enrolleeHasAppliedMoreThanOnce(enrollment: EnrollmentSpStoreModel) {
    return this.state.enrollments.filter(
      (e) => e.id !== enrollment.id && e.changeMaker.id === enrollment.changeMaker.id
    );
  }

  uploadCustomWaiver(event: Event, project: ProjectSpStoreModel) {
    let file: File | undefined;
    try {
      file = parseOneFile(event);
    } catch (error) {
      this.status.presentAlert({ title: 'Error', description: error.message });
    }

    if (!file) return;

    this.sp.projects.dispatchers.uploadCustomWaiver(project, file);
  }

  uploadCustomWaiverButtonClick() {
    this.waiverInp.nativeElement.click();
  }

  getEnrollmentStatuses() {
    const statuses = {
      pending: 0,
      enrolled: 0,
      started: 0,
    };

    this.state.enrollments.forEach((e) => {
      switch (calculateEnrollmentStatus(e)) {
        case EnrollmentStatus.pending:
          statuses.pending++;
          break;

        case EnrollmentStatus.enrolled:
          statuses.enrolled++;
          break;

        case EnrollmentStatus.started:
          statuses.started++;
          break;
      }
    });

    return statuses;
  }
}
