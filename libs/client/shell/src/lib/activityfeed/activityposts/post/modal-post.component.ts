import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { CommentService, PostStoreModel, UserFacade } from "@involvemint/client/shared/data-access";
import { StatefulComponent } from "@involvemint/client/shared/util";
import { PoiStatus, calculatePoiStatus, calculatePoiTimeWorked } from "@involvemint/shared/domain";
import { IonButton, ModalController } from "@ionic/angular";

export const CLOSED = "close";

@Component({
    selector: 'app-post',
    templateUrl: './modal-post.component.html',
    styleUrls: ['./modal-post.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {
    @Input() post!: PostStoreModel & { status: PoiStatus; timeWorked: string; };
    constructor(
        private readonly modalCtrl: ModalController,
        private readonly user: UserFacade,
        private readonly commentService: CommentService
    ) {}  

    get PoiStatus() {
        return PoiStatus;
    }
    ngOnInit(): void { 
        this.post = {
            ...this.post,
            status: calculatePoiStatus(this.post.poi),
            timeWorked: calculatePoiTimeWorked(this.post.poi)
        }
    }

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

    close() {
        return this.modalCtrl.dismiss(null, CLOSED);
    }

}
