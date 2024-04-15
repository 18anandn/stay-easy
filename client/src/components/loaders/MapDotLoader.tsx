import styled from 'styled-components';
import DotLoader from './DotLoader';

const MapDotLoader = styled(DotLoader)`
  position: absolute;
  top: 30px;
  left: 50%;
  translate: -50%;
  z-index: 3;
  pointer-events: none;
  background-color: white;
  padding: 12px;
  font-size: 8px;
  border-radius: 1000px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
    rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
`;

export default MapDotLoader;
