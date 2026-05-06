import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { nactiBalicky, ulozBalicky, Balicek, Karticka } from '@/storage/decks';

export default function EditDeckScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [balicek, setBalicek] = useState<Balicek | null>(null);
    const [nazev, setNazev] = useState('');
    const [karticky, setKarticky] = useState<Karticka[]>([]);

    useEffect(() => {
        nactiBalicky().then((vsechny) => {
            const nalezeny = vsechny.find((b) => b.id === id);
            if (nalezeny) {
                setBalicek(nalezeny);
                setNazev(nalezeny.nazev);
                setKarticky(nalezeny.karticky);
            }
        });
    }, []);

    async function uloz() {
        if (!balicek) return;
        if (nazev.trim() === '') {
            Alert.alert('Chyba', 'Zadej název balíčku');
            return;
        }
        const vyplnene = karticky.filter(k => k.predni.trim() !== '' && k.zadni.trim() !== '');
        if (vyplnene.length === 0) {
            Alert.alert('Chyba', 'Balíček musí mít alespoň jednu vyplněnou kartičku');
            return;
        }
        const vsechny = await nactiBalicky();
        const nove = vsechny.map((b) =>
            b.id === balicek.id ? { ...b, nazev, karticky: vyplnene } : b
        );
        await ulozBalicky(nove);
        router.back();
    }

    function pridejKarticku() {
        const novaKarticka: Karticka = {
            id: Date.now().toString(),
            predni: '',
            zadni: '',
        };
        setKarticky([...karticky, novaKarticka]);
    }

    function smazKarticku(kartickaId: string) {
        if (karticky.length === 1) {
            Alert.alert('Chyba', 'Balíček musí mít alespoň jednu kartičku');
            return;
        }
        Alert.alert('Smazat kartičku', 'Opravdu chceš smazat tuto kartičku?', [
            { text: 'Ponechat', style: 'cancel' },
            { text: 'Smazat', style: 'destructive', onPress: () => {
                    setKarticky(karticky.filter((k) => k.id !== kartickaId));
                }},
        ]);
    }

    function upravKarticku(kartickaId: string, strana: 'predni' | 'zadni', hodnota: string) {
        setKarticky(karticky.map((k) =>
            k.id === kartickaId ? { ...k, [strana]: hodnota } : k
        ));
    }

    if (!balicek) return null;

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.zpet}>← Zpět</Text>
                </TouchableOpacity>

                <Text style={styles.nadpis}>Upravit balíček</Text>

                <Text style={styles.label}>Název balíčku</Text>
                <TextInput
                    style={styles.input}
                    value={nazev}
                    onChangeText={setNazev}
                    placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.sekce}>Kartičky</Text>

                {karticky.map((karticka, index) => (
                    <View key={karticka.id} style={styles.kartickaBox}>
                        <View style={styles.kartickaHeader}>
                            <Text style={styles.kartickaLabel}>Kartička {index + 1}</Text>
                            <TouchableOpacity onPress={() => smazKarticku(karticka.id)}>
                                <Text style={styles.smazatText}>Smazat</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={karticka.predni}
                            onChangeText={(text) => upravKarticku(karticka.id, 'predni', text)}
                            placeholder="Přední strana"
                            placeholderTextColor="#9CA3AF"
                        />
                        <TextInput
                            style={styles.input}
                            value={karticka.zadni}
                            onChangeText={(text) => upravKarticku(karticka.id, 'zadni', text)}
                            placeholder="Zadní strana"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                ))}

                <TouchableOpacity style={styles.pridatBtn} onPress={pridejKarticku}>
                    <Text style={styles.pridatText}>+ Přidat kartičku</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.ulozitBtn} onPress={uloz}>
                    <Text style={styles.ulozitText}>Uložit změny</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
    zpet: { fontSize: 17, fontWeight: '500', color: '#1F2937', marginBottom: 24 },
    nadpis: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 24 },
    label: { fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 8 },
    sekce: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginTop: 16, marginBottom: 16 },
    input: { backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, fontSize: 15, color: '#1F2937', marginBottom: 12 },
    kartickaBox: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB' },
    kartickaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    kartickaLabel: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
    smazatText: { fontSize: 13, color: '#EF4444', fontWeight: '500' },
    pridatBtn: { backgroundColor: '#EEF2FF', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 16 },
    pridatText: { color: '#4F46E5', fontSize: 15, fontWeight: '500' },
    ulozitBtn: { backgroundColor: '#4F46E5', borderRadius: 16, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 40 },
    ulozitText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});