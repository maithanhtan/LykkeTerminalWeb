import {connect} from '../../connect';
import Chart from './Chart';
import ChartWrapper from './ChartWrapper';
import Mesh from './Mesh';
import Pointer from './Pointer';

import chart from './chartConstants';

// tslint:disable:object-literal-sort-keys
const ConnectedChartWrapper: any = connect(
  ({depthChartStore: {setWidth, setHeight}, uiStore: {selectedInstrument}}) => {
    return {
      setWidth,
      setHeight,
      selectedInstrument
    };
  },
  ChartWrapper
);

const ConnectedMesh = connect(
  ({
    depthChartStore: {
      asks,
      bids,
      mid,
      height,
      width,
      setLabelsWidth,
      labelsWidth
    },
    uiStore: {selectedInstrument}
  }) => {
    return {
      asks,
      bids,
      mid: mid(),
      height: height - chart.labelsHeight,
      width: width - labelsWidth,
      baseAsset: selectedInstrument!.baseAsset.name,
      quoteAsset: selectedInstrument!.quoteAsset.name,
      quoteAccuracy: selectedInstrument!.quoteAsset.accuracy,
      baseAccuracy: selectedInstrument!.baseAsset.accuracy,
      priceAccuracy: selectedInstrument!.accuracy,
      setLabelsWidth
    };
  },
  Mesh
);

const ConnectedChart = connect(
  ({
    depthChartStore: {asks, bids, mid, height, width, labelsWidth},
    uiStore: {selectedInstrument}
  }) => {
    return {
      asks,
      bids,
      mid: mid(),
      height: height - chart.labelsHeight,
      width: width - labelsWidth,
      baseAsset: selectedInstrument!.baseAsset.name,
      quoteAsset: selectedInstrument!.quoteAsset.name,
      quoteAccuracy: selectedInstrument!.quoteAsset.accuracy,
      baseAccuracy: selectedInstrument!.baseAsset.accuracy,
      priceAccuracy: selectedInstrument!.accuracy
    };
  },
  Chart
);

const ConnectedPointer = connect(
  ({
    depthChartStore: {height, width, labelsWidth},
    uiStore: {selectedInstrument}
  }) => {
    return {
      height: height - chart.labelsHeight,
      width: width - labelsWidth,
      baseAsset: selectedInstrument!.baseAsset.name,
      quoteAsset: selectedInstrument!.quoteAsset.name,
      quoteAccuracy: selectedInstrument!.quoteAsset.accuracy,
      baseAccuracy: selectedInstrument!.baseAsset.accuracy,
      priceAccuracy: selectedInstrument!.accuracy
    };
  },
  Pointer
);

export default ConnectedChartWrapper;
export {default as ChartWrapper} from './ChartWrapper';
export {ConnectedMesh as Mesh};
export {ConnectedChart as Chart};
export {ConnectedPointer as Pointer};
