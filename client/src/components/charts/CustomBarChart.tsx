import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import styled from 'styled-components';
import { useMemo } from 'react';
import { Stats } from '../../features/owner/types/Stats';

const StyledCustomBarChart = styled.div`
  height: 400px;
`;

type Props = {
  stats: Stats;
  // y_axis_label: string;
  tool_tip_label: string;
  tickFormatter?: (value: any, index: number) => string;
};

const CustomBarChart: React.FC<Props> = ({
  stats,
  // y_axis_label,
  tool_tip_label,
  tickFormatter,
}) => {
  const data = useMemo(
    () => [
      { type: 'Min', val: stats.min },
      { type: 'Avg', val: stats.avg },
      { type: 'Max', val: stats.max },
    ],
    [stats]
  );
  return (
    <StyledCustomBarChart>
      <ResponsiveContainer>
        <BarChart width={150} height={40} data={data}>
          <XAxis dataKey="type" />
          <YAxis tickFormatter={tickFormatter} />
          <Tooltip />
          <Bar dataKey="val" name={tool_tip_label} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </StyledCustomBarChart>
  );
};

export default CustomBarChart;
