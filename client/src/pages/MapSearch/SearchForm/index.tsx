import styled from 'styled-components';
import { screenWidths } from '../../../providers/ScreenProvider';
import FormModalOnPhone from './FormModalOnPhone';
import SearchFormProvider from './SearchFormProvider';
import SearchInputField from './SearchInputField';
import SubmitButton from './SubmitButton';
import Filters from './Filters';
import DateRangeField from './DateRangeField';

const StyledForm = styled.div`
  height: 100%;
  display: flex;
  gap: 20px;
  align-items: center;

  .custom-search-input {
    max-width: 23ch;
    font-size: 1rem;
  }

  .custom-date-picker {
    max-width: 17rem;
  }

  @media (max-width: ${screenWidths.phone}px) {
    /* height: min-content; */
    min-width: min-content;
    padding: 20px;
    border-radius: 10px;
    flex-direction: column;
    align-items: start;
    background-color: white;
    border-radius: 20px;

    .custom-button {
      margin: auto;
    }

    .custom-date-picker {
      max-width: 19rem;
    }
  }
`;

const SearchForm: React.FC = () => {
  return (
    <SearchFormProvider>
      <FormModalOnPhone>
        <StyledForm>
          <SearchInputField />
          <DateRangeField />
          <SubmitButton />
        </StyledForm>
      </FormModalOnPhone>
      <Filters />
    </SearchFormProvider>
  );
};

export default SearchForm;
