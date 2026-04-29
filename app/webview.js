import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function InAppBrowser() {
  const { url, title } = useLocalSearchParams();

  // Intercept any navigation that tries to open instagram:// or other app links
  const handleNavigation = (request) => {
    const { url: navUrl } = request;
    // Block app scheme redirects — keep everything in the webview
    if (
      navUrl.startsWith('instagram://') ||
      navUrl.startsWith('fb://') ||
      navUrl.startsWith('youtube://') ||
      navUrl.startsWith('intent://')
    ) {
      return false; // Block the redirect
    }
    return true; // Allow normal web URLs
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title || url}</Text>
        <View style={{ width: 60 }} />
      </View>

      <WebView
        source={{ uri: url }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        onShouldStartLoadWithRequest={handleNavigation}
        // Use mobile user agent to get full mobile site
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#12121f',
    borderBottomWidth: 1, borderBottomColor: '#2a2a4a',
  },
  backBtn: { width: 60 },
  backText: { color: '#6C5CE7', fontSize: 15, fontWeight: '500' },
  headerTitle: { flex: 1, color: '#fff', fontSize: 13, textAlign: 'center', opacity: 0.7 },
  webview: { flex: 1 },
});