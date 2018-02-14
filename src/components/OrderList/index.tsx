import {connect} from '../connect';
import {withLoader} from '../Loader';
import OrderList from './OrderList';

export interface OrderActions {
  cancelOrder?: (id: string) => void;
}

const ConnectedOrderList = connect(
  ({orderListStore: {limitOrders: orders}, orderStore: {cancelOrder}}) => ({
    cancelOrder,
    orders,
    // tslint:disable-next-line:object-literal-sort-keys
    isLoading: orders.length === 0
  }),
  withLoader(OrderList)
);

export {ConnectedOrderList as OrderList};
export {default as OrderListItem} from './OrderListItem';
