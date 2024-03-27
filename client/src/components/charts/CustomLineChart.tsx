import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  Label,
  YAxis,
  ReferenceLine,
  Line,
  Tooltip,
} from 'recharts';
import styled from 'styled-components';
import { Stats } from '../../features/owner/types/Stats';

const StyledCustomLineChart = styled.div`
  height: 400px;
`;

type Props = {
  data: {
    months: {
      month: string;
      property: number;
    }[];
    stats: Stats;
  };
  y_axis_label: string;
  tool_tip_label: string;
  tickFormatter?: (value: any, index: number) => string;
};

const CustomLineChart: React.FC<Props> = ({
  data,
  y_axis_label,
  tool_tip_label,
  tickFormatter,
}) => {
  return (
    <StyledCustomLineChart>
      <ResponsiveContainer>
        <LineChart
          width={500}
          height={300}
          data={data.months}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month">
            <Label value="Month" position="centerBottom" dy={10} />
          </XAxis>
          <YAxis tickFormatter={tickFormatter}>
            <Label
              value={y_axis_label}
              position="insideLeft"
              angle={-90}
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          {data.stats.max > 0 && (
            <ReferenceLine
              y={data.stats.max}
              strokeDasharray="5 5"
              label="Max"
              stroke="red"
            />
          )}
          {data.stats.avg > 0 && (
            <ReferenceLine
              y={data.stats.avg}
              strokeDasharray="5 5"
              label="Avg"
              stroke="red"
            />
          )}
          {data.stats.min > 0 && (
            <ReferenceLine
              y={data.stats.min}
              strokeDasharray="5 5"
              label="Min"
              stroke="red"
            />
          )}
          <Tooltip />
          <Line
            type="monotone"
            dataKey="property"
            name={tool_tip_label}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </StyledCustomLineChart>
  );
};

export default CustomLineChart;
