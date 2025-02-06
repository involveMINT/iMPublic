import { VoucherService } from '@involvemint/server/core/application-services';
import {
  ArchiveVoucherDto,
  BuyVoucherDto,
  EpVoucherQuery,
  GetVouchersBySellerDto,
  GetVouchersForProfileDto,
  InvolvemintRoutes,
  RedeemVoucherDto,
  RefundVoucherDto,
  UnarchiveVoucherDto,
  Voucher,
  VoucherQuery,
  DTO_KEY,
  QUERY_KEY,
  TOKEN_KEY,
  Query
} from '@involvemint/shared/domain';
import { 
  Controller,
  Post,
  Body,
  Headers
} from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.voucher)
export class VoucherController {
  constructor(private readonly voucher: VoucherService) {}

  @Post('getForProfile')
  async getForProfile(
    @Body(QUERY_KEY, new QueryValidationPipe(VoucherQuery)) query: Query<Voucher[]>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: GetVouchersForProfileDto
  ) {
    return this.voucher.getForProfile(query, token, dto);
  }

  @Post('getBySeller')
  async getBySeller(
    @Body(QUERY_KEY, new QueryValidationPipe(EpVoucherQuery)) query: Query<Voucher[]>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: GetVouchersBySellerDto
  ) {
    return this.voucher.getBySeller(query, token, dto);
  }

  @Post('buy')
  async buy(
    @Body(QUERY_KEY, new QueryValidationPipe(VoucherQuery)) query: Query<Voucher>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: BuyVoucherDto
  ) {
    return this.voucher.buy(query, token, dto);
  }

  @Post('redeemVoucher')
  async redeemVoucher(
    @Body(QUERY_KEY, new QueryValidationPipe(EpVoucherQuery)) query: Query<Voucher>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: RedeemVoucherDto
  ) {
    return this.voucher.redeemVoucher(query, token, dto);
  }

  @Post('refundVoucher')
  async refundVoucher(
    @Body(QUERY_KEY, new QueryValidationPipe(EpVoucherQuery)) query: Query<Voucher>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: RefundVoucherDto
  ) {
    return this.voucher.refundVoucher(query, token, dto);
  }

  @Post('archiveVoucher')
  async archiveVoucher(
    @Body(QUERY_KEY, new QueryValidationPipe(EpVoucherQuery)) query: Query<Voucher>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: ArchiveVoucherDto
  ) {
    return this.voucher.archiveVoucher(query, token, dto);
  }

  @Post('unarchiveVoucher')
  async unarchiveVoucher(
    @Body(QUERY_KEY, new QueryValidationPipe(EpVoucherQuery)) query: Query<Voucher>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: UnarchiveVoucherDto
  ) {
    return this.voucher.unarchiveVoucher(query, token, dto);
  }
}
