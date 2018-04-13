import * as React from 'react';
import {TradeModel} from '../../models/index';
import {Table} from '../Table/index';
import {PublicTradeListItem} from './index';

interface PublicTradeListProps {
  trades: TradeModel[];
}

const ScrollableTable = Table.extend`
  width: calc(100% - 1rem);
`;

export const PublicTradeList: React.SFC<PublicTradeListProps> = ({
  trades = []
}) => (
  <ScrollableTable>
    <tbody>
      {trades.map(trade => <PublicTradeListItem key={trade.id} {...trade} />)}
    </tbody>
  </ScrollableTable>
);

export default PublicTradeList;
