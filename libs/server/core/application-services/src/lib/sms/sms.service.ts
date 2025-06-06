import { environment } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

const accountSid = environment.twilio.accountSid;
const authToken = environment.twilio.authToken;
const sendingPhone = environment.twilio.sendingPhone;

@Injectable()
export class SMSService {
  private t = environment.environment !== 'local' ? twilio.default(accountSid, authToken) : null;

  shouldNotSendNotification = environment.environment !== 'production';

  sendInfoSMS({ message, phone }: { message: string; phone: string }) {
    if (this.shouldNotSendNotification || !phone || !message) return;

    return this.t?.messages.create({
      body: `involveMINT notification: ${message}`,
      from: sendingPhone,
      to: phone,
    });
  }
}
