import React from 'react'
import {
   View,
   Text,
   TextInput,
   StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import COLORS from '../../const/colors'

const Input = ({ error, password, onFocus = () => { }, ...props }: any) => {
   const [isFocused, setIsFocused] = React.useState(false)
   const [hidePassword, setHidePassword] = React.useState(password)

   return (
       <View style={{ marginBottom: 12 }}>
           <View style={[styles.inputContainer, { borderColor: error ? COLORS.error : isFocused ? COLORS.disabled : COLORS.light }]}>
               <TextInput
                   style={styles.textInput}
                   autoCorrect={false}
                   cursorColor={COLORS.black}
                   placeholderTextColor={COLORS.disabled}
                   secureTextEntry={hidePassword}
                   onFocus={() => {
                       onFocus()
                       setIsFocused(true)
                   }}
                   onBlur={() => {
                       setIsFocused(false)
                   }}
                   {...props}
               />
               {password && (
                   <Icon
                       onPress={() => setHidePassword(!hidePassword)}
                       name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                       style={{ color: COLORS.disabled, fontSize: 22 }}
                   />
               )}
           </View>
           {error && (
               <Text style={styles.error}>{error}</Text>
           )}
       </View>
   )
}

const styles = StyleSheet.create({
   inputContainer: {
       width: '100%',
       height: 56,
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'center',
       paddingHorizontal: 12,
       borderRadius: 8,
       backgroundColor: COLORS.light,
       borderWidth: 1
   },
   textInput: {
       flex: 1,
       fontSize: 16,
       fontWeight: 'normal',
       color: COLORS.black
   },
   error: {
       marginTop: 8,
       fontSize: 14,
       fontWeight: 'normal',
       color: COLORS.error
   }
})

export default Input