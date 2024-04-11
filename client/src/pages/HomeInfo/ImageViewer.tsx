import styled from 'styled-components';
import {
  ScreenType,
  screenWidths,
  useScreen,
} from '../../providers/ScreenProvider';
import CustomImageCarousel from '../../components/CustomImageCarousel';

const StyledImageViewer = styled.div`
  grid-column: 1 / -1;

  .image-grid {
    display: grid;
    overflow: hidden;
    aspect-ratio: 3 / 1;
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

    .image-grid {
      overflow: auto;
      aspect-ratio: unset;
    }
  }
`;

type Props = {
  images: string[];
};

const ImageViewer: React.FC<Props> = ({ images }) => {
  const screen = useScreen();

  return (
    <StyledImageViewer>
      {screen === ScreenType.PHONE ? (
        <CustomImageCarousel images={images} />
      ) : (
        <ul className="image-grid">
          {images.slice(0, 5).map((url) => (
            <li key={url}>
              <img src={url} alt="" />
            </li>
          ))}
        </ul>
      )}
    </StyledImageViewer>
  );
};

export default ImageViewer;
