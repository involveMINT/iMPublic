import { IOperation } from '@orcha/common';
import { CreateChangeMakerProfileDto, EditCmProfileDto } from './change-maker.dtos';
import { ChangeMaker } from './change-maker.model';

export interface IChangeMakerOrchestration {
  createProfile: IOperation<ChangeMaker, CreateChangeMakerProfileDto>;
  editProfile: IOperation<ChangeMaker, EditCmProfileDto>;
  updateProfileImage: IOperation<ChangeMaker, undefined, File>;
}
