import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { atom, useAtom } from 'jotai';

import Modal from './Modal';
import { ScreenType, useScreen } from '../providers/ScreenProvider';
import { getFindHomeParams } from '../features/homes/services/searchHome';
import { dateRangeFormatter } from '../utils/dates/date-range-formatter';

type Props = {
  children: React.ReactNode;
};

const StyledButton = styled.button`
  /* background-color: transparent; */
  border: none;
  outline: none;
  display: flex;
  flex-direction: column;
  width: 20ch;
  padding: 5px 10px;
  border-radius: 10px;

  span {
    display: block;
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;

    &.dates {
      opacity: 0.5;
    }
  }
`;

export const formModalAtom = atom(false);

const FormWrapper: React.FC<Props> = ({ children }) => {
  const screen = useScreen();
  const [isOpenModal, setIsOpenModal] = useAtom(formModalAtom);
  const [searchParams] = useSearchParams();
  const currentParams = getFindHomeParams(searchParams);

  useEffect(() => {
    if (screen !== ScreenType.PHONE) {
      setIsOpenModal(false);
    }
  }, [screen, setIsOpenModal]);

  if (screen === ScreenType.PHONE) {
    return (
      <>
        <StyledButton className="" onClick={() => setIsOpenModal(true)}>
          <span className="address">
            {currentParams.address ? currentParams.address : 'Enter address'}
          </span>
          <span className="dates">
            {currentParams.dates
              ? dateRangeFormatter(
                  new Date(currentParams.dates.split('_')[0]),
                  new Date(currentParams.dates.split('_')[1])
                )
              : 'Add dates'}
          </span>
        </StyledButton>
        <Modal isModalOpen={isOpenModal} setIsModalOpen={setIsOpenModal}>
          {children}
        </Modal>
      </>
    );
  }

  return children;
};

export default FormWrapper;
