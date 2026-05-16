import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../context/AppContext";
import { WHITE, Fonts, SPACING } from "../constants";

interface MainHeaderProps {
  title?: string;
}

export const MainHeader = ({ title }: MainHeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, apiUser } = useAppContext();

  const initials = (apiUser?.full_name || user?.name || "CK")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const firstName = (apiUser?.full_name || user?.name || "there").split(" ")[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── TOP ROW: PROFILE & ACTIONS ── */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => router.push("/profile")}
        >
          <View style={styles.avatar}>
            {apiUser?.avatar_url ? (
              <Image
                key={apiUser.avatar_url}
                source={{ uri: apiUser.avatar_url }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.initialsAvatar}>
                <Text style={styles.initialsText}>{initials}</Text>
              </View>
            )}
          </View>
          <Text style={styles.greeting}>Hi, {firstName}</Text>
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/learning")}
          >
            <Ionicons name="school-outline" size={24} color={WHITE} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/profile/notifications")}
          >
            <Ionicons name="notifications-outline" size={24} color={WHITE} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── OPTIONAL CENTERED TITLE ── */}
      {title && (
        <Text style={styles.headerTitle}>{title}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.LG,
    paddingVertical: 12,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  avatarImage: {
    width: 38,
    height: 38,
  },
  initialsAvatar: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  greeting: {
    fontFamily: Fonts.semiBold,
    color: WHITE,
    fontSize: 16,
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: Fonts.medium,
    color: WHITE,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
    marginTop: -4, // Slight pull up to balance with top row
  },
});
