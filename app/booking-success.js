import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BookingSuccess() {
  const { name, date, slot, amount } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✓</Text>
        </View>

        <Text style={styles.title}>Booking confirmed!</Text>
        <Text style={styles.sub}>Your session has been requested. The instructor will confirm shortly.</Text>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Instructor</Text>
            <Text style={styles.cardVal}>{name}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Date</Text>
            <Text style={styles.cardVal}>{new Date(date).toDateString()}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Time</Text>
            <Text style={styles.cardVal}>{slot}</Text>
          </View>
          <View style={[styles.cardRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.cardLabel}>Amount</Text>
            <Text style={[styles.cardVal, { color: '#6C5CE7', fontWeight: '700', fontSize: 18 }]}>
              ₹{amount}
            </Text>
          </View>
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            💡 Payment is collected after the instructor confirms your booking.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace('/(tabs)/discover')}
        >
          <Text style={styles.homeBtnText}>Back to discover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },

  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(29,158,117,0.15)',
    borderWidth: 2, borderColor: '#1D9E75',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  icon: { fontSize: 36, color: '#1D9E75' },

  title: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 10 },
  sub: {
    fontSize: 14, color: '#555', textAlign: 'center',
    lineHeight: 22, marginBottom: 32,
  },

  card: {
    backgroundColor: '#12121f', borderRadius: 16,
    borderWidth: 1, borderColor: '#1e1e3a',
    width: '100%', padding: 4,
  },
  cardRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 14,
    borderBottomWidth: 1, borderBottomColor: '#1e1e3a',
  },
  cardLabel: { fontSize: 13, color: '#555' },
  cardVal: { fontSize: 14, color: '#fff', fontWeight: '500' },

  noteBox: {
    backgroundColor: 'rgba(108,92,231,0.08)',
    borderRadius: 12, padding: 14, marginTop: 20,
    borderWidth: 1, borderColor: 'rgba(108,92,231,0.2)',
    width: '100%',
  },
  noteText: { fontSize: 13, color: '#888', lineHeight: 20 },

  footer: {
    padding: 20, paddingBottom: 40,
    borderTopWidth: 1, borderTopColor: '#1e1e3a',
  },
  homeBtn: {
    backgroundColor: '#6C5CE7', borderRadius: 14,
    padding: 18, alignItems: 'center',
  },
  homeBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});