import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
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

export const PodcastListScreen = () => {
  const router = useRouter();
  const { allContent } = useLearningContext();
  const podcasts = allContent.filter(c => c.type === 'podcast');

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Market Pulse Podcast" showBack={true} onBack={() => router.back()} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.heroArt}>
           <View style={styles.artContainer}>
                <Image 
                  source={getLearningImageSource({ type: 'podcast' })} 
                  style={styles.artImage}
                  resizeMode="cover"
                />
           </View>
           <Text style={styles.heroTitle}>Market Pulse</Text>
           <Text style={styles.heroHost}>By BOF OAU</Text>
           <View style={styles.playAllRow}>
                <TouchableOpacity style={styles.playBtn}>
                    <Ionicons name="play" size={20} color={WHITE} />
                    <Text style={styles.playText}>Play Latest</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.followBtn}>
                    <Text style={styles.followText}>Follow</Text>
                </TouchableOpacity>
           </View>
        </View>

        <View style={styles.episodesList}>
          <Text style={styles.sectionTitle}>All Episodes</Text>
          {podcasts.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.episodeCard}
              onPress={() => router.push({ pathname: '/learning/detail', params: { id: item.id, type: 'podcast' } })}
            >
              <View style={styles.episodeLeft}>
                    <View style={styles.episodeImageContainer}>
                      <Image 
                        source={getLearningImageSource(item)} 
                        style={styles.episodeImage}
                        resizeMode="cover"
                      />
                    </View>
                 <View style={styles.info}>
                    <Text style={styles.epTitle}>{item.title}</Text>
                    <Text style={styles.epMeta}>{item.duration} • Episode 0{item.episode_number}</Text>
                 </View>
              </View>
              <TouchableOpacity style={styles.downloadBtn}>
                 <Ionicons name="download-outline" size={22} color={TEXT_SECONDARY} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          
          {/* Mock extra episodes */}
          {[2, 3, 4].map(idx => (
            <View key={idx} style={[styles.episodeCard, { opacity: 0.5 }]}>
              <View style={styles.episodeLeft}>
                 <View style={styles.thumb}>
                    <Ionicons name="lock-closed" size={20} color={TEXT_SECONDARY} />
                 </View>
                 <View style={styles.info}>
                    <Text style={styles.epTitle}>Market Pulse — EP 0{idx}</Text>
                    <Text style={styles.epMeta}>Coming Soon</Text>
                 </View>
              </View>
            </View>
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
  heroArt: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FAFAFA',
  },
  artContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: WHITE,
  },
  artImage: {
    width: '100%',
    height: '100%',
  },
  heroTitle: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: TEXT_PRIMARY,
  },
  heroHost: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: PRIMARY_GREEN,
    marginTop: 4,
  },
  playAllRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 99,
    gap: 8,
  },
  playText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: WHITE,
  },
  followBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  followText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  episodesList: {
    padding: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: TEXT_PRIMARY,
    marginBottom: 20,
  },
  episodeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  episodeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  episodeImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  episodeImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
  },
  epTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  epMeta: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  downloadBtn: {
    padding: 8,
  }
});

export default PodcastListScreen;
