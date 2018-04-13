import * as React from 'react';
import {OrderListItem} from '.';
import {OrderModel} from '../../models';
import {Table} from '../Table';
import {HeaderCell} from '../Table/styles';

interface OrderListProps {
  orders: OrderModel[];
  onEditOrder: (order: OrderModel) => (id: string) => void;
  onCancelOrder?: (id: string) => void;
}

const ScrollableTable = Table.extend`
  width: 'calc(100% - 1rem)';

  thead {
    border-bottom: none;
  }

  thead > tr > th {
    border-bottom: solid 1px #292929;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const OrderList: React.SFC<OrderListProps> = ({
  orders,
  onEditOrder,
  onCancelOrder
}) => (
  <React.Fragment>
    <ScrollableTable>
      <thead>
        <tr>
          <th>Asset pair</th>
          <th>Cancel order</th>
          <th>OrderID</th>
          <th>Side</th>
          <th>Volume</th>
          <th>Price</th>
          <th>Created Date</th>
          <th>Edit</th>
          <HeaderCell w={14}>&nbsp;</HeaderCell>
        </tr>
      </thead>
    </ScrollableTable>
    <ScrollableTable>
      <tbody>
        {orders.map(order => (
          <OrderListItem
            key={order.id}
            cancelOrder={onCancelOrder}
            onEdit={onEditOrder(order)}
            {...order}
          />
        ))}
        {orders.map(order => (
          <OrderListItem
            key={order.id}
            cancelOrder={onCancelOrder}
            onEdit={onEditOrder(order)}
            {...order}
          />
        ))}
      </tbody>
    </ScrollableTable>
  </React.Fragment>
);

export default OrderList;
