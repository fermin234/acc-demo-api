import { HttpService } from '@nestjs/axios';

import { BaseStandardFieldsRequestDto } from '../../application/dto/kyc/base-standar-fields-request.dto';
import { FilesRequestDto } from '../../application/dto/kyc/files-request.dto';
import { KYCCallbackRequestDto } from '../../application/dto/kyc/kyc-callback-request.dto';
import { KYCDeleteRequestDto } from '../../application/dto/kyc/kyc-delete-request.dto';
import { KYCRequestDto } from '../../application/dto/kyc/kyc-request.dto';
import { KYCVerificationDto } from '../../application/dto/kyc/kyc-verification.dto';
import AxiosHttpRequestError from '../../application/error/axios-http-request.error';
import convertToSnakeCase from '../../application/helper/convert-to-snake-case';
import { getImageFormatFromBase64 } from '../../application/helper/image-format-from-base64';
import PayloadBuilder from '../../application/helper/payload-builder';
import queryBuilder from '../../application/helper/query-builder';

export default class SEP12Adapter {
  private kycServerUrl: string;
  private token: string;

  constructor(private readonly httpService: HttpService) {}

  setCredentials(kycServerUrl: string, token: string) {
    this.kycServerUrl = kycServerUrl;
    this.token = token;
  }

  async getKYCStatus(request?: KYCRequestDto) {
    const url = request
      ? `${this.kycServerUrl}/customer?${queryBuilder(request)}`
      : `${this.kycServerUrl}/customer`;

    try {
      const { data } = await this.httpService.axiosRef.get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async sendKYCInformation(request: BaseStandardFieldsRequestDto) {
    const payload = new PayloadBuilder(request)
      .parseObjectKeyCaseType(convertToSnakeCase)
      .filterUndefinedValues()
      .build();

    try {
      const { data } = await this.httpService.axiosRef.put(
        `${this.kycServerUrl}/customer`,
        payload,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async setCallbackUrl(request: KYCCallbackRequestDto) {
    const payload = new PayloadBuilder(request)
      .parseObjectKeyCaseType(convertToSnakeCase)
      .filterUndefinedValues()
      .build();

    try {
      const { data } = await this.httpService.axiosRef.put(
        `${this.kycServerUrl}/customer/callback`,
        payload,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async sendVerificationCodes(request: KYCVerificationDto) {
    const payload = new PayloadBuilder(request)
      .parseObjectKeyCaseType(convertToSnakeCase)
      .filterUndefinedValues()
      .build();

    try {
      const { data } = await this.httpService.axiosRef.put(
        `${this.kycServerUrl}/customer/verification`,
        payload,
        { headers: { Authorization: `Bearer ${this.token}` } },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async deleteKYCInformation(request?: KYCDeleteRequestDto) {
    if (!request) {
      request = {};
    }

    const queryParams = queryBuilder(request);

    try {
      const { data } = await this.httpService.axiosRef.delete(
        `${this.kycServerUrl}/customer/${queryParams}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async uploadBinaryFile(file: string) {
    const imageFormat = getImageFormatFromBase64(file);
    if (!imageFormat) {
      throw new Error(`Invalid image format, try again.`);
    }

    const imageBlob = new Blob([file], { type: `image/${imageFormat}` });

    const formData = new FormData();
    formData.append('file', imageBlob, `file.${imageFormat}`);
    try {
      const { data } = await this.httpService.axiosRef.post(
        `${this.kycServerUrl}/customer/files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async getFiles(request?: FilesRequestDto) {
    const url = request
      ? `${this.kycServerUrl}/customer/files?${queryBuilder(request)}`
      : `${this.kycServerUrl}/customer/files`;

    try {
      const { data } = await this.httpService.axiosRef.get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }
}
