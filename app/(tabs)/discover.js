import { router } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { db } from '../../firebase/config';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const CATEGORIES = ['All', 'Bollywood', 'Hip-hop', 'Contemporary', 'Salsa', 'Classical', 'Kathak'];

const GRADIENTS = [
  ['#2D1B69', '#6C5CE7'],
  ['#1a1a2e', '#4a4a8a'],
  ['#2d1b1b', '#8a4a4a'],
  ['#1b2d1b', '#4a8a4a'],
  ['#1b1b2d', '#5C5CE7'],
  ['#2d2d1b', '#8a8a4a'],
];

export default function DiscoverScreen() {
  const [instructors, setInstructors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const snap = await getDocs(collection(db, 'instructors'));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setInstructors(data);
        setFiltered(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchInstructors();
  }, []);

  useEffect(() => {
    let results = instructors;
    if (activeCategory !== 'All') {
      results = results.filter(i =>
        (i.styles || [i.style]).some(s =>
          s?.toLowerCase().includes(activeCategory.toLowerCase())
        )
      );
    }
    if (search) {
      results = results.filter(i =>
        i.name?.toLowerCase().includes(search.toLowerCase()) ||
        i.city?.toLowerCase().includes(search.toLowerCase()) ||
        (i.styles || [i.style]).some(s =>
          s?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    setFiltered(results);
  }, [search, activeCategory, instructors]);

  const getGradient = (index) => GRADIENTS[index % GRADIENTS.length];

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  };

  const renderCard = ({ item, index }) => {
    const [colorA, colorB] = getGradient(index);
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colorA }]}
        onPress={() => router.push({ pathname: '/instructor/[id]', params: { id: item.id } })}
        activeOpacity={0.85}
      >
        <View style={[styles.cardGradientOverlay, { backgroundColor: colorB }]} />
        <View style={styles.cardTop}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <TouchableOpacity style={styles.heartBtn}>
            <Text style={styles.heart}>♡</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardBottom}>
          <Text style={styles.cardRating}>
            {renderStars(item.rating || 0)}
            {item.rating > 0 ? ` ${item.rating}` : ' New'}
          </Text>
          <Text style={styles.cardName}>{item.name?.toUpperCase()}</Text>
          <Text style={styles.cardStyle}>
            {(item.styles || [item.style]).slice(0, 2).join(' & ').toUpperCase()}
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>
              ₹{item.rate}<Text style={styles.cardPriceSub}>/hr</Text>
            </Text>
            <TouchableOpacity style={styles.bookBtn}>
              <Text style={styles.bookBtnText}>BOOK NOW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6C5CE7" />
      <Text style={styles.loadingText}>Finding dancers near you...</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>DANCECONNECT</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Style, name, or city..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Title */}
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.titleMain}>TOP RATED</Text>
          <Text style={styles.titleAccent}>PROFESSIONALS</Text>
        </View>
        <Text style={styles.titleCount}>
          Showing {filtered.length} {filtered.length === 1 ? 'instructor' : 'instructors'}
        </Text>
      </View>

      {/* Grid */}
      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💃</Text>
          <Text style={styles.emptyTitle}>No instructors found</Text>
          <Text style={styles.emptySub}>Try a different style or city</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f' },
  loadingText: { color: '#888', marginTop: 12, fontSize: 14 },

  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12 },
  appName: { fontSize: 22, fontWeight: '700', color: '#6C5CE7', letterSpacing: 2 },

  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1a1a2e', borderRadius: 12,
    marginHorizontal: 16, paddingHorizontal: 14,
    marginBottom: 14, borderWidth: 1, borderColor: '#2a2a4a'
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', fontSize: 14, paddingVertical: 12 },

  categoriesScroll: { maxHeight: 44 },
  categoriesContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  categoryChip: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: '#2a2a4a',
    backgroundColor: '#1a1a2e'
  },
  categoryChipActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
  categoryText: { fontSize: 13, color: '#888' },
  categoryTextActive: { color: '#fff', fontWeight: '500' },

  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', paddingHorizontal: 16,
    marginTop: 20, marginBottom: 16
  },
  titleMain: { fontSize: 26, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  titleAccent: { fontSize: 26, fontWeight: '700', color: '#6C5CE7', letterSpacing: 1, fontStyle: 'italic' },
  titleCount: { fontSize: 11, color: '#666', marginBottom: 4 },

  grid: { paddingHorizontal: 16, paddingBottom: 100 },
  row: { gap: 16, marginBottom: 16 },

  card: {
    width: CARD_WIDTH, borderRadius: 16,
    overflow: 'hidden', minHeight: 220,
    justifyContent: 'space-between', padding: 14,
  },
  cardGradientOverlay: {
    position: 'absolute', top: 0, left: 0,
    right: 0, height: '50%', opacity: 0.3,
    borderRadius: 16,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center'
  },
  avatarIcon: { fontSize: 20 },
  heartBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center'
  },
  heart: { fontSize: 16, color: '#fff' },

  cardBottom: { marginTop: 16 },
  cardRating: { fontSize: 11, color: '#F59E0B', marginBottom: 4 },
  cardName: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 2 },
  cardStyle: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 12, letterSpacing: 0.5 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontSize: 18, fontWeight: '700', color: '#fff' },
  cardPriceSub: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '400' },
  bookBtn: {
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 6
  },
  bookBtnText: { fontSize: 10, fontWeight: '700', color: '#0a0a0f' },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  emptySub: { fontSize: 14, color: '#666', marginTop: 4 },
});