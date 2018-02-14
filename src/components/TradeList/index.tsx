import {observer} from 'mobx-react';
import {TradeModel} from '../../models/index';
import {connect} from '../connect';
import {withLoader} from '../Loader/index';
import PublicTradeList from './PublicTradeList';
import TradeList from './TradeList';
import TradeListItem from './TradeListItem';

export interface TradesProps {
  trades?: TradeModel[];
  fetchPart: any;
  stringId?: string;
  authorized?: true;
}

const ConnectedTradeList = connect(
  ({tradeStore: {getAllTrades, fetchPartTrade}, authStore}) => ({
    fetchPart: fetchPartTrade,
    trades: getAllTrades,
    // tslint:disable-next-line:object-literal-sort-keys
    authorized: authStore.isAuth,
    // tslint:disable-next-line:object-literal-sort-keys
    isLoading: getAllTrades.length === 0
  }),
  withLoader(TradeList)
);

const ConnectedPublicTradeList = connect(
  ({tradeStore: {getPublicTrades, fetchPartPublicTrade}, authStore}) => ({
    fetchPart: fetchPartPublicTrade,
    trades: getPublicTrades,
    // tslint:disable-next-line:object-literal-sort-keys
    isLoading: getPublicTrades.length === 0
  }),
  withLoader(PublicTradeList)
);

const ObservedTradeListItem = observer(TradeListItem);

export {ConnectedTradeList as TradeList};
export {ConnectedPublicTradeList as PublicTradeList};
export {ObservedTradeListItem as TradeListItem};
