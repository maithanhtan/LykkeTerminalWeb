import {ISubscription} from 'autobahn';
import {addDays, addMonths} from 'date-fns';
import {computed, observable, runInAction} from 'mobx';
import {last} from 'rambda';
import {BaseStore, RootStore} from '.';
import {PriceApi} from '../api';
import * as topics from '../api/topics';
import messages from '../constants/notificationMessages';
import {levels} from '../models';
import {MarketType, PriceType} from '../models';
import * as map from '../models/mappers';

const toUtc = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  return new Date(Date.UTC(y, m, d));
};

class PriceStore extends BaseStore {
  priceApi: any;
  @observable lastTradePrice: number;
  @observable dailyHigh: number;
  @observable dailyLow: number;
  @observable dailyOpen: number;
  @observable dailyVolume: number;

  private subscriptions: Set<ISubscription> = new Set();

  @computed
  get dailyChange() {
    return (this.lastTradePrice - this.dailyOpen) / this.dailyOpen * 100;
  }

  @computed
  get selectedInstrument() {
    return this.rootStore.uiStore.selectedInstrument;
  }

  constructor(store: RootStore, private readonly api: PriceApi) {
    super(store);
  }

  fetchLastPrice = async () => {
    return this.api
      .fetchCandles(
        this.selectedInstrument!.id,
        toUtc(addMonths(new Date(), -12)),
        toUtc(addMonths(new Date(), 1)),
        'month'
      )
      .then((resp: any) => {
        if (resp.History && resp.History.length > 0) {
          runInAction(() => {
            const {close} = map.mapToBarFromRest(last(resp.History));
            this.lastTradePrice = close;
            this.selectedInstrument!.updateFromCandle(
              undefined,
              close,
              undefined
            );
          });
        }
      })
      .catch((e: any) => {
        switch (e.status) {
          case 404:
            this.rootStore.notificationStore.addNotification(
              levels.error,
              messages.pairNotConfigured(this.selectedInstrument!.id)
            );
            break;
          default:
            break;
        }
      });
  };

  fetchDailyCandle = async () => {
    const resp = await this.api.fetchCandles(
      this.selectedInstrument!.id,
      toUtc(new Date()),
      toUtc(addDays(new Date(), 1)),
      'day'
    );
    if (resp.History && resp.History.length > 0) {
      runInAction(() => {
        const {open, high, low, close, volume} = map.mapToBarFromRest(
          last(resp.History)
        );
        this.dailyOpen = open;
        this.dailyHigh = high;
        this.dailyLow = low;
        this.dailyVolume = volume;

        this.selectedInstrument!.updateFromCandle(open, close, volume);
        this.selectedInstrument!.updateVolumeInBase(
          this.rootStore.marketStore.convert(
            volume,
            this.selectedInstrument!.baseAsset.id,
            this.rootStore.referenceStore.baseAssetId,
            this.rootStore.referenceStore.getInstrumentById
          )
        );
      });
    }
  };

  subscribeToDailyCandle = async () => {
    this.subscriptions.add(
      await this.getWs().subscribe(
        topics.candle(
          MarketType.Spot,
          this.selectedInstrument!.id,
          PriceType.Trade,
          'day'
        ),
        this.onDailyTradeCandle
      )
    );
  };

  onDailyTradeCandle = (args: any[]) => {
    if (this.selectedInstrument && this.selectedInstrument.id === args[0].a) {
      const {open, high, low, close, volume} = map.mapToBarFromWamp(args[0]);
      this.dailyOpen = open;
      this.dailyHigh = high;
      this.dailyLow = low;
      this.lastTradePrice = close;
      this.dailyVolume = volume;
    }
  };

  unsubscribeFromDailyCandle = async () => {
    const subscriptions = Array.from(this.subscriptions).map(s => {
      // tslint:disable-next-line:no-unused-expression
      this.getWs() && this.getWs().unsubscribe(s);
    });
    await Promise.all(subscriptions);
    if (this.subscriptions.size > 0) {
      this.subscriptions.clear();
    }
  };

  reset = () => {
    this.lastTradePrice = 0;
    this.dailyHigh = 0;
    this.dailyLow = 0;
    this.dailyOpen = 0;
    this.dailyVolume = 0;
    this.unsubscribeFromDailyCandle();
  };
}

export default PriceStore;
