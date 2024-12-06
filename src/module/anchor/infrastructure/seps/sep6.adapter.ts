import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { DepositExchangeDto } from '../../application/dto/deposit/deposit-exchange.dto';
import { DepositRequestDto } from '../../application/dto/deposit/deposit.dto';
import { FeeRequestDto } from '../../application/dto/fee/fee-request.dto';
import { TransactionRequestDto } from '../../application/dto/transaction/transaction.dto';
import { TransactionsRequestDto } from '../../application/dto/transaction/transactions.dto';
import { TransferServerRequestDto } from '../../application/dto/transfer-server/transfer-server.dto';
import { WithdrawRequestDto } from '../../application/dto/withdraw/withdraw-request.dto';
import { WithdrawExchangeDto } from '../../application/dto/withdraw/withdraw-exchange.dto';
import AxiosHttpRequestError from '../../application/error/axios-http-request.error';
import queryBuilder from '../../application/helper/query-builder';
import IAnchorDepositResponse from '../../application/interface/response/anchor-deposit-response.interface';
import IAnchorTransferServerInfoResponse from '../../application/interface/response/anchor-transfer-server-response.interface';
import IAnchorWithdrawResponse from '../../application/interface/response/anchor-withdraw-response.interface';

@Injectable()
export default class SEP6Adapter {
  private token: string;
  private transferServerUrl: string;

  constructor(private readonly httpService: HttpService) {}

  setCredentials(token: string, transferServerUrl: string): void {
    this.token = token;
    this.transferServerUrl = transferServerUrl;
  }

  async getInfo(
    request?: TransferServerRequestDto,
  ): Promise<IAnchorTransferServerInfoResponse> {
    try {
      const url = request
        ? `${this.transferServerUrl}/info?${queryBuilder(request)}`
        : `${this.transferServerUrl}/info`;
      const { data } = await this.httpService.axiosRef.get(url);

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async deposit(request: DepositRequestDto): Promise<IAnchorDepositResponse> {
    try {
      const queryParams = queryBuilder(request);

      const { data } = await this.httpService.axiosRef.get(
        `${this.transferServerUrl}/deposit?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );
      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async withdraw(
    request: WithdrawRequestDto,
  ): Promise<IAnchorWithdrawResponse> {
    try {
      const queryParams = queryBuilder(request);

      const { data } = await this.httpService.axiosRef.get(
        `${this.transferServerUrl}/withdraw?${queryParams}`,
        { headers: { Authorization: `Bearer ${this.token}` } },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async getTransactions(request: TransactionsRequestDto) {
    try {
      const queryParams = queryBuilder(request);

      const { data } = await this.httpService.axiosRef.get(
        `${this.transferServerUrl}/transactions?${queryParams}`,
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
    try {
      const queryParams = queryBuilder(request);

      const { data } = await this.httpService.axiosRef.get(
        `${this.transferServerUrl}/transaction?${queryParams}`,
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
        `${this.transferServerUrl}/fee?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async getDepositExchange(
    request: DepositExchangeDto,
  ): Promise<IAnchorDepositResponse> {
    try {
      const queryParams = queryBuilder(request);

      const { data } = await this.httpService.axiosRef.get(
        `${this.transferServerUrl}/deposit-exchange?${queryParams}`,
        { headers: { Authorization: `Bearer ${this.token}` } },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }

  async getWithdrawExchange(
    request: WithdrawExchangeDto,
  ): Promise<IAnchorWithdrawResponse> {
    try {
      const queryParams = queryBuilder(request);

      const { data } = await this.httpService.axiosRef.get(
        `${this.transferServerUrl}/withdraw-exchange?${queryParams}`,
        { headers: { Authorization: `Bearer ${this.token}` } },
      );

      return data;
    } catch (e) {
      throw new AxiosHttpRequestError(e);
    }
  }
}
