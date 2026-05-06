import { View, Text, StyleSheet } from 'react-native';

export default function StatsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Statistiky</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
    },
});