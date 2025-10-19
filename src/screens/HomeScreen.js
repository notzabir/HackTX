import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';

const BURNTO_RANGE = '#BF5700';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Image source={require('../../assets/UT.png')} style={styles.logo} />
        <Text style={styles.title}>UT Austin Virtual Tour</Text>
        <Text style={styles.subtitle}>Explore campus, find resources, and manage your student life.</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Map')}>
            <Text style={styles.ctaText}>Start Tour</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callAgentButton} onPress={() => Linking.openURL('tel:+18887948480').catch((err) => console.error('Error opening dialer:', err))}>
            <Text style={styles.callAgentButtonText}>Call Agent</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Welcome</Text>
        <Text style={styles.panelText}>Use the Map to explore buildings. Check Resources for campus services and Schedule for your classes.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { padding: 24, alignItems: 'center', backgroundColor: '#fff' },
  logo: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: BURNTO_RANGE },
  subtitle: { fontSize: 14, color: '#333', textAlign: 'center', marginVertical: 8 },
  buttonRow: { flexDirection: 'row', marginTop: 12 },
  cta: { backgroundColor: BURNTO_RANGE, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginRight: 10 },
  ctaText: { color: '#fff', fontWeight: '700' },
  callAgentButton: { backgroundColor: BURNTO_RANGE, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  callAgentButtonText: { color: '#fff', fontWeight: '700' },
  panel: { margin: 16, padding: 16, backgroundColor: '#f7f7f7', borderRadius: 8 },
  panelTitle: { fontSize: 18, fontWeight: '600' },
  panelText: { marginTop: 8, color: '#444' }
});
