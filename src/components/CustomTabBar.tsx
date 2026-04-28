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
  const router = useRouter();
  const currentRouteName = state.routes[state.index]?.name;

  // Only render the 4 visible tabs in the requested order
  const visibleRoutes = VISIBLE_TABS.map(name => 
    state.routes.find(r => r.name === name)
  ).filter(Boolean) as any[];

  const handleFabPress = () => {
    switch (currentRouteName) {
      case 'index':
      case 'expenses':
        router.push('/add-transaction');
        break;
      case 'budget':
        router.push('/budget/create');
        break;
      case 'savings':
        router.push('/savings/create');
        break;
      default:
        router.push('/add-transaction');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {visibleRoutes.map((route, index) => {
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

          const tabItem = (
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

          // Insert FAB after the second tab (Expenses)
          if (index === 2) {
            return (
              <React.Fragment key="fab-fragment">
                <View style={styles.fabContainer}>
                  <TouchableOpacity
                    style={styles.fabButton}
                    activeOpacity={0.8}
                    onPress={handleFabPress}
                  >
                    <Ionicons name="add" size={32} color={WHITE} />
                  </TouchableOpacity>
                </View>
                {tabItem}
              </React.Fragment>
            );
          }

          return tabItem;
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
    overflow: 'visible',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    overflow: 'visible',
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
  fabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PRIMARY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -35, // Lift it up
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 4,
    borderColor: WHITE,
  },
});
