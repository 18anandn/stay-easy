import CustomBarChart from '../../../features/owner/components/CustomBarChart';
import CustomLineChart from '../../../features/owner/components/CustomLineChart';
import { amountFormat } from '../../../utils/amountFormatter';
import { useMemo } from 'react';
import { DATE_FORMAT_MONTH_SHORT } from '../../../data/constants';
import { parseISO, format } from 'date-fns';
import { AnalyticsData } from '../../../features/owner/types/AnalyticsData';
import styled from 'styled-components';
import { screenWidths } from '../../../providers/ScreenProvider';

const tickFormatter = {
  occupancy: (val: number) => {
    if (val === 0) return '0';
    return `${val}d`;
  },
  revenue: (val: number) => {
    if (val === 0) return '0';
    return amountFormat(val);
  },
};

const StyledCharts = styled.div`
  .chart-list {
    margin-top: 1rem;
  }

  .by-month {
    .line-charts {
      display: flex;
      flex-direction: column;
      gap: 2rem;

      .chart {
        h3 {
          margin-bottom: 1rem;
        }
      }
    }
  }

  .by-booking {
    .bar-charts {
      list-style-type: none;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 3%;

      h3 {
        text-align: center;
      }
    }
  }

  @media (max-width: ${screenWidths.phone}px) {
    .by-booking {
      .bar-charts {
        display: block;
      }
    }
  }
`;

type Props = {
  data: AnalyticsData | undefined;
};

const Charts: React.FC<Props> = ({ data }) => {
  const revenue = useMemo(() => {
    if (!data) return undefined;
    return {
      by_month: {
        months: data.month_data.map((val) => ({
          month: format(parseISO(val.month), DATE_FORMAT_MONTH_SHORT),
          property: val.revenue,
        })),
        stats: data.by_month_stats.revenue,
      },
      by_booking: data.by_booking_stats.revenue,
    };
  }, [data]);

  const occupancy = useMemo(() => {
    if (!data) return undefined;
    return {
      by_month: {
        months: data.month_data.map((val) => ({
          month: format(parseISO(val.month), DATE_FORMAT_MONTH_SHORT),
          property: val.occupancy,
        })),
        stats: data.by_month_stats.occupancy,
      },
      by_booking: data.by_booking_stats.occupancy,
    };
  }, [data]);

  const guests = useMemo(() => {
    if (!data) return undefined;
    return {
      by_month: {
        months: data.month_data.map((val) => ({
          month: format(parseISO(val.month), DATE_FORMAT_MONTH_SHORT),
          property: val.guests,
        })),
        stats: data.by_month_stats.guests,
      },
      by_booking: data.by_booking_stats.guests,
    };
  }, [data]);

  if (!data || !occupancy || !revenue || !guests) {
    return null;
  }

  return (
    <StyledCharts>
      <div className="by-month">
        {data.number_of_cabins > 1 && (
          <p className="note">
            The following data is summing up all the cabins.
          </p>
        )}
        <h2>Statistics by month</h2>
        <ul className="chart-list line-charts">
          <li className="chart revenue">
            <h3>Revenue</h3>
            <CustomLineChart
              data={revenue.by_month}
              y_axis_label="Revenue (&#8377;)"
              tool_tip_label="Revenue (&#8377;)"
              tickFormatter={tickFormatter.revenue}
            />
          </li>
          <li className="chart occupancy">
            <h3>Occupancy</h3>
            <CustomLineChart
              data={occupancy.by_month}
              y_axis_label="Days Occupied"
              tool_tip_label="Occupied days"
              tickFormatter={tickFormatter.occupancy}
            />
          </li>
          <li className="chart guests">
            <h3>Guests</h3>
            <CustomLineChart
              data={guests.by_month}
              y_axis_label="Guests"
              tool_tip_label="Guests"
            />
          </li>
        </ul>
      </div>
      <div className="by-booking">
        <h2>Statistics by booking</h2>
        <ul className="chart-list bar-charts">
          <li>
            <CustomBarChart
              stats={revenue.by_booking}
              tickFormatter={tickFormatter.revenue}
              tool_tip_label="Revenue (&#8377;)"
            />
            <h3>Revenue</h3>
          </li>
          <li>
            <CustomBarChart
              stats={occupancy.by_booking}
              tickFormatter={tickFormatter.occupancy}
              tool_tip_label="Occupancy"
            />
            <h3>Occupancy</h3>
          </li>
          <li>
            <CustomBarChart stats={guests.by_booking} tool_tip_label="Guests" />
            <h3>Guests</h3>
          </li>
        </ul>
      </div>
    </StyledCharts>
  );
};

export default Charts;
