import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { MouseEventHandler, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import Button from '../../ui/Button';
import { CreateHotelFormData, ServerError } from '../../commonDataTypes';
import Modal from '../../ui/Modal';
import Loader from '../../ui/loaders/Loader';
import { compressImages, createHotel, uploadImages } from '../../apis/hotel';

const Container = styled.div`
  .custom-button {
    margin: auto;
  }
`;

const StatusBox = styled.div`
  width: 20rem;
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

  .custom-loader {
    height: 3.5rem;
  }
`;

const HotelSubmission: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const {
    trigger,
    getValues,
    formState: { isValid },
  } = useFormContext<CreateHotelFormData>();
  const navigate = useNavigate();

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    trigger();
    if (!isValid) {
      return;
    }
    const data = getValues();
    setSubmitting(true);
    try {
      setMessage('Compressing images....\nThis may take a couple of minutes');
      const images = await compressImages([
        ...data.main_image,
        ...data.extra_images,
      ]);
      setMessage('Uploading Images....');
      const names = await uploadImages(images);
      setMessage('Uploading your home info....');
      await createHotel(data, names);
      toast.success('Your home was registered successfully');
      navigate('/', { replace: true });
    } catch (error) {
      let errorMessage = 'There was some internal server error';
      if (error instanceof ServerError) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
      setMessage('');
    }
  };

  return (
    <Container>
      <Button type="submit" onClick={handleClick}>
        Submit
      </Button>
      <Modal
        isModalOpen={submitting}
        setIsModalOpen={setSubmitting}
        closable={false}
      >
        <StatusBox>
          <h3>Submitting.....</h3>
          <p>{message}</p>
          <Loader color="black" />
        </StatusBox>
      </Modal>
    </Container>
  );
};

export default HotelSubmission;
