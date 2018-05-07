import * as React from 'react';
import {TradesCellWidth} from '.';
import {TradeModel} from '../../models/index';
import {feeAssetFromSide} from '../../models/tradeModel.mapper';
import {toLocaleStringWithAccuracy} from '../../utils/string';
import {Cell} from '../Table/styles';
import TitledCell from '../Table/TitledCell';
import {SideCell} from './styles';

interface TradeListItemProps extends TradeModel {
  className?: string;
  clickable: boolean;
  changeInstrumentById: (id: string) => void;
  isSelected: boolean;
}

const TradeListItem: React.SFC<TradeListItemProps> = ({
  price,
  side,
  symbol,
  volume,
  oppositeVolume,
  orderType,
  fee,
  timestamp,
  instrument,
  className,
  clickable,
  changeInstrumentById,
  isSelected
}) => {
  const {
    accuracy,
    baseAsset: {accuracy: baseAssetAccuracy, name: baseAssetName},
    quoteAsset: {accuracy: quoteAssetAccuracy, name: quoteAssetName},
    id: instrumentId
  } = instrument!;
  const feeAsset = feeAssetFromSide(instrument!, side);
  const handleChangeInstrumentById = () =>
    clickable && !isSelected && changeInstrumentById(instrumentId);
  return (
    <tr>
      <Cell
        clickable={clickable && !isSelected}
        onClick={handleChangeInstrumentById}
        w={TradesCellWidth.Symbol}
      >
        {instrument!.displayName}
      </Cell>
      <SideCell w={TradesCellWidth.Side} side={side}>
        {side}
      </SideCell>
      <TitledCell>{toLocaleStringWithAccuracy(price, accuracy)}</TitledCell>
      <TitledCell>
        {toLocaleStringWithAccuracy(volume, baseAssetAccuracy)} {baseAssetName}
      </TitledCell>
      <TitledCell>
        {toLocaleStringWithAccuracy(fee, feeAsset.accuracy)} {feeAsset.name}
      </TitledCell>
      <TitledCell>
        {toLocaleStringWithAccuracy(oppositeVolume, quoteAssetAccuracy)}{' '}
        {quoteAssetName}
      </TitledCell>
      <Cell w={TradesCellWidth.OrderType}>{orderType}</Cell>
      <TitledCell>{new Date(timestamp).toLocaleString()}</TitledCell>
    </tr>
  );
};

export default TradeListItem;
