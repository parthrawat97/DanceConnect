import { router } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../firebase/config';

const STATUS_COLORS = {
  pending: { bg: 'rgba(239,159,39,0.1)', border: '#EF9F27', text: '#EF9F27' },
  confirmed: { bg: 'rgba(29,158,117,0.1)', border: '#1D9E75', text: '#1D9E75' },
  declined: { bg: 'rgba(216,90,48,0.1)', border: '#D85A30', text: '#D85A30' },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const user = auth.currentUser;
        const q = query(
          collection(db, 'bookings'),
          where('learnerUid', '==', user.uid)
        );
        const snap = await getDocs(q);
        const data = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBookings(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const renderBooking = ({ item }) => {
    const sc = STATUS_COLORS[item.status] || STATUS_COLORS.pending;
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardLeft}>
            <Text style={styles.cardName}>{item.instructorName}</Text>
            <Text style={styles.cardDate}>{new Date(item.date).toDateString()} · {item.timeSlot}</Text>
            <Text style={styles.cardType}>{item.sessionType === 'private' ? '👤 Private' : '👥 Group'}</Text>
          </View>
          <View style={styles.cardRight}>
            <Text style={styles.cardAmount}>₹{item.amount}</Text>
            <View style={[styles.statusBadge, { backgroundColor: sc.bg, borderColor: sc.border }]}>
              <Text style={[styles.statusText, { color: sc.text }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My bookings</Text>
        <View style={{ width: 38 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#6C5CE7" size="large" />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptySub}>Book your first session from the Discover tab</Text>
          <TouchableOpacity
            style={styles.discoverBtn}
            onPress={() => router.replace('/(tabs)/discover')}
          >
            <Text style={styles.discoverBtnText}>Browse instructors</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={i => i.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingTop: 56,
    paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#1e1e3a',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { color: '#fff', fontSize: 18 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  emptySub: { fontSize: 14, color: '#555', textAlign: 'center', paddingHorizontal: 40 },
  discoverBtn: {
    backgroundColor: '#6C5CE7', borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 12, marginTop: 16,
  },
  discoverBtnText: { color: '#fff', fontWeight: '600' },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#12121f', borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: '#1e1e3a',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLeft: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '600', color: '#fff', marginBottom: 4 },
  cardDate: { fontSize: 12, color: '#666', marginBottom: 4 },
  cardType: { fontSize: 12, color: '#555' },
  cardRight: { alignItems: 'flex-end', gap: 8 },
  cardAmount: { fontSize: 18, fontWeight: '700', color: '#fff' },
  statusBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: '600' },
});