import { router } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import { auth } from '../firebase/config';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.replace('/(tabs)/discover');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background circles for visual depth */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <View style={styles.content}>

        {/* Logo area */}
        <View style={styles.logoArea}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>💃</Text>
          </View>
          <Text style={styles.appName}>DANCECONNECT</Text>
          <Text style={styles.tagline}>Find your perfect dance instructor</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>{isLogin ? 'Welcome back' : 'Create account'}</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>✉</Text>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Please wait...' : isLogin ? 'Log in' : 'Sign up'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.toggleAccent}>
                {isLogin ? 'Sign up' : 'Log in'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },

  circle1: {
    position: 'absolute', width: 300, height: 300,
    borderRadius: 150, backgroundColor: '#6C5CE7',
    opacity: 0.08, top: -80, right: -80,
  },
  circle2: {
    position: 'absolute', width: 200, height: 200,
    borderRadius: 100, backgroundColor: '#6C5CE7',
    opacity: 0.06, bottom: 100, left: -60,
  },

  content: { flex: 1, justifyContent: 'center', padding: 28 },

  logoArea: { alignItems: 'center', marginBottom: 48 },
  logoIcon: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: '#6C5CE7', alignItems: 'center',
    justifyContent: 'center', marginBottom: 16,
  },
  logoEmoji: { fontSize: 36 },
  appName: {
    fontSize: 24, fontWeight: '700', color: '#fff',
    letterSpacing: 3, marginBottom: 8,
  },
  tagline: { fontSize: 14, color: '#555', letterSpacing: 0.3 },

  form: {
    backgroundColor: '#12121f',
    borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: '#2a2a4a',
  },
  formTitle: {
    fontSize: 20, fontWeight: '600', color: '#fff',
    marginBottom: 20, textAlign: 'center',
  },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1a1a2e', borderRadius: 12,
    borderWidth: 1, borderColor: '#2a2a4a',
    paddingHorizontal: 14, marginBottom: 12,
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 15, paddingVertical: 14 },

  button: {
    backgroundColor: '#6C5CE7', borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },

  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginVertical: 20, gap: 12,
  },
  divider: { flex: 1, height: 1, backgroundColor: '#2a2a4a' },
  dividerText: { color: '#555', fontSize: 13 },

  toggleBtn: { alignItems: 'center' },
  toggleText: { color: '#666', fontSize: 14 },
  toggleAccent: { color: '#6C5CE7', fontWeight: '600' },
});