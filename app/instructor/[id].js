import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { db } from '../../firebase/config';

export default function InstructorProfile() {
  const { id } = useLocalSearchParams();
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const snap = await getDoc(doc(db, 'instructors', id));
        if (snap.exists()) {
          setInstructor({ id: snap.id, ...snap.data() });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructor();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  if (!instructor) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#fff' }}>Instructor not found</Text>
      </View>
    );
  }

  // All instructor data is safely available from this point down
  const instructorStyles = instructor.styles
    ? instructor.styles
    : instructor.style
    ? [instructor.style]
    : ['Dance'];

  const openInAppBrowser = (url, title) => {
    router.push({ pathname: '/webview', params: { url, title } });
  };

  const handleBooking = () => {
    router.push({
      pathname: '/booking/[id]',
      params: {
        id: instructor.id,
        name: instructor.name,
        rate: String(instructor.rate ?? 0),
        groupRate: String(instructor.groupRate ?? 0),
      }
    });
  };

  const renderStars = (rating) => {
    if (!rating || rating === 0) return null;
    const full = Math.min(Math.floor(rating), 5);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <View style={styles.photoContainer}>
            {instructor.photoUrl ? (
              <Image
                source={{ uri: instructor.photoUrl }}
                style={styles.photo}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoEmoji}>💃</Text>
              </View>
            )}
            <View style={styles.onlineBadge}>
              <View style={[
                styles.onlineDot,
                { backgroundColor: instructor.available ? '#1D9E75' : '#888' }
              ]} />
            </View>
          </View>

          <Text style={styles.heroName}>{instructor.name ?? 'Instructor'}</Text>
          <Text style={styles.heroSub}>
            {instructorStyles[0]} · {instructor.city ?? ''}
          </Text>

          {instructor.rating > 0 && (
            <View style={styles.ratingRow}>
              <Text style={styles.stars}>{renderStars(instructor.rating)}</Text>
              <Text style={styles.ratingNum}>{instructor.rating}</Text>
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{instructor.experience ?? 0}</Text>
              <Text style={styles.statLbl}>years exp</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{instructor.students ?? 0}</Text>
              <Text style={styles.statLbl}>students</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{instructor.videos ?? 0}</Text>
              <Text style={styles.statLbl}>videos</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>

          {/* Style tags */}
          <View style={styles.tagRow}>
            {instructorStyles.map((s, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{s}</Text>
              </View>
            ))}
            <View style={[
              styles.tag,
              {
                backgroundColor: instructor.available
                  ? 'rgba(29,158,117,0.15)'
                  : 'rgba(136,136,136,0.15)',
                borderColor: instructor.available ? '#1D9E75' : '#555'
              }
            ]}>
              <Text style={[
                styles.tagText,
                { color: instructor.available ? '#1D9E75' : '#888' }
              ]}>
                {instructor.available ? '● Online available' : '● In-studio only'}
              </Text>
            </View>
          </View>

          {/* About */}
          {instructor.bio ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bioText}>{instructor.bio}</Text>
            </View>
          ) : null}

          {/* Pricing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <View style={styles.priceRow}>
              <View style={styles.priceCard}>
                <Text style={styles.priceType}>Private</Text>
                <Text style={styles.priceVal}>₹{instructor.rate ?? 0}</Text>
                <Text style={styles.priceSub}>per hour</Text>
              </View>
              {instructor.groupRate ? (
                <View style={[styles.priceCard, styles.priceCardAccent]}>
                  <Text style={styles.priceType}>Group</Text>
                  <Text style={styles.priceVal}>₹{instructor.groupRate}</Text>
                  <Text style={styles.priceSub}>per session</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Social media */}
          {(instructor.youtubeUrl || instructor.instagramUrl) ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Watch & follow</Text>
              <View style={styles.socialRow}>
                {instructor.youtubeUrl ? (
                  <TouchableOpacity
                    style={styles.socialBtn}
                    onPress={() => openInAppBrowser(
                      instructor.youtubeUrl, 'YouTube'
                    )}
                  >
                    <Text style={styles.socialIcon}>▶</Text>
                    <View>
                      <Text style={styles.socialLabel}>YouTube</Text>
                      <Text style={styles.socialSub}>Watch tutorials</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {instructor.instagramUrl ? (
                  <TouchableOpacity
                    style={[styles.socialBtn, styles.socialBtnIG]}
                    onPress={() => openInAppBrowser(
                      instructor.instagramUrl, 'Instagram'
                    )}
                  >
                    <Text style={styles.socialIcon}>◆</Text>
                    <View>
                      <Text style={styles.socialLabel}>Instagram</Text>
                      <Text style={styles.socialSub}>See reels & posts</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ) : null}

          {/* Book button */}
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={handleBooking}
          >
            <Text style={styles.bookBtnText}>Book a session</Text>
          </TouchableOpacity>

          <View style={{ height: 48 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  loadingContainer: {
    flex: 1, backgroundColor: '#0a0a0f',
    alignItems: 'center', justifyContent: 'center'
  },
  hero: {
    backgroundColor: '#12121f', alignItems: 'center',
    paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: '#1e1e3a',
  },
  backBtn: {
    position: 'absolute', top: 56, left: 20,
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { color: '#fff', fontSize: 18 },
  photoContainer: { position: 'relative', marginBottom: 16 },
  photo: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: '#6C5CE7'
  },
  photoPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#1e1e3a', borderWidth: 3,
    borderColor: '#6C5CE7', alignItems: 'center', justifyContent: 'center',
  },
  photoEmoji: { fontSize: 44 },
  onlineBadge: {
    position: 'absolute', bottom: 4, right: 4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#0a0a0f',
    alignItems: 'center', justifyContent: 'center',
  },
  onlineDot: { width: 10, height: 10, borderRadius: 5 },
  heroName: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 4 },
  heroSub: { fontSize: 14, color: '#666', marginBottom: 10 },
  ratingRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, marginBottom: 20
  },
  stars: { fontSize: 14, color: '#F59E0B' },
  ratingNum: { fontSize: 14, color: '#F59E0B', fontWeight: '600' },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#0a0a0f',
    borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#1e1e3a', width: '100%',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#1e1e3a' },
  statVal: { fontSize: 22, fontWeight: '700', color: '#fff' },
  statLbl: { fontSize: 11, color: '#555', marginTop: 2 },
  body: { padding: 20 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  tag: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: 'rgba(108,92,231,0.15)',
    borderWidth: 1, borderColor: '#6C5CE7',
  },
  tagText: { fontSize: 12, color: '#6C5CE7', fontWeight: '500' },
  section: { marginTop: 24 },
  sectionTitle: {
    fontSize: 11, fontWeight: '600', color: '#555',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12,
  },
  bioText: { fontSize: 14, color: '#aaa', lineHeight: 22 },
  priceRow: { flexDirection: 'row', gap: 12 },
  priceCard: {
    flex: 1, backgroundColor: '#12121f', borderRadius: 16,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#1e1e3a',
  },
  priceCardAccent: {
    borderColor: '#6C5CE7',
    backgroundColor: 'rgba(108,92,231,0.08)'
  },
  priceType: {
    fontSize: 11, color: '#555',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6
  },
  priceVal: { fontSize: 28, fontWeight: '700', color: '#fff' },
  priceSub: { fontSize: 11, color: '#555', marginTop: 2 },
  socialRow: { gap: 10 },
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#1a1200', borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: '#F59E0B',
  },
  socialBtnIG: { backgroundColor: '#1a001a', borderColor: '#EC4899' },
  socialIcon: { fontSize: 20, width: 32, textAlign: 'center' },
  socialLabel: { fontSize: 14, fontWeight: '600', color: '#fff' },
  socialSub: { fontSize: 11, color: '#666', marginTop: 1 },
  bookBtn: {
    backgroundColor: '#6C5CE7', borderRadius: 16,
    padding: 18, alignItems: 'center', marginTop: 28,
  },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
});