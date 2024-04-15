import { createGlobalStyle } from 'styled-components';

const MarkerCss = createGlobalStyle`
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
          background-color: white;
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

export default MarkerCss;
