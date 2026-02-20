import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Scatter,
} from 'recharts';
import { useMemo } from 'react';
import { CustomTooltip } from './CustomTooltip';
import { smoothData } from '@/utils/smoothData';

type ChartPoint = {
  second: number;
  wpm: number;
  raw: number;
  burst: number;
  errors: number | null;
  errorCount: number;
};

export const ResultChart = ({ data }: { data: ChartPoint[] }) => {
  const smoothed = useMemo(() => smoothData(data, 4), [data]);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={smoothed}>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />

        <XAxis
          dataKey="second"
          stroke="#52525b"
          axisLine={false}
          tickLine={false}
        />

        <YAxis stroke="#52525b" axisLine={false} tickLine={false} />

        <Tooltip content={<CustomTooltip />} />

        {/* RAW */}
        <Line
          type="monotone"
          dataKey="raw"
          stroke="#4ade80"
          strokeWidth={2}
          dot={false}
          name="Raw"
        />

        {/* WPM */}
        <Line
          type="monotone"
          dataKey="wpm"
          stroke="#60a5fa"
          strokeWidth={2}
          dot={false}
          name="WPM"
        />

        {/* Burst */}
        <Line
          type="monotone"
          dataKey="burst"
          stroke="#a1a1aa"
          strokeDasharray="4 4"
          strokeWidth={2}
          dot={false}
          name="Burst"
        />

        {/* Errors */}
        <Scatter dataKey="errors" fill="#ef4444" name="Errors" />
      </LineChart>
    </ResponsiveContainer>
  );
};
