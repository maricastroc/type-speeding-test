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
          stroke="#717178"
          axisLine={false}
          tickLine={false}
          label={{
            value: 'Seconds',
            offset: -5,
            position: 'insideBottom',
            style: { fill: '#949497', fontSize: 11 },
          }}
        />

        <YAxis
          stroke="#949497"
          axisLine={false}
          tickLine={false}
          label={{
            value: 'Words per minute',
            angle: -90,
            position: 'insideLeft',
            style: { fill: '#949497', fontSize: 11 },
          }}
        />

        <Tooltip content={<CustomTooltip />} />

        <Line
          type="monotone"
          dataKey="raw"
          stroke="#4DD67B"
          strokeWidth={2}
          dot={false}
          name="Raw"
        />

        <Line
          type="monotone"
          dataKey="wpm"
          stroke="#4CA6FF"
          strokeWidth={2}
          dot={false}
          name="WPM"
        />

        <Line
          type="monotone"
          dataKey="burst"
          stroke="#949497"
          strokeDasharray="4 4"
          strokeWidth={2}
          dot={false}
          name="Burst"
        />

        <Scatter dataKey="errors" fill="#D64D5B" name="Errors" />
      </LineChart>
    </ResponsiveContainer>
  );
};
