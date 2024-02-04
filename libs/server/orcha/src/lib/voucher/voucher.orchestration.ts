import { VoucherService } from '@involvemint/server/core/application-services';
import {
  ArchiveVoucherDto,
  BuyVoucherDto,
  EpVoucherQuery,
  GetVouchersBySellerDto,
  GetVouchersForProfileDto,
  InvolvemintRoutes,
  IVoucherOrchestration,
  RedeemVoucherDto,
  RefundVoucherDto,
  UnarchiveVoucherDto,
  Voucher,
  VoucherQuery,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintRoutes.voucher)
export class VoucherOrchestration implements IServerOrchestration<IVoucherOrchestration> {
  constructor(private readonly voucher: VoucherService) {}

  @ServerOperation({ validateQuery: VoucherQuery })
  getForProfile(query: IQuery<Voucher[]>, token: string, dto: GetVouchersForProfileDto) {
    return this.voucher.getForProfile(query, token, dto);
  }

  @ServerOperation({ validateQuery: EpVoucherQuery })
  getBySeller(query: IQuery<Voucher[]>, token: string, dto: GetVouchersBySellerDto) {
    return this.voucher.getBySeller(query, token, dto);
  }

  @ServerOperation({ validateQuery: VoucherQuery })
  buy(query: IQuery<Voucher>, token: string, dto: BuyVoucherDto) {
    return this.voucher.buy(query, token, dto);
  }

  @ServerOperation({ validateQuery: EpVoucherQuery })
  redeemVoucher(query: IQuery<Voucher>, token: string, dto: RedeemVoucherDto) {
    return this.voucher.redeemVoucher(query, token, dto);
  }

  @ServerOperation({ validateQuery: EpVoucherQuery })
  refundVoucher(query: IQuery<Voucher>, token: string, dto: RefundVoucherDto) {
    return this.voucher.refundVoucher(query, token, dto);
  }

  @ServerOperation({ validateQuery: EpVoucherQuery })
  archiveVoucher(query: IQuery<Voucher>, token: string, dto: ArchiveVoucherDto) {
    return this.voucher.archiveVoucher(query, token, dto);
  }

  @ServerOperation({ validateQuery: EpVoucherQuery })
  unarchiveVoucher(query: IQuery<Voucher>, token: string, dto: UnarchiveVoucherDto) {
    return this.voucher.unarchiveVoucher(query, token, dto);
  }
}
