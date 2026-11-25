import { useState, useEffect } from 'react'
import {
  PermissionsAndroid,
  ScrollView,
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Progress from 'react-native-progress'
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
} from 'react-native-permissions'
import AsyncStorage from '@react-native-async-storage/async-storage'

import COLORS from '../../const/colors'

import { AutoBeacon } from '@autobeacon/autobeacon-react-native'

const TripSummaryScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false)

  const [tripSummary, setTripSummary] = useState({
    response: '',
    numOfTrips: 0,
    safeDrivingScore: 0,
    drivingDistance: 0,
    message: '',
  })
  const [tripSummaryCardVisibility, setTripSummaryCardVisibility] =
    useState(false)

  const getItemAsync = async (key: string): Promise<string> => {
    const value = await AsyncStorage.getItem(key)
    return value ?? ''
  }

  const requestPermissionsForAndroid = async () => {
    const fineLocationPermissionStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )

    if (fineLocationPermissionStatus === 'granted') {
      const backgroundLocationPermissionStatus =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        )

      if (backgroundLocationPermissionStatus === 'granted') {
        const activityRecognitionPermissionStatus =
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
          )

        if (activityRecognitionPermissionStatus === 'granted') {
          const bluetoothConnectPermissionStatus =
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
            )
          const bluetoothScanPermissionStatus =
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
            )

          if (
            bluetoothConnectPermissionStatus === 'granted' &&
            bluetoothScanPermissionStatus === 'granted'
          ) {
            AutoBeacon.requestBatteryOptimizationPermission().then(() => {})

            AutoBeacon.statusOfBatteryOptimization().then(async (res) => {
              if (res === true) {
                const notificationPermissionStatus =
                  await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                  )

                if (notificationPermissionStatus === 'granted') {
                  AutoBeacon.startTripTracking()
                }
              } else {
                Alert.alert(
                  'Battery optimization permission needed!',
                  'Permission to disable battery optimization is required for trip tracking. Please disable battery optimization from settings.'
                )
              }
            })
          }
        } else {
          Alert.alert(
            'Physical activity permission needed!',
            'Permission to use the device physical activity or motion is required for trip tracking. Please enable physical activity permissions from settings.'
          )
        }
      } else {
        Alert.alert(
          'Background location permission needed!',
          'Permission to use the device location in background is required for trip tracking. Please enable background location permissions from settings.'
        )
      }
    } else {
      Alert.alert(
        'Location permission needed!',
        'Permission to use the device location is required for trip tracking. Please enable location permissions from settings.'
      )
    }
  }

  const requestPermissionsForIos = async () => {
    await request(PERMISSIONS.IOS.MOTION)

    await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    let locationPermissionStatus = await check(
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    )

    if (locationPermissionStatus === 'granted') {
      await request(PERMISSIONS.IOS.LOCATION_ALWAYS)
    } else {
      openSettings()
    }

    await request(PERMISSIONS.IOS.MOTION)

    let motionPermissionStatus = await check(PERMISSIONS.IOS.MOTION)
    let locationPermissionState = await check(PERMISSIONS.IOS.LOCATION_ALWAYS)

    if (
      motionPermissionStatus !== 'granted' ||
      locationPermissionState !== 'granted'
    ) {
      openSettings()
    } else if (
      motionPermissionStatus === 'granted' &&
      locationPermissionState === 'granted'
    ) {
      console.log(
        'calling  startTripTracking method as all permissions are given'
      )
      AutoBeacon.startTripTracking()
    }
  }

  const getTripSummary = async () => {
    setLoading(true)

    try {
      const [name, email, password] = await Promise.all([
        getItemAsync('loggedInUserName'),
        getItemAsync('loggedInUserEmail'),
        getItemAsync('loggedInUserPassword'),
      ])

      if (name && email && password) {
        AutoBeacon.loginOrRegisterNewUser(
          name,
          email,
          password,
          'mycar',
          'India',
          'Maruti Suzuki',
          '800',
          'TEST123',
          '',
          '',
          ''
        )
          .then((result) => {
            setLoading(false)

            if (result == 'Failure') {
              Alert.alert(
                'Registration Failed',
                "Credentials Don't Match. Please try again with correct credentials."
              )
              return
            }

            const parsedResult =
              typeof result === 'string' ? JSON.parse(result) : result

            if (Platform.OS === 'android') {
              setTripSummary({
                response: parsedResult.response,
                numOfTrips: parsedResult.numOfTrips,
                safeDrivingScore: parsedResult.safeDrivingScore,
                drivingDistance: parsedResult.drivingDistance,
                message: parsedResult.message,
              })
            } else if (Platform.OS === 'ios') {
              setTripSummary({
                response: parsedResult.response,
                numOfTrips: parsedResult.numTrips,
                safeDrivingScore: parsedResult.safeDrivingScore,
                drivingDistance: parsedResult.drivingDistance,
                message: parsedResult.message,
              })
            }

            setTripSummaryCardVisibility(true)

            if (Platform.OS === 'android') {
              requestPermissionsForAndroid()
            } else if (Platform.OS === 'ios') {
              requestPermissionsForIos()
            }
          })
          .catch(() => {
            setLoading(false)

            setTripSummaryCardVisibility(false)

            Alert.alert(
              'ERROR!',
              'Some error occurred while fetching trip summary.'
            )
          })
      } else {
        setLoading(false)

        setTripSummaryCardVisibility(false)

        Alert.alert(
          'ERROR!',
          'Missing stored user credentials. Please login again.'
        )
      }
    } catch (error) {
      setLoading(false)

      setTripSummaryCardVisibility(false)

      Alert.alert('ERROR!', 'Error reading user data. Please login again.')
    }
  }

  useEffect(() => {
    getTripSummary()
  }, [])

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={{ marginTop: 16 }}>
            Please wait... This may take a moment!
          </Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView>
        {tripSummaryCardVisibility ? (
          <View>
            <View style={{ marginHorizontal: 12, marginTop: 12 }}>
              <View style={styles.summaryCard}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.summaryScoreSection}>
                    <Progress.Circle
                      size={112}
                      progress={(tripSummary.safeDrivingScore || 0) / 100}
                      showsText={false}
                      color={
                        tripSummary.safeDrivingScore >= 95
                          ? COLORS.success
                          : tripSummary.safeDrivingScore >= 85
                            ? COLORS.warning
                            : COLORS.error
                      }
                      unfilledColor={COLORS.light}
                      borderWidth={0}
                      thickness={6}
                    />
                    <View style={styles.summaryScoreTextContainer}>
                      <Text style={styles.summaryScoreText}>
                        {Math.round(tripSummary.safeDrivingScore)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={styles.summaryInfoContainer}>
                      <Text style={styles.summaryInfoText}>
                        {tripSummary.drivingDistance.toFixed(2)} kms across{' '}
                        {tripSummary.numOfTrips} trips
                      </Text>
                      <Text style={styles.summaryInsightText}>
                        {tripSummary.message}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('HomeScreen', { tripSummary: tripSummary })
          }
        >
          <Text style={styles.buttonText}>Move to SDK Screens</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.overlay,
  },
  loader: {
    marginHorizontal: 24,
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  summaryCard: {
    width: '100%',
    height: 'auto',
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
  },
  summaryScoreSection: {
    width: 128,
    height: 128,
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 12,
  },
  summaryScoreTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryScoreText: {
    fontSize: 28,
    fontWeight: '500',
    color: COLORS.black,
  },
  summaryInfoContainer: {
    justifyContent: 'center',
  },
  summaryInfoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  summaryInsightText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.white,
  },
  button: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    marginTop: 12,
    marginHorizontal: 12,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.white,
  },
})

export default TripSummaryScreen