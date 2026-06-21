import { View, Text } from 'react-native';
import { BloodSugarType } from '../types';
import { getLevel } from '../utils/glucoseCalc';
import { COLORS } from '../constants/reference';

interface Props {
  value: number;
  type: BloodSugarType;
  timestamp: Date;
  note?: string;
  unit?: string;
}

const typeLabels: Record<BloodSugarType, string> = {
  fasting: '空腹 Fasting',
  before_meal: '餐前 Before Meal',
  after_meal: '餐后 After Meal',
  bedtime: '睡前 Bedtime',
  random: '随机 Random',
};

const colorMap: Record<string, string> = {
  low: COLORS.warning,
  normal: COLORS.success,
  high: COLORS.danger,
};

export default function BloodSugarCard({ value, type, timestamp, note, unit = 'mmol/L' }: Props) {
  const level = getLevel(value);
  const badgeColor = colorMap[level];
  const formattedTime = new Date(timestamp).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 5,
        borderLeftColor: badgeColor,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <View
          style={{
            backgroundColor: badgeColor + '20',
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: badgeColor }}>
            {typeLabels[type] || type}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={{ fontSize: 40, fontWeight: '800', color: badgeColor }}>
          {value.toFixed(1)}
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.muted, marginLeft: 6 }}>{unit}</Text>
      </View>

      <Text style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>{formattedTime}</Text>

      {note ? (
        <Text
          style={{
            fontSize: 13,
            color: COLORS.text,
            marginTop: 8,
            backgroundColor: COLORS.bg,
            padding: 8,
            borderRadius: 8,
          }}
        >
          {note}
        </Text>
      ) : null}
    </View>
  );
}
