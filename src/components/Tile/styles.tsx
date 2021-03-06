import {margin, rem} from 'polished';
import styled, {colors, css, dims, fonts, padding} from '../styled';

const lightGraphite = (p: any) =>
  p.selected ? colors.lightGraphite : 'transparent';

const darkGraphite = (p: any) =>
  p.selected ? colors.darkGraphite : 'transparent';

export const TileHeader = styled.div`
  display: flex;
  align-items: center;
  border: none;
  border-bottom: 1px solid ${colors.darkGraphite};
  font-size: ${rem(fonts.normal)};
  position: relative;
  z-index: 0;
  height: ${dims.tileHeaderHeight}px !important;
  width: 100% !important;
  &:before {
    content: '';
    background-color: #2f2f2f;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;

export const TileTitle = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.lightGraphite};
  color: ${colors.white};
  border: none;
  border-right: 1px solid ${colors.darkGraphite};
  border-bottom: solid 1px ${colors.lightGraphite};
  padding: ${padding(...dims.padding)};
  margin-bottom: -1px;
  height: calc(100% + 1px);
`;

export const TileTab = TileTitle.extend`
  background: ${p => lightGraphite(p)};
  border: solid 1px transparent;
  border-right-color: ${p => darkGraphite(p)};
  border-left-color: ${p => darkGraphite(p)};
  border-bottom-color: ${p => lightGraphite(p)};
  cursor: pointer;

  &:first-child {
    border-left: none !important;
  }
` as any;

export const TileContent = styled.div`
  font-size: ${rem(fonts.normal)};
  padding: ${padding(...dims.padding)};
  height: calc(100% - 40px) !important;
  overflow: hidden;
`;

export const TileToolbar = styled.div`
  display: flex;
  align-items: center;
  padding: ${padding(8, 0)};
  width: 100%;
`;

export const Pills = styled.div`
  display: flex;
  align-items: center;
  ${margin(rem(8), 0) as any};
`;

export const Pill = styled.span`
  cursor: pointer;
  text-align: center;
  border-radius: ${rem(4)};
  padding: ${padding(...dims.padding)};
  border: solid 1px rgba(140, 148, 160, 0.4);
  margin-right: ${rem(8)};
  ${(p: any) =>
    p.active &&
    css`
      border-color: #0388ef;
      box-shadow: inset 0 0 0 1px #0388ef;
    `};
` as any;
