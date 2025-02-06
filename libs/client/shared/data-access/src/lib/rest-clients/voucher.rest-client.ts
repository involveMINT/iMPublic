import { HttpClient } from '@angular/common/http';
import { ArchiveVoucherDto, BuyVoucherDto, DTO_KEY, EpVoucherQuery, GetVouchersBySellerDto, GetVouchersForProfileDto, IParser, Query, InvolvemintRoutes, QUERY_KEY, RedeemVoucherDto, RefundVoucherDto, UnarchiveVoucherDto, Voucher, VoucherQuery, environment } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class VoucherRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.voucher}`;

  constructor(private http: HttpClient) { }

  getForProfile(query: Query<Voucher[]>, dto: GetVouchersForProfileDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof VoucherQuery>[]>(`${this.apiUrl}/getForProfile`, body);
  }

  getBySeller(query: Query<Voucher[]>, dto: GetVouchersBySellerDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof EpVoucherQuery>[]>(`${this.apiUrl}/getBySeller`, body);
  }

  buy(query: Query<Voucher>, dto: BuyVoucherDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof VoucherQuery>>(`${this.apiUrl}/buy`, body);
  }

  redeemVoucher(query: Query<Voucher>, dto: RedeemVoucherDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof VoucherQuery>>(`${this.apiUrl}/redeemVoucher`, body);
  }

  refundVoucher(query: Query<Voucher>, dto: RefundVoucherDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof VoucherQuery>>(`${this.apiUrl}/refundVoucher`, body);
  }

  archiveVoucher(query: Query<Voucher>, dto: ArchiveVoucherDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof VoucherQuery>>(`${this.apiUrl}/archiveVoucher`, body);
  }

  unarchiveVoucher(query: Query<Voucher>, dto: UnarchiveVoucherDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof VoucherQuery>>(`${this.apiUrl}/unarchiveVoucher`, body);
  }
}
