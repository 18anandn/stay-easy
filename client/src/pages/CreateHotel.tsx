import styled, { css } from 'styled-components';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import Label from '../components/Label';
import Input from '../components/inputs/Input';
import ErrorMessage from '../components/ErrorMessage';
import Asterisk from '../components/Asterisk';
import InputCounter from '../components/inputs/InputCounter';
import FileInput from '../components/inputs/FileInput';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/buttons/Button';
import { ChangeEventHandler, useEffect, useState } from 'react';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import Spinner from '../components/loaders/Spinner';
import { preventEnterKeyFormSubmission } from '../utils/preventEnterKeyFormSubmission';
import {
  CreateHomeFormData,
  CreateHomeFormDataSchema,
  MAX_EXTRA_IMAGES,
} from '../types/CreateHomeFormData';
import { AMENITIES_OPTIONS } from '../features/homes/data/amenities';
import { screenWidths } from '../providers/ScreenProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { getIndicesOfChar } from '../utils/getIndicesOfChar';
import {
  createHome,
  uploadImages,
  verifyCreateHomeData,
} from '../features/homes/services/createHome';
import { Exception } from '../data/Exception';
import { useQueryClient } from '@tanstack/react-query';
import { UserRole } from '../features/auth/enums/UserRole.enum';
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';

const StyledCreateHotel = styled.div`
  padding: 50px 5%;
  font-size: 0.8rem;

  & > * {
    margin-left: auto;
    margin-right: auto;
  }

  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }

  form {
    /* width: 60%; */
    max-width: 50rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .map-link {
    font-size: 1rem;
    text-decoration: underline;
    color: black;
    white-space: nowrap;
  }

  .amenities-display {
    /* margin: auto; */
    resize: none;
    height: min-content;
    font-size: 1rem;
    line-height: 1.5;
    /* min-height: 0; */
    width: 100%;
    overflow: hidden;
    border: none;
    border: 1px solid black;
    outline: none;
  }

  .description-field {
    resize: none;
    font-size: 1rem;
    min-height: 1rem;
    max-height: 8rem;
    width: 100%;
    padding: 0.5rem;
    /* padding: 0; */
    margin: 0;
    /* box-sizing: border-box; */
    /* overflow: hidden; */
  }

  .submit-button {
    margin: auto;
  }
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
`;

type GridCellProps = {
  $fileCell?: boolean;
  $noteCell?: boolean;
  $spanRow?: boolean;
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
    if (props.$spanRow) {
      return css`
        min-height: 0;
        grid-column: 1 / -1;
        p {
          margin: auto;
          padding: 1rem;
          font-size: 1rem;
        }
      `;
    }
  }}
