import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fonts, PRIMARY_GREEN, WHITE } from "../constants";

const { width } = Dimensions.get("window");

const VISIBLE_TABS = ["index", "expenses", "budget", "savings"] as const;
const TAB_TITLES: Record<string, string> = {
  index: "Home",
  expenses: "Expenses",
  budget: "Budget",
  savings: "Savings",
};

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const currentRouteName = state.routes[state.index]?.name;

  // Only render the 4 visible tabs in the requested order
  const visibleRoutes = VISIBLE_TABS.map((name) =>
    state.routes.find((r) => r.name === name),
  ).filter(Boolean) as any[];

  const handleFabPress = () => {
    switch (currentRouteName) {
      case "index":
      case "expenses":
        router.push("/add-transaction");
        break;
      case "budget":
        router.push("/budget/create");
        break;
      case "savings":
        router.push("/savings/create");
        break;
      default:
        router.push("/add-transaction");
    }
  };

  // Modern floating tab bar padding
  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPadding }]}>
      <View style={styles.container}>
        {visibleRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.routes[state.index]?.name === route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const title = TAB_TITLES[route.name] ?? (options.title as string);

          let iconName: any = "home-outline";
          switch (route.name) {
            case "index":
              iconName = isFocused ? "home" : "home-outline";
              break;
            case "expenses":
              iconName = isFocused ? "list" : "list-outline";
              break;
            case "budget":
              iconName = isFocused ? "pie-chart" : "pie-chart-outline";
              break;
            case "savings":
              iconName = isFocused ? "wallet" : "wallet-outline";
              break;
          }

          const tabItem = (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                <Ionicons
                  name={iconName}
                  size={24}
                  color={isFocused ? PRIMARY_GREEN : "#9CA3AF"}
                />
              </View>
              {isFocused && (
                <Text style={styles.tabLabel} numberOfLines={1}>
                  {title}
                </Text>
              )}
            </TouchableOpacity>
          );

          if (index === 1) { // Insert FAB after the second tab (Expenses)
            return (
              <React.Fragment key="fab-fragment">
                {tabItem}
                <View style={styles.fabContainer}>
                  <TouchableOpacity
                    style={styles.fabButton}
                    activeOpacity={0.9}
                    onPress={handleFabPress}
                  >
                    <Ionicons name="add" size={32} color={WHITE} />
                  </TouchableOpacity>
                </View>
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
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: width,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 20,
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: "row",
    backgroundColor: WHITE,
    width: width - 32, // 16 margin on each side
    height: 70,
    borderRadius: 35, // Fully rounded pill
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  activeIconContainer: {
    backgroundColor: `${PRIMARY_GREEN}15`, // Light green background for active icon
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: Fonts.semiBold,
    color: PRIMARY_GREEN,
    marginTop: 2,
  },
  fabContainer: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PRIMARY_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -35, // Protrudes outside the pill
    shadowColor: PRIMARY_GREEN,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#F9FAFB', // Outer stroke to blend with background
  },
});
