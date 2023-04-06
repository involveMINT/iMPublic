import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { CommentService, PostStoreModel, UserFacade } from "@involvemint/client/shared/data-access";
import { PoiStatus, calculatePoiStatus, calculatePoiTimeWorked } from "@involvemint/shared/domain";
import { IonButton } from "@ionic/angular";

export const CLOSED = "close";

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {
    @Input() post!: PostStoreModel;
    constructor(
        private readonly user: UserFacade,
        private readonly commentService: CommentService
    ) { } 

    ngOnInit(): void { }

    like(id: string, button: IonButton) {
        button.disabled = true; // prevent click spam
        this.user.posts.dispatchers.like({
            postId: id,
        })
    }

    unlike(id: string, button: IonButton) {
        button.disabled = true; // prevent click spam
        this.user.posts.dispatchers.unlike({
            postId: id,
        })
    }

    checkUserLiked(post: PostStoreModel) {
        let userId = "";
        this.user.session.selectors.email$.subscribe(s => userId = s);
        const filteredObj = post.likes.filter(obj => obj.user.id === userId);
        return filteredObj.length != 0
    }

    comments(id: string) {
        return this.commentService.goToComments(id);
    }

    calculatePoiStatus(poi: any) {
        return calculatePoiStatus(poi);
    }

    calculateTimeWorked(poi: any) {
        return calculatePoiTimeWorked(poi);
    }


    get PoiStatus() {
        return PoiStatus;
    }

}
