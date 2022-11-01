import { ChangeMakerView } from '@involvemint/shared/domain';
import { JoinColumn, OneToOne, ViewColumn, ViewEntity } from 'typeorm';
import { CreditEntity } from '../credit/credit.entity';
import { DbTableNames } from '../db-table-names';
import { EnrollmentEntity } from '../enrollment/enrollment.entity';
import { PoiEntity } from '../poi/poi.entity';
import { TransactionEntity } from '../transaction/transaction.entity';
import { ChangeMakerEntity } from './change-maker.entity';

const secondsCompleted: keyof ChangeMakerView = 'secondsCompleted';
const poiApproved: keyof ChangeMakerView = 'poiApproved';
const spentCredits: keyof ChangeMakerView = 'spentCredits';
const earnedCredits: keyof ChangeMakerView = 'earnedCredits';

const enrollmentCm: keyof EnrollmentEntity = 'changeMaker';

const creditPoi: keyof CreditEntity = 'poi';
const creditAmount: keyof CreditEntity = 'amount';

const poiEnrollment: keyof PoiEntity = 'enrollment';
const poiStarted: keyof PoiEntity = 'dateStarted';
const poiStopped: keyof PoiEntity = 'dateStopped';

const transactionAmount: keyof TransactionEntity = 'amount';
const transactionSenderCm: keyof TransactionEntity = 'senderChangeMaker';

const ChangeMaker = DbTableNames.ChangeMaker;
const Credit = DbTableNames.Credit;
const Enrollment = DbTableNames.Enrollment;
const Poi = DbTableNames.Poi;
const Transaction = DbTableNames.Transaction;

@ViewEntity({
  expression: `
    WITH "poi_q" as (
      SELECT
        DISTINCT "${ChangeMaker}"."id" AS "id",
        COUNT(*)::int AS "${poiApproved}",
        EXTRACT(SECOND FROM SUM(DISTINCT "${Poi}"."${poiStopped}" - "${Poi}"."${poiStarted}"))::int AS "${secondsCompleted}"
      FROM
        "${ChangeMaker}" "${ChangeMaker}",
        "${Enrollment}" "${Enrollment}",
        "${Poi}" "${Poi}"
      WHERE
        "${Poi}"."${poiEnrollment}Id" = "${Enrollment}"."id"
      AND
        "${Enrollment}"."${enrollmentCm}Id" = "${ChangeMaker}"."id"
      GROUP BY
        "${ChangeMaker}"."id"

      UNION ALL

      SELECT
        "${ChangeMaker}"."id" AS "id",
        0::int AS "${poiApproved}",
        0::int AS "${secondsCompleted}"
      FROM
        "${ChangeMaker}" "${ChangeMaker}"
      GROUP BY
        "${ChangeMaker}"."id"
    ),
    "spentCredits_q" AS (
      SELECT
        DISTINCT "${ChangeMaker}"."id" AS "id",
        SUM(DISTINCT "${Transaction}"."${transactionAmount}")::int AS "${spentCredits}"
      FROM
        "${ChangeMaker}" "${ChangeMaker}",
        "${Transaction}" "${Transaction}"
      WHERE
        "${Transaction}"."${transactionSenderCm}Id" = "${ChangeMaker}"."id"
      GROUP BY
        "${ChangeMaker}"."id"

      UNION ALL

      SELECT
        "${ChangeMaker}"."id" AS "id",
        0::int AS "${spentCredits}"
      FROM
        "${ChangeMaker}" "${ChangeMaker}"
    ),
    "earnedCredits_q" AS (
      SELECT
        "${ChangeMaker}"."id" AS "id",
        SUM(DISTINCT "${Credit}"."${creditAmount}")::int AS "${earnedCredits}"
      FROM
        "${ChangeMaker}" "${ChangeMaker}",
        "${Credit}" "${Credit}",
        "${Poi}" "${Poi}",
        "${Enrollment}" "${Enrollment}"
      WHERE
        "${Credit}"."${creditPoi}Id" = "${Poi}"."id"
      AND
        "${Poi}"."${poiEnrollment}Id" = "${Enrollment}"."id"
      AND
        "${Enrollment}"."${enrollmentCm}Id" = "${ChangeMaker}"."id"
      GROUP BY
        "${ChangeMaker}"."id"

      UNION ALL

      SELECT
      "${ChangeMaker}"."id" AS "id",
        0::int AS "${earnedCredits}"
      FROM
        "${ChangeMaker}" "${ChangeMaker}"
    )

    SELECT
      "${ChangeMaker}"."id" as "id",
      SUM(DISTINCT "poi_q"."${poiApproved}")::int as "${poiApproved}",
      SUM(DISTINCT "poi_q"."${secondsCompleted}")::int as "${secondsCompleted}",
      SUM(DISTINCT "spentCredits_q"."${spentCredits}") AS "${spentCredits}",
      SUM(DISTINCT "earnedCredits_q"."${earnedCredits}") AS "${earnedCredits}"
    FROM
      "${ChangeMaker}" "${ChangeMaker}",
      "poi_q" "poi_q",
      "spentCredits_q" "spentCredits_q",
      "earnedCredits_q" "earnedCredits_q"
    WHERE
      "${ChangeMaker}"."id" = "poi_q"."id"
    AND
      "${ChangeMaker}"."id" = "spentCredits_q"."id"
    AND
      "${ChangeMaker}"."id" = "earnedCredits_q"."id"
    GROUP BY
      "${ChangeMaker}"."id"
  `,
})
export class ChangeMakerViewEntity implements Required<ChangeMakerView> {
  @ViewColumn()
  id!: number;

  @ViewColumn()
  [secondsCompleted]!: number;

  @ViewColumn()
  [poiApproved]!: number;

  @ViewColumn()
  [spentCredits]!: number;

  @ViewColumn()
  [earnedCredits]!: number;

  @OneToOne(() => ChangeMakerEntity, (s) => s.view)
  @JoinColumn({ name: 'id' })
  changeMaker!: ChangeMakerEntity;
}
