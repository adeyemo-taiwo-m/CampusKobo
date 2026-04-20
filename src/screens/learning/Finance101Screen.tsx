import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
} from '../../constants';
import { Header } from '../../components/Header';
import { FINANCE_101_SERIES } from '../../constants/learningData';

export const Finance101Screen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Finance 101" showBack={true} onBack={() => router.back()} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Master the Basics</Text>
          <Text style={styles.heroSub}>A step-by-step guide to financial freedom for OAU students, curated by BOF.</Text>
        </View>

        <View style={styles.episodesList}>
          {FINANCE_101_SERIES.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.episodeCard}
              onPress={() => router.push({ pathname: '/learning/detail', params: { id: item.id } })}
            >
              <View style={[styles.episodeNumber, { backgroundColor: item.color }]}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <View style={styles.episodeInfo}>
                <Text style={styles.episodeTitle}>{item.title}</Text>
                <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color={TEXT_SECONDARY} />
                    <Text style={styles.metaText}>{item.duration}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={TEXT_SECONDARY} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollPadding: {
    paddingBottom: 40,
  },
  heroSection: {
    padding: 24,
    backgroundColor: '#F0FDF4',
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: PRIMARY_GREEN,
    marginBottom: 8,
  },
  heroSub: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: TEXT_SECONDARY,
    lineHeight: 22,
  },
  episodesList: {
    padding: 20,
    gap: 16,
  },
  episodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    gap: 16,
    elevation: 1,
  },
  episodeNumber: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: WHITE,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
});

export default Finance101Screen;
