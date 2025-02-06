import { EnrollmentRepository, ProjectRepository } from '@involvemint/server/core/domain-services';
import {
  calculateEnrollmentStatus,
  CreateProjectDto,
  defaultProjectListingStatus,
  DeleteProjectDto,
  DeleteProjectImageDto,
  EnrollmentStatus,
  generateProjectCustomWaiverFilePath,
  generateProjectImageFilePath,
  GetProjectDto,
  ImStorageFileRoots,
  Project,
  ProjectsQueryDto,
  ProjectsSpDto,
  UpdateProjectDto,
  UploadCustomWaiverDto,
  UploadProjectImageDto,
  Query,
  parseQuery
} from '@involvemint/shared/domain';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../storage/storage.service';
import { DbTransactionCreator } from '../transaction-creator/transaction-creator.service';
import { getDefaultAddress } from '@involvemint/shared/domain';

@Injectable()
export class ProjectService {
  readonly permissions = {
    userIsServeAdmin: async (token: string, spId: string) => {
      const user = await this.auth.validateUserToken(token, {
        changeMaker: { id: true },
        serveAdmins: { servePartner: { id: true, name: true } },
      });
      if (!user.serveAdmins.some((sa) => sa.servePartner.id === spId)) {
        throw new HttpException(` You are not a ServeAdmin of the ServePartner.`, HttpStatus.UNAUTHORIZED);
      }
      return user;
    },
  };

  constructor(
    private readonly projectRepo: ProjectRepository,
    private readonly auth: AuthService,
    private readonly storage: StorageService,
    private readonly dbTransaction: DbTransactionCreator,
    private readonly enrollmentRepo: EnrollmentRepository
  ) {}

  // TODO dto criteria
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAll(query: Query<Project[]>, dto: ProjectsQueryDto) {
    return this.projectRepo.query(query, { where: { listingStatus: 'public' } });
  }

  async getOne(query: Query<Project>, token: string, dto: GetProjectDto) {
    let userIsEnrolled = false;
    const project = await this.projectRepo.findOneOrFail(dto.projectId, { id: true, listingStatus: true });
    if (token) {
      const user = await this.auth.validateUserToken(token, {
        changeMaker: {
          enrollments: {
            project: { id: true },
            dateApplied: true,
            dateApproved: true,
            dateDenied: true,
            dateRetired: true,
            dateSubmitted: true,
          },
        },
      });
      userIsEnrolled =
        user.changeMaker?.enrollments.some(
          (e) => e.project.id === project.id && calculateEnrollmentStatus(e) === EnrollmentStatus.enrolled
        ) ?? false;
    }
    if (project.listingStatus === 'private' && !userIsEnrolled) {
      throw new HttpException('This project is private.', HttpStatus.UNAUTHORIZED);
    }
    return this.projectRepo.findOneOrFail(dto.projectId, query);
  }

  async getAllOwnedBySp(query: Query<Project[]>, token: string, { spId }: ProjectsSpDto) {
    await this.permissions.userIsServeAdmin(token, spId);
    return this.projectRepo.query(query, { where: { servePartner: spId } });
  }

  async create(query: Query<Project[]>, token: string, dto: CreateProjectDto) {
    await this.permissions.userIsServeAdmin(token, dto.spId);

    return this.projectRepo.upsert(
      {
        id: uuid.v4(),
        servePartner: dto.spId,
        title: '',
        imagesFilePaths: [],
        dateCreated: new Date(),
        dateUpdated: new Date(),
        address: {
          id: uuid.v4(),
          address1: '',
          city: '',
          state: '',
          zip: '',
        },
        listingStatus: defaultProjectListingStatus,
        description: '',
        preferredScheduleOfWork: '',
        requireLocation: true,
        requireImages: true,
        creditsEarned: 3600,
        maxChangeMakers: 5,
        enrollments: [],
        questions: [],
        projectDocuments: [],
        requireCustomWaiver: false,
      },
      query
    );
  }

  async update(query: Query<Project>, token: string, { projectId, changes }: UpdateProjectDto) {
    const project = await this.projectRepo.findOneOrFail(projectId, { servePartner: { id: true } });
    await this.permissions.userIsServeAdmin(token, project.servePartner.id);
    return this.projectRepo.update(projectId, { ...changes, dateUpdated: new Date() }, query);
  }

  async delete(query: Query<{ deletedId: string }>, token: string, dto: DeleteProjectDto) {
    const project = await this.projectRepo.findOneOrFail(dto.projectId, {
      servePartner: { id: true },
      imagesFilePaths: true,
      customWaiverFilePath: true,
      enrollments: { id: true },
    });
    await this.permissions.userIsServeAdmin(token, project.servePartner.id);

    await this.dbTransaction.run(async () => {
      await this.enrollmentRepo.deleteMany(project.enrollments.map((e) => e.id));
      await this.projectRepo.delete(dto.projectId);
    });

    await Promise.all([
      ...(project.customWaiverFilePath ? [this.storage.deleteFile(project.customWaiverFilePath)] : []),
      ...project.imagesFilePaths.map((path) => this.storage.deleteFile(path)),
    ]);
    return parseQuery(query, { deletedId: dto.projectId });
  }

  async uploadImages(
    query: Query<Project>,
    token: string,
    dto: UploadProjectImageDto,
    files: Express.Multer.File[]
  ) {
    const project = await this.projectRepo.findOneOrFail(dto.projectId, {
      servePartner: { id: true },
      imagesFilePaths: true,
    });
    await this.permissions.userIsServeAdmin(token, project.servePartner.id);

    const imagesFilePaths = await Promise.all(
      files.map(async (file) => {
        const ext = this.storage.extractFileExtension(file.originalname);
        const filename = `${uuid.v4()}.${ext}`;
        const path = generateProjectImageFilePath({
          root: ImStorageFileRoots.projectImages,
          projectId: dto.projectId,
          filename,
        });
        await this.storage.upload(path, file);
        return path;
      })
    );

    return this.projectRepo.update(
      dto.projectId,
      { imagesFilePaths: [...project.imagesFilePaths, ...imagesFilePaths] },
      query
    );
  }

  async deleteImage(query: Query<Project>, token: string, dto: DeleteProjectImageDto) {
    const project = await this.projectRepo.findOneOrFail(dto.projectId, {
      servePartner: { id: true },
      imagesFilePaths: true,
    });
    await this.permissions.userIsServeAdmin(token, project.servePartner.id);

    await this.storage.deleteFile(project.imagesFilePaths[dto.index]);

    return this.projectRepo.update(
      dto.projectId,
      { imagesFilePaths: project.imagesFilePaths.filter((_, i) => i !== dto.index) },
      query
    );
  }

  async uploadCustomWaiver(
    query: Query<Project>,
    token: string,
    dto: UploadCustomWaiverDto,
    file: Express.Multer.File
  ) {
    const project = await this.projectRepo.findOneOrFail(dto.projectId, {
      servePartner: { id: true },
      imagesFilePaths: true,
    });
    await this.permissions.userIsServeAdmin(token, project.servePartner.id);

    const ext = this.storage.extractFileExtension(file.originalname);
    const filename = `${uuid.v4()}.${ext}`;
    const path = generateProjectCustomWaiverFilePath({
      root: ImStorageFileRoots.projectCustomWaiver,
      projectId: dto.projectId,
      filename,
    });
    await this.storage.upload(path, file);

    return this.projectRepo.update(
      dto.projectId,
      { customWaiverFilePath: path, requireCustomWaiver: true },
      query
    );
  }
}
