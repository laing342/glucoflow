import { View, Text } from 'react-native';
import Svg, { Path, Circle, Line, Rect, Text as SvgText, G } from 'react-native-svg';
import { COLORS } from '../constants/reference';

interface DataPoint {
  date: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  width?: number;
  height?: number;
  targetMin?: number;
  targetMax?: number;
}

export default function TrendChart({
  data,
  width = 340,
  height = 200,
  targetMin = 3.9,
  targetMax = 10.0,
}: Props) {
  if (data.length === 0) {
    return (
      <View
        style={{
          width,
          height,
          backgroundColor: COLORS.card,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 14, color: COLORS.muted }}>No data to display</Text>
      </View>
    );
  }

  const padding = { top: 20, bottom: 30, left: 40, right: 20 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const values = data.map(function (d) { return d.value; });
  const minVal = Math.min.apply(null, values.concat([targetMin - 1]));
  const maxVal = Math.max.apply(null, values.concat([targetMax + 2]));
  const valRange = maxVal - minVal || 1;

  const yLabels = 5;
  const yLabelStep = valRange / (yLabels - 1);

  const xLabels = Math.min(data.length, 7);
  const xStep = Math.max(1, Math.floor(data.length / xLabels));

  function xScale(i: number) {
    return padding.left + (i / Math.max(data.length - 1, 1)) * chartW;
  }

  function yScale(v: number) {
    return padding.top + chartH - ((v - minVal) / valRange) * chartH;
  }

  const targetYMin = yScale(targetMin);
  const targetYMax = yScale(targetMax);

  const pathD = data
    .map(function (d, i) {
      const x = xScale(i);
      const y = yScale(d.value);
      return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
    })
    .join(' ');

  return (
    <View
      style={{
        width,
        height,
        backgroundColor: COLORS.card,
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <Svg width={width} height={height}>
        {}
        <Rect
          x={padding.left}
          y={targetYMax}
          width={chartW}
          height={targetYMin - targetYMax}
          fill={COLORS.success + '20'}
        />
        {}
        <Line
          x1={padding.left}
          y1={targetYMax}
          x2={padding.left + chartW}
          y2={targetYMax}
          stroke={COLORS.success}
          strokeWidth={1}
          strokeDasharray="4,4"
        />
        <Line
          x1={padding.left}
          y1={targetYMin}
          x2={padding.left + chartW}
          y2={targetYMin}
          stroke={COLORS.success}
          strokeWidth={1}
          strokeDasharray="4,4"
        />
        {}
        <Path d={pathD} fill="none" stroke={COLORS.primary} strokeWidth={2} strokeLinejoin="round" />
        {}
        {data.map(function (d, i) {
          const x = xScale(i);
          const y = yScale(d.value);
          const color =
            d.value < targetMin
              ? COLORS.warning
              : d.value > targetMax
              ? COLORS.danger
              : COLORS.success;
          return (
            <Circle key={i} cx={x} cy={y} r={4} fill={color} stroke="#fff" strokeWidth={2} />
          );
        })}
        {}
        {Array.from({ length: yLabels }).map(function (_, i) {
          const val = minVal + i * yLabelStep;
          const y = yScale(val);
          return (
            <G key={'y' + i}>
              <Line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartW}
                y2={y}
                stroke={COLORS.border}
                strokeWidth={0.5}
              />
              <SvgText
                x={padding.left - 6}
                y={y + 4}
                fontSize={10}
                fill={COLORS.muted}
                textAnchor="end"
              >
                {val.toFixed(1)}
              </SvgText>
            </G>
          );
        })}
        {}
        {Array.from({ length: data.length }).map(function (_, i) {
          if (i % xStep !== 0 && i !== data.length - 1) return null;
          const x = xScale(i);
          const dateStr = data[i].date;
          const label = dateStr.length > 5 ? dateStr.slice(5) : dateStr;
          return (
            <SvgText
              key={'x' + i}
              x={x}
              y={height - 6}
              fontSize={9}
              fill={COLORS.muted}
              textAnchor="middle"
            >
              {label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}
