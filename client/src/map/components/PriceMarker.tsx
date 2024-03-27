import L, { LatLngLiteral, divIcon } from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import { usePopupDimensions } from '../MapPopupProvider';
import { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { HomeCardWithLocation } from '../../features/homes/types/HomeCardWithLocation';
import { moneyFormatter } from '../../utils/money-formatter';
import { calculatePopupPosition } from '../../utils/popup-funcs';
import CloseButton from '../../components/buttons/CloseButton';
import CustomImageCarousel from '../../components/CustomImageCarousel';
import { getFormattedLocation } from '../../utils/location/format-location';

export const MarkerCss = css`
  .custom-div-icon {
    height: fit-content;
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;

    .button {
      height: 30px;
      padding: 0 10px;
      font-size: 13px;
      font-weight: bold;
      width: max-content;
      /* position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%); */
      cursor: pointer;
      white-space: nowrap;
      background-color: white;
      border: none;
      border-radius: 1000px;
      outline: none;
      box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
        rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
      transition: transform 0.1s ease-in-out, background-color 0.1s ease-in-out;

      &:hover {
        transform: scale(1.15);
        /* background-color: black; */
        /* color: white; */
      }

      &.focused,
      &.active {
        transform: scale(1.15);
        background-color: black;
        color: white;
      }
    }
  }

  .custom-popup {
    box-sizing: border-box;
    height: 0;
    width: 0;
    border: none;
    outline: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    position: relative;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-font-smoothing: antialiased;
    -webkit-perspective: 0;
    perspective: 0;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    will-change: transform;
    -webkit-filter: none;
    filter: none;
  }

  .leaflet-popup-tip-container {
    visibility: hidden;
  }

  .leaflet-popup-content-wrapper,
  .leaflet-popup-content {
    box-sizing: border-box;
    height: 0;
    width: 0;
    /* background-color: transparent; */
    box-shadow: none;
    border: none;
    /* box-sizing: border-box; */
    margin: 0;
    padding: 0;
    overflow: visible;
    /* display: flex;
    align-items: center;
    justify-content: center; */
    border-radius: none;
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .popup-content-container {
      pointer-events: auto;
      /* height: max-content; */
      width: 300px;
      margin: 0;
      padding: 0;
      background-color: white;
      border-radius: 10px;
      overflow: hidden;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1;
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      -webkit-font-smoothing: antialiased;
      -webkit-perspective: 0;
      perspective: 0;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      will-change: transform;
      -webkit-filter: none;
      filter: none;

      & * {
        margin: 0;
        padding: 0;
      }

      .home-container {
        /* height: max-content; */
        width: 100%;
        /* overflow: hidden; */
        /* background-color: brown; */
        display: block;
        text-decoration: none;
        position: relative;

        .close-button {
          font-size: 8px;
          position: absolute;
          z-index: 2;
          top: 6px;
          right: 6px;
        }

        .carousel {
          /* height: 70%; */
          width: 100%;
          aspect-ratio: 4.5/3;
          position: relative;
          overflow: hidden;
        }

        .details {
          box-sizing: border-box;
          width: 100%;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          opacity: 1;
          text-decoration: none;

          h3,
          p {
            max-width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: black;
            overflow: hidden;
            filter: none;
          }
        }
      }
    }
  }
`;

type Props = {
  position: LatLngLiteral;
  price: number;
  home: HomeCardWithLocation;
  onClick?: () => void;
  onPopupOpen?: () => void;
  onPopupClose?: () => void;
  focused?: boolean;
};

const PriceMarker: React.FC<Props> = ({
  price,
  home,
  onClick,
  onPopupOpen,
  onPopupClose,
  focused,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const popupDimensions = usePopupDimensions();
  const map = useMap();
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
