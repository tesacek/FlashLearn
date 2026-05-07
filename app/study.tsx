import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { nactiBalicky, ulozVysledek } from '@/storage/decks';
import { zaznamenajAktivitu } from '@/storage/notifications';

export default function StudyScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [balicek, setBalicek] = useState<any>(null);
    const [znamCount, setZnamCount] = useState(0);
    const [index, setIndex] = useState(0);
    const [otoceno, setOtoceno] = useState(false);

    useEffect(() => {
        nactiBalicky().then((balicky) => {
            const nalezeny = balicky.find((b) => b.id === id);
            setBalicek(nalezeny ?? null);
        });
    }, []);

    if (!balicek) return null;

    const karticky = balicek.karticky;
    const aktualni = karticky[index];
    const hotovo = index >= karticky.length;

    if (hotovo) {
        return (
            <View style={styles.container}>
                <Text style={styles.zpet} onPress={() => router.back()}>← Zpět</Text>
                <View style={styles.vysledek}>
                    <Text style={styles.vysledekEmoji}>🎉</Text>
                    <Text style={styles.vysledekText}>Hotovo!</Text>
                    <Text style={styles.vysledekPocet}>Znals jsi {znamCount} z {karticky.length} kartiček</Text>
                    <Text style={styles.uspesnost}>Úspěšnost: {Math.round((znamCount / karticky.length) * 100)}%</Text>
                    <TouchableOpacity style={styles.znamTlacitko} onPress={() => {
                        setIndex(0);
                        setOtoceno(false);
                        setZnamCount(0);
                    }}>
                        <Text style={styles.znamText}>Opakovat znovu</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    function oznacZnam() {
        const novyZnam = znamCount + 1;
        const novyIndex = index + 1;
        if (novyIndex >= karticky.length) {
            ulozVysledek({
                balicekId: balicek.id,
                datum: new Date().toLocaleDateString('cs-CZ'),
                spravne: novyZnam,
                celkem: karticky.length,
            });
            zaznamenajAktivitu();
        }
        setZnamCount(novyZnam);
        setIndex(novyIndex);
        setOtoceno(false);
    }

    function oznacNeznam() {
        const novyIndex = index + 1;
        if (novyIndex >= karticky.length) {
            ulozVysledek({
                balicekId: balicek.id,
                datum: new Date().toLocaleDateString('cs-CZ'),
                spravne: znamCount,
                celkem: karticky.length,
            });
        }
        setIndex(novyIndex);
        setOtoceno(false);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.zpet} onPress={() => router.back()}>← {balicek.nazev}</Text>
            <Text style={styles.progres}>{index + 1} / {karticky.length} kartiček</Text>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${((index + 1) / karticky.length) * 100}%` }]} />
            </View>
            <TouchableOpacity style={styles.karticka} onPress={() => setOtoceno(!otoceno)}>
                <Text style={styles.kartickaText}>{otoceno ? aktualni.zadni : aktualni.predni}</Text>
                <Text style={styles.hint}>{otoceno ? '💡 Odpověď' : 'Klepni pro otočení'}</Text>
            </TouchableOpacity>
            {otoceno && (
                <View style={styles.tlacitka}>
                    <TouchableOpacity style={styles.neznamTlacitko} onPress={oznacNeznam}>
                        <Text style={styles.neznamText}>✗ Neznám</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.znamTlacitko} onPress={oznacZnam}>
                        <Text style={styles.znamText}>✓ Znám</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
    zpet: { fontSize: 17, fontWeight: '500', color: '#1F2937', marginBottom: 16 },
    progres: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
    progressBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 32 },
    progressFill: { height: 8, backgroundColor: '#4F46E5', borderRadius: 4 },
    karticka: { backgroundColor: '#4F46E5', borderRadius: 24, padding: 40, alignItems: 'center', justifyContent: 'center', minHeight: 300 },
    kartickaText: { fontSize: 48, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
    hint: { fontSize: 14, color: '#C7D2FE', marginTop: 16 },
    tlacitka: { flexDirection: 'row', gap: 12, marginTop: 24 },
    neznamTlacitko: { flex: 1, backgroundColor: '#FEE2E2', borderRadius: 16, padding: 16, alignItems: 'center' },
    neznamText: { fontSize: 16, color: '#EF4444', fontWeight: '500' },
    znamTlacitko: { backgroundColor: '#DCFCE7', borderRadius: 16, padding: 16, paddingHorizontal: 32, alignItems: 'center' },
    znamText: { fontSize: 16, color: '#22C55E', fontWeight: '500' },
    vysledek: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    vysledekEmoji: { fontSize: 64, marginBottom: 16 },
    vysledekText: { fontSize: 32, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
    vysledekPocet: { fontSize: 18, color: '#6B7280', marginBottom: 8 },
    uspesnost: { fontSize: 18, color: '#4F46E5', marginBottom: 32 },
});