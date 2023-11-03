import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';

import { useGetAmenity } from './useGetAmenity';
import { CreateHotelFormData } from '../../commonDataTypes';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import { useState } from 'react';
import Loader from '../../ui/loaders/Loader';

const StyledSelectAmenity = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Container = styled.div`
  box-sizing: border-box;
  height: min(20rem, 90dvh);
  width: min(35rem, 90vw);
  overflow: auto;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  gap: 1.5rem;
  font-size: 4rem;
  /* border: 1px solid red; */

  .button-ok {
    margin: auto;
    font-size: 0.8rem;
  }
`;

const OptionsLayout = styled.div`
  margin: auto;
  font-size: 1rem;
  width: min-content;
  /* padding: 1rem; */
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(3, max-content);
  /* justify-content: safe center; */
  /* border: 1px solid red; */
  gap: 1rem 3rem;
`;

const CheckBox = styled.div`
  box-sizing: border-box;
  /* width: min-content; */
  /* border: 1px solid red; */
  display: flex;
  gap: 1rem;
  align-items: center;
  white-space: nowrap;
  label {
    /* display: flex;
    align-items: center; */
  }

  input[type='checkbox'] {
    height: 1.5rem;
    width: 1.5rem;
    /* flex: none; */
  }
`;

const SelectAmenity: React.FC = () => {
  const { isLoading, amenities } = useGetAmenity();
  const { getValues, register } = useFormContext<CreateHotelFormData>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const selectedAmenities = getValues()?.amenities
    ? getValues().amenities?.join(', ')
    : [];

  const options = amenities?.map((val) => {
    return {
      value: val.name,
      label: val.name,
    };
  });

  return (
    <StyledSelectAmenity>
      <Button type="button" onClick={() => setIsModalOpen(true)}>
        Select Amenities
      </Button>
      <span className="values-selected">{selectedAmenities}</span>
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <Container>
          {isLoading ? (
            <Loader color="black" />
          ) : (
            <>
              <OptionsLayout>
                {options?.map((option) => (
                  <CheckBox key={option.label}>
                    <input
                      type="checkbox"
                      id={option.label}
                      value={option.value}
                      {...register('amenities')}
                    />
                    <label htmlFor={option.label}>{option.label}</label>
                  </CheckBox>
                ))}
              </OptionsLayout>
              <Button
                className="button-ok"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                OK
              </Button>
            </>
          )}
        </Container>
      </Modal>
    </StyledSelectAmenity>
  );
};

export default SelectAmenity;
