import { LatLngBoundsLiteral, LeafletEvent } from 'leaflet';
import React from 'react';
import { useMap, useMapEvent } from 'react-leaflet/hooks';

interface Props {
  onMoveEnd: (bounds: LatLngBoundsLiteral, event?: LeafletEvent) => void;
}

const MoveEndEvent: React.FC<Props> = ({ onMoveEnd }) => {
  const map = useMapEvent('moveend', (event) => {
    const bounds = map.getBounds();
    onMoveEnd(
      [
        [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
        [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
      ],
      event,
    );
  });
  return null;
};

export default MoveEndEvent;
