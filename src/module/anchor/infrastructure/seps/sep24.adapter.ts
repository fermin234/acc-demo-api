import { HttpService } from '@nestjs/axios';

import { DepositRequestDto } from '../../application/dto/deposit/deposit.dto';
import { FeeRequestDto } from '../../application/dto/fee/fee-request.dto';
import { TransactionRequestDto } from '../../application/dto/transaction/transaction.dto';
import { TransactionsRequestDto } from '../../application/dto/transaction/transactions.dto';
import { WithdrawRequestDto } from '../../application/dto/withdraw/withdraw-request.dto';
import AxiosHttpRequestError from '../../application/error/axios-http-request.error';
import convertToSnakeCase from '../../application/helper/convert-to-snake-case';
import PayloadBuilder from '../../application/helper/payload-builder';
import queryBuilder from '../../application/helper/query-builder';

export default class SEP24Adapter {
  private transferServerSep24Url: string;
  private token: string;

  constructor(private readonly httpService: HttpService) {}

  setCredentials(transferServerSep24Url: string, token: string) {
    this.transferServerSep24Url = transferServerSep24Url;
    this.token = token;
  }

  async getDepositInteractiveUrl(request: DepositRequestDto) {
    const payload = new PayloadBuilder(request)
      .parseObjectKeyCaseType(convertToSnakeCase)
      .build();

    try {
      const { data } = await this.httpService.axiosRef.post(
        `${this.transferServerSep24Url}/transactions/deposit/interactive`,
        payload,
        { headers: { Authorization: `Bearer ${this.token}` } },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async getWithdrawInteractiveUrl(request: WithdrawRequestDto) {
    const payload = new PayloadBuilder(request)
      .parseObjectKeyCaseType(convertToSnakeCase)
      .build();

    try {
      const { data } = await this.httpService.axiosRef.post(
        `${this.transferServerSep24Url}/transactions/withdraw/interactive`,
        payload,
        { headers: { Authorization: `Bearer ${this.token}` } },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async getTransactions(request: TransactionsRequestDto) {
    const queryParams = queryBuilder(request);
    try {
      const { data } = await this.httpService.axiosRef.get(
        `${this.transferServerSep24Url}/transactions?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async getTransactionById(request: TransactionRequestDto) {
    const queryParams = queryBuilder(request);
    try {
      const { data } = await this.httpService.axiosRef.get(
        `${this.transferServerSep24Url}/transaction?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async getFee(request: FeeRequestDto) {
    try {
      const queryParams = queryBuilder(request);

      const { data } = await this.httpService.axiosRef.get(
        `${this.transferServerSep24Url}/fee?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async getInfo(lang?: string) {
    try {
      const url = lang
        ? `${this.transferServerSep24Url}/info?${queryBuilder({ lang })}`
        : `${this.transferServerSep24Url}/info`;
      const { data } = await this.httpService.axiosRef.get(url);

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }
}
