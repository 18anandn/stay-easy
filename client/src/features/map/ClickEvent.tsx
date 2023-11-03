import { LeafletMouseEventHandlerFn } from 'leaflet';
import React from 'react';
import { useMapEvent } from 'react-leaflet/hooks';

interface Props {
  handleClick: LeafletMouseEventHandlerFn;
}

const ClickEvent: React.FC<Props> = ({ handleClick }) => {
  useMapEvent('click', handleClick);
  return null;
};

export default ClickEvent;
