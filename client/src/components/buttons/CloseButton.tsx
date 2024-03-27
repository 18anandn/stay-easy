import styled from 'styled-components';

const CloseButton = styled.button.attrs({
  className: 'close-button',
  type: 'button',
})`
  height: 3em;
  width: 3em;
  margin: none;
  padding: none;
  background-color: transparent;
  border-radius: 100em;
  border: none;
  outline: none;
  color: transparent;
  position: relative;
  cursor: pointer;

  &::before,
  &::after {
    content: '';
    height: 60%;
    width: 10%;
    border-radius: 100em;
    background-color: black;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

// const CloseButton: React.FC<React.ComponentPropsWithRef<'button'>> = (
//   props,
// ) => {
//   return (
//     <StyledCloseButton {...props}>
//       <span className="left-hand"></span>
//       <span className="right-hand"></span>
//     </StyledCloseButton>
//   );
// };

export default CloseButton;
