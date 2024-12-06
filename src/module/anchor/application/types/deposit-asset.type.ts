export interface DepositAssetType {
  enabled: boolean;
  authentication_required: boolean;
  min_amount: number;
  max_amount: number;
  fee_fixed: number;
  fee_percent: number;
}
