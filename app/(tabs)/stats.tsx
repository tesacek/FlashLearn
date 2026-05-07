import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { nactiBalicky, nactiVysledky, Balicek, Vysledek } from '@/storage/decks';

export default function StatsScreen() {
    const [balicky, setBalicky] = useState<Balicek[]>([]);
    const [vysledky, setVysledky] = useState<Vysledek[]>([]);

    useFocusEffect(
        useCallback(() => {
            nactiBalicky().then(setBalicky);
            nactiVysledky().then(setVysledky);
        }, [])
    );

    const celkemKarticek = balicky.reduce((sum, b) => sum + b.karticky.length, 0);
    const uspesnost = vysledky.length > 0
        ? Math.round(vysledky.reduce((sum, v) => sum + (v.spravne / v.celkem) * 100, 0) / vysledky.length)
        : 0;
    const posledni = [...vysledky].reverse().slice(0, 3);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.nadpis}>Statistiky</Text>

            <View style={styles.hlavniKarta}>
                <Text style={styles.hlavniLabel}>Celkem kartiček</Text>
                <Text style={styles.hlavniCislo}>{celkemKarticek}</Text>
                <Text style={styles.hlavniLabel}>ve {balicky.length} balíčcích</Text>
            </View>

            <View style={styles.boxy}>
                <View style={styles.box}>
                    <Text style={styles.boxLabel}>Úspěšnost</Text>
                    <Text style={styles.boxCislo}>{uspesnost}%</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.boxLabel}>Sessions</Text>
                    <Text style={styles.boxCislo}>{vysledky.length}</Text>
                </View>
            </View>

            <Text style={styles.sekceNadpis}>Poslední aktivita</Text>

            {posledni.length === 0 && (
                <Text style={styles.prazdno}>Zatím žádná aktivita 📚</Text>
            )}

            {posledni
                .filter((v) => balicky.find((b) => b.id === v.balicekId))
                .map((v, i) => {
                    const balicek = balicky.find((b) => b.id === v.balicekId);
                    return (
                        <View key={i} style={styles.radek}>
                            <Text style={styles.radekNazev}>{balicek?.nazev}</Text>
                            <Text style={styles.radekPocet}>+{v.spravne} správně</Text>
                        </View>
                    );
                })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
    nadpis: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 24 },
    hlavniKarta: { backgroundColor: '#4F46E5', borderRadius: 20, padding: 24, marginBottom: 24, alignItems: 'center' },
    hlavniLabel: { fontSize: 14, color: '#C7D2FE', marginBottom: 4 },
    hlavniCislo: { fontSize: 64, fontWeight: 'bold', color: '#fff' },
    boxy: { flexDirection: 'row', gap: 12, marginBottom: 32 },
    box: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 16, padding: 16 },
    boxLabel: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
    boxCislo: { fontSize: 32, fontWeight: 'bold', color: '#1F2937' },
    sekceNadpis: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
    radek: { backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    radekNazev: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
    radekPocet: { fontSize: 13, color: '#22C55E' },
    prazdno: { fontSize: 16, color: '#9CA3AF', textAlign: 'center', marginTop: 40 },
});