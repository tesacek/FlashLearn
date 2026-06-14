import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function zadejOpravneni(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

export async function zaznamenajAktivitu(): Promise<void> {
    await AsyncStorage.setItem('posledni_aktivita', new Date().toISOString());
    await zrusNotifikaci();
    await naplanovNotifikaci();
}

export async function naplanovNotifikaci(): Promise<void> {
    const povoleno = await zadejOpravneni();
    if (!povoleno) return;

    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'FlashLearn 🎴',
            body: 'Nezapomněl jsi se dnes učit? Otevři aplikaci a procvič si kartičky!',
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 24 * 60 * 60,
            repeats: false,
        },
    });
}

export async function zrusNotifikaci(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
}