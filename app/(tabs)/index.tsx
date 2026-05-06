import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { nactiBalicky, smazBalicek, Balicek } from '@/storage/decks';

export default function HomeScreen() {
  const router = useRouter();
  const [balicky, setBalicky] = useState<Balicek[]>([]);

  useFocusEffect(
      useCallback(() => {
        nactiBalicky().then(setBalicky);
      }, [])
  );

  return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.nadpis}>FlashLearn</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={styles.aiBtn} onPress={() => router.push('/ai-deck' as any)}>
              <Text style={styles.aiText}>✨ AI</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tlacitko} onPress={() => router.push('/new-deck')}>
              <Text style={styles.tlacitkoText}>+ Nový</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.podnadpis}>Moje balíčky</Text>

        {balicky.length === 0 && (
            <Text style={styles.prazdno}>Zatím žádné balíčky. Vytvoř první! 🎴</Text>
        )}

        {balicky.map((balicek) => (
            <View key={balicek.id} style={styles.karta}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push(`/study?id=${balicek.id}` as any)}>
                <Text style={styles.kartaNazev}>{balicek.nazev}</Text>
                <Text style={styles.kartaPocet}>{balicek.karticky.length} kartiček</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.upravitBtn} onPress={() => router.push(`/edit-deck?id=${balicek.id}` as any)}>
                <Text style={styles.upravitText}>Upravit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smazatBtn} onPress={() => {
                Alert.alert(
                    'Smazat balíček',
                    `Opravdu chceš smazat "${balicek.nazev}" s ${balicek.karticky.length} kartičkami?`,
                    [
                      { text: 'Ponechat', style: 'cancel' },
                      { text: 'Smazat', style: 'destructive', onPress: () => {
                          smazBalicek(balicek.id).then(() => nactiBalicky().then(setBalicky));
                        }},
                    ]
                );
              }}>
                <Text style={styles.smazatText}>Smazat</Text>
              </TouchableOpacity>
            </View>
        ))}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  nadpis: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  tlacitko: { backgroundColor: '#4F46E5', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  tlacitkoText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  aiBtn: { backgroundColor: '#EEF2FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  aiText: { color: '#4F46E5', fontSize: 14, fontWeight: '500' },
  podnadpis: { fontSize: 18, color: '#6B7280', marginBottom: 16 },
  karta: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  kartaNazev: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  kartaPocet: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  prazdno: { fontSize: 16, color: '#9CA3AF', textAlign: 'center', marginTop: 60 },
  upravitBtn: { backgroundColor: '#EEF2FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8 },
  upravitText: { fontSize: 13, color: '#4F46E5', fontWeight: '500' },
  smazatBtn: { backgroundColor: '#FEE2E2', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  smazatText: { fontSize: 13, color: '#EF4444', fontWeight: '500' },
});