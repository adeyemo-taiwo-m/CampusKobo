import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Platform, Text } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PRIMARY_GREEN, WHITE, Fonts } from '../constants';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 80;

// The 4 visible tabs in order
const VISIBLE_TABS = ['index', 'expenses', 'savings', 'budget'] as const;
const TAB_TITLES: Record<string, string> = {
  index: 'Home',
  expenses: 'Expenses',
  savings: 'Savings',
  budget: 'Budget',
};

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const router = useRouter();

  // FAB action depends on which tab is focused
  const handleFabPress = () => {
    const currentRoute = state.routes[state.index]?.name;
    switch (currentRoute) {
      case 'savings':
        router.push('/savings/create');
        break;
      case 'budget':
        router.push('/budget/create');
        break;
      case 'expenses':
      case 'index':
      default:
        router.push('/add-transaction');
        break;
    }
  };

  // Only render the 4 visible tabs
  const visibleRoutes = state.routes.filter(r => VISIBLE_TABS.includes(r.name as any));

  return (
    <View style={styles.container}>
      {/* Curved SVG background */}
      <Svg width={width} height={TAB_BAR_HEIGHT} style={styles.svg}>
        <Path
          fill={WHITE}
          d={`
            M0,25 
            C0,11.19 11.19,0 25,0 
            L${width / 2 - 60},0 
            C${width / 2 - 45},0 ${width / 2 - 40},40 ${width / 2},40
            C${width / 2 + 40},40 ${width / 2 + 45},0 ${width / 2 + 60},0
            L${width - 25},0 
            C${width - 11.19},0 ${width},11.19 ${width},25 
            L${width},${TAB_BAR_HEIGHT} 
            L0,${TAB_BAR_HEIGHT} 
            Z
          `}
        />
      </Svg>

      <View style={styles.tabsContainer}>
        {visibleRoutes.map((route, visibleIndex) => {
          const { options } = descriptors[route.key];
          // isFocused: match by name since hidden tabs shift state.index
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
              iconName = isFocused ? 'list' : 'list-outline';
              break;
            case 'savings':
              iconName = isFocused ? 'disc' : 'disc-outline';
              break;
            case 'budget':
              iconName = isFocused ? 'bar-chart' : 'bar-chart-outline';
              break;
          }

          const tabItem = (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {isFocused && <View style={styles.activeIndicator} />}
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? PRIMARY_GREEN : '#9CA3AF'}
              />
              <Text style={[styles.tabLabel, { color: isFocused ? PRIMARY_GREEN : '#9CA3AF' }]}>
                {title}
              </Text>
            </TouchableOpacity>
          );

          // Insert FAB between Expenses (index 1) and Savings (index 2)
          if (visibleIndex === 2) {
            return (
              <React.Fragment key={`fab-${route.key}`}>
                {/* FAB */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleFabPress}
                  style={styles.fabButton}
                >
                  <Ionicons name="add" size={32} color={WHITE} />
                </TouchableOpacity>
                {/* Savings tab */}
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
    position: 'absolute',
    bottom: 0,
    width: width,
    height: TAB_BAR_HEIGHT,
    backgroundColor: 'transparent',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  svg: {
    position: 'absolute',
    top: 0,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: 10,
  },
  activeIndicator: {
    position: 'absolute',
    top: 10,
    width: 40,
    height: 4,
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 2,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontFamily: Fonts.regular,
  },
  fabButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: PRIMARY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    elevation: 12,
    shadowColor: PRIMARY_GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
});
