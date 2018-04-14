import {observer} from 'mobx-react';
import {AssetModel} from '../../models/index';
import {connect} from '../connect';
import {withStyledScroll} from '../CustomScrollbar';
import WalletBalanceItem from './WalletBalanceItem/WalletBalanceItem';
import WalletBalanceList from './WalletBalanceList';

const ConnectedWalletBalanceList = connect(
  ({referenceStore: {getAssetById, baseAssetId}}) => ({
    baseAsset: getAssetById(baseAssetId) || new AssetModel({}),
    getAssetById
  }),
  withStyledScroll({width: 'calc(100% + 1rem)'})(WalletBalanceList)
);

const ObservedWalletBalanceItem = observer(WalletBalanceItem);

export {ConnectedWalletBalanceList as WalletBalanceList};
export {ObservedWalletBalanceItem as WalletBalanceItem};
