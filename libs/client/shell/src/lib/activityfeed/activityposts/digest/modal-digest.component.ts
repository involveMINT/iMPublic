import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { PostStoreModel, UserFacade } from "@involvemint/client/shared/data-access";
import { StatefulComponent } from "@involvemint/client/shared/util";
import { ModalController } from "@ionic/angular";
import { compareDesc } from 'date-fns';
import { tap } from 'rxjs/operators';
import { parseDate } from '@involvemint/shared/util';
import { calculatePoiStatus, calculatePoiTimeWorked, Like, PoiStatus, Comment } from '@involvemint/shared/domain';

interface State {
    posts: Array<PostStoreModel & { status: PoiStatus; timeWorked: string; }>;
    loaded: boolean;
}

@Component({
    selector: 'app-modal-digest',
    templateUrl: './modal-digest.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDigestComponent extends StatefulComponent<State> implements OnInit {

    constructor(
        private readonly modalCtrl: ModalController,
        private readonly user: UserFacade
    ) { 
        super({ posts: [], loaded: false })
    }

    ngOnInit(): void {
        this.effect(() => 
            this.user.posts.selectors.digest_posts$.pipe(
                tap(({ posts, loaded }) => 
                this.updateState({
                    posts: posts
                    .sort((a, b) => 
                        compareDesc(parseDate(a.dateCreated ?? new Date()), parseDate(b.dateCreated ?? new Date()))
                    )
                    .map((post) => ({
                        ...post,
                        status: calculatePoiStatus(post.poi),
                        timeWorked: calculatePoiTimeWorked(post.poi)
                    })),
                    loaded: loaded
                })
                )
            )
        );
    }

    filterOnDate(obj: any[]) {
        const days = 7; // Past days you want to get
        const currDate = new Date();
        const lastDays = new Date(currDate.getTime() - (days * 24 * 60 * 60 * 1000));
        return obj.filter((p: any) => { 
            let incomingDate = p.dateCreated
            if (typeof incomingDate == "string") {
                incomingDate = new Date(p.dateCreated)
            }
            return incomingDate.getTime() > lastDays.getTime()
        });
    }

    filter(obj: any[]) {
        return obj.filter((p: any) => { 
            return this.filterOnDate(p.likes).length > 0 || this.filterOnDate(p.comments).length > 0
        });
    }

    close() {
        return this.modalCtrl.dismiss(null, 'close');
    }

}