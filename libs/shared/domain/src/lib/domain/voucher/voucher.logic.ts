import { parseDate } from '@involvemint/shared/util';
import { createLogic } from '../repository';
import { addMonths, isBefore } from 'date-fns';
import { Voucher } from './voucher.model';

export enum VoucherStatus {
  active = 'active',
  expired = 'expired',
  refunded = 'refunded',
  redeemed = 'redeemed',
}

export const calculateVoucherStatus = createLogic<
  Voucher,
  {
    dateRedeemed: true;
    dateRefunded: true;
    dateExpires: true;
  }
>()((voucher) => {
  if (voucher.dateRedeemed) {
    return VoucherStatus.redeemed;
  }
  if (voucher.dateRefunded) {
    return VoucherStatus.refunded;
  }
  const now = new Date();
  if (voucher.dateExpires && isBefore(parseDate(voucher.dateExpires), now)) {
    return VoucherStatus.expired;
  }
  return VoucherStatus.active;
});

export const voucherCanBeRefunded = createLogic<
  Voucher,
  {
    dateRedeemed: true;
    dateRefunded: true;
    dateExpires: true;
  }
>()((voucher) => {
  const status = calculateVoucherStatus(voucher);
  return (status === VoucherStatus.active || status === VoucherStatus.redeemed) && !voucher.dateRefunded;
});

export const voucherCanBeRedeemed = createLogic<
  Voucher,
  {
    dateRedeemed: true;
    dateRefunded: true;
    dateExpires: true;
  }
>()((voucher) => {
  const status = calculateVoucherStatus(voucher);
  return status === VoucherStatus.active;
});

export const calculateVoucherExpirationDate = (now: Date) => addMonths(now, 1);
