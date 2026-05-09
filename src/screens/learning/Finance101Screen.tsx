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
import { useLearningContext } from '../../context/LearningContext';
import { getLearningImageSource } from '../../utils/learningUtils';
import { Image } from 'react-native';

export const Finance101Screen = () => {
  const router = useRouter();
  const { finance101Series } = useLearningContext();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Finance 101" showBack={true} onBack={() => router.back()} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Master the Basics</Text>
          <Text style={styles.heroSub}>A step-by-step guide to financial freedom for OAU students, curated by BOF.</Text>
        </View>

        <View style={styles.episodesList}>
          {finance101Series.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.episodeCard}
              onPress={() => router.push({ pathname: '/learning/detail', params: { id: item.id, isSeries: 'true' } })}
            >
              <View style={styles.episodeImageContainer}>
                <Image 
                  source={getLearningImageSource(item)} 
                  style={styles.episodeImage}
                  resizeMode="cover"
                />
                <View style={[styles.numberOverlay, { backgroundColor: (item as any).color || PRIMARY_GREEN }]}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>
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
  episodeImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
  },
  episodeImage: {
    width: '100%',
    height: '100%',
  },
  numberOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: WHITE,
  },
  numberText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
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
