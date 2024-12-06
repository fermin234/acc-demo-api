import {
  CreateTemplateCommand,
  GetTemplateCommand,
  SESClient,
  SendTemplatedEmailCommand,
  SendTemplatedEmailCommandInput,
  SendTemplatedEmailCommandOutput,
  Template,
  TemplateDoesNotExistException,
} from '@aws-sdk/client-ses';

import { ConfigService } from '@nestjs/config';

import {
  ICreateTemplateData,
  IEmailService,
  ISendEmailParams,
  ISendEmailResponse,
} from '@/module/aws/application/interface/email-service.interface';

export type ISendTemplateEmailParams = SendTemplatedEmailCommandInput;

export class AmazonSESService implements IEmailService {
  private readonly client: SESClient;
  private readonly region = process.env.AWS_REGION;
  private readonly accessKey = process.env.AWS_SES_ACCESS_KEY;
  private readonly secretKey = process.env.AWS_SES_SECRET_KEY;

  constructor() {
    this.client = new SESClient({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });
  }

  async sendContactEmail(
    sendEmailParams: ISendEmailParams,
  ): Promise<ISendEmailResponse> {
    const { Template } = sendEmailParams;
    const template = await this.getTemplate(Template);

    if (!template) {
      await this.createTemplate({
        templateName: Template,
        subject: 'Nuova richiesta di incontro',
        html: '<h1>Richiesta di contatto</h1>',
      });
    }

    const { MessageId } = await this.sendTemplateEmail(sendEmailParams);
    return {
      messageId: MessageId,
    };
  }

  private async createTemplate(
    createTemplateData: ICreateTemplateData,
  ): Promise<void> {
    const { templateName, subject, html } = createTemplateData;

    const createTemplateParams = new CreateTemplateCommand({
      Template: {
        TemplateName: templateName,
        SubjectPart: subject,
        HtmlPart: html,
      },
    });

    try {
      await this.client.send(createTemplateParams);
    } catch (error) {
      throw new Error('Failed to create template email');
    }
  }

  private async getTemplate(name: string): Promise<Template | null> {
    const getTemplateCommand = new GetTemplateCommand({
      TemplateName: name,
    });

    try {
      const { Template } = await this.client.send(getTemplateCommand);
      return Template;
    } catch (error) {
      if (error instanceof TemplateDoesNotExistException) {
        return null;
      }
      throw new Error('Failed to get template email');
    }
  }

  private async sendTemplateEmail(
    sendTemplatedEmailParams: ISendTemplateEmailParams,
  ): Promise<SendTemplatedEmailCommandOutput> {
    const sendTemplatedEmailCommand = new SendTemplatedEmailCommand(
      sendTemplatedEmailParams,
    );

    try {
      return await this.client.send(sendTemplatedEmailCommand);
    } catch (error) {
      throw new Error('Failed to send template email');
    }
  }
}
