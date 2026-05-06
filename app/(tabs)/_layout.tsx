import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#4F46E5' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Domů',
                    tabBarIcon: ({ color }) => {
                        return <Ionicons name="home" size={24} color={color} />;
                    },
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Statistiky',
                    tabBarIcon: ({ color }) => {
                        return <Ionicons name="bar-chart" size={24} color={color} />;
                    },
                }}
            />
        </Tabs>
    );
}