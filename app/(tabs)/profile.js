import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebase/config';

export default function ProfileScreen() {
  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/instructor-setup')}
      >
        <Text style={styles.cardIcon}>🎭</Text>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Set up instructor profile</Text>
          <Text style={styles.cardSub}>List yourself as a dance instructor</Text>
        </View>

    <TouchableOpacity
  style={styles.card}
  onPress={() => router.push('/my-bookings')}
>
  <Text style={styles.cardIcon}>📅</Text>
  <View style={styles.cardText}>
    <Text style={styles.cardTitle}>My bookings</Text>
    <Text style={styles.cardSub}>View your upcoming sessions</Text>
  </View>
  <Text style={styles.arrow}>→</Text>
</TouchableOpacity>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '600', color: '#222', marginBottom: 28 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#eee', marginBottom: 12 },
  cardIcon: { fontSize: 28, marginRight: 14 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '500', color: '#222' },
  cardSub: { fontSize: 12, color: '#888', marginTop: 2 },
  arrow: { fontSize: 18, color: '#ccc' },
  logoutBtn: { marginTop: 'auto', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#ffdddd', alignItems: 'center' },
  logoutText: { color: '#e53935', fontWeight: '500' },
});