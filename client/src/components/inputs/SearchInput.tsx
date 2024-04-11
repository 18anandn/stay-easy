import styled from 'styled-components';
import { BiSearch } from 'react-icons/bi';
import { forwardRef } from 'react';
import CloseButton from '../buttons/CloseButton';

const Container = styled.div`
  height: 3rem;
  /* width: 100%; */
  /* border: 1px solid blue; */
  /* height: 100%; */
  /* flex-grow: 1; */
  position: relative;
  display: flex;

  .search-icon {
    font-size: 1.2rem;
    left: 1rem;
    height: 100%;
    position: absolute;
  }

  input[type='search']::-webkit-search-decoration,
  input[type='search']::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-results-button,
  input[type='search']::-webkit-search-results-decoration {
    display: none;
  }

  input {
    font-size: 1.1rem;
    border: none;
    /* box-sizing: border-box; */
    height: 100%;
    width: 100%;
    vertical-align: middle;
    /* height: 2rem; */
    padding: 0 3rem;
    padding-bottom: 0.1rem;
    /* border: 1px solid red; */
    border-radius: 100rem;
    outline: none;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    text-overflow: ellipsis;

    &:focus::placeholder {
      color: transparent;
    }

    &:focus::-ms-input-placeholder {
      color: transparent;
    }

    &.high-light::placeholder {
      color: black;
      opacity: 1; /* Firefox */
    }

    &::-ms-input-placeholder {
      /* Edge 12 -18 */
      color: black;
      opacity: 1;
    }
  }

  .close-button {
    font-size: 0.4rem;
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translate(0, -50%);
  }
`;

type Props = {
  value: string;
  onValChange: (value: string) => void;
  placeholderSpeacial?: string;
} & Omit<React.ComponentPropsWithRef<'input'>, 'type' | 'onChange'>;

const SearchInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onValChange, placeholderSpeacial, placeholder, ...rest }, ref) => {
    return (
      <Container>
        <BiSearch className="search-icon" />
        <input
          className={placeholderSpeacial ? 'high-light' : ''}
          ref={ref}
          type="search"
          placeholder={placeholderSpeacial ?? placeholder}
          value={value}
          onChange={(event) => {
            onValChange(event.target.value);
          }}
          {...rest}
        />
        {value.length > 0 && (
          <CloseButton
            type="button"
            onClick={() => {
              onValChange('');
            }}
          />
        )}
      </Container>
    );
  }
);

export default SearchInput;
