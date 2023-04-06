import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { PostStoreModel, UserFacade } from "@involvemint/client/shared/data-access";
import { StatefulComponent } from "@involvemint/client/shared/util";
import { ModalController } from "@ionic/angular";
import { take, tap } from 'rxjs/operators';
import { CLOSED } from "../post/post.component";

interface State {
    post?: PostStoreModel;
}

@Component({
    selector: 'app-modal-post',
    templateUrl: './modal-post.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalPostComponent extends StatefulComponent<State> implements OnInit {
    @Input() post!: PostStoreModel;
    constructor(
        private readonly modalCtrl: ModalController,
        private readonly user: UserFacade,
    ) { 
        super({
            post: undefined
        });
    }

    ngOnInit(): void {
        this.effect(() =>
            this.user.posts.selectors.getPost(this.post.id).pipe(
                tap(({ post }) => 
                    this.updateState({
                        post: post 
                    })
                )
            )
        );
    }

    close() {
        return this.modalCtrl.dismiss(null, CLOSED);
    }

}