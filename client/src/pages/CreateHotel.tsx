import styled, { css } from 'styled-components';
import { FormProvider, useForm } from 'react-hook-form';
import { useRef } from 'react';

import Heading from '../ui/Heading';
import Label from '../ui/Label';
import Input from '../ui/inputs/Input';
import { CreateHotelFormData } from '../commonDataTypes';
import { latlngVerify } from '../utils/latlngVerify';
import ErrorMessage from '../ui/ErrorMessage';
import Asterisk from '../ui/Asterisk';
import InputCounter from '../ui/inputs/InputCounter';
import SelectAmenity from '../features/amenity/SelectAmenity';
import SelectFromMap from '../features/map/SelectFromMap';
import FileInput from '../ui/inputs/FileInput';
import HotelSubmission from '../features/hotels/HotelSubmission';

const StyledCreateHotel = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.7rem;
  font-size: 0.8rem;

  & > * {
    margin-left: auto;
    margin-right: auto;
  }

  /* border: 5px solid red; */

  form {
    width: 60%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  label {
    font-size: 1rem;
  }

  .styled-input {
    box-shadow:
      rgba(17, 17, 26, 0.05) 0px 1px 0px,
      rgba(17, 17, 26, 0.1) 0px 0px 8px;
  }
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
`;

type GridCellProps = {
  $fileCell?: boolean;
  $noteCell?: boolean;
};

const GridCell = styled.div.attrs({ className: 'grid-cell' })<GridCellProps>`
  box-sizing: border-box;
  min-height: 5rem;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  border-top: 2px solid rgba(204, 204, 204, 0.5);
  & > * {
    margin-top: auto;
    margin-bottom: auto;
  }

  &:nth-of-type(1),
  &:nth-of-type(2) {
    border: none;
  }

  ${(props) => {
    if (props.$fileCell) {
      return css`
        border: none;
        min-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        grid-column: 2 / 2;
      `;
    }
    if (props.$noteCell) {
      return css`
        min-height: 0;
        grid-column: 1 / -1;
        p {
          margin: auto;
          padding: 1rem;
          font-size: 1rem;
          background-color: #fffaa0;
          border-radius: 10px;
        }
      `;
    }
  }}
`;

const CreateHotel: React.FC = () => {
  const methods = useForm<CreateHotelFormData>();
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
  } = methods;

  register('cabin_amount');
  register('cabin_capacity');

  register('main_image', {
    validate: (val) => {
      if (!val || val.length === 0) {
        return 'Please select a main image';
      }
      return true;
    },
  });

  register('extra_images', {
    validate: (val) => {
      if (!val || val.length < 4) {
        return 'Please select atleast 4 extra images';
      }
      return true;
    },
  });

  const mainImageRef = useRef<HTMLInputElement>(
    document.createElement('input'),
  );
  const extraImagesRef = useRef<HTMLInputElement>(
    document.createElement('input'),
  );

  // const props = register('cabin_amount')

  return (
    <StyledCreateHotel>
      <Heading as="h2">Register your home on StayEasy!</Heading>
      <FormProvider {...methods}>
        <form>
          <GridLayout>
            <GridCell>
              <Label>
                {errors.name?.message ? (
                  <ErrorMessage>{errors.name.message}</ErrorMessage>
                ) : (
                  <span>
                    Home name <Asterisk />
                  </span>
                )}
              </Label>
            </GridCell>
            <GridCell>
              <Input
                type="text"
                id="name"
                defaultValue="Test"
                {...register('name', {
                  required: 'Home name is required',
                  minLength: {
                    value: 2,
                    message: 'Home name must be atleast 2 characters long',
                  },
                })}
              />
            </GridCell>
            <GridCell>
              <Label>
                {errors.location?.message ? (
                  <ErrorMessage>{errors.location.message}</ErrorMessage>
                ) : (
                  <span>
                    Location <Asterisk />
                  </span>
                )}
              </Label>
            </GridCell>
            <GridCell>
              <Input
                type="text"
                id="location"
                defaultValue="15.547406880851836, 73.80432026106719"
                {...register('location', {
                  required: 'Location is required',
                  validate: latlngVerify,
                })}
              />
              <SelectFromMap />
            </GridCell>
            <GridCell>
              <Label>Complete Address</Label>
            </GridCell>
            <GridCell>
              <Input
                type="text"
                id="location_name"
                defaultValue={'Goa'}
                {...register('location_name')}
              />
            </GridCell>
            <GridCell>
              <Label>
                Price (&#8377;) <Asterisk />
              </Label>
            </GridCell>
            <GridCell>
              <Input
                type="number"
                id="price"
                defaultValue={1}
                {...register('price', {
                  onChange: () => {
                    const val = getValues('price');
                    const num = parseFloat(val);
                    if (val.length === 0 || isNaN(num)) {
                      return;
                    }
                    const arr = val.split('.');
                    if (arr.length === 2) {
                      setValue('price', `${arr[0]}.${arr[1].slice(0, 2)}`);
                    }
                  },
                })}
              />
            </GridCell>
            <GridCell>
              <Label>
                Price per Guest (&#8377;) <Asterisk />
              </Label>
            </GridCell>
            <GridCell>
              <Input
                type="number"
                id="price_per_guest"
                defaultValue={1}
                {...register('price_per_guest', {
                  onChange: () => {
                    const val = getValues('price_per_guest');
                    const num = parseFloat(val);
                    if (val.length === 0 || isNaN(num)) {
                      return;
                    }
                    const arr = val.split('.');
                    if (arr.length === 2) {
                      setValue(
                        'price_per_guest',
                        `${arr[0]}.${arr[1].slice(0, 2)}`,
                      );
                    }
                  },
                })}
              />
            </GridCell>
            <GridCell $noteCell={true}>
              <p>
                Note: 5% of the total price will be charged additionaly by StayEasy.
              </p>
            </GridCell>
            <GridCell>
              <Label>
                Number of cabins <Asterisk />
              </Label>
            </GridCell>
            <GridCell>
              <InputCounter
                name="cabin_amount"
                min={1}
                max={20}
                onValChange={(val) => {
                  setValue('cabin_amount', val);
                }}
              />
            </GridCell>
            <GridCell>
              <Label>Cabin Capacity</Label>
            </GridCell>
            <GridCell>
              <InputCounter
                name="cabin_capacity"
                min={1}
                max={20}
                onValChange={(val) => {
                  setValue('cabin_capacity', val);
                }}
              />
            </GridCell>
            <GridCell>
              <Label>Amenities</Label>
            </GridCell>
            <GridCell>
              <SelectAmenity />
            </GridCell>
            <GridCell>
              <Label>
                {errors.main_image?.message ? (
                  <ErrorMessage>{errors.main_image.message}</ErrorMessage>
                ) : (
                  <span>
                    Main Image <Asterisk />
                  </span>
                )}
              </Label>
            </GridCell>
            <FileInput
              fileChangeHandler={(files) => {
                setValue('main_image', files, { shouldValidate: true });
              }}
            >
              <GridCell>
                <FileInput.Input
                  maxFiles={1}
                  name="main_image"
                  ref={mainImageRef}
                />
              </GridCell>
              <GridCell $fileCell={true}>
                <FileInput.Display />
              </GridCell>
            </FileInput>
            <GridCell>
              <Label>
                {errors.extra_images?.message ? (
                  <ErrorMessage>{errors.extra_images.message}</ErrorMessage>
                ) : (
                  <span>
                    Extra Images <Asterisk />
                  </span>
                )}
              </Label>
            </GridCell>
            <FileInput
              fileChangeHandler={(files) => {
                setValue('extra_images', files, { shouldValidate: true });
              }}
            >
              <GridCell>
                <FileInput.Input
                  multiple
                  maxFiles={10}
                  name="extra_images"
                  ref={extraImagesRef}
                />
              </GridCell>
              <GridCell $fileCell={true}>
                <FileInput.Display />
              </GridCell>
            </FileInput>
          </GridLayout>
          <HotelSubmission />
        </form>
      </FormProvider>
    </StyledCreateHotel>
  );
};

export default CreateHotel;
