import styled from 'styled-components';
import { HotelInfo } from '../../apis/hotel';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';

const StyledHotelCard = styled(Link)`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  text-decoration: none;
  color: inherit;
  font-size: 1rem;

  p {
    /* margin: 0.2rem 0; */
  }

  .image {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 5%;
  }
`;

type Props = {
  hotelInfo: HotelInfo;
};

const HotelCard: React.FC<Props> = ({ hotelInfo }) => {
  return (
    <StyledHotelCard to={`/home/${hotelInfo.id}`}>
      <LazyLoadImage
        className="image"
        src={hotelInfo.main_image}
        effect="blur"
      />
      <p>
        {hotelInfo.city}, {hotelInfo.state}
      </p>
      <p>&#8377;{hotelInfo.price} night</p>
    </StyledHotelCard>
  );
};

export default HotelCard;
