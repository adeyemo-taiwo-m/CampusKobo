import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Platform, Text } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PRIMARY_GREEN, WHITE, Fonts } from '../constants';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 65;

const VISIBLE_TABS = ['index', 'expenses', 'budget', 'savings'] as const;
const TAB_TITLES: Record<string, string> = {
  index: 'Home',
  expenses: 'Expenses',
  budget: 'Budget',
  savings: 'Savings',
};

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  // Only render the 4 visible tabs in the requested order
  const visibleRoutes = VISIBLE_TABS.map(name => 
    state.routes.find(r => r.name === name)
  ).filter(Boolean) as any[];

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {visibleRoutes.map((route) => {
          const { options } = descriptors[route.key];
          const isFocused = state.routes[state.index]?.name === route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const title = TAB_TITLES[route.name] ?? (options.title as string);

          let iconName: any = 'home-outline';
          switch (route.name) {
            case 'index':
              iconName = isFocused ? 'home' : 'home-outline';
              break;
            case 'expenses':
              iconName = isFocused ? 'receipt' : 'receipt-outline';
              break;
            case 'budget':
              iconName = isFocused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'savings':
              iconName = isFocused ? 'wallet' : 'wallet-outline';
              break;
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? PRIMARY_GREEN : '#6B7280'}
              />
              <Text style={[styles.tabLabel, { color: isFocused ? PRIMARY_GREEN : '#6B7280' }]}>
                {title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    height: TAB_BAR_HEIGHT,
    width: width,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // BORDER_GRAY
    paddingBottom: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontFamily: Fonts.medium,
  },
});
