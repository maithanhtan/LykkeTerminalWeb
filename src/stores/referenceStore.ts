import {action, computed, observable, runInAction} from 'mobx';
import {compose, filter, replace, toLower} from 'rambda';
import {AssetApi} from '../api/index';
import {keys} from '../models';
import {
  AssetCategoryModel,
  AssetModel,
  InstrumentModel,
  SearchString
} from '../models';
import * as mappers from '../models/mappers';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

// tslint:disable-next-line:no-var-requires
const {includes} = require('rambda');

const normalize = compose(
  replace(SearchString.Delimiter, SearchString.Empty),
  toLower
);

const baseAssetStorage = StorageUtils(keys.baseAsset);

class ReferenceStore extends BaseStore {
  @observable private assets: AssetModel[] = [];
  @observable.shallow private availableAssets: string[] = [];
  @observable private categories: AssetCategoryModel[] = [];
  @observable.shallow private instruments: InstrumentModel[] = [];
  @observable private baseAsset: string = '';

  @computed
  get baseAssets() {
    return this.assets
      .filter(a => this.availableAssets.indexOf(a.id) > -1)
      .filter(a => a.isBase);
  }

  @computed
  get allAssets() {
    return this.assets;
  }

  @computed
  get baseAssetId() {
    return this.baseAsset;
  }

  @computed
  get getBaseAssetAccuracy() {
    const asset = this.getAssetById(this.baseAsset);
    return asset ? asset.accuracy : 2;
  }

  @computed
  get getBaseAsset() {
    return this.getAssetById(this.baseAssetId);
  }

  constructor(readonly store: RootStore, private api: AssetApi) {
    super(store);
  }

  getAssets = () => this.assets;

  getAssetById = (id: string) => this.assets.find(a => a.id === id);

  @action
  addAsset = (asset: AssetModel) => (this.assets = [...this.assets, asset]);

  getCategories = () => this.categories;

  getInstruments = () => {
    return this.instruments;
  };

  getInstrumentById = (id: string) => this.instruments.find(x => x.id === id);

  findInstruments = (term: string, watchlistName: string) => {
    const {getWatchlistByName} = this.rootStore.watchlistStore;
    const instrumentsByName = this.instruments.filter(instrument =>
      includes(normalize(term), normalize(instrument.displayName!))
    );

    if (watchlistName) {
      const instrumentsByWatchlist = getWatchlistByName(watchlistName);
      if (instrumentsByWatchlist) {
        return filter(
          i => instrumentsByWatchlist.assetIds.indexOf(i.id) > -1,
          instrumentsByName
        );
      }
    }
    return instrumentsByName;
  };

  @action
  addInstrument = (instrument: InstrumentModel) => {
    this.instruments.push(instrument);
  };

  @action
  addAvailableAsset = (assetId: string) => {
    this.availableAssets.push(assetId);
  };

  fetchReferenceData = async (authenticated: boolean) => {
    await this.fetchCategories();
    await this.fetchAssets();

    if (authenticated) {
      await this.fetchInstruments();
      await this.fetchAvailableAssets();
    } else {
      await this.fetchPublicInstruments();
    }
  };

  fetchAssets = () => {
    return this.api
      .fetchAll()
      .then((resp: any) => {
        if (resp && resp.Assets) {
          runInAction(() => {
            this.assets = resp.Assets.map((x: any) =>
              mappers.mapToAsset(x, this.categories)
            );
          });
        }
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  fetchAssetById = (id: string) => {
    return this.api.fetchAssetById(id).then((resp: any) => {
      const asset = mappers.mapToAsset(resp.Asset, this.categories);
      this.assets.push(asset);
      return Promise.resolve(asset);
    });
  };

  fetchAvailableAssets = async () => {
    const resp = await this.api.fetchAvailableAssets();
    runInAction(() => {
      this.availableAssets = resp.AssetIds;
    });
  };

  fetchCategories = () => {
    return this.api
      .fetchAssetCategories()
      .then((resp: any) => {
        if (resp && resp.AssetCategories) {
          runInAction(() => {
            this.categories = resp.AssetCategories.map(
              mappers.mapToAssetCategory
            );
          });
        }
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  fetchInstruments = async () => {
    const resp = await this.api.fetchAssetInstruments();
    if (resp && resp.AssetPairs) {
      runInAction(() => {
        this.instruments = resp.AssetPairs.map((x: any) =>
          mappers.mapToInstrument(x, this.getAssetById)
        );
      });
    }
  };

  fetchPublicInstruments = async () => {
    const resp = await this.api.fetchPublicAssetInstruments();
    if (resp && resp.AssetPairs) {
      runInAction(() => {
        this.instruments = resp.AssetPairs.map((x: any) =>
          mappers.mapToPublicInstrument(x, this.getAssetById)
        );
      });
    }
  };

  fetchBaseAsset = () => {
    return this.api
      .fetchBaseAsset()
      .then((res: any) => {
        if (!!res) {
          this.baseAsset = res.BaseAssetId || 'USD';
          baseAssetStorage.set(this.baseAsset);
        }
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  fetchRates = async () => {
    const resp = await this.api.fetchMarket();
    resp.forEach(({assetPair, lastPrice, bid, ask, volume24H}: any) => {
      const instrument = this.getInstrumentById(assetPair);
      if (instrument) {
        runInAction(() => {
          instrument.price = lastPrice;
          instrument.bid = bid;
          instrument.ask = ask;
          instrument.volume = volume24H / lastPrice;
        });
      }
    });
  };

  setBaseAssetId = async (assetId: string) => {
    baseAssetStorage.set(assetId);
    this.baseAsset = assetId;
    this.api.setBaseAsset({BaseAsssetId: assetId});
    this.updateInstruments();
    this.rootStore.balanceListStore.updateWalletBalances();
  };

  updateInstruments = () => {
    this.getInstruments().forEach(instrument =>
      instrument.updateVolumeInBase(
        this.rootStore.marketStore.convert(
          instrument.volume,
          instrument.baseAsset.id,
          this.baseAssetId,
          this.getInstrumentById
        )
      )
    );
  };

  onQuote = (args: any) => {
    const {a: id, p: price} = args[0];
    const instrument = this.getInstrumentById(id);
    if (instrument && instrument.id) {
      instrument.updateBid(price); // TODO: improve domain model design
    }
  };

  onQuoteAsk = (args: any) => {
    const {a: id, p: price} = args[0];
    const instrument = this.getInstrumentById(id);
    if (instrument && instrument.id) {
      instrument.updateAsk(price);
    }
  };

  onCandle = async (args: any) => {
    const {a: id, o: openPrice, c: closePrice, v: volume} = args[0];
    const instrument = this.getInstrumentById(id);

    if (instrument && instrument.id) {
      instrument.updateFromCandle(openPrice, closePrice, volume);
      instrument.updateVolumeInBase(
        this.rootStore.marketStore.convert(
          volume,
          instrument.baseAsset.id,
          this.baseAssetId,
          this.getInstrumentById
        )
      );
    }
  };

  reset = () => {
    this.assets = [];
    this.availableAssets = [];
  };
}

export default ReferenceStore;
