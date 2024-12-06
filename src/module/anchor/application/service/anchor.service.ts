import { Injectable } from '@nestjs/common';

import SEP1Adapter from '../../infrastructure/seps/SEP1';
import SEP6Adapter from '../../infrastructure/seps/sep6.adapter';
import SEP10Adapter from '../../infrastructure/seps/sep10.adapter';
import SEP12Adapter from '../../infrastructure/seps/sep12.adapter';
import SEP24Adapter from '../../infrastructure/seps/sep24.adapter';
import SEP38Adapter from '../../infrastructure/seps/sep38.adapter';
import GetAnchorTomlError from '../error/get-anchor-toml.error';
import IAnchorTomlResponse from '../interface/response/anchor-toml-response.interface';

@Injectable()
export class AnchorService {
  constructor(
    private readonly sep1Adapter: SEP1Adapter,

    private readonly sep10Adapter: SEP10Adapter,

    private readonly sep6Adapter: SEP6Adapter,

    private readonly sep12Adapter: SEP12Adapter,

    private readonly sep24Adapter: SEP24Adapter,

    private readonly sep38Adapter: SEP38Adapter,
  ) {}

  async getToml(): Promise<IAnchorTomlResponse> {
    const toml = await this.sep1Adapter.getInfo();

    if (!toml) {
      throw new GetAnchorTomlError('Anchor toml not found');
    }

    return toml;
  }

  async getChallenge(publicKey: string) {
    const toml = await this.getToml();

    return await this.sep10Adapter.getChallenge(
      toml.WEB_AUTH_ENDPOINT,
      publicKey,
    );
  }

  async signChallenge(
    publicKey: string,
    secretKey: string,
    challengeXdr: string,
  ) {
    const toml = await this.getToml();

    const { xdr } = await this.sep10Adapter.validateChallenge(
      publicKey,
      challengeXdr,
      toml,
    );

    return await this.sep10Adapter.signChallenge(secretKey, xdr);
  }

  async sendChallenge(signedXdr: string) {
    const toml = await this.getToml();

    const { token } = await this.sep10Adapter.sendChallenge(
      toml.WEB_AUTH_ENDPOINT,
      signedXdr,
    );

    this.sep6Adapter.setCredentials(token, toml.TRANSFER_SERVER);

    this.sep12Adapter.setCredentials(token, toml.KYC_SERVER);

    this.sep24Adapter.setCredentials(token, toml.TRANSFER_SERVER_SEP0024);

    this.sep38Adapter.setCredentials(token, toml.ANCHOR_QUOTE_SERVER);

    return token;
  }

  async getSep6Info() {
    return await this.sep6Adapter.getInfo();
  }
}
