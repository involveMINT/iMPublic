import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { PostStoreModel, UserFacade } from "@involvemint/client/shared/data-access";
import { ModalController } from "@ionic/angular";
import { ModalPostComponent } from "../modal-post/modal-post.component";


export const CLOSED = "close";
export const OPEN = "open";
const imagePlaceholder 
        = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";

@Component({
    selector: 'app-modal-digest',
    templateUrl: './modal-digest.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDigestComponent implements OnInit {
    @Input() digestPosts!: Array<PostStoreModel>;
    constructor(
        private readonly modalCtrl: ModalController,
        private readonly user: UserFacade
    ) { }

    ngOnInit(): void { }

    selectPostImage(imageFilePaths: string[]) {
        if (imageFilePaths.length === 0) {
            return [imagePlaceholder];
        }
        return imageFilePaths;
    }

    async openPost(post: PostStoreModel) {
        /**
         * 1. Return the post id that was clicked
         * 2. Make a call to NgRx such that the state is updated to have the post
         * 3. ActivtyPosts module needs to be able to find image in state then scroll to it for user (or place at top)
         */
        this.user.posts.dispatchers.get({ postId: post.id });
        this.digestPosts = this.digestPosts.filter(p => {
            return p.id !== post.id
        });
        const modal = await this.modalCtrl.create({
            component: ModalPostComponent,
            componentProps: { post: post },
          });
        await modal.present();
        return (await modal.onDidDismiss()).data;
    }

    close() {
        return this.modalCtrl.dismiss(this.digestPosts, CLOSED);
    }

    convertDate(date: Date | string) {
        if (typeof date == "string") {
            return new Date(date).toLocaleDateString();
        }
        return date.toLocaleDateString();
    }

}