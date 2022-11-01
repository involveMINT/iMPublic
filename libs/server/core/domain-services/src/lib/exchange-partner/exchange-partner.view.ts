import { ExchangePartnerView } from '@involvemint/shared/domain';
import { JoinColumn, OneToOne, ViewColumn, ViewEntity } from 'typeorm';
import { DbTableNames } from '../db-table-names';
import { TransactionEntity } from '../transaction/transaction.entity';
import { VoucherEntity } from '../voucher/voucher.entity';
import { ExchangePartnerEntity } from './exchange-partner.entity';

const transactionDate: keyof TransactionEntity = 'dateTransacted';
const transactionAmount: keyof TransactionEntity = 'amount';
const transactionReceiver: keyof TransactionEntity = 'receiverExchangePartner';

const epBudgetEndDate: keyof ExchangePartnerEntity = 'budgetEndDate';

const seller: keyof VoucherEntity = 'seller';
const amount: keyof VoucherEntity = 'amount';
const dateCreated: keyof VoucherEntity = 'dateCreated';
const dateRedeemed: keyof VoucherEntity = 'dateRedeemed';
const dateRefunded: keyof VoucherEntity = 'dateRefunded';

const ExchangePartner = DbTableNames.ExchangePartner;
const Transaction = DbTableNames.Transaction;
const Voucher = DbTableNames.Voucher;

const receivedThisMonth: keyof ExchangePartnerView = 'receivedThisMonth';

@ViewEntity({
  expression: `
    WITH "t" AS (
      SELECT
        "${ExchangePartner}"."id" AS "id",
        SUM("${Transaction}"."${transactionAmount}")::int AS "${receivedThisMonth}"
      FROM
        "${ExchangePartner}" "${ExchangePartner}",
        "${Transaction}" "${Transaction}"
      WHERE
        "${ExchangePartner}"."id" = "${Transaction}"."${transactionReceiver}Id"
      AND
        "${Transaction}"."${transactionDate}" > ("${ExchangePartner}"."${epBudgetEndDate}" - '1 month'::interval)
      GROUP BY
        "${ExchangePartner}"."id"

      UNION ALL

      SELECT
        "${ExchangePartner}"."id" AS "id",
        0::int AS "${receivedThisMonth}"
      FROM
        "${ExchangePartner}" "${ExchangePartner}"

    ), "v" AS (
      SELECT
        "${ExchangePartner}"."id" AS "id",
        SUM("${Voucher}"."${amount}")::int AS "${receivedThisMonth}"
      FROM
        "${ExchangePartner}" "${ExchangePartner}",
        "${Voucher}" "${Voucher}"
      WHERE
        "${Voucher}"."${seller}Id" = "${ExchangePartner}"."id"
      AND
        "${Voucher}"."${dateCreated}" > ("${ExchangePartner}"."${epBudgetEndDate}" - '1 month'::interval)
      AND
        "${Voucher}"."${dateRedeemed}" IS NULL
      AND
        "${Voucher}"."${dateRefunded}" IS NULL
      GROUP BY
        "${ExchangePartner}"."id"

      UNION ALL

      SELECT
        "${ExchangePartner}"."id" AS "id",
        0::int AS "${receivedThisMonth}"
      FROM
        "${ExchangePartner}" "${ExchangePartner}"
      )

    SELECT
    "${ExchangePartner}"."id" AS "id",
    SUM(DISTINCT "t"."${receivedThisMonth}")::int + SUM(DISTINCT "v"."${receivedThisMonth}")::int AS "${receivedThisMonth}"
    FROM
      "${ExchangePartner}" "${ExchangePartner}",
      "t" "t",
      "v" "v"
    WHERE
      "${ExchangePartner}"."id" = "t"."id"
    AND
      "${ExchangePartner}"."id" = "v"."id"
    GROUP BY
      "${ExchangePartner}"."id"
  `,
})
export class ExchangePartnerViewEntity implements Required<ExchangePartnerView> {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  [receivedThisMonth]!: number;

  @OneToOne(() => ExchangePartnerEntity, (s) => s.view)
  @JoinColumn({ name: 'id' })
  exchangePartner!: ExchangePartnerEntity;
}
