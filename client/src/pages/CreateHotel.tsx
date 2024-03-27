import styled, { css } from 'styled-components';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import Label from '../components/Label';
import Input from '../components/inputs/Input';
import { latlngVerify } from '../utils/location/latlngVerify';
import ErrorMessage from '../components/ErrorMessage';
import Asterisk from '../components/Asterisk';
import InputCounter from '../components/inputs/InputCounter';
import FileInput from '../components/inputs/FileInput';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/buttons/Button';
import { ChangeEventHandler, useState } from 'react';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import Spinner from '../components/loaders/Spinner';
import { preventEnterKeyFormSubmission } from '../utils/preventEnterKeyFormSubmission';
import { CreateHomeFormData } from '../types/CreateHomeFormData';
import {
  createHotel,
  uploadImages,
} from '../features/homes/services/createHome';
import { Exception } from '../data/Exception';
import { AMENITIES_OPTIONS } from '../data/amenities';
import { screenWidths } from '../providers/ScreenProvider';

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
    max-width: 800px;
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
  /* padding: 1vh 1vw; */
  background-color: white;
  /* max-height: 100dvh; */
  /* width: 50dvw; */
  /* overflow: hidden; */
  height: min-content;
  width: min-content;
  display: flex;
  flex-direction: column;
  /* box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; */

  /* @media (min-height: 475px) {
    max-height: 80dvh;
  } */

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
    /* max-height: 100dvh; */
    /* max-height: 80dvh; */
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
        /* grid-template-columns: min-content min-content; */
        grid-template-columns: repeat(2, minmax(min-content, 1fr));
        gap: 20px;

        .row {
          display: flex;
          align-items: center;
          gap: 1rem;
          label {
            white-space: nowrap;
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
  width: 20rem;
  padding: 1rem;
  border-radius: 1rem;
  background-color: white;
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h3 {
    font-size: 1.5rem;
  }

  p {
    font-size: 1.1rem;
    white-space: pre;
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
  const methods = useForm<CreateHomeFormData>({
    defaultValues: { amenities: [] },
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

  const onSubmit: SubmitHandler<CreateHomeFormData> = async (data) => {
    setSubmitting(true);
    try {
      setMessage('Uploading Images....');
      // const images = await compressImages([
      //   ...data.main_image,
      //   ...data.extra_images,
      // ]);
      const images = [...data.main_image, ...data.extra_images];
      const names = await uploadImages(images);
      setMessage('Uploading your home info....');
      await createHotel(data, names);
      toast.success('Your home was registered successfully');
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
                {...register('name', {
                  required: 'Home name is required',
                  minLength: {
                    value: 2,
                    message: 'Home name must be atleast 2 characters long',
                  },
                })}
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
              <Input
                type="text"
                id="location"
                // defaultValue="15.547406880851836, 73.80432026106719"
                {...register('location', {
                  required: 'Location is required',
                  validate: (val) => {
                    return latlngVerify(val) ? true : 'Invalid coordinates';
                  },
                })}
              />
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
                {...register('address', {
                  required: 'Address is required',
                })}
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
                  required: 'Price is required',
                  minLength: 1,
                  onChange: (event) => {
                    let inputValue: string = event.target.value;
                    inputValue = inputValue.replace(/[^0-9.]/g, '');
                    if (inputValue.length === 0) {
                      setValue('price', '');
                      return;
                    }
                    const dotIndex = inputValue.indexOf('.');
                    if (dotIndex !== -1) {
                      const decimalPart = inputValue.substring(dotIndex + 1);
                      inputValue =
                        inputValue.substring(0, dotIndex + 1) +
                        decimalPart.substring(0, 2); // Limit to two decimal places
                    }
                    setValue('price', inputValue);
                  },
                  onBlur: (event) => {
                    let inputValue: string = event.target.value;
                    inputValue = inputValue.replace(/[^0-9.]/g, '');
                    if (inputValue.length === 0) return;
                    setValue('price', parseFloat(inputValue).toString());
                  },
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
                  required: 'Price per guest is required',
                  onChange: (event) => {
                    let inputValue: string = event.target.value;
                    inputValue = inputValue.replace(/[^0-9.]/g, '');
                    if (inputValue.length === 0) {
                      setValue('price_per_guest', '');
                      return;
                    }
                    const dotIndex = inputValue.indexOf('.');
                    if (dotIndex !== -1) {
                      const decimalPart = inputValue.substring(dotIndex + 1);
                      inputValue =
                        inputValue.substring(0, dotIndex + 1) +
                        decimalPart.substring(0, 2); // Limit to two decimal places
                    }
                    setValue('price_per_guest', inputValue);
                  },
                  onBlur: (event) => {
                    let inputValue: string = event.target.value;
                    inputValue = inputValue.replace(/[^0-9.]/g, '');
                    setValue(
                      'price_per_guest',
                      parseFloat(inputValue).toString()
                    );
                  },
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
                defaultValue={1}
                render={({ field }) => (
                  <InputCounter
                    name="number_of_cabins"
                    min={1}
                    max={20}
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
                defaultValue={1}
                render={({ field }) => (
                  <InputCounter
                    name="cabin_capacity"
                    min={1}
                    max={50}
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
              <input
                type="text"
                id="amenities"
                readOnly
                style={{ display: 'none' }}
                value={selectedAmenities.join(', ')}
              />
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
              rules={{
                validate: (val) => {
                  if (!val || val.length < 1) {
                    return 'Please select a main image';
                  }
                  return true;
                },
              }}
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
              rules={{
                validate: (val) => {
                  if (!val || val.length < 4) {
                    return 'Please select atleast 4 extra images';
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <FileInput
                  value={field.value}
                  onChange={(files) => {
                    field.onChange(files);
                  }}
                >
                  <GridCell>
                    <FileInput.Input maxFiles={10} name="extra_images" />
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
          </GridLayout>
          <Button className="submit-button">Submit</Button>
          <Modal
            isModalOpen={submitting}
            setIsModalOpen={setSubmitting}
            closable={false}
          >
            <StatusBox>
              <h3>Submitting.....</h3>
              <p>{message}</p>
              <Spinner color="black" />
            </StatusBox>
          </Modal>
          {/* <HotelSubmission /> */}
        </form>
      </FormProvider>
    </StyledCreateHotel>
  );
};

export default CreateHotel;
