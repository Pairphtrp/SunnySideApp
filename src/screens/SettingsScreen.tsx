import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useUnit } from '../context/UnitContext';
import { colors } from '../styles/theme';

const SettingsScreen = () => {
  const { unit, toggleUnit } = useUnit();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Temperature Unit</Text>
        <Switch value={unit === 'metric'} onValueChange={toggleUnit} />
        <Text>{unit === 'metric' ? '°C' : '°F'}</Text>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: colors.primary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
});
