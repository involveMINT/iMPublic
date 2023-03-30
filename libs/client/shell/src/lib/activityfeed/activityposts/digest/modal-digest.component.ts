import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { PostStoreModel, UserFacade } from "@involvemint/client/shared/data-access";
import { StatefulComponent } from "@involvemint/client/shared/util";
import { ModalController } from "@ionic/angular";
import { compareDesc } from 'date-fns';
import { tap } from 'rxjs/operators';
import { parseDate } from '@involvemint/shared/util';
import { calculatePoiStatus, calculatePoiTimeWorked, Like, PoiStatus, Comment, ActivityPost } from '@involvemint/shared/domain';

interface State {
    posts: Array<PostStoreModel & { status: PoiStatus; timeWorked: string; }>;
    loaded: boolean;
}

const imagePlaceholder 
        = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";

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

    selectPostImage(imageFilePaths: string[]) {
        if (imageFilePaths.length === 0) {
            return [imagePlaceholder];
        }
        return imageFilePaths;
    }

    openPost(post: PostStoreModel) {
        /**
         * 1. Return the post id that was clicked
         * 2. Make a call to NgRx such that the state is updated to have the post
         * 3. ActivtyPosts module needs to be able to find image in state then scroll to it for user (or place at top)
         */
        return this.modalCtrl.dismiss(post.id, 'close');
    }

    close() {
        return this.modalCtrl.dismiss(null, 'close');
    }

}