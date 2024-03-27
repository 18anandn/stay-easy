import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
 * {
    margin: 0;
    padding: 0;
    font-family: 'Open Sans', sans-serif;
    /* border: 1px solid black; */
    --top-navbar-height: 80px;
  }

  body {
    /* height: 100%; */
    /* border: 1px solid green; */

    &.scroll-lock {
      overflow: hidden;
      width: calc(100% - var(--scrollbar-width, 0px));
      height: 100%;
    }
  }

  #root {
    /* border: 1px solid blue; */
    
  }
`;

export default GlobalStyles;
