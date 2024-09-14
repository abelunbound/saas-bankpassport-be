import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './guards/at.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';
import config from './config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { RiskProfileModule } from './risk-profile/risk-profile.module';
import { DatabaseModule } from './database/database.module';
import { RiskProfileProjectModule } from './risk-profile-project/risk-profile-project.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventEmitterModule } from '@nestjs/event-emitter';


@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: ".",
      maxListeners: 3
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("GMAIL_HOST"),
          port: configService.get<number>("GMAIL_PORT"),
          secure: true,
          auth: {
            user: configService.get<string>("GMAIL_SENDER"),
            pass: configService.get<string>("GMAIL_APP_PASSWORD")
          },
        },
        template: {
          dir: join(__dirname, 'mail/templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      })
    }),
    UsersModule, 
    EnterpriseModule, 
    CollaboratorModule, 
    DatabaseModule,
    RiskProfileModule,
    RiskProfileProjectModule,
    NotificationsModule],
  controllers: [AppController],
  providers: [ConfigService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    JwtService,
    AtStrategy,
    RtStrategy,
    AppService,],
})
export class AppModule { }
