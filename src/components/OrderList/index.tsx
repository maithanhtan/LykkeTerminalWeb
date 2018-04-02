import {withAuth} from '../Auth';
import {connect} from '../connect';
import {withScroll} from '../CustomScrollbar';
import OrderList from './OrderList';
import Orders from './Orders';

export const OrderCellWidth = {
  Symbol: 70,
  CancelOrder: 100,
  Id: 300,
  Side: 50
};

export interface OrderActions {
  cancelOrder?: (id: string) => void;
}

export interface OrderListProps {
  onEdit: any;
}

const ConnectedOrders = connect(
  ({
    orderListStore: {limitOrders: orders},
    orderStore: {cancelOrder},
    modalStore: {addModal},
    authStore: {isAuth}
  }) => ({
    addModal,
    cancelOrder,
    orders,
    isAuth
  }),
  withAuth(Orders)
);

const ConnectedOrderList = connect(
  ({orderListStore: {limitOrders: orders}}) => ({
    orders
  }),
  withScroll(OrderList)
);

export {ConnectedOrders as Orders};
export {ConnectedOrderList as OrderList};
export {default as OrderListItem} from './OrderListItem';
