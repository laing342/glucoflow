import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRecords } from '../../stores/useRecords';
import TrendChart from '../../components/TrendChart';
import { COLORS } from '../../constants/reference';
import { getLevel, formatTime } from '../../utils/glucoseCalc';

const FILTERS = ['7天', '14天', '30天', '90天'] as const;
const PERIOD_DAYS: Record<string, number> = { '7天': 7, '14天': 14, '30天': 30, '90天': 90 };

export default function TrendsScreen() {
  const { bloodSugarRecords } = useRecords();
  const [filter, setFilter] = useState('7天');

  const filteredData = useMemo(() => {
    const cutoff = Date.now() - PERIOD_DAYS[filter] * 86400000;
    return bloodSugarRecords
      .filter((r) => new Date(r.timestamp).getTime() > cutoff)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [bloodSugarRecords, filter]);

  const chartData = useMemo(() => {
    return filteredData.map((r) => ({ date: formatTime(r.timestamp), value: r.value }));
  }, [filteredData]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) return { avg: 0, min: 0, max: 0, normal: 0, total: 0 };
    const values = filteredData.map((r) => r.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return { avg: parseFloat(avg.toFixed(1)), min: Math.min(...values), max: Math.max(...values), normal: values.filter((v) => getLevel(v) === 'normal').length, total: values.length };
  }, [filteredData]);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.min(screenWidth - 40, 400);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: COLORS.text }}>趋势分析</Text>
        <Text style={{ fontSize: 14, color: COLORS.muted, marginTop: 4 }}>血糖波动趋势</Text>
      </View>
      <View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 12, gap: 8 }}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: filter === f ? COLORS.primary : COLORS.card }} onPress={() => setFilter(f)}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: filter === f ? '#fff' : COLORS.text }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginHorizontal: 20, marginTop: 16, alignItems: 'center' }}>
          <TrendChart data={chartData} width={chartWidth} height={220} />
        </View>
        {filteredData.length > 0 && (
          <View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 16, gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 14, alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: COLORS.muted }}>平均值</Text><Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.primary, marginTop: 4 }}>{stats.avg}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 14, alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: COLORS.muted }}>最低值</Text><Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.warning, marginTop: 4 }}>{stats.min}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 14, alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: COLORS.muted }}>最高值</Text><Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.danger, marginTop: 4 }}>{stats.max}</Text>
            </View>
          </View>
        )}
        <View style={{ marginHorizontal: 20, marginTop: 16, backgroundColor: COLORS.card, borderRadius: 16, padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 }}>统计数据</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
            <Text style={{ fontSize: 14, color: COLORS.muted }}>总记录数</Text><Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{stats.total}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
            <Text style={{ fontSize: 14, color: COLORS.muted }}>达标次数</Text><Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.success }}>{stats.normal} ({stats.total > 0 ? Math.round(stats.normal / stats.total * 100) : 0}%)</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
            <Text style={{ fontSize: 14, color: COLORS.muted }}>时间范围</Text><Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>近 {PERIOD_DAYS[filter]} 天</Text>
          </View>
        </View>
        {filteredData.length > 0 && (
          <View style={{ marginHorizontal: 20, marginTop: 16, marginBottom: 32 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 }}>记录列表</Text>
            {filteredData.map((r) => {
              const lvl = getLevel(r.value);
              const dotColor = lvl === 'normal' ? COLORS.success : lvl === 'low' ? COLORS.warning : COLORS.danger;
              return (
                <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, padding: 12, borderRadius: 10, marginBottom: 8 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: dotColor, marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text }}>{r.value.toFixed(1)} mmol/L</Text>
                    <Text style={{ fontSize: 12, color: COLORS.muted }}>{formatTime(r.timestamp)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
        {filteredData.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>{String.fromCodePoint(0x1F4CA)}</Text>
            <Text style={{ fontSize: 16, color: COLORS.muted }}>该时间段无数据</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}