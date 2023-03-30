import { ActivityPostRepository, LikeRepository } from "@involvemint/server/core/domain-services";
import { ActivityPostQuery, likeQuery } from "@involvemint/shared/domain";
import { Test } from "@nestjs/testing";
import { AuthService } from "../auth/auth.service";
import { ActivityPostService } from "./activity-post.service";
import 'uuid';


jest.mock('uuid', () => ({ v4: () => 'newId' }));

describe('Activity-Post Service', () => {

    let activityPostService: ActivityPostService;

    let activityPostRepo: ActivityPostRepository;
    let likeRepo: LikeRepository;
    let auth: AuthService;

    beforeEach(async () => {

        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date(2023, 3, 19));

        const moduleRef = await Test.createTestingModule({
            providers: [
                ActivityPostService,
                { provide: ActivityPostRepository, useValue: {
                    upsert: jest.fn(),
                    update: jest.fn(),
                    findOneOrFail: jest.fn()
                } },
                { provide: LikeRepository, useValue: {
                    upsert: jest.fn(),
                    delete: jest.fn(),
                    query: jest.fn()
                } },
                { provide: AuthService, useValue: {
                    validateUserToken: jest.fn()
                } },
            ]
        }).compile();

        activityPostService = moduleRef.get(ActivityPostService);

        auth = moduleRef.get(AuthService);
        activityPostRepo = moduleRef.get(ActivityPostRepository);
        likeRepo = moduleRef.get(LikeRepository);
    });

    it('Should be defined', () => {
        expect(activityPostService).toBeDefined();
        expect(activityPostRepo).toBeDefined();
        expect(likeRepo).toBeDefined();
        expect(auth).toBeDefined();
    });

    describe('Like Activity Post', () => {

        beforeEach(async () => {
            jest.spyOn(auth, 'validateUserToken')
                .mockReturnValue({ id: "json@gmail.com" } as any);

            jest.spyOn(likeRepo, 'query') 
                .mockReturnValue([])

            jest.spyOn(activityPostRepo, 'findOneOrFail')
                .mockReturnValue({ likeCount: 25 } as any);
        });

        it('should allow like from non-liked user', async () => {
            await activityPostService.like(
                ActivityPostQuery,
                "123",
                {
                    postId: "1"
                }
            );
            expect(likeRepo.query).toBeCalledTimes(1);
            expect(likeRepo.query).toBeCalledWith(
                likeQuery, 
                { where: { user: "json@gmail.com", activityPost: "1" } }
            );
            expect(likeRepo.upsert).toBeCalledTimes(1);
            expect(likeRepo.upsert).toBeCalledWith({
                    id: "newId",
                    dateCreated: new Date(),
                    activityPost: "1",
                    user: "json@gmail.com"
                },
                likeQuery
            );
            expect(activityPostRepo.findOneOrFail).toBeCalledTimes(1);
            expect(activityPostRepo.findOneOrFail).toBeCalledWith(
                "1",
                ActivityPostQuery
            )
            expect(activityPostRepo.update).toBeCalledTimes(1);
            expect(activityPostRepo.update).lastCalledWith(
                "1",
                { likeCount: 26 },
                ActivityPostQuery
            );
        });

        it('should NOT allow like from liked user', async () => {

            jest.spyOn(likeRepo, 'query') 
                .mockReturnValue([{}])
        
            expect(async () => {
                await activityPostService.like(
                    ActivityPostQuery,
                    "123",
                    {
                        postId: "1"
                    });
            }).rejects.toThrow('User already liked this activity post');
        });

    });

    describe('Unlike Activity Post', () => {

        beforeEach(async () => {
            jest.spyOn(auth, 'validateUserToken')
                .mockReturnValue({ id: "foo@gmail.com" } as any);

            jest.spyOn(likeRepo, 'query') 
                .mockReturnValue([])

            jest.spyOn(activityPostRepo, 'findOneOrFail')
                .mockReturnValue({likeCount: 25} as any);
        });

        it('should allow unlike from liked user', async () => {
            jest.spyOn(likeRepo, 'query')
                .mockReturnValue([{ id: "1" }]);

            await activityPostService.unlike(
                ActivityPostQuery,
                "124",
                {
                    postId: "2"
                }
            );

            expect(likeRepo.query).toBeCalledTimes(1);
            expect(likeRepo.query).toBeCalledWith(
                likeQuery, 
                { where: { user: "foo@gmail.com", activityPost: "2" } }
            );
            expect(likeRepo.delete).toBeCalledTimes(1);
            expect(likeRepo.delete).toBeCalledWith("1");
            expect(activityPostRepo.findOneOrFail).toBeCalledTimes(1);
            expect(activityPostRepo.findOneOrFail).toBeCalledWith(
                "2",
                ActivityPostQuery
            )
            expect(activityPostRepo.update).toBeCalledTimes(1);
            expect(activityPostRepo.update).lastCalledWith(
                "2",
                { likeCount: 24 },
                ActivityPostQuery
            );
        });

        it('should NOT allow unlike from non-liked user', async () => {
            expect(async () => {
                await activityPostService.unlike(
                    ActivityPostQuery,
                    "124",
                    {
                        postId: "1"
                    }
                )
            }).rejects.toThrow('User has not liked this activity post');
        });

    });

});