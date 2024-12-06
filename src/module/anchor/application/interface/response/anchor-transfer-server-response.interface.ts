import { DepositAssetType } from '../../types/deposit-asset.type';
import { WithdrawAssetType } from '../../types/withdraw-asset.type';

export default interface IAnchorTransferServerInfoResponse {
  deposit: { [key in string]: DepositAssetType };
  withdraw: { [key in string]: WithdrawAssetType };
}
