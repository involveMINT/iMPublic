import { IManyToOne } from '../repository';
import { ChangeMaker } from '../change-maker';
import { ExchangePartner } from '../exchange-partner';
import { ProjectListingStatus } from '../project';
import { ServePartner } from '../serve-partner';

export type RequestListingStatus = 'public' | 'unlisted' | 'private';
export const defaultRequestListingStatus: RequestListingStatus = 'private';

export interface Request {
  id: string;
  listingStatus: ProjectListingStatus;
  name: string;
  description: string;
  priceStatus: boolean;
  price: number;
  imagesFilePaths: string[];
  dateUpdated: Date | string;
  dateCreated: Date | string;

  changeMaker?: IManyToOne<ChangeMaker, 'requests'>;
  exchangePartner?: IManyToOne<ExchangePartner, 'requests'>;
  servePartner?: IManyToOne<ServePartner, 'requests'>;
}
