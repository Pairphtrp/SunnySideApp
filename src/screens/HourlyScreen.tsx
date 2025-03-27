import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HourlyScreen = () => (
  <View style={styles.container}>
    <Text>Hourly Forecast Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default HourlyScreen;
