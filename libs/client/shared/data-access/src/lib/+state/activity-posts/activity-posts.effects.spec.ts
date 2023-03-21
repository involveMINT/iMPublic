import { StatusService } from "@involvemint/client/shared/util";
import { Observable, of } from "rxjs";
import { ActivityPostOrchestration } from "../../orchestrations";
import { PostEffects } from "./activity-posts.effects";
import { Action } from "@ngrx/store";
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from "@angular/core/testing";
import { hot, cold } from 'jest-marbles';

import * as PostsActions from './activity-posts.actions';

describe('Activity-Post Effects', () => {

    let actions: Observable<Action>;
    let effects: PostEffects;
    let status: StatusService;
    let posts: ActivityPostOrchestration;
    
    beforeEach(() => {
        const moduleRef = TestBed.configureTestingModule({
            providers: [
                PostEffects,
                provideMockActions(() => actions),
                {
                    provide: StatusService,
                    useValue: {}
                },
                {
                    provide: ActivityPostOrchestration,
                    useValue: {
                        list: jest.fn(),
                    }
                }
            ]
        });

        effects = moduleRef.get(PostEffects);

        status = moduleRef.get(StatusService);
        posts = moduleRef.get(ActivityPostOrchestration);
    });

    it('should be defined', () => {
        expect(effects).toBeTruthy();
        expect(status).toBeTruthy();
        expect(posts).toBeTruthy();
    });

    it('should return load posts success on happy path', () => {
        // provide fake data that will be used in effect
        const fakePosts = [
            { id: "1"} as any, {id: "2"} as any
        ];
        const action = PostsActions.loadPosts({ page: 1 });
        const completion = PostsActions.loadPostsSuccess({ 
            posts: fakePosts, 
            page: 1
        });

        // mock `this.posts.list` call and return OBSERVABLE data!
        jest.spyOn(posts, 'list')
            .mockImplementation((_query: any) => {
                return of(fakePosts)
            });

        // mock the observable action passed to effects
        actions = hot('--a-', { a: action });

        // specify expected output and run test
        const expected = cold('--(b)', { b: completion });
        expect(effects.loadPosts$).toBeObservable(expected);
    });

    it('should return load posts error on unhappy path', () => {
        // provide fake data that will be used in effect

        // mock `this.posts.list` call and return OBSERVABLE data!

        // specify expected output and run test

        // specify expected output and run test
    });

});