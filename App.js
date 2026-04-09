import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import NewEntryScreen from './src/screens/NewEntryScreen';
import EntryDetailScreen from './src/screens/EntryDetailScreen';

const Stack = createNativeStackNavigator();

// AuthStack — shown when the user is NOT logged in
// Only contains Login and Register screens
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// AppStack — shown when the user IS logged in
// Contains all the main app screens
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NewEntry" component={NewEntryScreen} />
      <Stack.Screen name="EntryDetail" component={EntryDetailScreen} />
    </Stack.Navigator>
  );
}

// RootNavigator — decides which stack to show based on auth state
// This is the key piece that handles automatic login/logout navigation
function RootNavigator() {
  const { user, loading } = useAuth();

  // Show a loading spinner while we check for a stored token on startup
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' }}>
        <ActivityIndicator size="large" color="#6c63ff" />
      </View>
    );
  }

  // If the user is logged in show the app, otherwise show auth screens
  return user ? <AppStack /> : <AuthStack />;
}

// Root App component — wraps everything in AuthProvider and NavigationContainer
// AuthProvider makes auth state available to every screen
// NavigationContainer manages the navigation state for the whole app
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
