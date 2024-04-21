import styled from 'styled-components';
import { compareAsc } from 'date-fns';
import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { MouseEventHandler, useEffect, useState } from 'react';
import { addDays, format } from 'date-fns';
import CloseButton from './buttons/CloseButton';
import { DATE_FORMAT_TEXT } from '../data/constants';
import {
  ScreenType,
  screenWidths,
  useScreen,
} from '../providers/ScreenProvider';
import classNames from 'classnames';

const StyledCustomDatePicker = styled.div`
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .dates {
    /* height: var(--height); */
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

    .date-fields {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      /* align-items: center; */
      border-radius: 1rem;
      cursor: pointer;
    }

    .check-in,
    .check-out {
      padding: 0.5rem 1rem;
      padding-right: 1rem;
      border: 1px solid rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.1rem;
      position: relative;

      &.selected {
        border: 1px solid black;
      }

      label {
        white-space: nowrap;
        font-size: 0.8rem;
        font-weight: bold;
      }

      input {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        box-sizing: border-box;
        width: 100%;
        font-size: 1rem;
        border: none;
        outline: none;
        cursor: inherit;
      }

      .close-button {
        font-size: 0.35rem;
        position: absolute;
        top: 50%;
        right: 0.1rem;
        transform: translate(0, -50%);
      }
    }

    .check-in {
      border-top-left-radius: 1rem;
      border-bottom-left-radius: 1rem;
    }

    .check-out {
      /* border-left: none; */
      border-top-right-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }
  }

  .day-picker-container {
    height: min-content;
    width: min-content;
    margin: auto;
    padding: 10px;
    position: absolute;
    /* top: var(--height); */
    top: 100%;
    /* bottom: 0; */
    left: 50%;
    z-index: 1;
    translate: -50%;
    background-color: white;
    border: 1px solid black;
    border-radius: 1rem;
    display: none;

    &.normal {
      display: block;
      position: static;
      translate: unset;
    }

    &.left {
      left: 100%;
      translate: -100%;
    }

    &.open {
      display: block;
    }

    .day-picker {
      height: min-content;
      padding: 0;
      margin: 0;
      /* display: initial; */
      /* width: 20rem; */
    }
  }

  .table {
    padding: 0;
    margin: 0;
    border: none;
    border-collapse: collapse;
    border-spacing: 0;
    margin: 0;
    padding: 0;

    & * {
      margin: 0;
      padding: 0;
    }
  }

  .head-cell {
    padding-top: 0.5rem;
    font-size: 1rem;
  }

  .day-cell {
    /* width: 100%; */
    margin: 0;
    margin-left: 0;
    margin-right: 0;
    padding: 0;
    padding-left: 0;
    padding-right: 0;
    border: none;
  }

  .day-box,
  .day-box.selected {
    /* height: 1.8rem; */
    /* aspect-ratio: 1; */
    /* height: 100%; */
    width: 2.3rem;
    aspect-ratio: 1;
    font-size: 1rem;
    margin: 0;
    margin-left: 0;
    margin-right: 0;
    padding: 0;
    padding-block: 0;
    padding-inline: 0;
    /* padding-left: 0;
    padding-right: 0; */
    box-sizing: border-box;
    /* background-color: blue; */
    border: none;
    outline: none;
    /* margin: 1%; */
    border-radius: 1000px;
  }

  .day-box.range-start:hover:not([disabled]),
  .day-box.range-end:hover:not([disabled]) {
    background-color: transparent;
  }

  .range-start,
  .range-middle,
  .range-end {
    /* height: 2.2rem; */
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    margin: 0;
    margin-left: 0;
    margin-right: 0;
    padding: 0;
    padding-left: 0;
    padding-right: 0;
    box-sizing: border-box;
    background-color: transparent;
    /* overflow: hidden; */
  }

  /* --background-range: #f7f7f7; */
  /* --background-range: #e5e4e2; */
  --background-range: #dcdcdc;
  /* --background-range: lightgray; */
  /* --background-range: red; */

  .range-start,
  .range-end {
    /* height: 3rem; */
    color: white;
    position: relative;
    overflow: visible;
    border-radius: 1000px;
    z-index: 0;
    /* background-color: blue; */

    &:hover {
      /* background-color: black; */
      cursor: default;
    }

    &::before {
      content: '';
      /* height: 2.5rem;
      width: 2.5rem; */
      height: 95%;
      width: 95%;
      border-radius: 1000px;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: -1;
      transform: translate(-50%, -50%);
      background-color: black;
    }

    &::after {
      content: '';
      /* height: 2.2rem;
      width: 2.2rem; */
      height: 95%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 50%;
      z-index: -1000;
      /* transform: translate(-50%, -50%); */
      background-color: var(--background-range);
    }
  }

  .selected {
    position: relative;
    &:hover {
      /* background-color: transparent; */
    }
  }

  .range-start.range-end {
    &::after {
      display: none;
    }
  }

  .range-start {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    &::after {
      left: 50%;
      transform: translate(-50%, -50%);
      border-top-left-radius: 1000px;
      border-bottom-left-radius: 1000px;
    }
  }

  .range-end {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    &::after {
      left: 50%;
      transform: translate(-50%, -50%);
      border-top-right-radius: 1000px;
      border-bottom-right-radius: 1000px;
    }
  }

  .range-middle {
    position: relative;
    overflow: visible;

    &::before {
      content: '';
      /* height: 2.2rem;
      width: 2.7rem; */
      height: 95%;
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: -1000;
      transform: translate(-50%, -50%);
      background-color: var(--background-range);
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    .day-picker-container {
      padding: 2px 15px;
    }
  }
`;

