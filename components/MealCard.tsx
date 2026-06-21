import { View, Text } from 'react-native';
import { MealType, FoodItem } from '../types';
import { COLORS, MEAL_CARB_RANGES } from '../constants/reference';

interface Props {
  type: MealType;
  foods: FoodItem[];
  totalCarbs: number;
  timestamp: Date;
  photo?: string;
  note?: string;
}

const mealConfig: Record<MealType, { label: string; color: string }> = {
  breakfast: { label: '\u65e9\u9910 Breakfast', color: '#F59E0B' },
  lunch: { label: '\u5348\u9910 Lunch', color: '#0EA5E9' },
  dinner: { label: '\u665a\u9910 Dinner', color: '#6366F1' },
  snack: { label: '\u52a0\u9910 Snack', color: '#22C55E' },
};

export default function MealCard({ type, foods, totalCarbs, timestamp, photo, note }: Props) {
  const config = mealConfig[type] || mealConfig.snack;
  const carbRange = MEAL_CARB_RANGES[type];
  const isHighCarb = carbRange && totalCarbs > carbRange.max;
  const formattedTime = new Date(timestamp).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  const displayFoods = foods.slice(0, 3);

  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 5,
        borderLeftColor: config.color,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <View
          style={{
            backgroundColor: config.color + '20',
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: config.color }}>
            {config.label}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: isHighCarb ? COLORS.danger + '20' : COLORS.success + '20',
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: isHighCarb ? COLORS.danger : COLORS.success }}>
            {totalCarbs}g
          </Text>
        </View>
      </View>

      {displayFoods.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          {displayFoods.map((food, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 4,
                borderBottomWidth: idx < displayFoods.length - 1 ? 1 : 0,
                borderBottomColor: COLORS.border,
              }}
            >
              <Text style={{ fontSize: 14, color: COLORS.text, flex: 1, marginRight: 8 }}>
                {food.name}
                {food.amount ? ' (' + food.amount + ')' : ''}
              </Text>
              <Text style={{ fontSize: 14, color: COLORS.muted }}>{food.carbs}g</Text>
            </View>
          ))}
          {foods.length > 3 && (
            <Text style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>
              +{foods.length - 3} more items
            </Text>
          )}
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, color: COLORS.muted }}>{formattedTime}</Text>
        {photo && (
          <View
            style={{
              width: 36,
              height: 36,
              backgroundColor: COLORS.bg,
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18 }}>{'\u{1F4F7}'}</Text>
          </View>
        )}
      </View>

      {note ? (
        <Text style={{ fontSize: 13, color: COLORS.text, marginTop: 8, backgroundColor: COLORS.bg, padding: 8, borderRadius: 8 }}>
          {note}
        </Text>
      ) : null}
    </View>
  );
}
