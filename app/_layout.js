import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="instructor/[id]" />
      <Stack.Screen name="instructor-setup" />
      <Stack.Screen name="webview" />
    </Stack>
  );
}