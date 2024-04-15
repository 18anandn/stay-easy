import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Marker } from 'react-leaflet/Marker';
import { Popup } from 'react-leaflet/Popup';
import { LatLngExpression, divIcon } from 'leaflet';

import { usePopupDimensions } from '../MapPopupProvider';
import { HomeCardWithLocation } from '../../features/homes/types/HomeCardWithLocation';
import { moneyFormatter } from '../../utils/money-formatter';
import { calculatePopupPosition } from '../../utils/popup-funcs';
import CloseButton from '../../components/buttons/CloseButton';
import CustomImageCarousel from '../../components/CustomImageCarousel';
import { getFormattedLocation } from '../../utils/location/format-location';
import { useGetHoveredHome } from '../../pages/MapSearch/hooks/useHoveredHome';

type Props = {
  position: LatLngExpression;
  price: number;
  home: HomeCardWithLocation;
  onClick?: () => void;
  onPopupOpen?: () => void;
  onPopupClose?: () => void;
};

const PriceMarker: React.FC<Props> = ({
  price,
  home,
  onClick,
  onPopupOpen,
  onPopupClose,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const popupDimensions = usePopupDimensions();
  const map = useMap();
  const hoveredHome = useGetHoveredHome();
  const focused = hoveredHome === home.id;
  const markerRef = useRef<L.Marker>(null);
  const iconRef = useRef<L.DivIcon>(
    divIcon({
      className: `custom-div-icon`,
      html: `<div><button class='button'>${moneyFormatter(
        price
      )}</button></div>`,
    })
  );

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      if (focused) {
        marker.getElement()?.querySelector('.button')?.classList.add('focused');
      } else {
        marker
          .getElement()
          ?.querySelector('.button')
          ?.classList.remove('focused');
      }
    }
  }, [focused]);

  useEffect(() => {
    if (isPopupOpen) {
      const marker = markerRef.current;
      if (marker) {
        const markerElem = marker.getElement()?.querySelector('.button');
        markerElem?.classList.add('active');
        if (markerElem && popupDimensions) {
          const markerWidth = markerElem.getBoundingClientRect().width;
          const markerHeight = markerElem.getBoundingClientRect().height;
          const popupContainer = marker.getPopup()?.getElement();
          const popupContentContainer = popupContainer?.querySelector(
            '.popup-content-container'
          ) as HTMLElement;
          if (popupContainer && popupContentContainer) {
            const containerWidth = map
              .getContainer()
              .getBoundingClientRect().width;
            const containerheight = map
              .getContainer()
              .getBoundingClientRect().height;
            const { x: left, y: top } = map.latLngToContainerPoint(
              marker.getLatLng()
            );
            // const popupWidth = popupDimensions.width;
            // const popupHeight = popupDimensions.height;
            const popupWidth =
              popupContentContainer.getBoundingClientRect().width;
            const popupHeight =
              popupContentContainer.getBoundingClientRect().height;
            const resPos = calculatePopupPosition(
              containerWidth,
              containerheight,
              markerWidth,
              markerHeight,
              left - markerWidth / 2,
              top - markerHeight / 2,
              popupWidth,
              popupHeight,
              popupDimensions.padding,
              popupDimensions.mapHorizontalPadding,
              popupDimensions.mapVerticalPadding
            );
            // popupContentContainer.style.width = `${popupDimensions.width}px`;
            // popupContentContainer.style.height = `${popupDimensions.height}px`;
            popupContentContainer.style.transform = `translate(calc(-50% + ${resPos.left}px), calc(-50% + ${resPos.top}px))`;
          }
        }
      }
    }
  }, [isPopupOpen, popupDimensions, map]);

  const zIndex = focused ? 50 : isPopupOpen ? 40 : 0;

  return (
    <Marker
      ref={markerRef}
      position={home.location}
      icon={iconRef.current}
      riseOnHover={true}
      riseOffset={100}
      zIndexOffset={zIndex}
      eventHandlers={{
        dblclick: () => {
          return false;
        },
        click: () => {
          onClick?.();
        },
        popupopen: () => {
          setIsPopupOpen(true);
          onPopupOpen?.();
        },
        popupclose: () => {
          setIsPopupOpen(false);
          onPopupClose?.();
          const marker = markerRef.current;
          if (marker) {
            marker
              .getElement()
              ?.querySelector('.button')
              ?.classList.remove('active');
          }
        },
      }}
    >
      <Popup
        maxHeight={0}
        maxWidth={0}
        // minWidth={0}
        offset={[2, 0]}
        className="custom-popup"
        closeButton={false}
        autoPan={false}
        autoPanPadding={undefined}
        keepInView={false}
        interactive={true}
      >
        <div className="popup-content-container">
          <Link
            to={`/home/${home.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="home-container"
          >
            <CloseButton
              onClick={(event) => {
                event.preventDefault();
                const marker = markerRef.current;
                if (marker) {
                  marker.closePopup();
                }
              }}
            >
              Close
            </CloseButton>
            <div className="carousel">
              <CustomImageCarousel
                images={home.images}
                reset={!markerRef.current?.isPopupOpen()}
              />
            </div>
            <div className="details">
              <h3>{home.name}</h3>
              <p>{getFormattedLocation(home.city, home.state, home.country)}</p>
              <p>{moneyFormatter(home.price)} night</p>
            </div>
          </Link>
        </div>
      </Popup>
    </Marker>
  );
};

export default PriceMarker;
