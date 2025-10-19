import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
// react-native-maps is native-only. We'll require it lazily inside a native-only
// component so the web bundler doesn't try to import native code and produce warnings.
import mapData from '../../data/map.json';

const BURNTO_RANGE = '#BF5700';

export default function MapScreen() {
  const [selected, setSelected] = useState(null);
  const [tourIndex, setTourIndex] = useState(0);
  const mapRef = useRef(null);
  const features = Array.isArray(mapData?.features) ? mapData.features : [];

  useEffect(() => {
    // center map on first feature
    if (features.length) {
      const f = features[0];
      const coords = f?.geometry?.coordinates;
      if (coords && Array.isArray(coords)) {
        const [lng, lat] = coords;
        mapRef.current?.animateToRegion({ latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 800);
      }
    }
  }, []);

  // If running on web, we mount a Leaflet map into a normal RN <View> via its DOM node.
  // This avoids importing react-leaflet and keeps the code native-friendly.
  const WebMap = ({ features, onMarkerPress }) => {
    const elRef = useRef(null);

    useEffect(() => {
      if (Platform.OS !== 'web') return;
      let map;
      try {
        const L = require('leaflet');
        // ensure CSS is loaded for leaflet on web
        try { require('leaflet/dist/leaflet.css'); } catch (e) { /* ignore css load errors */ }

        const node = elRef.current;
        if (!node) return;

        // node is the underlying DOM element when running on web
        map = L.map(node).setView([30.2849, -97.7341], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(map);

        const markers = [];
        (Array.isArray(features) ? features : []).forEach((f) => {
          const coords = f?.geometry?.coordinates;
          if (!coords || !Array.isArray(coords)) return;
          const [lng, lat] = coords;
          const m = L.marker([lat, lng]).addTo(map);
          m.on('click', () => onMarkerPress && onMarkerPress(f?.properties));
          markers.push(m);
        });

      } catch (err) {
        // Leaflet may not be available in some environments; don't crash the whole app
        // eslint-disable-next-line no-console
        console.warn('Web map init failed', err);
      }

      return () => {
        try { map && map.remove(); } catch (e) {}
      };
    }, [features, onMarkerPress]);

    return <View ref={elRef} style={{ flex: 1 }} />;
  };

  // NativeMap is only used on native platforms. It requires react-native-maps at
  // runtime to avoid static imports that cause webpack to include native modules.
  const NativeMap = ({ features, onMarkerPress }) => {
    if (Platform.OS === 'web') return null; // Ensure NativeMap is excluded on web

    let MapViewComponent = null;
    let MarkerComponent = null;
    try {
      const rnMaps = require('react-native-maps');
      MapViewComponent = rnMaps.default || rnMaps;
      MarkerComponent = rnMaps.Marker;
    } catch (e) {
      console.warn('react-native-maps not available. Please install the library using `npm install react-native-maps`.', e);
      return (
        <View style={styles.map}>
          <Text style={{ textAlign: 'center', marginTop: 20, color: 'red' }}>
            Map functionality is unavailable. Please install `react-native-maps`.
          </Text>
        </View>
      );
    }

    return (
      <MapViewComponent style={styles.map} ref={mapRef} initialRegion={{ latitude: 30.2849, longitude: -97.7341, latitudeDelta: 0.02, longitudeDelta: 0.02 }}>
        {features.map((f) => {
          const coords = f?.geometry?.coordinates;
          if (!coords || !Array.isArray(coords)) return null;
          const [lng, lat] = coords;
          return (
            <MarkerComponent key={f?.properties?.id ?? Math.random().toString()} coordinate={{ latitude: lat, longitude: lng }} onPress={() => onMarkerPress && onMarkerPress(f?.properties)}>
              <View style={styles.marker}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>🏛️</Text>
              </View>
            </MarkerComponent>
          );
        })}
      </MapViewComponent>
    );
  };

  function startTour() {
    setTourIndex(0);
    goToFeature(0);
  }

  function goToFeature(i) {
    const f = features[i];
    if (!f) return;
    setSelected(f?.properties ?? null);
    const coords = f?.geometry?.coordinates;
    if (!coords || !Array.isArray(coords)) return;
    const [lng, lat] = coords;
    mapRef.current?.animateToRegion({ latitude: lat, longitude: lng, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 800);
  }

  function nextStop() {
    const next = tourIndex + 1;
    if (next >= mapData.features.length) return;
    setTourIndex(next);
    goToFeature(next);
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <WebMap features={features} onMarkerPress={(p) => setSelected(p)} />
      ) : (
        <NativeMap features={features} onMarkerPress={(p) => setSelected(p)} />
      )}

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <TouchableOpacity style={styles.tourBtn} onPress={startTour}>
            <Text style={styles.tourBtnText}>Start Guided Tour</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tourBtnOutline} onPress={nextStop}>
            <Text style={{ color: BURNTO_RANGE }}>Next</Text>
          </TouchableOpacity>
        </View>

            {selected ? (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.name}>{selected?.name ?? 'Untitled'}</Text>
                <Text style={styles.desc}>{selected?.description ?? ''}</Text>
              </View>
            ) : (
              <Text style={{ color: '#666' }}>Tap a building to see details.</Text>
            )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  marker: { backgroundColor: '#BF5700', padding: 6, borderRadius: 20, borderWidth: 2, borderColor: '#fff' },
  panel: { position: 'absolute', left: 12, right: 12, bottom: 20, backgroundColor: '#fff', padding: 12, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  tourBtn: { backgroundColor: BURNTO_RANGE, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  tourBtnText: { color: '#fff', fontWeight: '700' },
  tourBtnOutline: { borderWidth: 1, borderColor: BURNTO_RANGE, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  name: { fontWeight: '700', fontSize: 16 },
  desc: { marginTop: 6, color: '#444' }
});
