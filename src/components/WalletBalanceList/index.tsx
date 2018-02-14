import {AssetBalanceModel, AssetModel} from '../../models/index';
import {connect} from '../connect';
import {withLoader} from '../Loader/index';
import WalletBalanceList from './WalletBalanceList';

export interface WalletBalanceItemProps {
  assetBalance: AssetBalanceModel;
  baseAsset: AssetModel;
}

const ConnectedWalletBalanceList = connect(
  ({
    balanceListStore: {tradingWalletAssets: assets, tradingWalletTotal: total},
    referenceStore
  }) => ({
    assets,
    baseAsset:
      referenceStore.getAssetById(referenceStore.baseAssetId) ||
      new AssetModel({}),
    total,
    // tslint:disable-next-line:object-literal-sort-keys
    isLoading: assets.length === 0
  }),
  withLoader(WalletBalanceList)
);

export {ConnectedWalletBalanceList as WalletBalanceList};
export {
  default as TradingWalletItem
} from './WalletBalanceItem/WalletBalanceItem';
