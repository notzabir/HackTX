import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Platform, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const widgetHTML = `
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      background: transparent !important;
      overflow: hidden;
    }
    elevenlabs-convai {
      background: transparent !important;
    }
  </style>
  <elevenlabs-convai agent-id="agent_4901k6c3tqv6ehnbw926nze72jnc"></elevenlabs-convai>
  <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
  <div style="position: absolute; bottom: 10px; right: 10px;">
    <button style="background-color: #BF5700; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer;" id="callAgentButton">
      Call Agent
    </button>
  </div>
  <script>
    document.getElementById('callAgentButton').addEventListener('click', function() {
      window.ReactNativeWebView.postMessage('callAgent:+18449651889');
    });
  </script>
`;

export default function App() {
  const handleWebViewMessage = (event) => {
    const message = event.nativeEvent.data;
    if (message.startsWith('callAgent:')) {
      const phoneNumber = message.split(':')[1];
      Linking.openURL(`tel:${phoneNumber}`).catch((err) => console.error('Error opening dialer:', err));
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              let iconName;

              switch (route.name) {
                case 'Home':
                  iconName = 'home';
                  break;
                case 'Map':
                  iconName = 'map';
                  break;
                case 'Resources':
                  iconName = 'menu-book';
                  break;
                case 'Schedule':
                  iconName = 'schedule';
                  break;
                default:
                  iconName = 'help';
              }

              return <MaterialIcons name={iconName} color={color} size={size} />;
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="Resources" component={ResourcesScreen} />
          <Tab.Screen name="Schedule" component={ScheduleScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />

      {/* Eleven Labs Widget */}
      {Platform.OS === 'web' ? (
        <div style={styles.widgetContainer}>
          <elevenlabs-convai agent-id="agent_4901k6c3tqv6ehnbw926nze72jnc"></elevenlabs-convai>
          <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
        </div>
      ) : (
        <View style={styles.widgetContainerNative}>
          <WebView
            source={{ html: widgetHTML }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={['*']}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
            onMessage={handleWebViewMessage}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView error: ', nativeEvent);
            }}
          />
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  widgetContainer: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 9999,
    maxWidth: '90%',
    maxHeight: '90%',
    minWidth: 300,
    minHeight: 400,
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'transparent', // Restore transparency
    padding: 0,
    margin: 0,
  },
  widgetContainerNative: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 350,
    height: 500,
    zIndex: 9999,
    borderRadius: 15,
    overflow: 'visible',
    backgroundColor: 'transparent',
    elevation: 0,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
