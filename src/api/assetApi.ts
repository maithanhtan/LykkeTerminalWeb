import {Interval} from '../models/index';
import {PriceApi} from './index';
import {RestApi} from './restApi';

export interface AssetApi {
  fetchAll: () => Promise<any>;
  fetchBaseAsset: () => Promise<any>;
  fetchAssetCategories: () => Promise<any>;
  fetchAssetInstruments: () => Promise<any>;
  setBaseAsset: (body: any) => Promise<any>;
}

export class RestAssetApi extends RestApi implements AssetApi {
  fetchAll = () => this.get('/assets');
  fetchBaseAsset = () => this.get('/assets/baseAsset');
  fetchAssetCategories = () => this.get('/assets/categories');
  fetchAssetInstruments = () => this.get('/assetpairs');
  setBaseAsset = (body: any) => this.fireAndForget('/assets/baseAsset', body);
  fetchInstrumentPerformance = (instrument: string, period: Interval) =>
    new PriceApi().fetchInstrumentPerformance(instrument, period);
}

// tslint:disable-next-line:max-classes-per-file
export class MockAssetApi implements AssetApi {
  fetchAll = () => Promise.resolve<any[]>([]);
  fetchBaseAsset = () => Promise.resolve<any[]>([]);
  fetchAssetCategories = () => Promise.resolve<any[]>([]);
  fetchAssetInstruments = () => Promise.resolve<any[]>([]);
  setBaseAsset = () => Promise.resolve<any[]>([]);
}

export default AssetApi;
