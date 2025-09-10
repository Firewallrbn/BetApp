// src/screens/MegaHomeBetting.js
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const { width } = Dimensions.get("window");

export default function MegaHomeBetting() {
  const heroScale = useRef(new Animated.Value(1)).current;
  const [balance, setBalance] = useState(600.000);
  const [openBets, setOpenBets] = useState(3);
  const [winRate, setWinRate] = useState(58);
  const [search, setSearch] = useState("");

  const pushHero = () => {
    Animated.sequence([
      Animated.timing(heroScale, {
        toValue: 0.98,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(heroScale, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const quickBet = (amount = 10) => {
    if (balance < amount) return Alert.alert("Saldo insuficiente", "Deposita para continuar.");
    setBalance((b) => +(b - amount).toFixed(2));
    setOpenBets((n) => n + 1);
    Alert.alert("Apuesta enviada", `Apuesta rápida de $${amount} enviada.`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>¡Hola, Juan</Text>
            <Text style={styles.subGreeting}>Tu centro de apuestas </Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <View style={styles.balanceBox}>
              <Text style={styles.balanceLabel}>Saldo</Text>
              <Text style={styles.balanceValue}>${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
            </View>

            <TouchableOpacity style={styles.proBadge} onPress={() => Alert.alert("VIP", "Beneficios VIP activados.")}>
              <Text style={styles.proText}>VIP</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchWrap}>
          <Feather name="search" size={18} color="#6B8F6B" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholder="Buscar partido, equipo o mercado..."
            placeholderTextColor="#8CA78C"
          />
          <TouchableOpacity style={styles.searchBtn} onPress={() => Alert.alert("Buscar", `Buscando: ${search}`)}>
            <Text style={styles.searchBtnText}>Ir</Text>
          </TouchableOpacity>
        </View>

        {/* HERO - PROMO / LIVE MATCH */}
        <TouchableOpacity activeOpacity={0.95} onPress={() => Alert.alert("En vivo", "Abriendo partido en vivo")} style={{ marginBottom: 18 }}>
          <Animated.View style={[styles.heroCard, { transform: [{ scale: heroScale }] }]}>
            <LinearGradient colors={["#16A34A", "#34D399"]} start={[0, 0]} end={[1, 1]} style={styles.heroGradient}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={styles.heroTitle}>Partido en vivo: River vs Boca</Text>
                  <Text style={styles.heroSubtitle}>Min 62 — Resultado 1 - 0 • Cuota 2.15</Text>
                </View>
                {/* <TouchableOpacity style={[styles.btnPrimary, { marginLeft: 12 }]} onPress={() => quickBet(20)}>
                  <Text style={styles.btnPrimaryText}>Apostar $20</Text>
                </TouchableOpacity> */}
              </View>

              <View style={{ marginTop: 12, flexDirection: "row", justifyContent: "space-between" }}>
                <View style={styles.kpi}>
                  <Text style={styles.kpiNum}>Live</Text>
                  <Text style={styles.kpiLabel}>Mercados abiertos</Text>
                </View>
                <View style={styles.kpi}>
                  <Text style={styles.kpiNum}>{openBets}</Text>
                  <Text style={styles.kpiLabel}>Apuestas abiertas</Text>
                </View>
                <View style={styles.kpi}>
                  <Text style={styles.kpiNum}>{winRate}%</Text>
                  <Text style={styles.kpiLabel}>Win rate</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        {/* MARKETS GRID */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mercados populares</Text>
          <View style={styles.gridRow}>
            <MarketCard name="Fútbol" icon={<Ionicons name="football" size={22} color="#131d1dff" />} />
            <MarketCard name="Baloncesto" icon={<MaterialIcons name="sports-basketball" size={22} color="#F97316" />} />
            <MarketCard name="Tenis" icon={<Ionicons name="tennisball" size={22} color="#10B981" />} />
            <MarketCard name="eSports" icon={<Feather name="monitor" size={22} color="#6366F1" />} />
          </View>
        </View>

        {/* LIVE MATCHES (HORIZONTAL) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partidos en vivo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 6 }}>
            <LiveMatchCard teamA="Colombia" teamB="Brazil" score="0 - 1" oddsA="2.30" oddsB="1.65" />
            <LiveMatchCard teamA="PSG" teamB="Lyon" score="2 - 2" oddsA="1.85" oddsB="2.00" />
            <LiveMatchCard teamA="Real" teamB="Barça" score="1 - 0" oddsA="2.15" oddsB="1.95" />
          </ScrollView>
        </View>

        {/* STAT CARDS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas rápidas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statScroll}>
            <StatCard label="Apostadores activos" value="8.2k" accent="#f1eb7bff" />
            <StatCard label="Cuotas promedio" value="1.92" accent="#16A34A" />
            <StatCard label="Ganancias hoy" value="$1,240" accent="#053d96ff" />
          </ScrollView>
        </View>

        {/* ACTION GRID */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accesos rápidos</Text>
          <View style={styles.actionGrid}>
            <ActionButton icon={<Feather name="dollar-sign" size={18} color="#064E3B" />} label="Depositar" action={() => setBalance((b) => +(b + 100).toFixed(2))} />
            <ActionButton icon={<Feather name="credit-card" size={18} color="#064E3B" />} label="Retirar" action={() => Alert.alert("Retirar", "Función de retirar (demo).")} />
            <ActionButton icon={<Feather name="zap" size={18} color="#064E3B" />} label="Apuesta rápida $10" action={() => quickBet(10)} />
            <ActionButton icon={<Ionicons name="cash-outline" size={18} color="#064E3B" />} label="Cobrar" action={() => Alert.alert("Cobrar", "Intentando cobrar... (demo)") } />
          </View>
        </View>

        {/* FOOTER */}
        <View style={{ marginBottom: 120 }}>
          <Text style={styles.sectionTitle}>Consejos de apuesta</Text>
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>🏁 Gestiona tu bankroll</Text>
            <Text style={styles.tipText}>No apuestes más del 2–5% de tu saldo en una sola apuesta.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- Subcomponents ---------------- */

function MarketCard({ name, icon }: { name: string; icon: React.ReactNode }) {
  return (
    <TouchableOpacity style={styles.marketCard}>
      <View style={styles.marketIcon}>{icon}</View>
      <Text style={styles.marketName}>{name}</Text>
    </TouchableOpacity>
  );
}

function LiveMatchCard({ teamA, teamB, score, oddsA, oddsB }: { teamA: string; teamB: string; score: string; oddsA: string; oddsB: string }) {
  return (
    <TouchableOpacity style={styles.liveCard} onPress={() => Alert.alert("Partido", `${teamA} vs ${teamB}`)}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.liveTeams}>{teamA} • {teamB}</Text>
        <Text style={styles.liveScore}>{score}</Text>
      </View>
      <View style={{ marginTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.liveOdds}>A: {oddsA}</Text>
        <Text style={styles.liveOdds}>B: {oddsB}</Text>
      </View>
    </TouchableOpacity>
  );
}

function StatCard({ label, value, accent = "#16A34A" }: { label: string; value: string; accent?: string }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: accent }]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function ActionButton({ icon, label, action = () => {} }: { icon: React.ReactNode; label: string; action?: () => void }) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={action}>
      <View style={styles.actionBtnInner}>
        <View style={styles.actionIcon}>{icon}</View>
        <Text style={styles.actionLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <TouchableOpacity style={styles.navItem}>
      {icon}
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff73" }, // green-50
  container: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 60 },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  greeting: { fontSize: 22, fontWeight: "800", color: "#064E3B" }, // green-900
  subGreeting: { color: "#16A34A", marginTop: 4 }, // green-600

  balanceBox: { backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, elevation: 2, alignItems: "flex-end" },
  balanceLabel: { fontSize: 12, color: "#16A34A" }, // green-600
  balanceValue: { color: "#064E3B", fontWeight: "800", fontSize: 16 }, // green-900
  proBadge: { marginTop: 8, backgroundColor: "#fff", paddingHorizontal: 8, paddingVertical: 6, borderRadius: 10, elevation: 2 },
  proText: { color: "#16A34A", fontWeight: "700" }, // green-600

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    elevation: 2,
    marginBottom: 18,
  },
  searchInput: { flex: 1, marginLeft: 10, color: "#064E3B" }, // green text
  searchBtn: { backgroundColor: "#16A34A", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }, // green button
  searchBtnText: { color: "#fff", fontWeight: "700" },

  heroCard: { borderRadius: 20, overflow: "hidden", elevation: 6 },
  heroGradient: { padding: 16 },
  heroTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  heroSubtitle: { color: "rgba(255,255,255,0.95)", marginTop: 6 },
  btnPrimary: { backgroundColor: "#064E3B", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }, // dark green button
  btnPrimaryText: { color: "#fff", fontWeight: "800" },

  kpi: { alignItems: "flex-start" },
kpiNum: { color: "#064E3B", fontWeight: "800" }, // darker green on white
kpiLabel: { color: "#064E3B", fontSize: 12 }, // darker green

  section: { marginBottom: 18 },
  sectionTitle: { fontWeight: "700", color: "#064E3B", marginBottom: 10 }, // dark green

  gridRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  marketCard: { width: (width - 36) / 2 - 6, backgroundColor: "#fff", borderRadius: 12, padding: 12, elevation: 3, alignItems: "center", marginBottom: 12 },
  marketIcon: { width: 46, height: 46, borderRadius: 10, justifyContent: "center", alignItems: "center", marginBottom: 8, backgroundColor: "#ECFDF5" }, // green-50
  marketName: { fontWeight: "700", color: "#064E3B" }, // dark green

  liveCard: { width: 220, backgroundColor: "#fff", borderRadius: 12, padding: 12, marginRight: 12, elevation: 3 },
  liveTeams: { fontWeight: "700", color: "#064E3B" }, // dark green
  liveScore: { fontWeight: "800", color: "#16A34A" }, // green
  liveOdds: { color: "#10B981" }, // green

  statScroll: { paddingBottom: 4 },
  statCard: { width: 140, backgroundColor: "#fff", borderRadius: 12, padding: 12, marginRight: 12, elevation: 3, borderLeftWidth: 4, borderLeftColor: "#16A34A" }, // green accent
  statLabel: { color: "#10B981", fontSize: 12 }, // green
  statValue: { fontSize: 18, fontWeight: "800", marginTop: 6, color: "#064E3B" }, // dark green

  actionGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  actionBtn: { width: (width - 36) / 2 - 6, marginBottom: 12 },
  actionBtnInner: { backgroundColor: "#fff", borderRadius: 12, padding: 12, elevation: 3, alignItems: "center", flexDirection: "row" },
  actionIcon: { width: 36, height: 36, borderRadius: 8, justifyContent: "center", alignItems: "center", backgroundColor: "#ECFDF5", marginRight: 10 }, // green-50
  actionLabel: { fontWeight: "700", color: "#064E3B" }, // dark green

  tipBox: { backgroundColor: "#fff", padding: 12, borderRadius: 12, elevation: 3, marginTop: 8 },
  tipTitle: { fontWeight: "700", color: "#064E3B" }, // dark green
  tipText: { color: "#10B981", marginTop: 6 }, // light green

  bottomNavWrap: { position: "absolute", left: 16, right: 16, bottom: 18 },
  bottomNav: { backgroundColor: "#fff", borderRadius: 28, paddingVertical: 10, paddingHorizontal: 14, flexDirection: "row", justifyContent: "space-between", elevation: 8 },
  navItem: { alignItems: "center", justifyContent: "center" },
  navLabel: { color: "#10B981", fontSize: 12, marginTop: 4 }, // light green
  navLabelActive: { color: "#16A34A", fontWeight: "800" }, // green
});
