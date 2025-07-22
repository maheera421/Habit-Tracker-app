import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

// if the user not logged in
function RouteGuard({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const {user, isLoadingUser} = useAuth();
  // to detect whether the user is already on the auth page
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';
    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace('/auth');
    } else if (user && inAuthGroup && !isLoadingUser) {
      router.replace("/");
    }
  }, [user, segments, isLoadingUser, router]);
  return <>{children}</>
}


export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard>
        <Stack>
          <Stack.Screen name="(tabs)" options={{headerShown: false }} />
        </Stack>
      </RouteGuard>
    </AuthProvider>
  );
}
