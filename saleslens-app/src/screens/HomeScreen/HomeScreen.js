import React, { useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from '../../navigation/TabNavigator';

export default function HomeScreen() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}