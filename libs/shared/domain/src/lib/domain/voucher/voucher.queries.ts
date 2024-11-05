import { createQuery } from '../repository';
import { Voucher } from './voucher.model';

export const VoucherQuery = createQuery<Voucher>()({
  id: true,
  amount: true,
  code: true,
  dateArchived: true,
  dateCreated: true,
  dateExpires: true,
  dateRedeemed: true,
  dateRefunded: true,
  seller: { id: true, handle: { id: true }, name: true },
  changeMakerReceiver: { id: true, handle: { id: true }, profilePicFilePath: true },
  exchangePartnerReceiver: { id: true, handle: { id: true }, logoFilePath: true },
  servePartnerReceiver: { id: true, handle: { id: true }, logoFilePath: true },
  offers: {
    id: true,
    quantity: true,
    offer: {
      name: true,
      price: true,
      imagesFilePaths: true,
      listingStatus: true,
      description: true,
    },
  },
});

export const EpVoucherQuery = createQuery<Voucher>()({
  id: true,
  amount: true,
  code: true,
  dateArchived: true,
  dateCreated: true,
  dateExpires: true,
  dateRedeemed: true,
  dateRefunded: true,
  seller: { id: true, handle: { id: true }, name: true },
  changeMakerReceiver: { id: true, handle: { id: true }, profilePicFilePath: true },
  exchangePartnerReceiver: { id: true, handle: { id: true }, logoFilePath: true },
  servePartnerReceiver: { id: true, handle: { id: true }, logoFilePath: true },
  offers: {
    id: true,
    quantity: true,
    offer: {
      name: true,
      price: true,
      imagesFilePaths: true,
      listingStatus: true,
      description: true,
    },
  },
});
