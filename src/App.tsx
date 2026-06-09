import { useEffect } from 'react'
import {
 PermissionsAndroid,
 Platform,
 TouchableOpacity
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { requestNotifications } from 'react-native-permissions'
import Geocoder from 'react-native-geocoding'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import SplashScreen from './views/screens/SplashScreen'
import LoginScreen from './views/screens/LoginScreen'
import TripSummaryScreen from './views/screens/TripSummaryScreen'
import { HomeScreen } from '@autobeacon/autobeacon-react-native'
import { AllTripsScreen } from '@autobeacon/autobeacon-react-native'
import { TripDetailScreen } from '@autobeacon/autobeacon-react-native'
import { TripMapScreen } from '@autobeacon/autobeacon-react-native'
import { TripTrendScreen } from '@autobeacon/autobeacon-react-native'
import { SettingsScreen } from '@autobeacon/autobeacon-react-native'
import { PermissionSettingsScreen } from '@autobeacon/autobeacon-react-native'
import { DrivingAlertsScreen } from '@autobeacon/autobeacon-react-native'

import COLORS from './const/colors'

// Initializing Geocoder with your Google Maps API key
Geocoder.init('AIzaSyCwZldLVcXnQqWEn6RBy0T41wM_dEGHOXw')

const Stack = createNativeStackNavigator()

const reqestNotificationPermissionForIos = async () => {
 await requestNotifications(['alert', 'sound', 'badge'])
}

const App = () => {
 useEffect(() => {
   if (Platform.OS === 'ios') {
     reqestNotificationPermissionForIos()
   } else if (Platform.OS === 'android') {
     PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
   }
 }, [])

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
         }
       }}
     >
       <Stack.Screen
         name='SplashScreen'
         component={SplashScreen}
         options={{ headerShown: false }}
       />
       <Stack.Screen
         name='LoginScreen'
         component={LoginScreen}
         options={{ headerShown: false }}
       />
       <Stack.Screen
         name='TripSummaryScreen'
         component={TripSummaryScreen}
         options={{
           title: 'AutoBeacon SDK',
           headerBackVisible: false
         }}
       />
       <Stack.Screen
         name='HomeScreen'
         component={HomeScreen}
         options={({ navigation }) => ({
           title: 'AutoBeacon SDK',
           headerRight: () => (
             <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
               <Icon name='cog' size={24} color={COLORS.white} />
             </TouchableOpacity>
           ),
         })}
       />
       <Stack.Screen
         name='AllTripsScreen'
         component={AllTripsScreen}
         options={{ title: 'All Trips' }}
       />
       <Stack.Screen
         name='TripDetailScreen'
         component={TripDetailScreen}
         options={{ title: 'Trip Detail' }}
       />
       <Stack.Screen
         name='TripMapScreen'
         component={TripMapScreen}
         options={{ title: 'Trip Detail - Map' }}
       />
       <Stack.Screen
         name='TripTrendScreen'
         component={TripTrendScreen}
         options={{ title: 'Trip Trend' }}
       />
       <Stack.Screen
         name='SettingsScreen'
         component={SettingsScreen}
         options={{ title: 'General Settings' }}
       />
       <Stack.Screen
         name='PermissionSettingsScreen'
         component={PermissionSettingsScreen}
         options={{ title: 'Permission Settings' }}
       />
       <Stack.Screen
         name='DrivingAlertsScreen'
         component={DrivingAlertsScreen}
         options={{ title: 'Driving Alerts' }}
       />
     </Stack.Navigator>
   </NavigationContainer>
 )
}

export default App