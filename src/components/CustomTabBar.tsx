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
import Svg, { Path } from "react-native-svg";
import { Fonts, PRIMARY_GREEN, WHITE } from "../constants";

const { width } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 65;

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

  const getPath = () => {
    const cutoutRadius = 45;
    const centerX = width / 2;
    // Creates a smooth curve around the center FAB
    return `
      M 0 0
      H ${centerX - cutoutRadius - 10}
      C ${centerX - cutoutRadius} 0, ${centerX - cutoutRadius + 5} ${cutoutRadius - 5}, ${centerX} ${cutoutRadius - 5}
      C ${centerX + cutoutRadius - 5} ${cutoutRadius - 5}, ${centerX + cutoutRadius} 0, ${centerX + cutoutRadius + 10} 0
      H ${width}
      V ${TAB_BAR_HEIGHT}
      H 0
      Z
    `;
  };

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg width={width} height={TAB_BAR_HEIGHT}>
          <Path
            d={getPath()}
            fill={WHITE}
            stroke="#E5E7EB"
            strokeWidth={1}
          />
        </Svg>
      </View>
      <View style={styles.tabsContainer}>
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
              iconName = isFocused ? "stats-chart" : "stats-chart-outline";
              break;
            case "savings":
              iconName = isFocused ? "disc" : "disc-outline";
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
                size={22}
                color={isFocused ? PRIMARY_GREEN : "#6B7280"}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? PRIMARY_GREEN : "#6B7280" },
                ]}
              >
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
    backgroundColor: "transparent", // Background handled by SVG
    height: TAB_BAR_HEIGHT,
    width: width,
    overflow: "visible",
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: TAB_BAR_HEIGHT,
  },
  tabsContainer: {
    flexDirection: "row",
    height: "100%",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    overflow: "visible",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontFamily: Fonts.medium,
  },
  fabContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  fabButton: {
    width: 68, // Slightly bigger as per visual
    height: 68,
    borderRadius: 34,
    backgroundColor: PRIMARY_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -52, // Lifted higher as requested
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 45,
    height: 4,
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 2,
  },
});
