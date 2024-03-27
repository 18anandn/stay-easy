import styled from 'styled-components';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';
import CustomImageCarousel from '../../../components/CustomImageCarousel';
import { HomeCardInfo } from '../types/HomeCardInfo';

const StyledHomeCard = styled(Link).attrs({ className: 'home-card' })`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  text-decoration: none;
  color: inherit;

  .carousel {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 10px;
    overflow: hidden;
  }
`;

type Props = {
  homeInfo: HomeCardInfo;
};

const HomeCard: React.FC<Props> = ({
  homeInfo: { id, images, city, country, price },
}) => {
  return (
    <StyledHomeCard to={`/home/${id}`}>
      <div className="carousel">
        <CustomImageCarousel images={images} showNavigationOnHover={true} />
      </div>
      <p>
        {city}, {country}
      </p>
      <p>&#8377;{price} night</p>
    </StyledHomeCard>
  );
};

export default HomeCard;
