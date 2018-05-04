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
  isAllTrades: boolean;
  onChangeInstrumentById: (id: string) => void;
}

const TradeList: React.SFC<TradeListProps> = ({
  trades = [],
  fetchNextTrades,
  shouldFetchMore,
  isAllTrades,
  onChangeInstrumentById
}) => (
  <React.Fragment>
    <Table>
      <tbody>
        {trades.map(trade => (
          <TradeListItem
            key={trade.id}
            {...trade}
            clickable={isAllTrades}
            changeInstrumentById={onChangeInstrumentById}
          />
        ))}
      </tbody>
    </Table>
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
