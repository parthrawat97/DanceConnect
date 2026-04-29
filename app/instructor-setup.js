import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebase/config';

const STYLES = ['Bollywood', 'Classical', 'Contemporary', 'Hip-hop', 'Salsa', 'Kathak', 'Bharatanatyam', 'Jazz', 'Folk', 'Garba'];

export default function InstructorSetup() {
  const [photo, setPhoto] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [experience, setExperience] = useState('');
  const [rate, setRate] = useState('');
  const [groupRate, setGroupRate] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleStyle = (style) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };
  const pickPhoto = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission needed', 'Please allow access to your photo library.');
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });
  if (!result.canceled) {
    setPhoto(result.assets[0].uri);
  }
};

const uploadPhoto = async (uid) => {
  if (!photo) return null;
  setUploadingPhoto(true);
  try {
    const storage = getStorage();
    const response = await fetch(photo);
    const blob = await response.blob();
    const storageRef = ref(storage, `instructors/${uid}/profile.jpg`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (e) {
    console.error(e);
    return null;
  } finally {
    setUploadingPhoto(false);
  }
};
const handleSave = async () => {
  if (!name || !city || !experience || !rate || selectedStyles.length === 0) {
    Alert.alert('Missing info', 'Please fill in name, city, experience, rate and select at least one style.');
    return;
  }
  setLoading(true);
  try {
    const user = auth.currentUser;
    const photoUrl = await uploadPhoto(user.uid);
    await setDoc(doc(db, 'instructors', user.uid), {
      name, bio, city,
      experience: Number(experience),
      rate: Number(rate),
      groupRate: Number(groupRate),
      youtubeUrl, instagramUrl,
      styles: selectedStyles,
      style: selectedStyles[0],
      photoUrl: photoUrl || null,
      rating: 0, students: 0, videos: 0,
      available: true,
      createdAt: new Date().toISOString(),
      uid: user.uid,
    });
    Alert.alert('Profile saved!', 'Your instructor profile is now live.', [
      { text: 'OK', onPress: () => router.replace('/(tabs)/discover') }
    ]);
  } catch (e) {
    Alert.alert('Error', e.message);
  }
  setLoading(false);
};
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Set up your instructor profile</Text>
        <Text style={styles.heroSub}>Let learners discover you on DanceConnect</Text>
      </View>

      <View style={styles.form}>
        {/* Photo picker */}
<TouchableOpacity style={styles.photoPicker} onPress={pickPhoto}>
  {photo ? (
    <Image source={{ uri: photo }} style={styles.photoPreview} />
  ) : (
    <View style={styles.photoPlaceholder}>
      <Text style={styles.photoPlaceholderIcon}>📷</Text>
      <Text style={styles.photoPlaceholderText}>Add profile photo</Text>
    </View>
  )}
</TouchableOpacity>
        <Text style={styles.label}>Full name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Priya Sharma"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>City *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Delhi, Mumbai, Bangalore"
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tell learners about yourself, your training background, achievements..."
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Years of experience *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 8"
          value={experience}
          onChangeText={setExperience}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Dance styles *</Text>
        <Text style={styles.labelSub}>Select all that apply</Text>
        <View style={styles.stylesGrid}>
          {STYLES.map(style => (
            <TouchableOpacity
              key={style}
              style={[styles.styleChip, selectedStyles.includes(style) && styles.styleChipActive]}
              onPress={() => toggleStyle(style)}
            >
              <Text style={[styles.styleChipText, selectedStyles.includes(style) && styles.styleChipTextActive]}>
                {style}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Pricing</Text>

        <Text style={styles.label}>Private class rate (₹/hr) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 800"
          value={rate}
          onChangeText={setRate}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Group class rate (₹/session)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 300"
          value={groupRate}
          onChangeText={setGroupRate}
          keyboardType="numeric"
        />

        <Text style={styles.sectionTitle}>Social media</Text>
        <Text style={styles.sectionSub}>Link your accounts so learners can preview your teaching style</Text>

        <Text style={styles.label}>YouTube channel URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://youtube.com/@yourchannel"
          value={youtubeUrl}
          onChangeText={setYoutubeUrl}
          autoCapitalize="none"
          keyboardType="url"
        />

        <Text style={styles.label}>Instagram profile URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://instagram.com/yourhandle"
          value={instagramUrl}
          onChangeText={setInstagramUrl}
          autoCapitalize="none"
          keyboardType="url"
        />

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>
            {loading ? 'Saving...' : 'Go live on DanceConnect'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { backgroundColor: '#6C5CE7', padding: 28, paddingTop: 48 },
  heroTitle: { fontSize: 22, fontWeight: '600', color: '#fff' },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  form: { padding: 20 },
  label: { fontSize: 13, fontWeight: '500', color: '#444', marginBottom: 6, marginTop: 16 },
  labelSub: { fontSize: 12, color: '#999', marginBottom: 8, marginTop: -4 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 14, fontSize: 14, color: '#333', backgroundColor: '#fafafa' },
  textArea: { height: 100, textAlignVertical: 'top' },
  stylesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  styleChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fafafa' },
  styleChipActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
  styleChipText: { fontSize: 13, color: '#666' },
  styleChipTextActive: { color: '#fff', fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#222', marginTop: 28, marginBottom: 4 },
  sectionSub: { fontSize: 12, color: '#999', marginBottom: 4 },
  saveBtn: { backgroundColor: '#6C5CE7', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 32 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '500' }, photoPicker: { alignSelf: 'center', marginBottom: 24 },
photoPreview: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#6C5CE7' },
photoPlaceholder: {
  width: 100, height: 100, borderRadius: 50,
  backgroundColor: '#1a1a2e', borderWidth: 2,
  borderColor: '#6C5CE7', borderStyle: 'dashed',
  alignItems: 'center', justifyContent: 'center', gap: 4,
},
photoPlaceholderIcon: { fontSize: 24 },
photoPlaceholderText: { fontSize: 10, color: '#6C5CE7', textAlign: 'center' },
});