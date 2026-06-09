import { useEffect } from 'react'
import {
   StyleSheet
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

import COLORS from '../../const/colors'
import Logo from '../../assets/logo.svg'

const SplashScreen = ({ navigation }: any) => {

   const getItemAsync = async (key: string): Promise<string> => {
       const value = await AsyncStorage.getItem(key)
       return value ?? ''
   }

   const checkLoginStatus = async () => {
       try {
           const isUserLoggedIn = await getItemAsync('isUserLoggedIn')

           if (isUserLoggedIn === 'true') {
               navigation.reset({
                   index: 0,
                   routes: [
                       { name: 'TripSummaryScreen' }
                   ],
               })
           } else {
               navigation.reset({
                   index: 0,
                   routes: [
                       { name: 'LoginScreen' }
                   ],
               })
           }
       } catch (error) {
           navigation.reset({
               index: 0,
               routes: [
                   { name: 'LoginScreen' }
               ],
           })
       }
   }

   useEffect(() => {
       setTimeout(checkLoginStatus, 2500)
   }, [])

   return (
       <SafeAreaView style={styles.container} edges={['left', 'right']}>
           <Logo width={160} height={160} />
       </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
       flex: 1,
       backgroundColor: COLORS.primary,
       alignItems: 'center',
       justifyContent: 'center',
   },
})

export default SplashScreen