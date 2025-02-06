import { ChangeMakerRepository, HandleRepository } from '@involvemint/server/core/domain-services';
import {
  ChangeMaker,
  CreateChangeMakerProfileDto,
  EditCmProfileDto,
  generateChangeMakerProfileImageFilePath,
  ImStorageFileRoots,
  Query
} from '@involvemint/shared/domain';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { AuthService } from '../auth/auth.service';
import { FirestoreService } from '../firestore/firestore.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ChangeMakerService {
  constructor(
    private readonly cmRepo: ChangeMakerRepository,
    private readonly auth: AuthService,
    private readonly handle: HandleRepository,
    private readonly storage: StorageService,
    private readonly firestore: FirestoreService
  ) {}

  /**
   * Creates a ChangeMaker profile and verifies handle is unique.
   * @param query query of the newly created ChangeMaker profile.
   * @param token User's auth token.
   * @param dto Essential ChangeMaker profile data.
   */
  async createProfile(query: Query<ChangeMaker>, token: string, dto: CreateChangeMakerProfileDto) {
    const user = await this.auth.validateUserToken(token);
    await this.handle.verifyHandleUniqueness(dto.handle);
    return this.cmRepo.upsert(
      {
        id: uuid.v4(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        handle: { id: dto.handle },
        onboardingState: dto.onboardingState === 'market' ? 'market' : 'project',
        phone: dto.phone,
        user,
        enrollments: [],
        passportDocuments: [],
        dateCreated: new Date(),
        credits: [],
        receivingTransactions: [],
        sendingTransactions: [],
        offers: [],
        requests: [],
        receivingVouchers: [],
        view: null,
      },
      query
    );
  }

  async editProfile(query: Query<ChangeMaker>, token: string, dto: EditCmProfileDto) {
    const user = await this.auth.validateUserToken(token, {
      id: true,
      changeMaker: { id: true, profilePicFilePath: true, handle: { id: true } },
    });

    if (!user.changeMaker) {
      throw new HttpException(
        `There is no ChangeMaker profile associated with user "${user.id}".`,
        HttpStatus.UNAUTHORIZED
      );
    }

    if (dto.profilePicFilePath === '' && user.changeMaker.profilePicFilePath) {
      this.storage.deleteFile(user.changeMaker.profilePicFilePath);
    }

    if (dto.handle?.id && user.changeMaker.handle.id !== dto.handle.id) {
      await this.firestore.changeHandleInChat(user.changeMaker.handle.id, dto.handle.id);
    }

    return this.cmRepo.update(user.changeMaker.id, dto, query);
  }

  async updateProfileImage(query: Query<ChangeMaker>, token: string, file: Express.Multer.File) {
    const user = await this.auth.validateUserToken(token, { id: true, changeMaker: { id: true } });
    if (!user?.changeMaker) {
      throw new HttpException(
        `No associated ChangeMaker Profile found with user "${user.id}".`,
        HttpStatus.NOT_FOUND
      );
    }

    const ext = this.storage.extractFileExtension(file.originalname);
    const name = `${user.changeMaker.id}.${ext}`;
    const path = generateChangeMakerProfileImageFilePath({
      root: ImStorageFileRoots.cmProfileImages,
      filename: name,
    });
    await this.storage.upload(path, file);

    return this.cmRepo.update(user.changeMaker.id, { profilePicFilePath: path }, query);
  }
}
