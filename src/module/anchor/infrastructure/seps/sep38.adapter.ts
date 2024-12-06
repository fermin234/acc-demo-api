import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { PriceRequestDto } from '../../application/dto/price/price-request.dto';
import { PricesRequestDto } from '../../application/dto/price/prices-request.dto';
import { QuotePostRequestDto } from '../../application/dto/price/quote-post-request.dto';
import AxiosHttpRequestError from '../../application/error/axios-http-request.error';
import convertToSnakeCase from '../../application/helper/convert-to-snake-case';
import PayloadBuilder from '../../application/helper/payload-builder';
import queryBuilder from '../../application/helper/query-builder';

@Injectable()
export default class SEP38Adapter {
  private anchorQuoteServerUrl: string;
  private token: string;

  constructor(private readonly httpService: HttpService) {}

  async setCredentials(anchorQuoteServerUrl: string, token: string) {
    this.anchorQuoteServerUrl = anchorQuoteServerUrl;
    this.token = token;
  }

  async getInfo() {
    try {
      const { data } = await this.httpService.axiosRef.get(
        `${this.anchorQuoteServerUrl}/info`,
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async getPrices(request: PricesRequestDto) {
    try {
      const queryParams = queryBuilder(request);
      const { data } = await this.httpService.axiosRef.get(
        `${this.anchorQuoteServerUrl}/prices?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async getPrice(request: PriceRequestDto) {
    try {
      const queryParams = queryBuilder(request);
      const { data } = await this.httpService.axiosRef.get(
        `${this.anchorQuoteServerUrl}/price?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );
      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async getFirmQuote(request: QuotePostRequestDto) {
    try {
      const payload = new PayloadBuilder(request)
        .parseObjectKeyCaseType(convertToSnakeCase)
        .filterUndefinedValues()
        .build();

      const { data } = await this.httpService.axiosRef.post(
        `${this.anchorQuoteServerUrl}/quote`,
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

  async getQuoteById(id: string) {
    try {
      const { data } = await this.httpService.axiosRef.get(
        `${this.anchorQuoteServerUrl}/quote/${id}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }
}
