import { ActivityPostRepository, CommentRepository, LikeRepository } from "@involvemint/server/core/domain-services";
import { ActivityPostQuery, likeQuery } from "@involvemint/shared/domain";
import { Test } from "@nestjs/testing";
import { AuthService } from "../auth/auth.service";
import { NotificationDigestService } from "./notification-digest.service";
import 'uuid';
import { MoreThan } from 'typeorm';


// jest.mock('uuid', () => ({ v4: () => 'newId' }));

describe('Notification Digest Service', () => {

    let notificationDigestService: NotificationDigestService;

    let activityPostRepo: ActivityPostRepository;
    let likeRepo: LikeRepository;
    let commentRepo: CommentRepository;
    let auth: AuthService;

    beforeEach(async () => {
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date(2023, 3, 19));

        const moduleRef = await Test.createTestingModule({
            providers: [
              NotificationDigestService,
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
                { provide: CommentRepository, useValue: {
                  upsert: jest.fn(),
                  delete: jest.fn(),
                  query: jest.fn()
                } },
                { provide: AuthService, useValue: {
                    validateUserToken: jest.fn()
                } },
            ]
        }).compile();

        notificationDigestService = moduleRef.get(NotificationDigestService);

        auth = moduleRef.get(AuthService);
        activityPostRepo = moduleRef.get(ActivityPostRepository);
        likeRepo = moduleRef.get(LikeRepository);
        commentRepo = moduleRef.get(CommentRepository);
    });

    it('Should be defined', () => {
      expect(notificationDigestService).toBeDefined();
      expect(activityPostRepo).toBeDefined();
      expect(likeRepo).toBeDefined();
      expect(commentRepo).toBeDefined();
      expect(auth).toBeDefined();
    });

    describe('likeNotificationUpdate', () => {

      beforeEach(async () => {
          
          jest.spyOn(auth, 'validateUserToken')
              .mockReturnValue({ id: "json@gmail.com" } as any);

          jest.spyOn(likeRepo, 'query') 
              .mockReturnValue([])

          // getRecentLikes = jest.mock((recentPosts: any, lastDays: any) => return [{id: "1"}])
        
      });

      it('should get recent likes for user', async () => {
          await notificationDigestService.likeNotificationUpdate(
              ActivityPostQuery,
              "123",
          );

          const randDate = new Date()
          const MoreThan = jest.fn(obj => true)

          expect(activityPostRepo.query).toBeCalledTimes(1);
          expect(activityPostRepo.query).toBeCalledWith(
              ActivityPostQuery,
              { where: { dateCreated: MoreThan(randDate), user: "json@gmail.com"}}
          )

      });

    });

});