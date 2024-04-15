import styled from 'styled-components';
import { useGetHomeData } from '../../features/admin/hooks/useGetHomeData';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/loaders/Spinner';
import { useUpdateHomeData } from '../../features/admin/hooks/useUpdateHomeData';
import { moneyFormatter } from '../../utils/money-formatter';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  UpdatedHomeData,
  VERIFICATION_OPTIONS,
  Verification,
} from '../../features/admin/services/updateHomeData';
import Button from '../../components/buttons/Button';
import Label from '../../components/Label';
import Input from '../../components/inputs/Input';
import Asterisk from '../../components/Asterisk';
import ErrorMessage from '../../components/ErrorMessage';
import { preventEnterKeyFormSubmission } from '../../utils/preventEnterKeyFormSubmission';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const StyledHomeVerification = styled.div`
  padding: 2rem;

  form {
    width: 800px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &.hide-form {
      display: none;
    }

    .grid-layout {
      margin: auto;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1.5fr;
    }

    .styled-input {
      width: 100%;
      font-size: 1rem;
      text-overflow: ellipsis;
      box-shadow:
        rgba(17, 17, 26, 0.05) 0px 1px 0px,
        rgba(17, 17, 26, 0.1) 0px 0px 8px;
    }

    .main-image,
    .extra-images {
      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }

    .main-image {
      height: 150px;
      aspect-ratio: 1;
    }

    .extra-images {
      ul {
        li {
          height: 150px;
          aspect-ratio: 1;
        }

        list-style-type: none;
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
      }
    }

    textarea {
      resize: vertical;
      width: 500px;
      min-height: 100px;
      max-height: 500px;
    }

    .custom-button {
      margin: auto;
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

const GridCell = styled.div`
  padding: 1rem 0;
  border-top: 1px solid black;
  display: flex;

  & > * {
    margin-top: auto;
    margin-bottom: auto;
  }

  &:nth-of-type(1),
  &:nth-of-type(2) {
    border: none;
  }
