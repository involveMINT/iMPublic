import { initialState, postsAdapter, PostsReducer } from "./activity-posts.reducer";
import * as PostsActions from './activity-posts.actions';


describe('Activity-Post Reducer', () => {

    beforeEach(() => {

        // reset the state to init
        initialState.pagesLoaded = 0;
        initialState.posts = {
            entities: {},
            ids: []
        };

        // spy methods used
        jest.spyOn(postsAdapter, 'upsertMany')
            .mockImplementation((posts: any, existing: any) => {
                posts.forEach((post: any) => {
                    existing.ids.push(post.id);
                });
                return existing;
            });

        jest.spyOn(postsAdapter, 'upsertOne')
            .mockImplementation((post: any, existing: any) => {
                existing.ids.push(post.id);
                return existing;
            });
    });

    afterEach(() => { jest.clearAllMocks(); })

    it('should return initial state when undefined start', () => {
        const newState = PostsReducer(undefined, PostsActions.loadPosts);
        expect(newState).toEqual(initialState);
    });

    it('should return initial state when undefined start & action', () => {
        const newState = PostsReducer(undefined, { type: 'NOOP' } as any);
        expect(newState).toEqual(initialState);
    });

    it('should return initial state on unknown action', () => {
        const newState = PostsReducer(initialState, { type: 'NOOP' } as any);
        expect(newState).toEqual(initialState);
    });

    it('should return initial state on unregistered action', () => {
        const newState = PostsReducer(
            initialState, 
            PostsActions.like({ dto: { postId: "1"}})
        );
        expect(newState).toEqual(initialState);
    });

    it('should update posts & page on load posts success', () => {
        const action = PostsActions.loadPostsSuccess({ posts: [{ id: 1 }, { id: 2 }], page: 1 } as any);
        const newState = PostsReducer(initialState, action);
        expect(postsAdapter.upsertMany).toBeCalledTimes(1);
        expect(newState.posts.ids).toEqual([1, 2].sort());
        expect(newState.posts.entities).toEqual({});
        expect(newState.pagesLoaded).toEqual(1);
    });

    it('should add post on create post success', () => {
        const action = PostsActions.createPostSuccess({ post: { id: 1 } as any });
        const newState = PostsReducer(initialState, action);
        expect(postsAdapter.upsertOne).toBeCalledTimes(1);
        expect(newState).toEqual({
            posts: {
                entities: {},
                ids: [ 1 ]
            },
            pagesLoaded: 0
        });
    });

    it('should update post on like post success', () => {
        const action = PostsActions.likeSuccess({ post: { id: 1 } as any});
        const newState = PostsReducer(initialState, action);
        expect(postsAdapter.upsertOne).toBeCalledTimes(1);
        expect(newState).toEqual({
            posts: {
                entities: {},
                ids: [ 1 ]
            },
            pagesLoaded: 0
        });
    });

    it('should update post on unlike post success', () => {
        const action = PostsActions.unlikeSuccess({ post: { id: 1 } as any});
        const newState = PostsReducer(initialState, action);
        expect(postsAdapter.upsertOne).toBeCalledTimes(1);
        expect(newState).toEqual({
            posts: {
                entities: {},
                ids: [ 1 ]
            },
            pagesLoaded: 0
        });
    });

})