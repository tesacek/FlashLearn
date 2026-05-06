import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { nactiBalicky, ulozBalicky } from '@/storage/decks';
import { useRouter } from 'expo-router';

export default function NewDeckScreen() {
    const router = useRouter();
    const [nazev, setNazev] = useState('');
    const [karticky, setKarticky] = useState([{ predni: '', zadni: '' }]);

    function pridejKarticku() {
        setKarticky([...karticky, { predni: '', zadni: '' }]);
    }

    function upravKarticku(index: number, strana: 'predni' | 'zadni', hodnota: string) {
        const nove = [...karticky];
        nove[index][strana] = hodnota;
        setKarticky(nove);
    }

    async function uloz() {
        if (nazev.trim() === '') {
            Alert.alert('Chyba', 'Zadej název balíčku');
            return;
        }
        const vyplnene = karticky.filter(k => k.predni.trim() !== '' && k.zadni.trim() !== '');
        if (vyplnene.length === 0) {
            Alert.alert('Chyba', 'Přidej alespoň jednu kartičku');
            return;
        }
        const stare = await nactiBalicky();
        const novyBalicek = {
            id: Date.now().toString(),
            nazev: nazev,
            karticky: vyplnene.map((k, i) => ({ id: i.toString(), predni: k.predni, zadni: k.zadni })),
        };
        await ulozBalicky([...stare, novyBalicek]);
        router.back();
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.zpet}>← Nový balíček</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Název balíčku</Text>
                <TextInput
                    style={styles.input}
                    placeholder="např. Španělština"
                    placeholderTextColor="#9CA3AF"
                    value={nazev}
                    onChangeText={setNazev}
                />

                {karticky.map((karticka, index) => (
                    <View key={index}>
                        <Text style={styles.label}>Kartička {index + 1} — přední strana</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="např. Hola"
                            placeholderTextColor="#9CA3AF"
                            value={karticka.predni}
                            onChangeText={(text) => upravKarticku(index, 'predni', text)}
                        />
                        <Text style={styles.label}>Kartička {index + 1} — zadní strana</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="např. Ahoj"
                            placeholderTextColor="#9CA3AF"
                            value={karticka.zadni}
                            onChangeText={(text) => upravKarticku(index, 'zadni', text)}
                        />
                    </View>
                ))}

                <TouchableOpacity style={styles.pridatTlacitko} onPress={pridejKarticku}>
                    <Text style={styles.pridatText}>+ Přidat další kartičku</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.ulozitTlacitko} onPress={uloz}>
                    <Text style={styles.ulozitText}>Uložit balíček</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
    zpet: { fontSize: 17, fontWeight: '500', color: '#1F2937', marginBottom: 32 },
    label: { fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 8 },
    input: { backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, fontSize: 15, color: '#1F2937', marginBottom: 20 },
    pridatTlacitko: { backgroundColor: '#EEF2FF', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 20 },
    pridatText: { color: '#4F46E5', fontSize: 15, fontWeight: '500' },
    ulozitTlacitko: { backgroundColor: '#4F46E5', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 40 },
    ulozitText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});