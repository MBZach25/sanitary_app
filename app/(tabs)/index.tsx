import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [emailFocus, setEmailFocus] = useState(new Animated.Value(0));
  const [passwordFocus, setPasswordFocus] = useState(new Animated.Value(0));

  // Add theme state to handle manual theme switching
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleSignUp = () => {
    setError('');
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setError('');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLogin = () => {
    setError('');
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setError('');
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  const handlePasswordReset = () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setError('');
    setSuccess('');
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccess('Password reset email sent! Check your inbox.');
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

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {user ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>
            Welcome, {user.email}!
          </Text>
          
          {/* Add your home screen content here */}
          <View style={[styles.homeContent, isDarkMode && styles.darkHomeContent]}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
               Sanitary Report App
            </Text>
            <Text style={[styles.description, isDarkMode && styles.darkText]}>
              Report unclean areas on campus and track their status.
            </Text>
            
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={[styles.actionCard, isDarkMode && styles.darkActionCard]}
                 onPress={() => router.push('../reportingTab')}
              >
                <Text style={[styles.actionIcon]}>📷</Text>
                <Text style={[styles.actionText, isDarkMode && styles.darkText]}>Report An Issue...</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionCard, isDarkMode && styles.darkActionCard]}
                onPress={() => {
                  console.log('My Reports button pressed');
                  router.push('../reports');
                }}
              >
                <Text style={[styles.actionIcon]}>📋</Text>
                <Text style={[styles.actionText, isDarkMode && styles.darkText]}>My Reports</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleLogout}>
            <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.themeToggleButton} onPress={toggleTheme}>
            <Text style={styles.themeToggleText}>
              {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
          
          
          <TouchableOpacity 
            onPress={handlePasswordReset}
            style={styles.forgotPasswordContainer}
          >
            <Text style={[styles.forgotPasswordText, isDarkMode && styles.darkForgotPasswordText]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleLogin}>
            <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleSignUp}>
            <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Sign Up</Text>
          </TouchableOpacity>
          {error ? <Text style={[styles.error, isDarkMode && styles.darkError]}>{error}</Text> : null}
          {success ? <Text style={[styles.success, isDarkMode && styles.darkSuccess]}>{success}</Text> : null}
          <TouchableOpacity style={styles.themeToggleButton} onPress={toggleTheme}>
            <Text style={styles.themeToggleText}>
              {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
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
    elevation: 3,
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
    marginTop: 5,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  darkForgotPasswordText: {
    color: '#64b5f6',
  },
  success: {
    color: '#4caf50',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  darkSuccess: {
    color: '#81c784',
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
    textAlign: 'center',
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
  homeContent: {
    marginVertical: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  darkHomeContent: {
    backgroundColor: '#1c1c1c',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '45%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkActionCard: {
    backgroundColor: '#2c2c2c',
    borderColor: '#404040',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});