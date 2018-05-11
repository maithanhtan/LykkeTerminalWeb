import {pathOr} from 'rambda';
import * as React from 'react';
import {Percentage} from '../../constants/ordersPercentage';
import {AssetBalanceModel, OrderInputs, OrderModel} from '../../models';
import ModalModel from '../../models/modalModel';
import Side from '../../models/side';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {precisionFloor} from '../../utils/math';
import EditOrderForm from '../Order/EditOrderForm/EditOrderForm';
import ModalHeader from './ModalHeader/ModalHeader';
import {EditActionTitle, EditModal, EditTitle} from './styles';

const percentage = Percentage.map((i: any) => {
  return {...i};
});

interface EditOrderProps {
  modal: ModalModel;
  orders: OrderModel[];
  getInstrumentById: any;
  onValueChange: any;
  editOrder: any;
  resetPercentage: any;
  handlePercentageChange: any;
  setActivePercentage: (
    percentage: any[],
    index?: number
  ) => {value: number; updatedPercentage: any[]};
  availableBalances: any;
  isLimitInvalid: (
    isSell: boolean,
    quantityValue: string,
    priceValue: string,
    baseAssetBalance: number,
    quoteAssetBalance: number,
    priceAccuracy: number,
    quantityAccuracy: number
  ) => boolean;
}

interface EditOrderState {
  pendingOrder: boolean;
  priceValue: string;
  quantityValue: string;
  percents: any[];
}

class EditOrder extends React.Component<EditOrderProps, EditOrderState> {
  private readonly action: string;
  private readonly accuracy: {
    priceAccuracy: number;
    quantityAccuracy: number;
    quoteAssetAccuracy: number;
  };
  private readonly baseAssetName: string = '';
  private readonly quoteAssetName: string = '';
  private readonly baseAssetId: string = '';
  private readonly quoteAssetId: string = '';
  private readonly currency: string = '';
  private readonly isSellActive: boolean;
  private readonly balance: number = 0;
  private assetAccuracy: number;

  constructor(props: EditOrderProps) {
    super(props);

    const {modal} = this.props;
    const currentInstrument = this.props.getInstrumentById(modal.config.symbol);

    this.accuracy = {
      priceAccuracy: pathOr(2, ['accuracy'], currentInstrument),
      quantityAccuracy: pathOr(2, ['baseAsset', 'accuracy'], currentInstrument),
      quoteAssetAccuracy: pathOr(
        2,
        ['quoteAsset', 'accuracy'],
        currentInstrument
      )
    };

    this.state = {
      pendingOrder: false,
      percents: percentage,
      priceValue: modal.config.price.toFixed(this.accuracy.priceAccuracy),
      quantityValue: modal.config.volume.toFixed(this.accuracy.quantityAccuracy)
    };

    this.baseAssetName = currentInstrument.baseAsset.name;
    this.quoteAssetName = currentInstrument.quoteAsset.name;
    this.baseAssetId = currentInstrument.baseAsset.id;
    this.quoteAssetId = currentInstrument.quoteAsset.id;
    this.action = modal.config.side.toLowerCase();
    this.currency = currentInstrument.id;
    this.isSellActive = this.action === Side.Sell.toLowerCase();

    const assetId = this.isSellActive ? this.baseAssetId : this.quoteAssetId;
    const asset: AssetBalanceModel = this.props.availableBalances.find(
      (b: AssetBalanceModel) => {
        return b.id === assetId;
      }
    );
    const reserved = this.isSellActive
      ? modal.config.volume
      : modal.config.volume * modal.config.price;
    this.assetAccuracy = this.isSellActive
      ? this.accuracy.quantityAccuracy
      : pathOr(2, ['quoteAsset', 'accuracy'], currentInstrument);
    this.balance = asset.available + reserved;
  }

