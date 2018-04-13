import {AssetBalanceModel, AssetModel} from '../../models/index';
import {connect} from '../connect';
import {withStyledScroll} from '../CustomScrollbar';
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
    total
  }),
  withStyledScroll({width: 'calc(100% + 1rem)'})(WalletBalanceList)
);

export {ConnectedWalletBalanceList as WalletBalanceList};
export {
  default as TradingWalletItem
} from './WalletBalanceItem/WalletBalanceItem';
