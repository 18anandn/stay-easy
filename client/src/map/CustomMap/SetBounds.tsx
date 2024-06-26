import { LatLngBounds, LatLngBoundsLiteral } from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ZoomControl, useMapEvents } from 'react-leaflet';
import { goToPosition } from '../../utils/location/goToPosition';

type Props = {
  // initialBounds?: LatLngBounds | LatLng;
  isDisplayed: boolean;
  yourBounds?: LatLngBoundsLiteral;
  onBoundsChange?: (bounds: LatLngBounds) => void;
  disableInteraction: boolean;
};

const SetBounds: React.FC<Props> = ({
  isDisplayed,
  yourBounds,
  onBoundsChange,
  disableInteraction,
}) => {
  const mapIsHiddenRef = useRef<boolean>(isDisplayed);
  const allowMoveEndTrigger = useRef<boolean>(false);
  const allowZoomEndTrigger = useRef<boolean>(false);
  const mapResizeTrackerRef = useRef<boolean>(false);
  const [allowZoom, setAllowZoom] = useState<boolean>(true);
  const boundsTracker = useRef<LatLngBounds | undefined>();
  const prevZoomRef = useRef<number>(10);

  const yourBoundsClass = useMemo(() => {
    if (!yourBounds) return undefined;
    return new LatLngBounds(yourBounds);
  }, [yourBounds]);

  const map = useMapEvents({
    moveend: () => {
      // // const bounds = map.getBounds();
      // // const newBoundsOnMoveEnd: LatLngBoundsLiteral = [
      // //   [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
      // //   [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
      // // ];
      // // boundsOnMoveEnd(newBoundsOnMoveEnd);
      // const prevMapSize = prevMapSizeRef.current;
      // const currMapSize: MapSize = {
      //   height: map.getSize().y,
      //   width: map.getSize().x,
      // };
      // if (
      //   prevMapSize &&
      //   prevMapSize.height === currMapSize.height &&
      //   prevMapSize.width === currMapSize.width
      // ) {
      //   if (allowMoveEndTrigger.current) {
      //     // console.log('move ended')
      //   } else {
      //     allowMoveEndTrigger.current = true;
      //   }
      // } else {
      //   prevMapSizeRef.current = currMapSize;
      //   if (yourBounds) {
      //     allowMoveEndTrigger.current = false;
      //     if (boundsTracker.current) map.flyToBounds(boundsTracker.current);
      //   } else {
      //     allowMoveEndTrigger.current = true;
      //   }
      // }
      // console.log(mapResizeTrackerRef.current, allowMoveEndTrigger.current);
      if (!mapResizeTrackerRef.current && allowMoveEndTrigger.current) {
        // console.log('move ended');
      }
      if (mapResizeTrackerRef.current) {
        mapResizeTrackerRef.current = false;
        if (boundsTracker.current) {
          allowMoveEndTrigger.current = false;
          allowZoomEndTrigger.current = false;
          goToPosition(boundsTracker.current, map, true);
        } else {
          allowZoomEndTrigger.current = true;
          allowMoveEndTrigger.current = true;
        }
      } else {
        allowZoomEndTrigger.current = true;
        allowMoveEndTrigger.current = true;
      }
      setAllowZoom(true);
      map.getContainer().style.pointerEvents = 'auto';
    },
    resize: () => {
      // console.log('resizing');
      mapResizeTrackerRef.current = true;
      // allowMoveEndTrigger.current = false;
      // if (boundsTracker.current) map.flyToBounds(boundsTracker.current);
    },
    dragstart: () => {
      // allowMoveEndTrigger.current = false;
    },
    zoomend: () => {
      if (!mapResizeTrackerRef.current) {
        if (allowMoveEndTrigger.current) {
          if (
            Math.abs(map.getZoom() - prevZoomRef.current) >= 1 ||
            map.getZoom() === map.getMaxZoom() ||
            map.getZoom() === map.getMinZoom()
          ) {
            boundsTracker.current = map.getBounds();
            prevZoomRef.current = map.getZoom();
            onBoundsChange?.(boundsTracker.current.pad(-0.1));
          }
        } else {
          allowZoomEndTrigger.current = true;
        }
      }
    },
    dragend: (event) => {
      // allowMoveEndTrigger.current = true;
      if (event.distance > 25) {
        boundsTracker.current = map.getBounds();
        onBoundsChange?.(boundsTracker.current.pad(-0.1));
      }
    },
  });

  useEffect(() => {
    if (isDisplayed) {
      map.invalidateSize();
    }
  }, [map, isDisplayed]);

  useEffect(() => {
    if(disableInteraction) {
      map.getContainer().style.pointerEvents = 'none';
    } else {
      map.getContainer().style.pointerEvents = 'auto';
    }
  }, [map, disableInteraction])

  useEffect(() => {
    // if (mapIsHiddenRef.current) {
    //   mapIsHiddenRef.current = false;
    //   prevZoomRef.current = map.getZoom();
    //   map.invalidateSize({ pan: false });
    //   const goToBounds = yourBounds ?? boundsTracker.current;
    //   if (goToBounds) {
    //     allowMoveEndTrigger.current = false;
    //     allowZoomEndTrigger.current = false;
    //     goToPosition(goToBounds, map, false);
    //     boundsTracker.current = goToBounds;
    //   }
    // } else
    if (isDisplayed) {
      if (yourBoundsClass) {
        allowMoveEndTrigger.current = false;
        allowZoomEndTrigger.current = false;
        boundsTracker.current = yourBoundsClass;
        map.getContainer().style.pointerEvents = 'none';
        setAllowZoom(false);
        goToPosition(yourBoundsClass, map, !mapIsHiddenRef.current);
        mapIsHiddenRef.current = false;
      }
    } else {
      mapIsHiddenRef.current = true;
    }
  }, [isDisplayed, yourBoundsClass, map]);

  return allowZoom ? <ZoomControl /> : null;
};

export default SetBounds;
