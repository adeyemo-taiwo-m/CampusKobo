import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PRIMARY_GREEN, WHITE, TEXT_SECONDARY, SPACING } from '../constants';
import { Text } from 'react-native';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 80;

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
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
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

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

          let iconName: any = 'home-outline';
          if (route.name === 'index') iconName = isFocused ? 'home' : 'home-outline';
          else if (route.name === 'expenses') iconName = isFocused ? 'list' : 'list-outline';
          else if (route.name === 'savings') iconName = isFocused ? 'disc' : 'disc-outline';
          else if (route.name === 'budget') iconName = isFocused ? 'bar-chart' : 'bar-chart-outline';

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
              <Text style={[
                styles.tabLabel,
                { color: isFocused ? PRIMARY_GREEN : '#9CA3AF' }
              ]}>
                {options.title}
              </Text>
            </TouchableOpacity>
          );

          // Add FAB at the center (middle of 4 tabs)
          if (index === 2) {
            return [
              <TouchableOpacity
                key="fab-button"
                activeOpacity={0.8}
                onPress={() => navigation.navigate('add-transaction' as any)}
                style={styles.fabButton}
              >
                <View style={styles.fabIconContainer}>
                  <Ionicons name="add" size={32} color={WHITE} />
                </View>
              </TouchableOpacity>,
              tabItem
            ];
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
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
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
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins_400Regular',
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PRIMARY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    top: -30,
    elevation: 10,
    shadowColor: PRIMARY_GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  fabIconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
