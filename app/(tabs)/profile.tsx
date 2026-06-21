import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useUserSettings } from '../../stores/useUserSettings';
import { COLORS } from '../../constants/reference';

export default function ProfileScreen() {
  const { userName, setUserName, targetMin, targetMax, setTargetMin, setTargetMax, clearAll } = useUserSettings();
  const [name, setName] = useState(userName);

  const handleClearAll = () => {
    Alert.alert('清除数据', '这将删除所有记录，确定吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => { clearAll(); Alert.alert('已完成', '所有数据已清除'); } },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: COLORS.text }}>设置</Text>
        <Text style={{ fontSize: 14, color: COLORS.muted, marginTop: 4 }}>个人信息和应用配置</Text>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginHorizontal: 20, marginTop: 20, backgroundColor: COLORS.card, borderRadius: 16, padding: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 16 }}>个人资料</Text>
          <Text style={{ fontSize: 13, color: COLORS.muted, marginBottom: 6 }}>姓名</Text>
          <TextInput style={{ fontSize: 16, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12 }} value={name} onChangeText={setName} onBlur={() => setUserName(name)} placeholder="请输入姓名" placeholderTextColor={COLORS.border} />
        </View>
        <View style={{ marginHorizontal: 20, marginTop: 20, backgroundColor: COLORS.card, borderRadius: 16, padding: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 16 }}>血糖目标范围</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, color: COLORS.muted, marginBottom: 6 }}>最低值 (mmol/L)</Text>
              <TextInput style={{ fontSize: 16, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12 }} keyboardType="decimal-pad" value={String(targetMin)} onChangeText={(v) => { const n = parseFloat(v); if (!isNaN(n)) setTargetMin(n); }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, color: COLORS.muted, marginBottom: 6 }}>最高值 (mmol/L)</Text>
              <TextInput style={{ fontSize: 16, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12 }} keyboardType="decimal-pad" value={String(targetMax)} onChangeText={(v) => { const n = parseFloat(v); if (!isNaN(n)) setTargetMax(n); }} />
            </View>
          </View>
        </View>
        <View style={{ marginHorizontal: 20, marginTop: 20, backgroundColor: COLORS.card, borderRadius: 16, padding: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 }}>关于</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
            <Text style={{ fontSize: 14, color: COLORS.muted }}>版本</Text><Text style={{ fontSize: 14, color: COLORS.text }}>1.0.0</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
            <Text style={{ fontSize: 14, color: COLORS.muted }}>平台</Text><Text style={{ fontSize: 14, color: COLORS.text }}>{Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'macos' ? 'macOS' : 'Windows'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
            <Text style={{ fontSize: 14, color: COLORS.muted }}>数据存储</Text><Text style={{ fontSize: 14, color: COLORS.text }}>本地存储</Text>
          </View>
        </View>
        <TouchableOpacity style={{ marginHorizontal: 20, marginTop: 24, backgroundColor: COLORS.danger + '15', borderRadius: 14, paddingVertical: 14, alignItems: 'center' }} onPress={handleClearAll}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.danger }}>清除所有数据</Text>
        </TouchableOpacity>
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}