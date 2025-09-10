import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack
            initialRouteName='(auth)'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(main)" />
        </Stack>
    );
}