`;

const StyledAmenities = styled.div`
  background-color: white;
  max-width: 90svw;
  max-height: 90svh;
  display: flex;
  flex-direction: column;

  .header {
    flex: none;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgb(0, 0, 0, 0.5);
    position: relative;

    h2 {
      text-align: center;
    }
  }

  .footer {
    flex: none;
    padding: 0.5rem;
    display: flex;
    gap: 2rem;
    border-top: 1px solid rgb(0, 0, 0, 0.5);

    & > *:first-child {
      margin-left: auto;
    }

    & > *:last-child {
      margin-right: auto;
    }
  }

  .box {
    flex: 0 1 auto;
    padding: 20px 50px;
    box-sizing: border-box;
    overflow-y: auto;

    fieldset {
      border: 0;

      legend {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      .list {
        display: grid;
        grid-template-columns: repeat(2, minmax(min-content, 1fr));
        gap: 20px;

        .row {
          display: flex;
          align-items: center;
          gap: 1rem;

          label {
            font-size: 1rem;
          }

          input[type='checkbox'] {
            height: 1.2rem;
            aspect-ratio: 1;
            /* outline: 3px solid black; */
          }
        }
      }
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    .box {
      padding: 20px;
    }
  }
`;

const StatusBox = styled.div`
  padding: 30px;
  border-radius: 1rem;
  background-color: white;
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h3 {
    font-size: 1.5rem;
    text-align: center;
  }

  p {
    font-size: 1.1rem;
  }

  .custom-spinner {
    font-size: 0.04rem;
    /* height: 3.5rem; */
  }
`;

const handleHeightChange: ChangeEventHandler<HTMLInputElement> = (event) => {
  const inputElem = event.target;
  inputElem.style.height = 'auto';
  const height = inputElem.scrollHeight;
  const padding = window
    .getComputedStyle(inputElem, null)
    .getPropertyValue('padding-top');
  inputElem.style.height = `calc(${height}px - ${padding}*2)`;
};

const CreateHotel: React.FC = () => {
  const queryClient = useQueryClient();
  const methods = useForm<CreateHomeFormData>({
    defaultValues: { amenities: [] },
    resolver: zodResolver(CreateHomeFormDataSchema),
  });
  const navigate = useNavigate();
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const {
    register,
    formState: { errors },
    setValue,
    control,
    handleSubmit,
    watch,
  } = methods;
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser && currentUser.email === 'johndoe@test.com') {
      toast.error('Cannot register home with test user', {
        duration: Infinity,
        id: 'create-home-test-user',
      });
    }
  }, [currentUser]);

  useEffect(() => {
    return () => toast.dismiss('create-home-test-user');
  }, []);

  const onSubmit: SubmitHandler<CreateHomeFormData> = async (data) => {
    setSubmitting(true);
    try {
      // const images = await compressImages([
      //   ...data.main_image,
      //   ...data.extra_images,
      // ]);
      setMessage('Verifying data....');
      const uploadUrlData = await verifyCreateHomeData(data);
      setMessage('Uploading images....');
      const images = [...data.main_image, ...data.extra_images];
      const names = await uploadImages(images, uploadUrlData);
      setMessage('Uploading your home info....');
      await createHome(data, names);
      toast.success('Your home details was sent to the verification team', {
        duration: 5500,
      });
      queryClient.setQueryData(['current-user'], (prev) => {
        if (!prev) return prev;
        return { ...prev, role: UserRole.OWNER };
      });
      navigate('/', { replace: true });
    } catch (error) {
      let errorMessage = 'There was some internal server error';
      if (error instanceof Exception) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
      setMessage('');
    }
  };

  const selectedAmenities = watch('amenities');

  const priceOnChange = (field: 'price' | 'price_per_guest') => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue: string = event.target.value;
      inputValue = inputValue.replace(/[^0-9.]/g, '');
      if (inputValue.length === 0) {
        setValue(field, '');
        return;
      }
      const dotIndices = getIndicesOfChar('.', inputValue);
      if (dotIndices.length !== 0) {
        if (dotIndices.length > 1) {
          inputValue = inputValue.slice(0, dotIndices[1]);
        }
        const dotIndex = dotIndices[0];
        const decimalPart = inputValue.substring(dotIndex + 1);
        inputValue =
          inputValue.substring(0, dotIndex + 1) + decimalPart.substring(0, 2); // Limit to two decimal places
      }
      setValue(field, inputValue, { shouldValidate: true });
    };
  };

  const priceOnBlur = (field: 'price' | 'price_per_guest') => {
    return (event: React.FocusEvent<HTMLInputElement, Element>) => {
      let inputValue: string = event.target.value;
      inputValue = inputValue.replace(/[^0-9.]/g, '');
      if (inputValue.length === 0) return;
      setValue(field, parseFloat(inputValue).toString(), {
        shouldValidate: true,
      });
    };
  };

  return (
    <StyledCreateHotel>
      <h1>Register your home on StayEasy!</h1>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={preventEnterKeyFormSubmission}
        >
          <GridLayout>
            <GridCell>
              <Label htmlFor="name">
                {errors.name?.message ? (
                  <ErrorMessage>{errors.name.message}</ErrorMessage>
                ) : (
                  <span>
                    Home name
                    <Asterisk />
                  </span>
                )}
              </Label>
            </GridCell>
            <GridCell>
              <Input
                type="text"
                id="name"
                autoComplete="off"
                // defaultValue="Test"
                {...register('name')}
              />
            </GridCell>
            <GridCell $noteCell={true}>
              <p>
                Note: Right click at a location on the{' '}
                <Link
                  to="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  map
                </Link>{' '}
                and select the first option.
              </p>
            </GridCell>
            <GridCell>
              <Label htmlFor="location">
                {errors.location?.message ? (
                  <ErrorMessage>{errors.location.message}</ErrorMessage>
                ) : (
                  <span>
                    Location
                    <Asterisk />
                  </span>
                )}
              </Label>
            </GridCell>
            <GridCell>
              <Input type="text" id="location" {...register('location')} />
            </GridCell>
            <GridCell>
              <Label htmlFor="address">
                {errors.address?.message ? (
                  <ErrorMessage>{errors.address.message}</ErrorMessage>
                ) : (
                  <span>
                    Complete Address
                    <Asterisk />
                  </span>
                )}
              </Label>
            </GridCell>
            <GridCell>
              <Input
                type="text"
                id="address"
                // defaultValue='Goa'
                {...register('address')}
              />
            </GridCell>
            <GridCell>
              <Label htmlFor="price">
                {errors.price?.message ? (
                  <ErrorMessage>{errors.price.message}</ErrorMessage>
                ) : (
                  <span>
                    Price (&#8377;)
                    <Asterisk />
                  </span>
                )}
              </Label>
            </GridCell>
            <GridCell>
              <Input
                type="text"
                id="price"
                defaultValue={''}
                {...register('price', {
                  onChange: priceOnChange('price'),
                  onBlur: priceOnBlur('price'),
                })}
              />
            </GridCell>
            <GridCell>
              <Label htmlFor="price_per_guest">
                {errors.price_per_guest?.message ? (
                  <ErrorMessage>{errors.price_per_guest.message}</ErrorMessage>
                ) : (
                  <span>
                    Price per Guest (&#8377;)
                    <Asterisk />
                  </span>
                )}
              </Label>
            </GridCell>
            <GridCell>
              <Input
                type="text"
                id="price_per_guest"
                defaultValue={''}
                {...register('price_per_guest', {
                  onChange: priceOnChange('price_per_guest'),
                  onBlur: priceOnBlur('price_per_guest'),
                })}
              />
            </GridCell>
            <GridCell $noteCell={true}>
              <p>
                Note: 5% of the total price will be charged additionaly by
                StayEasy.
              </p>
            </GridCell>
            <GridCell>
              <Label htmlFor="number_of_cabins">
                Number of cabins
                <Asterisk />
              </Label>
            </GridCell>
            <GridCell>
              <Controller
                control={control}
                name="number_of_cabins"
                defaultValue={
                  CreateHomeFormDataSchema.shape.number_of_cabins.minValue ?? 1
                }
                render={({ field }) => (
                  <InputCounter
                    name="number_of_cabins"
                    min={
                      CreateHomeFormDataSchema.shape.number_of_cabins
                        .minValue ?? 1
                    }
                    max={
                      CreateHomeFormDataSchema.shape.number_of_cabins
                        .maxValue ?? 50
                    }
                    value={field.value}
                    onValChange={(val) => {
                      field.onChange(val);
                    }}
                  />
                )}
              />
            </GridCell>
            <GridCell>
              <Label htmlFor="cabin_capacity">Cabin Capacity</Label>
            </GridCell>
            <GridCell>
              <Controller
                control={control}
                name="cabin_capacity"
                defaultValue={
                  CreateHomeFormDataSchema.shape.cabin_capacity.minValue ?? 1
                }
                render={({ field }) => (
                  <InputCounter
                    name="cabin_capacity"
                    min={
                      CreateHomeFormDataSchema.shape.cabin_capacity.minValue ??
                      1
                    }
                    max={
                      CreateHomeFormDataSchema.shape.cabin_capacity.maxValue ??
                      50
                    }
                    value={field.value}
                    onValChange={(val) => {
                      field.onChange(val);
                    }}
                  />
                )}
              />
            </GridCell>
            <GridCell>
              <Label htmlFor="amenities">Amenities</Label>
            </GridCell>
            <GridCell>
              <Button type="button" onClick={() => setIsAmenitiesOpen(true)}>
                Select amenities
              </Button>
              {selectedAmenities.length > 0 && (
                <p>{selectedAmenities.join(', ')}</p>
              )}
              <Modal
                isModalOpen={isAmenitiesOpen}
                setIsModalOpen={setIsAmenitiesOpen}
              >
                <StyledAmenities>
                  <div className="header">
                    <h2>Amenities</h2>
                  </div>
                  <div className="box">
                    <fieldset>
                      <div className="list">
                        {AMENITIES_OPTIONS.map((val) => (
                          <div className="row" key={val.value}>
                            <input
                              type="checkbox"
                              value={val.label}
                              id={val.value}
                              {...register('amenities')}
                            />
                            <label htmlFor={val.value}>{val.label}</label>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                  <div className="footer">
                    <Button
                      type="button"
                      onClick={() =>
                        setValue('amenities', [], { shouldDirty: true })
                      }
                      disabled={selectedAmenities.length === 0}
                    >
                      Clear all
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setIsAmenitiesOpen(false)}
                    >
                      OK
                    </Button>
                  </div>
                </StyledAmenities>
              </Modal>
            </GridCell>
            <GridCell $noteCell={true}>
              <p>
                Note: Max file size allowed for an image is 200KB. Visit{' '}
                <Link
                  to="https://image.pi7.org/download-compress-image/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="image-compress-link"
                >
                  this link
                </Link>{' '}
                to compress images.
              </p>
            </GridCell>
            <GridCell>
              <Label htmlFor="main_image">
                {errors.main_image?.message ? (
                  <ErrorMessage>{errors.main_image.message}</ErrorMessage>
                ) : (
                  <span>
                    Main Image
                    <Asterisk />
                  </span>
                )}
              </Label>
            </GridCell>
            <Controller
              control={control}
              name="main_image"
              defaultValue={[]}
              render={({ field }) => (
                <FileInput
                  value={field.value}
                  onChange={(files) => {
                    field.onChange(files);
                  }}
                >
                  <GridCell>
                    <FileInput.Input maxFiles={1} name="main_image" />
                  </GridCell>
                  <GridCell $fileCell={true}>
                    <FileInput.Display />
                  </GridCell>
                </FileInput>
              )}
            />
            <GridCell>
              <Label htmlFor="extra_images">
                {errors.extra_images?.message ? (
                  <ErrorMessage>{errors.extra_images.message}</ErrorMessage>
                ) : (
                  <span>
                    Extra Images
                    <Asterisk />
                  </span>
                )}
              </Label>
            </GridCell>
            <Controller
              control={control}
              name="extra_images"
              defaultValue={[]}
              render={({ field }) => (
                <FileInput
                  value={field.value}
                  onChange={(files) => {
                    field.onChange(files);
                  }}
                >
                  <GridCell>
                    <FileInput.Input
                      maxFiles={MAX_EXTRA_IMAGES}
                      name="extra_images"
                    />
                  </GridCell>
                  <GridCell $fileCell={true}>
                    <FileInput.Display />
                  </GridCell>
                </FileInput>
              )}
            />
            <GridCell>
              <Label htmlFor="description">
                {errors.description?.message ? (
                  <ErrorMessage>{errors.description.message}</ErrorMessage>
                ) : (
                  <span>
                    Description
                    <Asterisk />
                  </span>
                )}
              </Label>
            </GridCell>
            <GridCell>
              <textarea
                id="description"
                className="description-field"
                {...register('description', {
                  required: 'Description in required',
                  validate: (val) => {
                    if (val.length < 10 || val.length > 1500) {
                      return 'Description should be 10-1500 characters long.';
                    }
                    return true;
                  },
                  onChange: (event) => {
                    const inputValue: string = event.target.value;
                    setValue(
                      'description',
                      inputValue.replace(/[\r\n\v]+/g, '').replace(/\s+/g, ' ')
                    );
                    handleHeightChange(event);
                  },
                  onBlur: (event) => {
                    const inputValue: string = event.target.value;
                    setValue('description', inputValue.trim());
                  },
                })}
              />
            </GridCell>
            <GridCell $noteCell={true}>
              <p>Note: It may take upto 2 business days to verify your home.</p>
            </GridCell>
          </GridLayout>
          <Button className="submit-button">Submit</Button>
          <Modal isModalOpen={submitting} closable={false}>
            <StatusBox>
              <h3>Submitting.....</h3>
              <p>{message}</p>
              <Spinner color="black" />
            </StatusBox>
          </Modal>
        </form>
      </FormProvider>
    </StyledCreateHotel>
  );
};

export default CreateHotel;
