import { ExchangePartnerRepository } from '@involvemint/server/core/domain-services';
import {
  environment,
  ExchangePartner,
  FrontendRoutes,
  FRONTEND_ROUTES_TOKEN,
  IParser
} from '@involvemint/shared/domain';
import { parseDate } from '@involvemint/shared/util';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addMonths } from 'date-fns';
import { LessThan } from 'typeorm';
import { EmailService } from '../email/email.service';

@Injectable()
export class ExchangePartnerCronService {
  constructor(
    private readonly epRepo: ExchangePartnerRepository,
    private readonly email: EmailService,
    @Inject(FRONTEND_ROUTES_TOKEN) private readonly route: FrontendRoutes
  ) {}

  /**
   * Every day at 12:00 am, rollover ExchangePartner Budgets
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateSpMonthlyBudgets() {
    const rolledOverToday = await this.epRepo.query(
      { id: true, budgetEndDate: true },
      { where: { budgetEndDate: LessThan(new Date()) } }
    );

    const updatedDates: IParser<ExchangePartner, { id: true; budgetEndDate: true }>[] = [];
    for (const r of rolledOverToday) {
      updatedDates.push({ ...r, budgetEndDate: addMonths(parseDate(r.budgetEndDate), 1) });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.epRepo.upsertMany(updatedDates as any);
  }

  /**
   * Every Monday at 10:12am send an email to all ExP whose budgets are not set.
   * @returns number of ExchangePartners who were send an email.
   */
  @Cron('12 10 * * 1')
  async sendBudgetNotSetEmail(): Promise<number> {
    const eps = await this.epRepo.query(
      { admins: { user: { id: true } } },
      { where: { budget: LessThan(1) } }
    );

    await this.email.sendInfoEmail({
      email: eps.map((e) => e.admins.map((a) => a.user.id)).flat(),
      message: `Your ExchangePartner Budget is not currently set.
                This means you haven't determined how many CommunityCredits to accept at your store.
                Until this is set, your storefront will remain invisible and other users will be unable to make purchases at your business.
                Go here to edit your budget: ${environment.appUrl}${this.route.path.ep.budget.ROOT}`,
      subject: 'Your Budget is not set',
    });

    return eps.length;
  }
}
