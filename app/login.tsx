import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/reference';

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'phone' | 'wechat'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState(false);

  const handleSendCode = () => {
    if (phone.length < 11) { Alert.alert('提示', '请输入11位手机号'); return; }
    setSentCode(true);
    Alert.alert('验证码已发送', '演示模式：验证码 123456', [{ text: '好的', onPress: () => setCode('123456') }]);
  };

  const handleLogin = () => {
    if (mode === 'phone' && (!sentCode || code.length < 6)) { Alert.alert('请输入验证码'); return; }
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 80, paddingBottom: 40, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, alignItems: 'center' }}>
        <Text style={{ fontSize: 52, marginBottom: 12 }}>{String.fromCodePoint(0x1FA7A)}</Text>
        <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff' }}>GlucoFlow</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>智能血糖管理平台</Text>
      </View>
      <View style={{ marginHorizontal: 24, marginTop: -20, backgroundColor: COLORS.card, borderRadius: 20, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 }}>
        <View style={{ flexDirection: 'row', backgroundColor: COLORS.bg, borderRadius: 12, padding: 4, marginBottom: 24 }}>
          <TouchableOpacity style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: mode === 'phone' ? COLORS.primary : 'transparent', alignItems: 'center' }} onPress={() => setMode('phone')}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: mode === 'phone' ? '#fff' : COLORS.muted }}>手机号登录</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: mode === 'wechat' ? '#07C160' : 'transparent', alignItems: 'center' }} onPress={() => setMode('wechat')}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: mode === 'wechat' ? '#fff' : COLORS.muted }}>微信登录</Text>
          </TouchableOpacity>
        </View>
        {mode === 'phone' ? (
          <>
            <Text style={{ fontSize: 13, color: COLORS.muted, fontWeight: '500', marginBottom: 8 }}>手机号码</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: COLORS.text, marginRight: 6 }}>+86</Text>
              <TextInput style={{ flex: 1, fontSize: 16, color: COLORS.text, paddingVertical: 14 }} placeholder="请输入手机号" placeholderTextColor={COLORS.border} keyboardType="phone-pad" maxLength={11} value={phone} onChangeText={setPhone} />
            </View>
            <Text style={{ fontSize: 13, color: COLORS.muted, fontWeight: '500', marginBottom: 8 }}>验证码</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
              <TextInput style={{ flex: 1, fontSize: 16, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14 }} placeholder="请输入验证码" placeholderTextColor={COLORS.border} keyboardType="number-pad" maxLength={6} value={code} onChangeText={setCode} />
              <TouchableOpacity style={{ backgroundColor: sentCode ? COLORS.border : COLORS.primary, borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center' }} onPress={handleSendCode} disabled={sentCode}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: sentCode ? COLORS.muted : '#fff' }}>{sentCode ? '已发送' : '获取验证码'}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', opacity: (phone.length >= 11 && code.length >= 6) ? 1 : 0.5 }} onPress={handleLogin} disabled={!(phone.length >= 11 && code.length >= 6)}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>登录</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#07C160', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 36 }}>{String.fromCodePoint(0x1F4AC)}</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>微信快速登录</Text>
            <Text style={{ fontSize: 13, color: COLORS.muted, textAlign: 'center', marginBottom: 24, paddingHorizontal: 20 }}>点击下方按钮，微信一键登录</Text>
            <TouchableOpacity style={{ backgroundColor: '#07C160', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 48, alignItems: 'center', flexDirection: 'row', gap: 8 }} onPress={handleLogin}>
              <Text style={{ fontSize: 18 }}>{String.fromCodePoint(0x1F4AC)}</Text>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>微信登录</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 12, color: COLORS.muted, marginTop: 16, textAlign: 'center' }}>登录即表示同意服务条款和隐私政策</Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40 }}>
        <Text style={{ fontSize: 12, color: COLORS.muted }}>v1.0.0 - GlucoFlow</Text>
      </View>
    </View>
  );
}