import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  
  const [emailFocus, setEmailFocus] = useState(new Animated.Value(0));
  const [passwordFocus, setPasswordFocus] = useState(new Animated.Value(0));

  // Step 1: Add theme state to handle manual theme switching
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        setError('');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        setError('');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleFocus = (inputType: 'email' | 'password') => {
    Animated.timing(inputType === 'email' ? emailFocus : passwordFocus, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = (inputType: 'email' | 'password') => {
    Animated.timing(inputType === 'email' ? emailFocus : passwordFocus, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Step 2: Add a button to toggle the theme manually
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {user ? (
        <>
          <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>Welcome, {user.email}!</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={[styles.formContainer, isDarkMode && styles.darkFormContainer]}>
          <Text style={[styles.title, isDarkMode && styles.darkText]}>Login</Text>
          <Animated.View
            style={[
              styles.inputWrapper,
              { borderColor: emailFocus.interpolate({ inputRange: [0, 1], outputRange: ['#ddd', '#007bff'] }) },
              isDarkMode && { borderColor: '#bbb' },
            ]}
          >
            <TextInput
              style={[styles.input, isDarkMode && styles.darkInput]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              onFocus={() => handleFocus('email')}
              onBlur={() => handleBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholderTextColor={isDarkMode ? '#bbb' : '#aaa'}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.inputWrapper,
              { borderColor: passwordFocus.interpolate({ inputRange: [0, 1], outputRange: ['#ddd', '#007bff'] }) },
              isDarkMode && { borderColor: '#bbb' },
            ]}
          >
            <TextInput
              style={[styles.input, isDarkMode && styles.darkInput]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              autoCapitalize="none"
              autoComplete="password"
              placeholderTextColor={isDarkMode ? '#bbb' : '#aaa'}
            />
          </Animated.View>
          <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleLogin}>
            <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleSignUp}>
            <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Sign Up</Text>
          </TouchableOpacity>
          {error ? <Text style={[styles.error, isDarkMode && styles.darkError]}>{error}</Text> : null}
        </View>
      )}

      {/* Step 3: Add a button to toggle dark mode */}
      <TouchableOpacity style={styles.themeToggleButton} onPress={toggleTheme}>
        <Text style={styles.themeToggleText}>
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  formContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  darkFormContainer: {
    backgroundColor: '#1c1c1c',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  darkText: {
    color: '#fff',
  },
  inputWrapper: {
    marginVertical: 15,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  input: {
    padding: 15,
    fontSize: 16,
    color: '#333',
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  darkInput: {
    backgroundColor: '#333',
    color: '#fff',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3, // Add shadow effect for the button
  },
  darkButton: {
    backgroundColor: '#6200ea',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkButtonText: {
    color: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  darkError: {
    color: '#ff6f61',
  },
  logoutButton: {
    padding: 15,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  themeToggleButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  themeToggleText: {
    color: '#fff',
    fontSize: 16,
  },
});
