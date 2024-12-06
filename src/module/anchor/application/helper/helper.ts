import {
  Keypair,
  Operation,
  Transaction,
  TransactionBuilder,
} from '@stellar/stellar-sdk';

import GetChallengeValidationError from '../error/get-challenge-validation.error';
import IAnchorTomlResponse from '../interface/response/anchor-toml-response.interface';
import { ValidateChallengeResponse } from '../interface/response/validate-challenge-response.interface';

export async function validateXdrProvenance(
  anchor: IAnchorTomlResponse,
  challengeXdr: string,
  clientPublicKey: string,
): Promise<ValidateChallengeResponse> {
  const transaction = new Transaction(challengeXdr, 'base64');
  const anchorHomeDomain = extractHomeDomain(anchor.WEB_AUTH_ENDPOINT);
  const challengeMinimumOperationsAmount = 2;

  if (transaction.sequence !== '0')
    throw new GetChallengeValidationError('Invalid sequence number');

  if (transaction.source !== anchor.SIGNING_KEY)
    throw new GetChallengeValidationError(
      'Transaction must be signed by the Server',
    );

  const operations = transaction.operations;
  const firstManageDataOperation = operations[0] as Operation.ManageData;

  if (firstManageDataOperation.source !== clientPublicKey)
    throw new GetChallengeValidationError(
      'First manage data operation must have Source account set to the Client Account',
    );

  if (firstManageDataOperation.name !== `${anchorHomeDomain} auth`)
    throw new GetChallengeValidationError(
      `First manage data operation must have Key set to ${anchorHomeDomain} auth`,
    );

  const webAuthDomain = [] as Operation.ManageData[];
  for (let operation of operations) {
    operation = operation as Operation.ManageData;
    if (operation.name === 'web_auth_domain') webAuthDomain.push(operation);
  }

  if (
    webAuthDomain.length <= 0 ||
    webAuthDomain[0]?.source !== anchor.SIGNING_KEY
  )
    throw new GetChallengeValidationError(
      `Source account in manageData must be set to the Server account: ${anchor.SIGNING_KEY}`,
    );

  if (
    webAuthDomain.length >= 1 &&
    !webAuthDomain.every(
      (operation) =>
        Buffer.from(operation.value ?? '').toString('utf8') ===
        anchorHomeDomain,
    )
  )
    throw new GetChallengeValidationError(
      'The value of operation with name "web_auth_domain" must be the Server domain',
    );

  if (operations.length > challengeMinimumOperationsAmount) {
    const additionalOperations = operations.slice(
      challengeMinimumOperationsAmount,
    );
    const isValidManageData = additionalOperations.every(
      (operation) => operation.source === anchor.SIGNING_KEY,
    );
    if (!isValidManageData)
      throw new GetChallengeValidationError(
        'There is an invalid additional manage data in the operation',
      );
  }

  return { xdr: challengeXdr };
}

export function signXdr(secretKey: string, challengeXdr: string): object {
  const transaction = TransactionBuilder.fromXDR(
    challengeXdr,
    process.env.STELLAR_NETWORK_PASSPHRASE,
  );
  transaction.sign(Keypair.fromSecret(secretKey));

  return { signedXdr: transaction.toXDR() };
}

function extractHomeDomain(anchorUrl: string): string {
  const url = new URL(anchorUrl);

  return url.hostname;
}
