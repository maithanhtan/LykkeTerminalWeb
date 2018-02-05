import endOfDay from 'date-fns/end_of_day';
import endOfMonth from 'date-fns/end_of_month';
import startOfDay from 'date-fns/start_of_day';
import startOfMonth from 'date-fns/start_of_month';
import Interval from '../models/interval';
import {RestApi} from './index';

const asDate = (d: any = Date.now()) => new Date(d).toISOString();

// tslint:disable:object-literal-sort-keys
class PriceApi extends RestApi {
  fetchCandles = (
    instrument: string,
    from: Date,
    to: Date,
    interval: Interval
  ) =>
    this.get(
      `/candlesHistory/spot/${instrument.toLowerCase()}/bid/${interval}/${asDate(
        from
      )}/${asDate(to)}`
    );

  fetchInstrumentPerformance = (instrument: string, interval: Interval) => {
    let from;
    let to;
    const now = Date.now();
    switch (interval) {
      default:
      case 'day':
        from = startOfDay(now);
        to = endOfDay(now);
        break;
      case 'month':
        from = startOfMonth(now);
        to = endOfMonth(now);
        break;
    }
    return this.get(
      `/candlesHistory/spot/${instrument.toLowerCase()}/bid/${interval}/${asDate(
        from
      )}/${asDate(to)}`
    );
  };
}

export default PriceApi;
