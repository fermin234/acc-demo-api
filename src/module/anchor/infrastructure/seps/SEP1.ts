import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as toml from 'toml';

import AxiosHttpRequestError from '../../application/error/axios-http-request.error';
import IAnchorTomlResponse from '../../application/interface/response/anchor-toml-response.interface';

@Injectable()
export default class SEP1Adapter {
  private readonly anchorUrl: string;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.anchorUrl = configService.get('ANCHOR_URL');
  }

  async getInfo(): Promise<IAnchorTomlResponse> {
    try {
      const { data } = await this.httpService.axiosRef.get(this.anchorUrl);

      return toml.parse(data) as IAnchorTomlResponse;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }
}
