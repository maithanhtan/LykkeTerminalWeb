import * as React from 'react';
import {TradeListItem} from '.';
import {TradeModel} from '../../models';
import {LoaderProps} from '../Loader/withLoader';
import {Table} from '../Table';
import {StyledLoadMore, StyledLoadMoreButton} from './styles';

export interface TradeListProps extends LoaderProps {
  trades: TradeModel[];
  fetchNextTrades?: any;
  shouldFetchMore?: boolean;
}

const ScrollableTable = Table.extend`
  width: calc(100% - 1rem);
`;

const TradeList: React.SFC<TradeListProps> = ({
  trades = [],
  fetchNextTrades,
  shouldFetchMore
}) => (
  <React.Fragment>
    <ScrollableTable>
      <tbody>
        {trades.map(trade => <TradeListItem key={trade.id} {...trade} />)}
      </tbody>
    </ScrollableTable>
    {shouldFetchMore && (
      <StyledLoadMore>
        <StyledLoadMoreButton onClick={fetchNextTrades}>
          Load more...
        </StyledLoadMoreButton>
      </StyledLoadMore>
    )}
  </React.Fragment>
);

export default TradeList;
