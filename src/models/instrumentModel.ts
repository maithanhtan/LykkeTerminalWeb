import {action, extendObservable, observable} from 'mobx';
import {Dir} from '../models';
import {AssetModel} from './index';

class InstrumentModel {
  id: string;
  name: string;
  baseAsset: AssetModel;
  quotingAsset: AssetModel;
  accuracy: number;
  invertedAccuracy: number;

  @observable price: number;
  @observable change: number;

  @observable dir: Dir;

  @observable openPrice: number;

  constructor(instrument: Partial<InstrumentModel>) {
    extendObservable(this, instrument);
  }

  @action
  updatePrice = (nextPrice: number) => {
    if (this.price !== nextPrice) {
      this.change = (nextPrice - this.openPrice) / this.openPrice * 100;
      this.dir = this.change > 0 ? Dir.Up : Dir.Down;
      this.price = nextPrice;
    }
  };
}

export default InstrumentModel;
