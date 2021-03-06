import {observer} from 'mobx-react';
import * as React from 'react';
import {AssetModel, InstrumentModel} from '../../models/index';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {colors} from '../styled';
import {InstrumentListNumber, InstrumentPickerActions} from './index';

interface InstrumentListItemProps extends InstrumentPickerActions {
  baseAsset: AssetModel;
  instrument: InstrumentModel;
  inactive: boolean;
  isAuth: boolean;
}

const InstrumentListItem: React.SFC<InstrumentListItemProps> = observer(
  ({baseAsset, instrument, onPick, inactive, isAuth}) => {
    const percentageAccuracy = 2;
    const click = () => inactive && onPick && onPick(instrument);

    const dynamics =
      (instrument.change24h || 0) === 0
        ? 'zero'
        : (instrument.change24h || 0) > 0 ? 'up' : 'down';
    const sign = (instrument.change24h || 0) > 0 ? '+' : '';

    return (
      <tr onClick={click} className={inactive ? 'inactive' : 'active'}>
        <td title={instrument.displayName}>{instrument.displayName}</td>
        <td>
          <InstrumentListNumber
            num={formattedNumber(
              instrument.price || 0,
              instrument.accuracy || 0
            )}
          />
        </td>
        <td>
          <InstrumentListNumber
            num={formattedNumber(
              instrument.change24h || 0,
              percentageAccuracy || 0
            )}
            dynamics={dynamics}
            sign={sign}
          >
            %
          </InstrumentListNumber>
        </td>
        <td>
          {isAuth ? (
            <InstrumentListNumber
              num={formattedNumber(
                instrument.volume || 0,
                instrument.baseAsset.accuracy || 0
              )}
            >
              &nbsp;{instrument.baseAsset.name}
            </InstrumentListNumber>
          ) : (
            ''
          )}
        </td>
        <td>
          {isAuth ? (
            <InstrumentListNumber
              num={formattedNumber(
                instrument.volumeInBase || 0,
                baseAsset.accuracy || 0
              )}
              color={colors.lightGrey}
            >
              &nbsp;{baseAsset.name}
            </InstrumentListNumber>
          ) : (
            <InstrumentListNumber
              num={formattedNumber(
                instrument.volume || 0,
                instrument.baseAsset.accuracy || 0
              )}
            >
              &nbsp;{instrument.baseAsset.name}
            </InstrumentListNumber>
          )}
        </td>
      </tr>
    );
  }
);

export default InstrumentListItem;
