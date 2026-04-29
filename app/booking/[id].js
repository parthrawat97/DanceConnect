import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text, TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../firebase/config';

const TIME_SLOTS = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM',
  '11:00 AM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
];

const DAYS = (() => {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      label: dayNames[d.getDay()],
      date: d.getDate(),
      month: monthNames[d.getMonth()],
      full: d.toDateString(),
    });
  }
  return days;
})();

export default function BookingScreen() {
  const { id, name, rate, groupRate } = useLocalSearchParams();
  const [sessionType, setSessionType] = useState('private');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const price = sessionType === 'private' ? Number(rate) : Number(groupRate);

  const handleConfirm = async () => {
    if (!selectedDay || !selectedSlot) {
      Alert.alert('Incomplete', 'Please select a date and time slot.');
      return;
    }
    setLoading(true);
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, 'bookings'), {
        learnerUid: user.uid,
        learnerEmail: user.email,
        instructorUid: id,
        instructorName: name,
        sessionType,
        date: selectedDay.full,
        timeSlot: selectedSlot,
        amount: price,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      router.replace({
        pathname: '/booking-success',
        params: { name, date: selectedDay.full, slot: selectedSlot, amount: price }
      });
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a session</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Instructor info bar */}
        <View style={styles.instructorBar}>
          <View style={styles.instructorAvatar}>
            <Text style={styles.instructorEmoji}>💃</Text>
          </View>
          <View>
            <Text style={styles.instructorName}>{name}</Text>
            <Text style={styles.instructorSub}>Select your session details below</Text>
          </View>
        </View>

        <View style={styles.body}>

          {/* Session type */}
          <Text style={styles.sectionTitle}>Session type</Text>
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[styles.typeCard, sessionType === 'private' && styles.typeCardActive]}
              onPress={() => setSessionType('private')}
            >
              <Text style={styles.typeIcon}>👤</Text>
              <Text style={[styles.typeLabel, sessionType === 'private' && styles.typeLabelActive]}>
                Private
              </Text>
              <Text style={[styles.typePrice, sessionType === 'private' && styles.typePriceActive]}>
                ₹{rate}/hr
              </Text>
            </TouchableOpacity>

            {groupRate > 0 && (
              <TouchableOpacity
                style={[styles.typeCard, sessionType === 'group' && styles.typeCardActive]}
                onPress={() => setSessionType('group')}
              >
                <Text style={styles.typeIcon}>👥</Text>
                <Text style={[styles.typeLabel, sessionType === 'group' && styles.typeLabelActive]}>
                  Group
                </Text>
                <Text style={[styles.typePrice, sessionType === 'group' && styles.typePriceActive]}>
                  ₹{groupRate}/session
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Date picker */}
          <Text style={styles.sectionTitle}>Select date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
            {DAYS.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.dayCard, selectedDay?.full === d.full && styles.dayCardActive]}
                onPress={() => setSelectedDay(d)}
              >
                <Text style={[styles.dayName, selectedDay?.full === d.full && styles.dayTextActive]}>
                  {d.label}
                </Text>
                <Text style={[styles.dayDate, selectedDay?.full === d.full && styles.dayTextActive]}>
                  {d.date}
                </Text>
                <Text style={[styles.dayMonth, selectedDay?.full === d.full && styles.dayTextActive]}>
                  {d.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time slots */}
          <Text style={styles.sectionTitle}>Select time</Text>
          <View style={styles.slotsGrid}>
            {TIME_SLOTS.map(slot => (
              <TouchableOpacity
                key={slot}
                style={[styles.slotChip, selectedSlot === slot && styles.slotChipActive]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Summary */}
          {selectedDay && selectedSlot && (
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Booking summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Instructor</Text>
                <Text style={styles.summaryVal}>{name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Session</Text>
                <Text style={styles.summaryVal}>{sessionType === 'private' ? 'Private · 1 hr' : 'Group class'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date</Text>
                <Text style={styles.summaryVal}>{selectedDay.label}, {selectedDay.date} {selectedDay.month}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time</Text>
                <Text style={styles.summaryVal}>{selectedSlot}</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalVal}>₹{price}</Text>
              </View>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Confirm button */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>₹{price}</Text>
          <Text style={styles.footerSub}>{sessionType === 'private' ? 'per hour' : 'per session'}</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmBtn, loading && { opacity: 0.6 }]}
          onPress={handleConfirm}
          disabled={loading}
        >
          <Text style={styles.confirmBtnText}>
            {loading ? 'Confirming...' : 'Confirm booking'}
          </Text>
        </TouchableOpacity>
      </View>
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

  instructorBar: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, backgroundColor: '#12121f',
    borderBottomWidth: 1, borderBottomColor: '#1e1e3a',
  },
  instructorAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1e1e3a', alignItems: 'center', justifyContent: 'center',
  },
  instructorEmoji: { fontSize: 22 },
  instructorName: { fontSize: 15, fontWeight: '600', color: '#fff' },
  instructorSub: { fontSize: 12, color: '#555', marginTop: 2 },

  body: { padding: 20 },
  sectionTitle: {
    fontSize: 11, fontWeight: '600', color: '#555',
    letterSpacing: 1.5, textTransform: 'uppercase',
    marginBottom: 12, marginTop: 24,
  },

  typeRow: { flexDirection: 'row', gap: 12 },
  typeCard: {
    flex: 1, backgroundColor: '#12121f', borderRadius: 14,
    padding: 16, alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: '#1e1e3a',
  },
  typeCardActive: { borderColor: '#6C5CE7', backgroundColor: 'rgba(108,92,231,0.1)' },
  typeIcon: { fontSize: 24 },
  typeLabel: { fontSize: 14, fontWeight: '600', color: '#666' },
  typeLabelActive: { color: '#fff' },
  typePrice: { fontSize: 12, color: '#555' },
  typePriceActive: { color: '#6C5CE7' },

  daysScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  dayCard: {
    alignItems: 'center', padding: 12, borderRadius: 14,
    backgroundColor: '#12121f', borderWidth: 1,
    borderColor: '#1e1e3a', marginRight: 10, minWidth: 62,
  },
  dayCardActive: { borderColor: '#6C5CE7', backgroundColor: 'rgba(108,92,231,0.1)' },
  dayName: { fontSize: 11, color: '#555', marginBottom: 4 },
  dayDate: { fontSize: 20, fontWeight: '700', color: '#888' },
  dayMonth: { fontSize: 10, color: '#555', marginTop: 2 },
  dayTextActive: { color: '#fff' },

  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotChip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 10, backgroundColor: '#12121f',
    borderWidth: 1, borderColor: '#1e1e3a',
  },
  slotChipActive: { borderColor: '#6C5CE7', backgroundColor: 'rgba(108,92,231,0.1)' },
  slotText: { fontSize: 13, color: '#666' },
  slotTextActive: { color: '#fff', fontWeight: '500' },

  summary: {
    backgroundColor: '#12121f', borderRadius: 16,
    padding: 16, marginTop: 24,
    borderWidth: 1, borderColor: '#1e1e3a',
  },
  summaryTitle: { fontSize: 13, fontWeight: '600', color: '#fff', marginBottom: 14 },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1e1e3a',
  },
  summaryLabel: { fontSize: 13, color: '#555' },
  summaryVal: { fontSize: 13, color: '#aaa', fontWeight: '500' },
  summaryTotal: { borderBottomWidth: 0, marginTop: 4 },
  summaryTotalLabel: { fontSize: 15, fontWeight: '600', color: '#fff' },
  summaryTotalVal: { fontSize: 20, fontWeight: '700', color: '#6C5CE7' },

  footer: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20, paddingBottom: 36,
    backgroundColor: '#12121f',
    borderTopWidth: 1, borderTopColor: '#1e1e3a',
  },
  footerPrice: { fontSize: 24, fontWeight: '700', color: '#fff' },
  footerSub: { fontSize: 11, color: '#555', marginTop: 2 },
  confirmBtn: {
    backgroundColor: '#6C5CE7', borderRadius: 14,
    paddingHorizontal: 28, paddingVertical: 16,
  },
  confirmBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});