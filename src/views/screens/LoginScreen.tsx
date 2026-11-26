import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  Alert,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import COLORS from '../../const/colors';
import Input from '../components/Input';
import Logo from '../../assets/logo.svg';

const LoginScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors]: any = useState({});

  const handleOnChange = (text: any, input: string) => {
    setInputs((prevState: any) => ({ ...prevState, [input]: text }));
  };
  const handleError = (errorMessage: any, input: string) => {
    setErrors((prevState: any) => ({ ...prevState, [input]: errorMessage }));
  };

  const validate = () => {
    Keyboard.dismiss();

    let valid = true;

    if (!inputs.name) {
      handleError('Please enter your name', 'name');
      valid = false;
    }

    if (!inputs.email) {
      handleError('Please enter your email', 'email');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      handleError('Please enter a valid email', 'email');
      valid = false;
    }

    if (!inputs.password) {
      handleError('Please enter your password', 'password');
      valid = false;
    }

    if (valid) {
      register();
    }
  };

  const register = async () => {
    setLoading(true);

    try {
      await AsyncStorage.setMany({
        loggedInUserName: inputs.name,
        loggedInUserEmail: inputs.email,
        loggedInUserPassword: inputs.password,
        isUserLoggedIn: 'true',
      });

      setLoading(false);

      navigation.reset({
        index: 0,
        routes: [{ name: 'TripSummaryScreen' }],
      });
    } catch (error) {
      setLoading(false);

      Alert.alert('ERROR!', 'Failed to save user data.');
    }
  };

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
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.bannerContainer}>
            <Logo width={176} height={176} />
            <Text style={styles.bannerText}>Encourages Safe Driving</Text>
          </View>
          <View style={{ paddingHorizontal: 12 }}>
            <Input
              error={errors.name}
              placeholder="Enter your name"
              autoCapitalize="words"
              onChangeText={(text: any) => handleOnChange(text, 'name')}
              onFocus={() => handleError(null, 'name')}
            />
            <Input
              error={errors.email}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text: any) => handleOnChange(text, 'email')}
              onFocus={() => handleError(null, 'email')}
            />
            <Input
              error={errors.password}
              password
              placeholder="Enter your password"
              autoCapitalize="none"
              onChangeText={(text: any) => handleOnChange(text, 'password')}
              onFocus={() => handleError(null, 'password')}
            />
            <TouchableOpacity style={styles.button} onPress={validate}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  bannerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 64,
    paddingBottom: 24,
    backgroundColor: COLORS.primary,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: COLORS.white,
  },
  button: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.white,
  },
});

export default LoginScreen;