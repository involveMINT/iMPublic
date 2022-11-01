import { IOperation } from '@orcha/common';
import {
  ArchiveVoucherDto,
  BuyVoucherDto,
  GetVouchersBySellerDto,
  GetVouchersForProfileDto,
  RedeemVoucherDto,
  RefundVoucherDto,
  UnarchiveVoucherDto,
} from './voucher.dtos';
import { Voucher } from './voucher.model';

export interface IVoucherOrchestration {
  getForProfile: IOperation<Voucher[], GetVouchersForProfileDto>;
  getBySeller: IOperation<Voucher[], GetVouchersBySellerDto>;
  buy: IOperation<Voucher, BuyVoucherDto>;
  redeemVoucher: IOperation<Voucher, RedeemVoucherDto>;
  refundVoucher: IOperation<Voucher, RefundVoucherDto>;
  archiveVoucher: IOperation<Voucher, ArchiveVoucherDto>;
  unarchiveVoucher: IOperation<Voucher, UnarchiveVoucherDto>;
}