type SelectedFieldType = 'check-in' | 'check-out' | undefined;

type Props = {
  className?: string;
  initialDateRange?: DateRange;
  minStartDate: Date;
  maxStartDate?: Date;
  maxEndDate?: Date;
  maxRange?: number;
  disabledDates?: Date[];
  onSelectedFieldChange?: (field: SelectedFieldType) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  pickerPosition?: 'center' | 'left' | 'right' | 'normal';
  disabled?: boolean;
};

const CustomDatePicker: React.FC<Props> = ({
  initialDateRange,
  minStartDate,
  maxStartDate,
  maxEndDate,
  maxRange,
  disabledDates,
  onSelectedFieldChange,
  onDateRangeChange,
  className = 'custom-date-picker',
  pickerPosition = 'center',
  disabled,
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    () => initialDateRange
  );
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);
  const [selectedField, setSelectedField] = useState<SelectedFieldType>();
  const screen = useScreen();
  const normal = screen === ScreenType.PHONE;

  function closeDatePicker() {
    setIsOpenDatePicker(false);
    setSelectedField(undefined);
  }

  useEffect(() => {
    if (isOpenDatePicker) {
      document.addEventListener('click', closeDatePicker);
    } else {
      document.removeEventListener('click', closeDatePicker);
    }

    return () => document.removeEventListener('click', closeDatePicker);
  }, [isOpenDatePicker]);

  useEffect(() => {
    setDateRange(initialDateRange);
  }, [initialDateRange]);

  const openDatePicker: MouseEventHandler = (event) => {
    if (!normal) {
      event.stopPropagation();
      event.preventDefault();
      if (!isOpenDatePicker) {
        setIsOpenDatePicker(true);
      }
    }
  };

  useEffect(() => {
    if (normal) {
      setSelectedField('check-in');
    } else {
      setSelectedField(undefined);
    }
  }, [normal]);

  const fromDate =
    dateRange?.from && compareAsc(dateRange.from, minStartDate) >= 0
      ? dateRange.from
      : !selectedField || selectedField === 'check-in'
      ? minStartDate
      : dateRange?.from;

  const newMaxEndDate =
    maxEndDate ??
    (maxRange && dateRange && dateRange.from
      ? addDays(dateRange.from, maxRange)
      : undefined);

  const toDate =
    !selectedField || selectedField === 'check-in'
      ? maxStartDate
      : newMaxEndDate;

  const containerClasses = classNames(
    { disabled: disabled === true },
    className
  );

  const checkInClasses = classNames({
    'check-in': true,
    selected: selectedField === 'check-in',
  });

  const checkOutClasses = classNames({
    'check-out': true,
    selected: selectedField === 'check-out',
  });

  const dayPickerContainerClasses = classNames({
    'day-picker-container': true,
    open: isOpenDatePicker,
    [pickerPosition]: screen !== ScreenType.PHONE,
    normal,
  });

  return (
    <StyledCustomDatePicker className={containerClasses}>
      <div className="dates" onClick={openDatePicker}>
        <div className="date-fields">
          <div
            className={checkInClasses}
            onClickCapture={() => {
              if (selectedField !== 'check-in') {
                setSelectedField('check-in');
                onSelectedFieldChange?.('check-in');
              }
            }}
          >
            <label htmlFor="check-in">CHECK-IN</label>
            <input
              id="check-in"
              readOnly
              type="text"
              placeholder="Select date"
              value={
                dateRange && dateRange.from
                  ? format(dateRange.from, DATE_FORMAT_TEXT)
                  : ''
              }
            />
            {dateRange && dateRange.from && (
              <CloseButton
                type="button"
                onClickCapture={(event) => {
                  event.stopPropagation();
                  setDateRange(undefined);
                  onDateRangeChange(undefined);
                }}
              />
            )}
          </div>
          <div
            className={checkOutClasses}
            onClickCapture={() => {
              if (!dateRange || !dateRange.from) {
                if (selectedField !== 'check-in') {
                  setSelectedField('check-in');
                  onSelectedFieldChange?.('check-in');
                }
              } else {
                if (selectedField !== 'check-out') {
                  setSelectedField('check-out');
                  onSelectedFieldChange?.('check-out');
                }
              }
            }}
          >
            <label htmlFor="check-out">CHECK-OUT</label>
            <input
              id="check-out"
              readOnly
              type="text"
              placeholder="Select Date"
              value={
                dateRange && dateRange.to
                  ? format(dateRange.to, DATE_FORMAT_TEXT)
                  : ''
              }
            />
            {dateRange && dateRange.to && (
              <CloseButton
                type="button"
                onClickCapture={(event) => {
                  event.stopPropagation();
                  const newDateRange = {
                    from: dateRange.from,
                    to: undefined,
                  };
                  setDateRange(newDateRange);
                  onDateRangeChange(newDateRange);
                }}
              />
            )}
          </div>
        </div>
        <div className={dayPickerContainerClasses}>
          <DayPicker
            className="day-picker"
            mode="range"
            selected={dateRange}
            numberOfMonths={screen === ScreenType.PHONE ? 1 : 2}
            fromDate={fromDate}
            toDate={toDate}
            disabled={selectedField === 'check-in' ? disabledDates : undefined}
            styles={{
              caption_label: {
                fontSize: '1rem',
              },
            }}
            modifiersClassNames={{
              range_start: 'range-start',
              range_middle: 'range-middle',
              range_end: 'range-end',
              selected: 'selected',
            }}
            classNames={{
              table: 'table',
              day: 'day-box',
              head_cell: 'head-cell',
              cell: 'day-cell',
            }}
            onSelect={(date, selectedDay) => {
              if (
                !date ||
                (dateRange &&
                  dateRange.from &&
                  dateRange.from.toISOString() === selectedDay.toISOString())
              ) {
                return;
              }
              if (selectedField === 'check-in') {
                const newDateRange = { from: selectedDay, to: undefined };
                setDateRange(newDateRange);
                setSelectedField('check-out');
                onSelectedFieldChange?.('check-out');
                onDateRangeChange(newDateRange);
              } else if (selectedField === 'check-out') {
                const newDateRange = {
                  from: dateRange?.from,
                  to: selectedDay,
                };
                setIsOpenDatePicker(false);
                if (normal) {
                  setSelectedField('check-in');
                } else {
                  setSelectedField(undefined);
                }
                onSelectedFieldChange?.(undefined);
                onDateRangeChange(newDateRange);
                setDateRange(newDateRange);
              }
            }}
          />
        </div>
      </div>
    </StyledCustomDatePicker>
  );
};

export default CustomDatePicker;
