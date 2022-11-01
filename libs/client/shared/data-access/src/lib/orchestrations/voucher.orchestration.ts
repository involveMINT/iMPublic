import { InvolvemintOrchestrations, IVoucherOrchestration } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.voucher)
export class VoucherOrchestration implements IClientOrchestration<IVoucherOrchestration> {
  @ClientOperation()
  getForProfile!: IClientOrchestration<IVoucherOrchestration>['getForProfile'];
  @ClientOperation()
  getBySeller!: IClientOrchestration<IVoucherOrchestration>['getBySeller'];
  @ClientOperation()
  buy!: IClientOrchestration<IVoucherOrchestration>['buy'];
  @ClientOperation()
  redeemVoucher!: IClientOrchestration<IVoucherOrchestration>['redeemVoucher'];
  @ClientOperation()
  refundVoucher!: IClientOrchestration<IVoucherOrchestration>['refundVoucher'];
  @ClientOperation()
  archiveVoucher!: IClientOrchestration<IVoucherOrchestration>['archiveVoucher'];
  @ClientOperation()
  unarchiveVoucher!: IClientOrchestration<IVoucherOrchestration>['unarchiveVoucher'];
}
