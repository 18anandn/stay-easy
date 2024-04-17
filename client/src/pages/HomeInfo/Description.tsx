import styled from 'styled-components';
import { DataProps } from './types/DataProps';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { getRemInPixels } from '../../utils/getRemInPixels';

const StyledDescription = styled.div`
  /* max-width: 100%; */
  .show-more-button {
    display: none;
  }

  .text-container {
    /* background-color: red; */
  }

  .text {
    font-size: 1rem;

    p {
      word-wrap: break-word;
      /* word-break: break-all; */
      /* hyphens: auto; */
    }
  }

  &.hiding-feature {
    --hiding-height: 15rem;

    .text-container {
      overflow: hidden;
      padding-top: var(--hiding-height, 10rem);
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 200ms ease-in-out;
      position: relative;

      &::after {
        position: absolute;
        bottom: 0;
        height: 100%;
        width: 100%;
        content: '';
        background: rgb(255, 255, 255);
        background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(255, 255, 255, 0) 23%
        );
        pointer-events: none; /* so the text is still selectable */
      }
    }

    .text {
      position: relative;
      overflow: hidden;
      top: calc(-1 * var(--hiding-height, 10rem));
      margin-bottom: calc(-1 * var(--hiding-height, 10rem));
      font-size: 1rem;
    }

    &.show-more {
      .text-container {
        grid-template-rows: 1fr;

        &::after {
          background: none;
        }
      }
    }

    .show-more-button {
      text-decoration: underline;
      font-size: 1rem;
      display: block;
      background-color: transparent;
      outline: none;
      border: none;
    }
  }
`;

const Description: React.FC<DataProps> = ({ data }) => {
  const [isHidingFeatureOn, setIsHidingFeatureOn] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerElem = containerRef.current;
    const paraElem = paragraphRef.current;

    let observer: ResizeObserver | undefined;

    if (paraElem && containerElem) {
      observer = new ResizeObserver(() => {
        const cutOff = getRemInPixels(20);
        const pElemHeight = paraElem.getBoundingClientRect().height;
        if (pElemHeight > cutOff) {
          setIsHidingFeatureOn(true);
        } else {
          setIsHidingFeatureOn(false);
        }
      });
      observer.observe(paraElem);
    }

    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    if (isHidingFeatureOn) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }
  }, [isHidingFeatureOn]);

  const descriptionClasses = classNames({
    description: true,
    'hiding-feature': isHidingFeatureOn,
    'show-more': showMore,
  });

  return (
    <StyledDescription className={descriptionClasses}>
      <div className="text-container" ref={containerRef}>
        <div className="text">
          <p ref={paragraphRef}>{data.description}</p>
        </div>
      </div>
      {isHidingFeatureOn && (
        <button
          className="show-more-button"
          onClick={() => setShowMore((prev) => !prev)}
        >
          Show {showMore ? 'less' : 'more'}
        </button>
      )}
    </StyledDescription>
  );
};

export default Description;
