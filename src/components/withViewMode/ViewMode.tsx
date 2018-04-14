import {inject} from 'mobx-react';
import * as React from 'react';
import {RootStore} from '../../stores';
import styled from '../styled';

const Link = styled.a`
  color: #0388ef;
  cursor: pointer;
  text-decoration: underline;
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const mapStoreToProps = ({sessionStore}: RootStore) => ({
  showQr: sessionStore.showQR
});

const ViewMode = inject(mapStoreToProps)(({showQr}) => (
  <Centered>
    <Link onClick={showQr}>Scan QR</Link>&nbsp;to start trading
  </Centered>
));

export default ViewMode;
