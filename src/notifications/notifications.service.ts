import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


type EmailProps = {
    to: string,
    subject: string,
    template?: string,
    context?: Record<string, string | number | any>
} & Partial<ISendMailOptions>


@Injectable()
export class NotificationsService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }

    public async sendEmail(props: EmailProps) {
        this.mailerService
            .sendMail({
                from: `"BANK PASSPORT" ${this.configService.get<string>("GMAIL_SENDER")}`,
                ...props
            })
            .then((data) => {
            })
            .catch((error) => {
                console.log(error, 'error')
            });


    }
}
