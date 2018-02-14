import {connect} from '../connect';
import {withLoader} from '../Loader/index';
import OrderBook from './OrderBook';

const ConnectedOrderBook = connect(
  ({
    orderBookStore: {bestAsks, bestBids, mid},
    uiStore: {selectedInstrument}
  }) => ({
    asks: bestAsks(10),
    bids: bestBids(10),
    mid: mid().toFixed(2),
    // tslint:disable-next-line:object-literal-sort-keys
    isLoading: bestAsks(10).length === 0 || bestBids(10).length === 0
  }),
  withLoader(OrderBook)
);

export default ConnectedOrderBook;
export {default as OrderBookItem} from './OrderBookItem/OrderBookItem';
