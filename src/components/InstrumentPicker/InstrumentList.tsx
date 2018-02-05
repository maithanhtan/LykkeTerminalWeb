import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import styled from 'styled-components';
import {InstrumentListItem, InstrumentListProps} from './index';
// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

const StyledInstruments = styled.div`
  overflow: auto;
  max-height: 560px;
`;

const StyledInstrumentHeader = styled(Box)`
  text-align: center;
  padding: 10px;
  color: #8c94a0;
  &:first-child {
    text-align: left;
  }
`;

class InstrumentList extends React.Component<InstrumentListProps> {
  componentDidMount() {
    this.props.change();
  }

  render() {
    return (
      <StyledInstruments>
        <Flex justify="space-between">
          <StyledInstrumentHeader>Symbol</StyledInstrumentHeader>
          <StyledInstrumentHeader>Price</StyledInstrumentHeader>
          <StyledInstrumentHeader>Change (24h)</StyledInstrumentHeader>
        </Flex>
        <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={560}>
          {this.props.instruments.map(x => (
            <InstrumentListItem
              key={x.id}
              instrument={x}
              onPick={this.props.onPick}
            />
          ))}
        </Scrollbars>
      </StyledInstruments>
    );
  }
}

export default InstrumentList;
