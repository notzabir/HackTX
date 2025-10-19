import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import resources from '../../data/resources.json';

const BURNTO_RANGE = '#BF5700';

export default function ResourcesScreen() {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Campus Resources</Text>
        <Text style={styles.subtitle}>Find help across campus</Text>
      </View>

      <FlatList data={resources} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => setSelected(item)}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemCat}>{item.category}</Text>
        </TouchableOpacity>
      )} />

      {selected && (
        <View style={styles.detail}>
          <Text style={styles.detailTitle}>{selected.name}</Text>
          <Text>{selected.address}</Text>
          <Text style={{ marginTop: 8 }}>{selected.hours}</Text>
          <Text style={{ marginTop: 8, color: BURNTO_RANGE }}>{selected.phone}</Text>
          <TouchableOpacity style={styles.close} onPress={() => setSelected(null)}>
            <Text style={{ color: '#fff' }}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 20, fontWeight: '700', color: BURNTO_RANGE },
  subtitle: { color: '#666' },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  itemTitle: { fontWeight: '600' },
  itemCat: { color: '#888' },
  detail: { position: 'absolute', left: 16, right: 16, top: '30%', backgroundColor: '#fff', padding: 16, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  detailTitle: { fontWeight: '800', fontSize: 18 },
  close: { marginTop: 12, backgroundColor: BURNTO_RANGE, padding: 10, borderRadius: 8, alignItems: 'center' }
});
