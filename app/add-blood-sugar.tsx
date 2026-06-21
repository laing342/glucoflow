import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useRecords } from '../stores/useRecords';
import { COLORS } from '../constants/reference';
import { getTypeLabel } from '../utils/glucoseCalc';

const MEASURE_TYPES = ['fasting', 'before_meal', 'after_meal', 'bedtime', 'random'] as const;

export default function AddBloodSugarScreen() {
  const router = useRouter();
  const { addBloodSugar } = useRecords();
  const [value, setValue] = useState('');
  const [type, setType] = useState('random');
  const [note, setNote] = useState('');

  const handleSave = () => {
    const numVal = parseFloat(value);
    if (isNaN(numVal) || numVal <= 0) return;
    addBloodSugar({ value: numVal, type: type as any, timestamp: new Date(), note: note || undefined });
    router.back();
  };

  const isValid = value.trim() !== '' && !isNaN(parseFloat(value)) && parseFloat(value) > 0;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 28 }}>X</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text }}>Record Blood Sugar</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ marginHorizontal: 20, marginTop: 20, backgroundColor: COLORS.card, borderRadius: 16, padding: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.muted, marginBottom: 12 }}>Blood Sugar (mmol/L)</Text>
          <TextInput style={{ fontSize: 48, fontWeight: '800', color: COLORS.text, borderBottomWidth: 2, borderBottomColor: COLORS.primary, paddingBottom: 4 }} placeholder="0.0" placeholderTextColor={COLORS.border} keyboardType="decimal-pad" value={value} onChangeText={setValue} autoFocus />
        </View>
        <View style={{ marginHorizontal: 20, marginTop: 20, backgroundColor: COLORS.card, borderRadius: 16, padding: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.muted, marginBottom: 12 }}>Measurement Type</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {MEASURE_TYPES.map((t) => (
              <TouchableOpacity key={t} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: type === t ? COLORS.primary : COLORS.bg }} onPress={() => setType(t)}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: type === t ? '#fff' : COLORS.text }}>{getTypeLabel(t)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ marginHorizontal: 20, marginTop: 20, backgroundColor: COLORS.card, borderRadius: 16, padding: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.muted, marginBottom: 12 }}>Note (optional)</Text>
          <TextInput style={{ fontSize: 16, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, minHeight: 80, textAlignVertical: 'top' }} placeholder="Add a note..." placeholderTextColor={COLORS.border} value={note} onChangeText={setNote} multiline />
        </View>
      </ScrollView>
      <View style={{ padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}>
        <TouchableOpacity style={{ backgroundColor: isValid ? COLORS.primary : COLORS.border, borderRadius: 14, paddingVertical: 16, alignItems: 'center' }} onPress={handleSave} disabled={!isValid}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: isValid ? '#fff' : COLORS.muted }}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}