`;

const HomeVerification: React.FC = () => {
  const { homeId } = useParams();
  const { data: homeData, isLoading: isFetchingData } = useGetHomeData(
    homeId ?? '',
  );
  const { mutate: updateHomeData, isPending: isUpdatingData } =
    useUpdateHomeData();

  const {
    register,
    formState: { errors, isDirty: formIsDirty },
    watch,
    handleSubmit,
    reset,
  } = useForm<UpdatedHomeData>({
    defaultValues: { verification_status: Verification.Pending },
  });
  const current_verification_status = watch('verification_status');
  const disableSubmission =
    isFetchingData ||
    isUpdatingData ||
    current_verification_status === Verification.Pending ||
    !formIsDirty;

  useEffect(() => {
    if (homeData) {
      reset(
        {
          id: homeData.id,
          time_zone: homeData.time_zone,
          city: homeData.city,
          state: homeData.state,
          country: homeData.country,
          postcode: homeData.postcode,
          message: homeData.message,
          verification_status: homeData.verification_status,
        },
        { keepDefaultValues: false },
      );
    }
  }, [homeData, reset]);

  const onSubmit: SubmitHandler<UpdatedHomeData> = (data) => {
    if (data.verification_status === Verification.Rejected) {
      delete data.time_zone;
      delete data.city;
      delete data.state;
      delete data.country;
      delete data.postcode;
    } else if (data.verification_status === Verification.Approved) {
      delete data.message;
    }
    // console.log(data);
    updateHomeData(data, {
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <StyledHomeVerification>
      {isFetchingData && <Spinner />}
      <form
        className={!homeData ? 'hide-form' : undefined}
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={preventEnterKeyFormSubmission}
      >
        <div className="grid-layout">
          {homeData && (
            <>
              <>
                <GridCell>
                  <Label htmlFor="owner">Owner</Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="owner"
                    name="owner"
                    autoComplete="off"
                    readOnly
                    value={homeData.owner}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="name">Name</Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="off"
                    readOnly
                    value={homeData.name}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="location">Location</Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    autoComplete="off"
                    readOnly
                    value={homeData.location}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="address">Address</Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    autoComplete="off"
                    readOnly
                    value={homeData.address}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="price">Price</Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="price"
                    name="price"
                    autoComplete="off"
                    readOnly
                    value={moneyFormatter(parseFloat(homeData.price ?? ''))}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="price_per_guest">Price per guest</Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="price_per_guest"
                    name="price_per_guest"
                    autoComplete="off"
                    readOnly
                    value={moneyFormatter(parseFloat(homeData.price_per_guest ?? ''))}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="number_of_cabins">Number of cabins</Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="number_of_cabins"
                    name="number_of_cabins"
                    autoComplete="off"
                    readOnly
                    value={homeData.number_of_cabins}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="cabin_capacity">Cabin Capacity</Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="cabin_capacity"
                    name="cabin_capacity"
                    autoComplete="off"
                    readOnly
                    value={homeData.cabin_capacity}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="amenities">Amenities</Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="amenities"
                    name="amenities"
                    autoComplete="off"
                    readOnly
                    value={homeData.amenities.join(', ')}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="main_image">Main Image</Label>
                </GridCell>
                <GridCell>
                  <div className="main-image">
                    <img src={homeData.main_image} alt="" />
                  </div>
                  <input
                    style={{ display: 'none' }}
                    type="text"
                    id="main_image"
                    name="main_image"
                    autoComplete="off"
                    readOnly
                    value={homeData.main_image}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="extra_images">Extra images</Label>
                </GridCell>
                <GridCell>
                  <div className="extra-images">
                    <ul>
                      {homeData.extra_images.map((image, index) => (
                        <li key={index}>
                          <img src={image} alt="" />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <input
                    style={{ display: 'none' }}
                    type="text"
                    id="extra_images"
                    name="extra_images"
                    autoComplete="off"
                    readOnly
                    value={homeData.extra_images.join(', ')}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="description">Description</Label>
                </GridCell>
                <GridCell>
                  <textarea
                    id="description"
                    name="description"
                    autoComplete="off"
                    readOnly
                    value={homeData.description}
                  />
                </GridCell>
              </>
            </>
          )}
          <input
            type="hidden"
            id="homeId"
            autoComplete="off"
            readOnly
            value={homeId}
            {...register('id')}
          />
          <>
            <GridCell>
              <Label htmlFor="verification_status">Verification status</Label>
            </GridCell>
            <GridCell>
              <Input
                type="text"
                style={{ display: 'none' }}
                id="verification_status"
                readOnly
                value={current_verification_status ?? ''}
              />
              <div className="radio-inputs">
                {VERIFICATION_OPTIONS.filter(
                  (val) => val.value !== Verification.Pending,
                ).map((val) => (
                  <div key={val.value}>
                    <input
                      id={val.value}
                      type="radio"
                      value={val.value}
                      {...register('verification_status')}
                    />
                    <Label htmlFor={val.value}>{val.label}</Label>
                  </div>
                ))}
              </div>
            </GridCell>
          </>
          {current_verification_status === Verification.Approved && (
            <>
              <>
                <GridCell>
                  <Label htmlFor="time_zone">
                    {errors.time_zone?.message &&
                    current_verification_status === Verification.Approved ? (
                      <ErrorMessage>{errors.time_zone.message}</ErrorMessage>
                    ) : (
                      <>
                        Time Zone{' '}
                        {current_verification_status ===
                          Verification.Approved && <Asterisk />}
                      </>
                    )}
                  </Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="time_zone"
                    autoComplete="on"
                    {...register('time_zone', {
                      required: 'Time zone cannot be empty',
                      // validate: (value, { verification_status }) => {
                      //   if (verification_status === Verification.Approved) {
                      //     if (!value || value.length === 0) {
                      //       return 'Time zone cannot be empty';
                      //     }
                      //   }
                      // },
                    })}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="city">
                    {errors.city?.message &&
                    current_verification_status === Verification.Approved ? (
                      <ErrorMessage>{errors.city.message}</ErrorMessage>
                    ) : (
                      <>
                        City{' '}
                        {current_verification_status ===
                          Verification.Approved && <Asterisk />}
                      </>
                    )}
                  </Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="city"
                    autoComplete="on"
                    {...register('city', {
                      required: 'City name cannot be empty',
                      // validate: (value, { verification_status }) => {
                      //   if (verification_status === Verification.Approved) {
                      //     if (!value || value.length === 0) {
                      //       return 'City name cannot be empty';
                      //     }
                      //   }
                      // },
                    })}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="state">
                    {errors.state?.message &&
                    current_verification_status === Verification.Approved ? (
                      <ErrorMessage>{errors.state.message}</ErrorMessage>
                    ) : (
                      <>
                        State{' '}
                        {current_verification_status ===
                          Verification.Approved && <Asterisk />}
                      </>
                    )}
                  </Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="state"
                    autoComplete="on"
                    {...register('state', {
                      required: 'State name cannot be empty',
                      // validate: (value, { verification_status }) => {
                      //   if (verification_status === Verification.Approved) {
                      //     if (!value || value.length === 0) {
                      //       return 'State name cannot be empty';
                      //     }
                      //   }
                      // },
                    })}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="country">
                    {errors.country?.message &&
                    current_verification_status === Verification.Approved ? (
                      <ErrorMessage>{errors.country.message}</ErrorMessage>
                    ) : (
                      <>
                        Country{' '}
                        {current_verification_status ===
                          Verification.Approved && <Asterisk />}
                      </>
                    )}
                  </Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="country"
                    autoComplete="on"
                    {...register('country', {
                      required: 'Country name cannot be empty',
                      // validate: (value, { verification_status }) => {
                      //   if (verification_status === Verification.Approved) {
                      //     if (!value || value.length === 0) {
                      //       return 'Country name cannot be empty';
                      //     }
                      //   }
                      // },
                    })}
                  />
                </GridCell>
              </>
              <>
                <GridCell>
                  <Label htmlFor="postcode">
                    {errors.postcode?.message &&
                    current_verification_status === Verification.Approved ? (
                      <ErrorMessage>{errors.postcode.message}</ErrorMessage>
                    ) : (
                      <>
                        Postcode{' '}
                        {current_verification_status ===
                          Verification.Approved && <Asterisk />}
                      </>
                    )}
                  </Label>
                </GridCell>
                <GridCell>
                  <Input
                    type="text"
                    id="postcode"
                    autoComplete="on"
                    {...register('postcode', {
                      required: 'Postcode cannot be empty',
                      // validate: (value, { verification_status }) => {
                      //   if (verification_status === Verification.Approved) {
                      //     if (!value || value.length === 0) {
                      //       return 'Postcode cannot be empty';
                      //     }
                      //   }
                      // },
                    })}
                  />
                </GridCell>
              </>
            </>
          )}
          {current_verification_status === Verification.Rejected && (
            <>
              <GridCell>
                <Label htmlFor="message">
                  {errors.message?.message ? (
                    <ErrorMessage>{errors.message.message}</ErrorMessage>
                  ) : (
                    <>
                      Message <Asterisk />
                    </>
                  )}
                </Label>
              </GridCell>
              <GridCell>
                <textarea
                  id="message"
                  {...register('message', {
                    required: 'Message cannot be empty',
                  })}
                />
              </GridCell>
            </>
          )}
        </div>
        <Button type="submit" disabled={disableSubmission}>
          Submit
        </Button>
      </form>
    </StyledHomeVerification>
  );
};

export default HomeVerification;
