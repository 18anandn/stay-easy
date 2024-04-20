import { Stats } from './Stats';

export type CustomBarChartProps = {
  stats: Stats;
  tool_tip_label: string;
  tickFormatter?: (value: any, index: number) => string;
};
