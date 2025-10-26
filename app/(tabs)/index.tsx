// App.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '../../firebaseConfig';


export default function App() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [user, setUser] = useState<User | null>(null);
const [error, setError] = useState('');

const handleSignUp = () => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      setUser(user);   // update state
      setError('');    // clear errors
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

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>Welcome, {user.email}!</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Login" onPress={handleLogin} />
          <Button title="Sign Up" onPress={handleSignUp} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginVertical: 8, padding: 10, borderRadius: 5 },
  error: { color: 'red', marginTop: 10 },
});
