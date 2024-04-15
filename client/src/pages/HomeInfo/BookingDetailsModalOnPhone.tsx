import { ReactNode, useState } from 'react';
import { ScreenType, useScreen } from '../../providers/ScreenProvider';
import Modal from '../../components/Modal';
import { DataProps } from './types/DataProps';
import styled from 'styled-components';
import Button from '../../components/buttons/Button';
import { moneyFormatter } from '../../utils/money-formatter';

const StyledBookingPanel = styled.div`
  padding: 1rem var(--padding-inline);
  box-sizing: border-box;
  position: sticky;
  left: 0;
  width: 100vw;
  z-index: 3;
  bottom: -1px;
  background-color: white;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 10px;
  /* box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
    rgba(14, 30, 37, 0.32) 0px 2px 16px 0px; */

  & > .price {
    font-size: 1.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
    position: relative;
    top: -0.2rem;
  }
`;

type Props = {
  children: ReactNode;
} & DataProps;

const BookingDetailsModalOnPhone: React.FC<Props> = ({ children, data }) => {
  const screen = useScreen();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (screen === ScreenType.PHONE) {
    return (
      <>
        <StyledBookingPanel>
          <Button onClick={() => setIsModalOpen(true)}>Book now</Button>
          <p className="price">
            <span>{moneyFormatter(data.price)} night</span>
          </p>
        </StyledBookingPanel>
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          {children}
        </Modal>
      </>
    );
  }

  return children;
};

export default BookingDetailsModalOnPhone;
