import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';

function TabIcon({ icon, label, focused }) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.bar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ focused }) =>
            <TabIcon icon="🔍" label="Discover" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) =>
            <TabIcon icon="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#12121f',
    borderTopWidth: 1,
    borderTopColor: '#1e1e3a',
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: 8,
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: 4 },
  iconWrap: {
    width: 44, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: 'rgba(108,92,231,0.2)' },
  icon: { fontSize: 18 },
  label: { fontSize: 10, color: '#444', letterSpacing: 0.3 },
  labelActive: { color: '#6C5CE7', fontWeight: '600' },
});