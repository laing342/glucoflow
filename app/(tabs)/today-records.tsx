import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRecords } from '../../stores/useRecords';
import BloodSugarCard from '../../components/BloodSugarCard';
import MealCard from '../../components/MealCard';
import { COLORS } from '../../constants/reference';

type Tab = 'all' | 'blood' | 'meal';

export default function TodayRecordsScreen() {
  const { bloodSugarRecords, mealRecords, removeBloodSugar, removeMeal } = useRecords();
  const [tab, setTab] = useState<Tab>('all');

  const todayBlood = useMemo(() => bloodSugarRecords.filter((r) => {
    const d = new Date(r.timestamp); const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }), [bloodSugarRecords]);

  const todayMeals = useMemo(() => mealRecords.filter((r) => {
    const d = new Date(r.timestamp); const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }), [mealRecords]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: '全部 (' + (todayBlood.length + todayMeals.length) + ')' },
    { key: 'blood', label: '血糖 (' + todayBlood.length + ')' },
    { key: 'meal', label: '饮食 (' + todayMeals.length + ')' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: COLORS.text }}>今日记录</Text>
        <Text style={{ fontSize: 14, color: COLORS.muted, marginTop: 4 }}>今天的血糖和饮食记录</Text>
      </View>
      <View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 12, gap: 8 }}>
        {tabs.map((t) => (
          <TouchableOpacity key={t.key} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: tab === t.key ? COLORS.primary : COLORS.card }} onPress={() => setTab(t.key)}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: tab === t.key ? '#fff' : COLORS.text }}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={{ flex: 1, marginTop: 16 }} showsVerticalScrollIndicator={false}>
        {(tab === 'all' || tab === 'blood') && todayBlood.length > 0 && (
          <View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginHorizontal: 20, marginBottom: 12 }}>血糖记录</Text>
            {todayBlood.map((r) => (
              <TouchableOpacity key={r.id} onLongPress={() => removeBloodSugar(r.id)}>
                <BloodSugarCard value={r.value} type={r.type} timestamp={r.timestamp} note={r.note} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        {(tab === 'all' || tab === 'meal') && todayMeals.length > 0 && (
          <View style={{ marginTop: tab === 'all' && todayBlood.length > 0 ? 8 : 0 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginHorizontal: 20, marginBottom: 12 }}>饮食记录</Text>
            {todayMeals.map((r) => (
              <TouchableOpacity key={r.id} onLongPress={() => removeMeal(r.id)}>
                <MealCard type={r.type} foods={r.foods} totalCarbs={r.totalCarbs} timestamp={r.timestamp} note={r.note} photo={r.photo} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        {(tab === 'blood' && todayBlood.length === 0) && (
          <View style={{ alignItems: 'center', paddingVertical: 80 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>{String.fromCodePoint(0x1FA7A)}</Text>
            <Text style={{ fontSize: 16, color: COLORS.muted }}>今天无血糖记录</Text>
          </View>
        )}
        {(tab === 'meal' && todayMeals.length === 0) && (
          <View style={{ alignItems: 'center', paddingVertical: 80 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>{String.fromCodePoint(0x1F37D)}</Text>
            <Text style={{ fontSize: 16, color: COLORS.muted }}>今天无饮食记录</Text>
          </View>
        )}
        {(tab === 'all' && todayBlood.length === 0 && todayMeals.length === 0) && (
          <View style={{ alignItems: 'center', paddingVertical: 80 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>{String.fromCodePoint(0x1F4DD)}</Text>
            <Text style={{ fontSize: 16, color: COLORS.muted }}>今天还没有记录</Text>
            <Text style={{ fontSize: 14, color: COLORS.muted, marginTop: 8 }}>长按记录可删除</Text>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}