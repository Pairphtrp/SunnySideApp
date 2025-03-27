import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TenDayScreen = () => (
  <View style={styles.container}>
    <Text>10-Day Forecast Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default TenDayScreen;
