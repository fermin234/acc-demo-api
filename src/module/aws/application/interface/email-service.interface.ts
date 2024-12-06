import { Template } from '@aws-sdk/client-ses';

export const EMAIL_SERVICE = 'EMAIL_SERVICE';

export interface ISendEmailParams {
  Destination: ISendEmailParamsDestination;
  Template: string;
  TemplateData: string;
  Source: string;
}

interface ISendEmailParamsDestination {
  ToAddresses?: string[];
}

export interface ICreateTemplateData {
  templateName: string;
  subject: string;
  html: string;
}

export interface ISendEmailResponse {
  messageId: string;
}

export interface IEmailService {
  sendContactEmail(sendEmail: ISendEmailParams): Promise<ISendEmailResponse>;
}
