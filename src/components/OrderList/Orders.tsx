import * as React from 'react';
import {OrderModel} from '../../models';
import Types from '../../models/modals';
import {HBar} from '../Bar';
import {sortData, TableHeader, TableSortState} from '../Table';
import {OrderActions, OrderCellWidth, OrderList} from './';
import {CancelAllOrders, ToggleOrders} from './OrderListAdditional';
import OrderListToolbar from './OrderListToolbar';

interface OrdersProps extends OrderActions {
  addModal: any;
  cancelOrder: any;
  orders: OrderModel[];
}

class Blotter extends React.Component<OrdersProps, TableSortState> {
  constructor(props: OrdersProps) {
    super(props);
    this.state = {
      data: this.props.orders,
      sortByParam: '',
      sortDirection: 'ASC'
    };
  }

  componentWillReceiveProps(args: any) {
    this.setState({
      data: args.orders
    });
  }

  sort = (sortByParam: string, sortDirectionDefault: string) => {
    this.setState(
      sortData(this.props.orders, sortByParam, sortDirectionDefault, this.state)
    );
  };

  render() {
    const handleEditOrder = (order: any) => (id: string) => {
      this.props.addModal(
        id,
        // tslint:disable-next-line:no-empty
        () => {},
        // tslint:disable-next-line:no-empty
        () => {},
        Types.EditOrder,
        order
      );
    };
    const headers: any[] = [
      {key: 'symbol', value: 'Asset pair', width: OrderCellWidth.Symbol},
      {
        className: 'right-align',
        key: 'side',
        value: 'Side',
        width: OrderCellWidth.Side
      },
      {className: 'right-align', key: 'price', value: 'Price'},
      {className: 'right-align', key: 'amount', value: 'Amount'},
      {className: 'right-align', key: 'value', value: 'Value'},
      {
        className: 'right-align',
        key: 'time',
        value: 'Time',
        width: OrderCellWidth.CreatedDate
      },
      {
        sortDisabled: true,
        className: 'right-align',
        key: '',
        value: 'Edit',
        width: OrderCellWidth.Edit
      },
      {
        sortDisabled: true,
        className: 'center-align',
        key: '',
        value: 'Close',
        width: OrderCellWidth.CancelOrder
      }
    ];

    return (
      <React.Fragment>
        <OrderListToolbar>
          <ToggleOrders />
          <CancelAllOrders />
        </OrderListToolbar>
        <HBar />
        <TableHeader
          currentSortDirection={this.state.sortDirection}
          currentSortByParam={this.state.sortByParam}
          headers={headers}
          onSort={this.sort}
        />
        <OrderList
          orders={this.state.data}
          onEditOrder={handleEditOrder}
          onCancelOrder={this.props.cancelOrder}
        />
      </React.Fragment>
    );
  }
}

export default Blotter;
