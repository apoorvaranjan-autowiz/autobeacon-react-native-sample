import { useEffect, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { requestNotifications } from 'react-native-permissions';
import Geocoder from 'react-native-geocoding';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SplashScreen from './views/screens/SplashScreen';
import LoginScreen from './views/screens/LoginScreen';
import TripSummaryScreen from './views/screens/TripSummaryScreen';
import {
  AutoBeacon,
  HomeScreen,
  AllTripsScreen,
  TripDetailScreen,
  TripMapScreen,
  TripTrendScreen,
  SettingsScreen,
  PermissionSettingsScreen,
  DrivingAlertsScreen,
} from '@autobeacon/autobeacon-react-native';

import COLORS from './const/colors';

// Initializing Geocoder with your Google Maps API key
Geocoder.init('YOUR_GOOGLE_MAPS_API_KEY');

const Stack = createNativeStackNavigator();

const requestNotificationPermissionForIos = async () => {
  await requestNotifications(['alert', 'sound', 'badge']);
};

const SettingsHeaderButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress}>
    <Icon name="cog" size={24} color={COLORS.white} />
  </TouchableOpacity>
);

const getHomeScreenOptions = ({ navigation }: { navigation: any }) => ({
  title: 'AutoBeacon SDK',
  headerRight: () => (
    <SettingsHeaderButton
      onPress={() => navigation.navigate('SettingsScreen')}
    />
  ),
});

const App = () => {
  const [isSdkReady, setIsSdkReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAutoBeacon = async () => {
      try {
        await AutoBeacon.initSDK();
        await AutoBeacon.setAppReleaseMode(false);
        await AutoBeacon.enableSDK();
        await AutoBeacon.setDeviceLocation();
      } catch (error) {
        console.error('Failed to initialize AutoBeacon SDK:', error);
      } finally {
        if (isMounted) {
          setIsSdkReady(true);
        }
      }

      if (Platform.OS === 'ios') {
        await requestNotificationPermissionForIos();
      } else if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      }
    };

    initializeAutoBeacon();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isSdkReady) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'normal',
          },
        }}
      >
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TripSummaryScreen"
          component={TripSummaryScreen}
          options={{
            title: 'AutoBeacon SDK',
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={getHomeScreenOptions}
        />
        <Stack.Screen
          name="AllTripsScreen"
          component={AllTripsScreen}
          options={{ title: 'All Trips' }}
        />
        <Stack.Screen
          name="TripDetailScreen"
          component={TripDetailScreen}
          options={{ title: 'Trip Detail' }}
        />
        <Stack.Screen
          name="TripMapScreen"
          component={TripMapScreen}
          options={{ title: 'Trip Detail - Map' }}
        />
        <Stack.Screen
          name="TripTrendScreen"
          component={TripTrendScreen}
          options={{ title: 'Trip Trend' }}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{ title: 'General Settings' }}
        />
        <Stack.Screen
          name="PermissionSettingsScreen"
          component={PermissionSettingsScreen}
          options={{ title: 'Permission Settings' }}
        />
        <Stack.Screen
          name="DrivingAlertsScreen"
          component={DrivingAlertsScreen}
          options={{ title: 'Driving Alerts' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
});

export default App;