import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { RiskProfileService } from "../risk-profile.service";
import { generatePdf } from "src/helpers/pdf.helpers";
import { NotificationsService } from "src/notifications/notifications.service";
import { Users } from "src/users/entity/users.entity";


@Injectable()
export class RiskProfileListner {
    constructor(
        private readonly notificationService: NotificationsService,
        private readonly riskProfileService: RiskProfileService
    ) {

    }

    @OnEvent("risk_profile.completed")
    private async RiskProfileCompleted(
        content: string,
        user: Users
    ) {
        console.log('Emitting')
        const file = await generatePdf(content)
        // await this.riskProfileService.updateRiskProfile(
        //     user.enterprise.id as any,
        //     user.riskProfile.id,
        //     {
        //         pdfLink: pdf.url
        //     }
        // )
        await this.notificationService.sendEmail({
            to: user.email,
            template: './individual-report-available',
            subject: "Report Available",
            context: {
                name: `${user.first_name} ${user.last_name}`,
                orgName: user.enterprise.enterprise_name,
                url: ""
            },
            attachments: [
                {
                    filename: `${user.first_name.toUpperCase()}_${user.last_name.toUpperCase()}_RISK_PROFILE`,
                    content: file,
                    contentType: 'application/pdf'
                }
            ],
        })
        await this.notificationService.sendEmail({
            to: user.enterprise.email,
            template: './enterprise-report-available',
            subject: "Report Available",
            context: {
                name: `${user.first_name} ${user.last_name}`,
                orgName: user.enterprise.enterprise_name,
                url: ""
            },
            attachments: [
                {
                    filename: `${user.first_name.toUpperCase()}_${user.last_name.toUpperCase()}_RISK_PROFILE`,
                    content: file,
                    contentType: 'application/pdf'
                }
            ],
        })
    }
}