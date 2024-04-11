import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`

  :root {
    --top-navbar-height: 5rem;
    --padding-block: 20px;
    --padding-inline-small: 5%;
    --padding-inline-large: 10%;
    --padding-inline: var(--padding-inline-small);

    --owner-nav-width: 16rem;
    --owner-button-width: 25px;
  }

 * {
    margin: 0;
    padding: 0;
    font-family: 'Open Sans', sans-serif;
  }

  button:focus-visible {
    outline: 2px solid black;
  }

  body {

    &.scroll-lock {
      overflow: hidden;
      width: calc(100% - var(--scrollbar-width, 0px));
      height: 100%;
    }
  }

  .custom-spinner {
    font-size: 0.06rem;
  }
`;

export default GlobalStyles;
