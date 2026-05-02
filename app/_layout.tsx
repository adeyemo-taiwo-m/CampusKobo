import { AppProvider } from "@/src/context/AppContext";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAppContext } from "@/src/context/AppContext";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

function InnerLayout() {
  const { isAuthenticated, authLoading } = useAppContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      const inAuthGroup = segments[0] === 'onboarding';

      if (isAuthenticated && inAuthGroup) {
        // Redirect to tabs if authenticated and in onboarding
        router.replace('/(tabs)');
      } else if (!isAuthenticated && !inAuthGroup && segments[0] !== '(auth)') {
        // Redirect to splash if not authenticated and not in onboarding
        // Note: segments[0] can be empty on root, handled by index.tsx
      }
    }
  }, [isAuthenticated, authLoading, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="budget" options={{ headerShown: false }} />
      <Stack.Screen name="savings" options={{ headerShown: false }} />
      <Stack.Screen name="learning" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <InnerLayout />
          <StatusBar style="dark" />
        </AppProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
