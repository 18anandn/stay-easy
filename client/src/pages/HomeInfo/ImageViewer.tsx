import styled from 'styled-components';
import { GrGallery } from 'react-icons/gr';
import { useState } from 'react';

import {
  ScreenType,
  screenWidths,
  useScreen,
} from '../../providers/ScreenProvider';
import CustomImageCarousel from '../../components/CustomImageCarousel';
import Button from '../../components/buttons/Button';
import Modal from '../../components/Modal';

const StyledImageViewer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;

  & > .gallery-button {
    position: absolute;
    background-color: white;
    color: black;
    right: 10px;
    bottom: 10px;
    border: 1.5px solid black;
  }

  .image-grid {
    /* margin: auto;
    max-width: 1240px; */
    display: grid;
    overflow: hidden;
    aspect-ratio: 10 / 3;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: repeat(2, 1fr);
    gap: 10px;
    border-radius: 20px;
    overflow: hidden;

    li {
      overflow: hidden;
    }

    li:first-of-type {
      grid-row: 1/-1;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-color: lightgray;
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    order: -1;
    padding-inline: 0;
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;

    .carousel-container {
      height: 100%;
    }

    .image-grid {
      overflow: auto;
      aspect-ratio: unset;
    }

    .gallery-button {
      display: none;
    }
  }
`;

const StyledImageGallery = styled.div`
  height: var(--max-modal-height);
  width: var(--max-modal-width);
  overflow: auto;
  /* display: flex;
  flex-direction: column; */

  .image-container {
    /* max-height: 100%; */
    padding-block: 50px;
    max-width: 1000px;
    box-sizing: border-box;
    margin: auto;
    /* width: 90%; */
    /* overflow: auto; */
  }

  .image-box {
    list-style-type: none;
    margin: auto;
    display: grid;
    grid-auto-rows: 250px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;

    img {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }
`;

type Props = {
  images: string[];
};

const ImageViewer: React.FC<Props> = ({ images }) => {
  const screen = useScreen();
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);

  return (
    <StyledImageViewer>
      {screen === ScreenType.PHONE ? (
        <div
          className="carousel-container"
          role="button"
          onClick={() => setIsImageGalleryOpen(true)}
        >
          <CustomImageCarousel images={images} />
        </div>
      ) : (
        <ul className="image-grid">
          {images.slice(0, 5).map((url) => (
            <li key={url}>
              <img src={url} alt="" />
            </li>
          ))}
        </ul>
      )}
      <Button
        onClick={() => setIsImageGalleryOpen(true)}
        className="gallery-button"
      >
        <GrGallery /> Show all images
      </Button>
      <Modal
        isModalOpen={isImageGalleryOpen}
        setIsModalOpen={setIsImageGalleryOpen}
      >
        <StyledImageGallery>
          <div className="image-container">
            <ul className="image-box">
              {images.map((url) => (
                <li key={url}>
                  <img src={url} alt="" />
                </li>
              ))}
            </ul>
          </div>
        </StyledImageGallery>
      </Modal>
    </StyledImageViewer>
  );
};

export default ImageViewer;
