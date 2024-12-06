import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import AxiosHttpRequestError from '../../application/error/axios-http-request.error';
import {
  signXdr,
  validateXdrProvenance,
} from '../../application/helper/helper';
import IAnchorTomlResponse from '../../application/interface/response/anchor-toml-response.interface';

@Injectable()
export default class SEP10Adapter {
  constructor(private readonly httpService: HttpService) {}

  async getChallenge(baseUrl: string, publicKey: string) {
    try {
      const { data } = await this.httpService.axiosRef.get(
        `${baseUrl}/?account=${publicKey}`,
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async validateChallenge(
    publicKey: string,
    challengeXdr: string,
    toml: IAnchorTomlResponse,
  ) {
    return await validateXdrProvenance(toml, challengeXdr, publicKey);
  }

  async signChallenge(secretKey: string, challengeXdr: string) {
    return signXdr(secretKey, challengeXdr);
  }

  async sendChallenge(baseUrl: string, signedXdr: string) {
    try {
      const { data } = await this.httpService.axiosRef.post(`${baseUrl}/`, {
        transaction: signedXdr,
      });

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }
}
