import styled from 'styled-components';
import { HotelInfo } from '../../apis/hotel';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';

const StyledHotelCard = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
  width: 300px;
  padding: 1rem;
  border: 1px solid black;

  .image {
    height: 300px;
    width: 300px;
    object-fit: cover;
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
      <p>{hotelInfo.city}, {hotelInfo.state}</p>
      <p>{hotelInfo.price} per night</p>
      <br />
    </StyledHotelCard>
  );
};

export default HotelCard;
