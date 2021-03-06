import rem from 'polished/lib/helpers/rem';
import * as React from 'react';
import styled from 'styled-components';

interface OrderPercentageProps {
  percent: number;
  isActive: boolean;
  onClick: any;
  isDisabled: boolean;
}

const StyledPercent = styled.div.attrs({
  style: (props: any) => ({
    opacity: `${props.disabled ? 0.5 : 1}`
  })
})`
  color: #f5f6f7;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  padding: ${rem(8)} 0;
  border: 1px solid transparent;
  font-size: ${rem(14)};
  display: flex;
  justify-content: center;
  margin-bottom: ${rem(4)};

  div {
    border-left: 1px solid rgba(140, 148, 160, 0.4);
    width: 100%;
    text-align: center;
  }

  &.active {
    border: 1px solid rgba(140, 148, 160, 0.4);
    border-radius: 4px;

    div {
      border-left: 1px solid transparent;
    }
  }

  &:first-child {
    div {
      border-left: 1px solid transparent;
    }
  }

  &:hover,
  &.active + div:hover {
    border: 1px solid rgba(140, 148, 160, 0.4);
    border-left: 1px solid rgba(140, 148, 160, 0.4);
    border-radius: 4px;
    cursor: pointer;

    div {
      border-left: 1px solid transparent;
    }
  }

  &:hover + div,
  &.active + div {
    div {
      border-left: 1px solid transparent;
    }
  }
` as any;

const OrderPercentage: React.SFC<OrderPercentageProps> = ({
  percent,
  isActive,
  onClick,
  isDisabled
}) => {
  return (
    <StyledPercent
      disabled={isDisabled}
      className={isActive ? 'active' : ''}
      onClick={onClick}
    >
      <div>{percent}%</div>
    </StyledPercent>
  );
};

export default OrderPercentage;
