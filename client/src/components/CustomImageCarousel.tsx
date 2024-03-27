import styled from 'styled-components';
import {
  MouseEventHandler,
  useState,
  useRef,
  UIEventHandler,
  useEffect,
} from 'react';

const StyledCustomImageCarousel = styled.div`
  height: 100%;
  width: 100%;
  background-color: none;
  background: none;
  overflow: hidden;
  position: relative;

  &.on-hover {
    .previous,
    .next {
      transition: opacity 0.1s linear;
      opacity: 0;

      &:disabled,
      &[disabled] {
        opacity: 0;
      }
    }

    &:hover {
      .previous,
      .next {
        opacity: 1;

        &:disabled,
        &[disabled] {
          opacity: 0;
        }
      }
    }
  }

  .image-container {
    list-style-type: none;
    display: flex;
    height: 100%;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    scrollbar-width: none;
    overscroll-behavior-inline: contain;

    &::-webkit-scrollbar {
      display: none;
    }

    li {
      scroll-snap-align: start;
      flex: 0 0 auto;
      height: 100%;
      width: 100%;

      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        background: linear-gradient(
          to top,
          #c4c5c7 0%,
          #dcdddf 52%,
          #ebebeb 100%
        );
      }
    }
  }

  .previous,
  .next {
    color: transparent;
    height: 30px;
    width: 30px;
    border-radius: 1000px;
    border: none;
    outline: none;
    background-color: white;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 1;
    cursor: pointer;

    &:disabled,
    &[disabled] {
      opacity: 0;
    }
  }

  .previous {
    left: 5%;
  }

  .next {
    right: 5%;
  }

  .previous::before,
  .next::before,
  .previous::after,
  .next::after {
    content: '';
    height: 30%;
    aspect-ratio: 0.3;
    border-radius: 1000px;
    background-color: black;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-85%, -80%) rotate(45deg);
  }

  .previous::after,
  .next::after {
    transform: translate(-85%, -20%) rotate(-45deg);
  }

  .next::before,
  .next::after {
    left: unset;
    right: 50%;
    transform: translate(85%, -80%) rotate(135deg);
  }

  .next::after {
    transform: translate(85%, -20%) rotate(-135deg);
  }

  .pagination {
    width: var(--container-width);
    aspect-ratio: 6;
    padding: 0 1%;
    border-radius: 10000px;
    position: absolute;
    left: 50%;
    bottom: 5%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.4);
    /* background-color: black; */
    display: flex;
    align-items: center;
    overflow: hidden;

    .container {
      flex: 0 0 auto;
      height: 90%;
      width: 100%;
      box-sizing: border-box;
      /* background-color: white; */
      display: flex;
      align-items: center;
      transition: transform 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);

      span {
        flex: 0 0 auto;
        display: block;
        height: 100%;
        width: var(--dot-width);
        /* background-color: red; */
        position: relative;

        &::before {
          content: '';
          position: absolute;
          background-color: rgba(255, 255, 255);
          display: block;
          height: 75%;
          border-radius: 10000px;
          aspect-ratio: 1;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.8);
          transition: opacity 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
          opacity: 0.5;
        }

        &.active::before {
          background-color: white;
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        &.close-first::before,
        &.close-second::before {
          transform: translate(-50%, -50%) scale(1);
        }

        &.close-third::before {
          transform: translate(-50%, -50%) scale(0.85);
        }
      }
    }
  }
`;

type Props = {
  images: string[];
  showNavigationOnHover?: boolean;
  reset?: boolean;
};

const CustomImageCarousel: React.FC<Props> = ({
  images,
  showNavigationOnHover,
  reset,
}) => {
  // const con
  const [currIndex, setCurrIndex] = useState<number>(0);
  const imageContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (reset) {
      setCurrIndex(0);
    }
  }, [reset]);

  const handleNextButtonClick: MouseEventHandler = (event) => {
    event.preventDefault();
    if (currIndex < images.length - 1) {
      if (imageContainerRef.current) {
        imageContainerRef.current.scrollBy(
          imageContainerRef.current.getBoundingClientRect().width,
          0,
        );
      }
    }
  };

  const handlePrevButtonClick: MouseEventHandler = (event) => {
    event.preventDefault();
    if (currIndex > 0) {
      if (imageContainerRef.current) {
        imageContainerRef.current.scrollBy(
          -imageContainerRef.current.getBoundingClientRect().width,
          0,
        );
      }
    }
  };

  const handleScroll: UIEventHandler = (event) => {
    const scrollLeft = event.currentTarget.scrollLeft;
    const containerWidth = event.currentTarget.getBoundingClientRect().width;
    const index = Math.round(scrollLeft / containerWidth);
    if (index !== currIndex) {
      setCurrIndex(index);
    }
  };

  return (
    <StyledCustomImageCarousel
      className={showNavigationOnHover ? 'on-hover' : undefined}
    >
      <ul
        className={`image-container`}
        ref={imageContainerRef}
        onScroll={handleScroll}
      >
        {images.map((image, index) => (
          <li key={index}>
            <img src={image} alt="" loading="lazy" />
          </li>
        ))}
      </ul>
      <div
        className="pagination"
        style={{
          ['--container-width' as any]: `${
            (images.length > 4 ? 5 : images.length) * 3
          }%`,
          ['--dot-width' as any]: `${
            images.length > 4 ? 20 : 100 / images.length
          }%`,
        }}
      >
        <div
          className="container"
          style={{
            transform: `translateX(calc(var(--dot-width) * -${
              currIndex < 3 || images.length < 6
                ? 0
                : currIndex >= images.length - 3
                ? images.length - 5
                : currIndex - 2
            }))`,
          }}
        >
          {images.map((val, index) => (
            <span
              key={val}
              className={
                index === currIndex
                  ? 'active'
                  : Math.abs(index - currIndex) === 1
                  ? 'close-first'
                  : Math.abs(index - currIndex) === 2
                  ? 'close-second'
                  : Math.abs(index - currIndex) === 3
                  ? 'close-third'
                  : Math.abs(index - currIndex) === 4
                  ? 'close-fourth'
                  : ''
              }
            ></span>
          ))}
        </div>
      </div>
      <button
        className="previous"
        onClick={handlePrevButtonClick}
        disabled={currIndex === 0}
      >
        Previous
      </button>
      <button
        className="next"
        onClick={handleNextButtonClick}
        disabled={currIndex === images.length - 1}
      >
        Next
      </button>
    </StyledCustomImageCarousel>
  );
};

export default CustomImageCarousel;
