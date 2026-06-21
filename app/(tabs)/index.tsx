import { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useRecords } from "../../stores/useRecords";
import { getLevel } from "../../utils/glucoseCalc";
import BloodSugarCard from "../../components/BloodSugarCard";
import { COLORS } from "../../constants/reference";

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return y + "-" + m + "-" + d;
}
function isToday(d: Date): boolean {
  const now = new Date();
  const date = new Date(d);
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { bloodSugarRecords, mealRecords } = useRecords();
  const [showSheet, setShowSheet] = useState(false);

  const latest = bloodSugarRecords[0];
  const todayBlood = useMemo(
    () => bloodSugarRecords.filter((r: any) => isToday(r.timestamp)),
    [bloodSugarRecords]
  );
  const todayMeals = useMemo(
    () => mealRecords.filter((r: any) => isToday(r.timestamp)),
    [mealRecords]
  );
  const todayNormal = todayBlood.filter(
    (r: any) => getLevel(r.value) === "normal"
  );
  const compliance =
    todayBlood.length > 0
      ? Math.round((todayNormal.length / todayBlood.length) * 100)
      : 0;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 8,
          }}
        >
          <Text
            style={{ fontSize: 28, fontWeight: "700", color: COLORS.text }}
          >
            GlucoFlow
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.muted,
              marginTop: 4,
            }}
          >
            {formatDate(new Date())}
          </Text>
        </View>

        {latest && (
          <BloodSugarCard
            value={latest.value}
            type={latest.type}
            timestamp={latest.timestamp}
          />
        )}
        {!latest && (
          <View
            style={{
              alignItems: "center",
              paddingVertical: 60,
              marginHorizontal: 16,
              backgroundColor: COLORS.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
              borderStyle: "dashed",
            }}
          >
            <Text
              style={{
                fontSize: 48,
                marginBottom: 12,
              }}
            >
              💉
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: "#64748B",
                fontWeight: "600",
              }}
            >
              暂无记录
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.muted,
                marginTop: 8,
                textAlign: "center",
                paddingHorizontal: 32,
              }}
            >
              点击下方 + 按钮添加第一条血糖记录
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            marginTop: 20,
            gap: 12,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.card,
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: COLORS.muted,
                fontWeight: "500",
              }}
            >
              今日测量
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: COLORS.primary,
                marginTop: 4,
              }}
            >
              {todayBlood.length}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.muted,
                marginTop: 2,
              }}
            >
              次
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.card,
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: COLORS.muted,
                fontWeight: "500",
              }}
            >
              达标率
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: compliance >= 70 ? COLORS.success : COLORS.warning,
                marginTop: 4,
              }}
            >
              {compliance}%
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.muted,
                marginTop: 2,
              }}
            >
              {todayNormal.length}/{todayBlood.length}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.card,
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: COLORS.muted,
                fontWeight: "500",
              }}
            >
              今日饮食
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: COLORS.secondary,
                marginTop: 4,
              }}
            >
              {todayMeals.length}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.muted,
                marginTop: 2,
              }}
            >
              餐
            </Text>
          </View>
        </View>

        {todayBlood.length > 0 && (
          <View style={{ marginTop: 24, marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.text,
                marginHorizontal: 20,
                marginBottom: 12,
              }}
            >
              今日记录
            </Text>
            {todayBlood.slice(0, 3).map((r: any) => (
              <BloodSugarCard
                key={r.id}
                value={r.value}
                type={r.type}
                timestamp={r.timestamp}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 32,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: COLORS.primary,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: COLORS.primary,
          shadowOpacity: 0.4,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        }}
        onPress={() => setShowSheet(true)}
      >
        <Text style={{ fontSize: 32, color: "#fff", lineHeight: 34 }}>
          +
        </Text>
      </TouchableOpacity>

      <Modal visible={showSheet} transparent animationType="slide">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          onPress={() => setShowSheet(false)}
        >
          <View
            style={{
              marginTop: "auto",
              backgroundColor: COLORS.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 40,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: COLORS.text,
                marginBottom: 20,
              }}
            >
              快速添加
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
              }}
              onPress={() => {
                setShowSheet(false);
                router.push("/add-blood-sugar");
              }}
            >
              <Text style={{ fontSize: 28, marginRight: 16 }}>🩸</Text>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: COLORS.text,
                  }}
                >
                  血糖
                </Text>
                <Text
                  style={{ fontSize: 13, color: COLORS.muted }}
                >
                  记录血糖数值
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
              }}
              onPress={() => {
                setShowSheet(false);
                router.push("/add-meal");
              }}
            >
              <Text style={{ fontSize: 28, marginRight: 16 }}>🍽️</Text>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: COLORS.text,
                  }}
                >
                  饮食记录
                </Text>
                <Text
                  style={{ fontSize: 13, color: COLORS.muted }}
                >
                  记录饮食和碳水摄入
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
