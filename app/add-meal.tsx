import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useRecords } from '../stores/useRecords';
import { COLORS } from '../constants/reference';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const mealLabels: Record<string, string> = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' };

export default function AddMealScreen() {
  const router = useRouter();
  const { addMeal } = useRecords();
  const [type, setType] = useState('breakfast');
  const [foodName, setFoodName] = useState('');
  const [carbs, setCarbs] = useState('');
  const [foods, setFoods] = useState<{ name: string; carbs: number }[]>([]);
  const [note, setNote] = useState('');

  const addFood = () => {
    if (!foodName.trim() || !carbs) return;
    setFoods([...foods, { name: foodName.trim(), carbs: parseFloat(carbs) }]);
    setFoodName('');
    setCarbs('');
  };

  const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0);

  const handleSave = () => {
    if (foods.length === 0) return;
    addMeal({ type: type as any, foods, totalCarbs, timestamp: new Date(), note: note || undefined });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}><Text style={{ fontSize: 28 }}>X</Text></TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text }}>Record Meal</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ marginHorizontal: 20, marginTop: 20, backgroundColor: COLORS.card, borderRadius: 16, padding: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.muted, marginBottom: 12 }}>Meal Type</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {MEAL_TYPES.map((t) => (
              <TouchableOpacity key={t} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: type === t ? COLORS.primary : COLORS.bg }} onPress={() => setType(t)}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: type === t ? '#fff' : COLORS.text }}>{mealLabels[t]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ marginHorizontal: 20, marginTop: 20, backgroundColor: COLORS.card, borderRadius: 16, padding: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.muted, marginBottom: 12 }}>Add Food</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <TextInput style={{ flex: 2, fontSize: 16, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12 }} placeholder="Food name" placeholderTextColor={COLORS.border} value={foodName} onChangeText={setFoodName} />
            <TextInput style={{ flex: 1, fontSize: 16, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12 }} placeholder="Carbs (g)" placeholderTextColor={COLORS.border} keyboardType="decimal-pad" value={carbs} onChangeText={setCarbs} />
            <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center' }} onPress={addFood}>
              <Text style={{ fontSize: 20, color: '#fff' }}>+</Text>
            </TouchableOpacity>
          </View>
          {foods.map((f, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
              <Text style={{ fontSize: 14, color: COLORS.text }}>{f.name}</Text>
              <Text style={{ fontSize: 14, color: COLORS.muted }}>{f.carbs}g</Text>
            </View>
          ))}
        </View>

        <View style={{ marginHorizontal: 20, marginTop: 20, backgroundColor: COLORS.card, borderRadius: 16, padding: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.muted, marginBottom: 12 }}>Note (optional)</Text>
          <TextInput style={{ fontSize: 16, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, minHeight: 80, textAlignVertical: 'top' }} placeholder="Add a note..." placeholderTextColor={COLORS.border} value={note} onChangeText={setNote} multiline />
        </View>
      </ScrollView>

      <View style={{ padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}>
        <TouchableOpacity style={{ backgroundColor: foods.length > 0 ? COLORS.primary : COLORS.border, borderRadius: 14, paddingVertical: 16, alignItems: 'center' }} onPress={handleSave} disabled={foods.length === 0}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: foods.length > 0 ? '#fff' : COLORS.muted }}>Save ({totalCarbs.toFixed(0)}g carbs)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}