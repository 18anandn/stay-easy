import { Stats } from './Stats';

export type CustomeLineChartProps = {
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
