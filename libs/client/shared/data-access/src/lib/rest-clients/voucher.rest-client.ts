import { HttpClient } from '@angular/common/http';
import { ArchiveVoucherDto, BuyVoucherDto, DTO_KEY, EpVoucherQuery, GetVouchersBySellerDto, GetVouchersForProfileDto, IParser, IQuery, InvolvemintRoutes, QUERY_KEY, RedeemVoucherDto, RefundVoucherDto, UnarchiveVoucherDto, Voucher, VoucherQuery, environment } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class VoucherRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.voucher}`;

  constructor(private http: HttpClient) { }

  getForProfile(query: IQuery<Voucher[]>, dto: GetVouchersForProfileDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof VoucherQuery>[]>(`${this.apiUrl}/getForProfile`, body);
  }

  getBySeller(query: IQuery<Voucher[]>, dto: GetVouchersBySellerDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof EpVoucherQuery>[]>(`${this.apiUrl}/getBySeller`, body);
  }

  buy(query: IQuery<Voucher>, dto: BuyVoucherDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof VoucherQuery>>(`${this.apiUrl}/buy`, body);
  }

  redeemVoucher(query: IQuery<Voucher>, dto: RedeemVoucherDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof VoucherQuery>>(`${this.apiUrl}/redeemVoucher`, body);
  }

  refundVoucher(query: IQuery<Voucher>, dto: RefundVoucherDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof VoucherQuery>>(`${this.apiUrl}/refundVoucher`, body);
  }

  archiveVoucher(query: IQuery<Voucher>, dto: ArchiveVoucherDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof VoucherQuery>>(`${this.apiUrl}/archiveVoucher`, body);
  }

  unarchiveVoucher(query: IQuery<Voucher>, dto: UnarchiveVoucherDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Voucher, typeof VoucherQuery>>(`${this.apiUrl}/unarchiveVoucher`, body);
  }
}
