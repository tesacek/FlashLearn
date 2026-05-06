import AsyncStorage from '@react-native-async-storage/async-storage';

export type Karticka = {
    id: string;
    predni: string;
    zadni: string;
};

export type Balicek = {
    id: string;
    nazev: string;
    karticky: Karticka[];
};

export type Vysledek = {
    balicekId: string;
    datum: string;
    spravne: number;
    celkem: number;
};

export async function nactiBalicky(): Promise<Balicek[]> {
    const data = await AsyncStorage.getItem('balicky');
    if (data === null) return [];
    return JSON.parse(data);
}

export async function ulozBalicky(balicky: Balicek[]): Promise<void> {
    await AsyncStorage.setItem('balicky', JSON.stringify(balicky));
}

export async function smazBalicek(id: string): Promise<void> {
    const balicky = await nactiBalicky();
    const nove = balicky.filter((b) => b.id !== id);
    await ulozBalicky(nove);
}

export async function ulozVysledek(vysledek: Vysledek): Promise<void> {
    const data = await AsyncStorage.getItem('vysledky');
    const vysledky: Vysledek[] = data ? JSON.parse(data) : [];
    vysledky.push(vysledek);
    await AsyncStorage.setItem('vysledky', JSON.stringify(vysledky));
}

export async function nactiVysledky(): Promise<Vysledek[]> {
    const data = await AsyncStorage.getItem('vysledky');
    if (data === null) return [];
    return JSON.parse(data);
}
