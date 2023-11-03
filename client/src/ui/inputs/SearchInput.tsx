import styled from 'styled-components';
import { BiSearch } from 'react-icons/bi';
import { forwardRef } from 'react';

const Container = styled.div`
  height: 100%;
  width: 100%;
  /* border: 1px solid blue; */
  /* height: 100%; */
  /* flex-grow: 1; */
  position: relative;
  display: flex;

  .search-icon {
    left: 0.5rem;
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
    border: none;
    /* box-sizing: border-box; */
    height: 100%;
    width: 100%;
    vertical-align: middle;
    /* height: 2rem; */
    padding: 0 2rem;
    padding-bottom: 0.1rem;
    /* border: 1px solid red; */
    border-radius: 100rem;
    outline: none;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
`;

const SearchInput: React.FC<Omit<React.ComponentPropsWithRef<'input'>, 'type'>> =
  forwardRef((props, ref) => {
    return (
      <Container>
        <BiSearch className="search-icon" />
        <input ref={ref} type="search" {...props} />
      </Container>
    );
  });

export default SearchInput;