  handlePercentageChange = (index: number) => async (isInverted?: boolean) => {
    const {
      accuracy: {quantityAccuracy, priceAccuracy},
      baseAssetId,
      quoteAssetId
    } = this;

    if (!this.balance) {
      return;
    }

    const {updatedPercentage, value} = this.props.setActivePercentage(
      percentage,
      index
    );

    const tempObj = await this.props.handlePercentageChange({
      balance: this.balance,
      baseAssetId,
      index,
      isInverted,
      isSellActive: this.isSellActive,
      value,
      priceAccuracy,
      quantityAccuracy,
      quoteAssetId,
      currentPrice: this.state.priceValue
    });

    tempObj.percents = updatedPercentage;

    this.setState(tempObj);
  };

  updatePercentageState = (field: string) => {
    const tempObj: any = {};
    if (this.isSellActive && field === OrderInputs.Quantity) {
      this.props.resetPercentage(percentage);
      tempObj.percents = percentage;
    } else if (!this.isSellActive && field === OrderInputs.Price) {
      this.props.resetPercentage(percentage);
      tempObj.percents = percentage;
    }
    this.setState(tempObj);
  };

  onChange = (accuracy: number) => (field: string) => (e: any) => {
    const tempObj = this.props.onValueChange({
      accuracy,
      field,
      value: e.target.value
    });

    this.updatePercentageState(field);
    this.setState(tempObj);
  };

  toggleDisableBtn = (value: boolean) => {
    this.setState({
      pendingOrder: value
    });
  };

  handleEditOrder = () => {
    this.toggleDisableBtn(true);
    const body: any = {
      AssetId: this.baseAssetId,
      AssetPairId: this.currency,
      OrderAction: this.action,
      Price: parseFloat(this.state.priceValue),
      Volume: parseFloat(this.state.quantityValue)
    };

    this.props
      .editOrder(body, this.props.modal.config.id)
      .then(this.handleCancel)
      .catch(() => this.toggleDisableBtn(false));
  };

  handleCancel = () => {
    this.props.resetPercentage(percentage);
    this.props.modal.close();
  };

  render() {
    const {quantityValue, priceValue} = this.state;

    const {
      accuracy: {priceAccuracy, quantityAccuracy},
      isSellActive,
      balance
    } = this;
    const isOrderInvalid =
      this.state.pendingOrder ||
      this.props.isLimitInvalid(
        isSellActive,
        quantityValue,
        priceValue,
        +balance,
        +balance,
        priceAccuracy,
        quantityAccuracy
      );

    const roundedAmount = precisionFloor(
      parseFloat(this.state.quantityValue) * parseFloat(this.state.priceValue),
      this.accuracy.quoteAssetAccuracy
    );

    return (
      <EditModal isSell={this.action === Side.Sell.toLowerCase()}>
        <ModalHeader onClick={this.handleCancel}>
          <EditActionTitle isSell={this.action === Side.Sell.toLowerCase()}>
            {this.action}
          </EditActionTitle>
          <EditTitle>Edit Limit Order</EditTitle>
        </ModalHeader>
        <EditOrderForm
          action={this.action}
          onSubmit={this.handleEditOrder}
          quantity={this.state.quantityValue}
          price={this.state.priceValue}
          quantityAccuracy={this.accuracy.quantityAccuracy}
          priceAccuracy={this.accuracy.priceAccuracy}
          // tslint:disable-next-line:jsx-no-lambda
          onPriceChange={() => {
            return;
          }}
          // tslint:disable-next-line:jsx-no-lambda
          onQuantityChange={() => {
            return;
          }}
          // tslint:disable-next-line:jsx-no-lambda
          onQuantityArrowClick={() => {
            return;
          }}
          // tslint:disable-next-line:jsx-no-lambda
          onPriceArrowClick={() => {
            return;
          }}
          percents={this.state.percents}
          onHandlePercentageChange={this.handlePercentageChange}
          baseAssetName={this.baseAssetName}
          quoteAssetName={this.quoteAssetName}
          isSell={this.isSellActive}
          isDisable={isOrderInvalid}
          amount={formattedNumber(
            roundedAmount || 0,
            this.accuracy.quoteAssetAccuracy
          )}
          balance={this.balance}
          buttonMessage={'Modify'}
          isEditForm={true}
          balanceAccuracy={this.assetAccuracy}
          updatePercentageState={this.updatePercentageState}
        />
      </EditModal>
    );
  }
}

export default EditOrder;
