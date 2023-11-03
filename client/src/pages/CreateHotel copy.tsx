import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useRef } from 'react';
import toast from 'react-hot-toast';

import Heading from '../ui/Heading';
import Label from '../ui/Label';
import Input from '../ui/inputs/Input';
import { CreateHotelFormData } from '../commonDataTypes';
import { latlngVerify } from '../utils/latlngVerify';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import Asterisk from '../ui/Asterisk';
import InputCounter from '../ui/inputs/InputCounter';
import SelectAmenity from '../features/amenity/SelectAmenity';
import SelectFromMap from '../features/map/SelectFromMap';
import FileInput from '../ui/inputs/FileInput';
import { useCreateHotel } from '../features/hotels/useCreateHotel';
import LoaderOverlay from '../ui/loaders/LoaderOverlay';

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

    .custom-button {
      margin: auto;
    }
  }

  label {
    font-size: 1rem;
  }

  .styled-input {
    width: 100%;
    font-size: 1rem;
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
  }}
`;

const CreateHotel: React.FC = () => {
  const methods = useForm<CreateHotelFormData>();
  const {
    register,
    handleSubmit,
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

  const { createHotel, isLoading } = useCreateHotel();
  const navigate = useNavigate();

  const cabinAmountRef = useRef<HTMLInputElement>(
    document.createElement('input'),
  );
  const cabinCapacityRef = useRef<HTMLInputElement>(
    document.createElement('input'),
  );
  const mainImageRef = useRef<HTMLInputElement>(
    document.createElement('input'),
  );
  const extraImagesRef = useRef<HTMLInputElement>(
    document.createElement('input'),
  );

  const onSubmit: SubmitHandler<CreateHotelFormData> = (data) => {
    data.cabin_amount = parseInt(cabinAmountRef.current.value);
    data.cabin_capacity = parseInt(cabinCapacityRef.current.value);
    // if (
    //   !mainImageRef.current.files ||
    //   mainImageRef.current.files.length === 0
    // ) {
    //   toast.error('Need atleast 1 main image', {
    //     id: 'image-selection_error',
    //   });
    //   return;
    // }
    // if (
    //   !extraImagesRef.current.files ||
    //   extraImagesRef.current.files.length < 4
    // ) {
    //   toast.error('Need atleast 4 extra images', {
    //     id: 'image-selection_error',
    //   });
    //   return;
    // }
    // data.main_image = mainImageRef.current.files;
    // data.extra_images = extraImagesRef.current.files;
    createHotel(data, {
      onSuccess: () => {
        toast.success('Hotel created successfully');
        navigate('/', { replace: true });
      },
      onError: (err) => {
        toast.error(err.message, { id: 'hotel creation error' });
      },
    });
  };

  // const props = register('cabin_amount')

  return (
    <StyledCreateHotel>
      {isLoading && <LoaderOverlay />}
      <Heading as="h2">Register your home on StayEasy!</Heading>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              <Label>Price</Label>
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
                Number of cabins <Asterisk />
              </Label>
            </GridCell>
            <GridCell>
              <InputCounter
                name="cabin_amount"
                ref={cabinAmountRef}
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
                ref={cabinCapacityRef}
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
          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>
    </StyledCreateHotel>
  );
};

export default CreateHotel;
