import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  BORDER_GRAY,
} from '../../constants';
import { Header } from '../../components/Header';
import { LEARNING_CONTENT } from '../../constants/learningData';

const { width } = Dimensions.get('window');

export const LearningContentDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const content = LEARNING_CONTENT.find(c => c.id === id) || LEARNING_CONTENT[0];
  const isArticle = content.type === 'article';
  const isVideo = content.type === 'video';
  const isPodcast = content.type === 'podcast';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBtn}>
            <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{content.type.charAt(0).toUpperCase() + content.type.slice(1)}</Text>
          <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)} style={styles.headerIconBtn}>
            <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={22} color={isBookmarked ? PRIMARY_GREEN : TEXT_PRIMARY} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Hero Visual */}
        <View style={styles.heroVisual}>
          {isArticle ? (
            <View style={styles.articlePlaceholder}>
               <Ionicons name="document-text-outline" size={80} color="#DCFCE7" />
            </View>
          ) : isVideo ? (
            <View style={styles.videoPlaceholder}>
               <View style={styles.playBtnLarge}>
                  <Ionicons name="play" size={40} color={WHITE} />
               </View>
               <Text style={styles.videoDuration}>5:00</Text>
            </View>
          ) : (
            <View style={styles.podcastPlaceholder}>
                <View style={styles.podcastArt}>
                    <Ionicons name="mic-outline" size={60} color={WHITE} />
                </View>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.catBadge}>
            <Text style={styles.catBadgeText}>{content.category}</Text>
          </View>
          <Text style={styles.title}>{content.title}</Text>
          <View style={styles.metaRow}>
             <Ionicons name={isArticle ? "book-outline" : isVideo ? "play-circle-outline" : "mic-outline"} size={14} color={TEXT_SECONDARY} />
             <Text style={styles.metaText}>{isArticle ? 'Article' : isVideo ? 'Video' : 'Podcast'} • {content.duration}</Text>
          </View>

          {isPodcast && (
              <View style={styles.podcastControls}>
                  <View style={styles.progressBarWrapper}>
                      <View style={styles.progressFull} />
                      <View style={[styles.progressCurrent, { width: '30%' }]} />
                  </View>
                  <View style={styles.timeLabels}>
                      <Text style={styles.timeText}>3:45</Text>
                      <Text style={styles.timeText}>15:00</Text>
                  </View>
                  <View style={styles.controlBtns}>
                      <TouchableOpacity><Ionicons name="play-back" size={28} color={TEXT_PRIMARY} /></TouchableOpacity>
                      <TouchableOpacity style={styles.playPauseBtn}><Ionicons name="pause" size={32} color={WHITE} /></TouchableOpacity>
                      <TouchableOpacity><Ionicons name="play-forward" size={28} color={TEXT_PRIMARY} /></TouchableOpacity>
                  </View>
              </View>
          )}

          <Text style={styles.contentBody}>
            {content.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
          </Text>

          {content.keyTakeaways && (
            <View style={styles.takeawaysCard}>
              <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
              {content.keyTakeaways.map((task, idx) => (
                <View key={idx} style={styles.takeawayItem}>
                  <Ionicons name="checkmark-circle" size={18} color={PRIMARY_GREEN} />
                  <Text style={styles.takeawayText}>{task}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.applySection}>
            <Text style={styles.applyTitle}>Apply What You Learned</Text>
            <TouchableOpacity style={styles.applyCard} onPress={() => router.push("/budget/create")}>
                <View style={[styles.applyIcon, { backgroundColor: '#F0FDF4' }]}>
                    <Ionicons name="bar-chart" size={20} color={PRIMARY_GREEN} />
                </View>
                <View style={styles.applyInfo}>
                    <Text style={styles.applyCardTitle}>Create a Budget</Text>
                    <Text style={styles.applyCardSub}>Set spending limits for food, transport and more →</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyCard} onPress={() => router.push("/savings/create")}>
                <View style={[styles.applyIcon, { backgroundColor: '#EFF6FF' }]}>
                    <Ionicons name="target" size={20} color="#3B82F6" />
                </View>
                <View style={styles.applyInfo}>
                    <Text style={styles.applyCardTitle}>Set a Savings Goal</Text>
                    <Text style={styles.applyCardSub}>Start putting money aside for something you love →</Text>
                </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  safeHeader: {
    backgroundColor: WHITE,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 56,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
  },
  scrollPadding: {
    paddingBottom: 40,
  },
  heroVisual: {
    width: '100%',
    height: 240,
    backgroundColor: '#F3F4F6',
  },
  articlePlaceholder: {
    flex: 1,
    backgroundColor: '#0B5E2F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: WHITE,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  podcastPlaceholder: {
    flex: 1,
    backgroundColor: '#4C1D95',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podcastArt: {
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  body: {
    padding: 20,
    marginTop: -24,
    backgroundColor: WHITE,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  catBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  catBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: '#16A34A',
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: TEXT_PRIMARY,
    lineHeight: 32,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  metaText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  contentBody: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: TEXT_PRIMARY,
    lineHeight: 26,
    marginBottom: 32,
  },
  takeawaysCard: {
    backgroundColor: '#F0FDF4',
    padding: 20,
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  takeawaysTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: '#16A34A',
    marginBottom: 16,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  takeawayText: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  applySection: {
    gap: 16,
  },
  applyTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  applyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    gap: 16,
  },
  applyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyInfo: {
    flex: 1,
  },
  applyCardTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  applyCardSub: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  podcastControls: {
    marginBottom: 32,
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderRadius: 24,
  },
  progressBarWrapper: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    position: 'relative',
    marginBottom: 10,
  },
  progressFull: {
    ...StyleSheet.absoluteFillObject,
  },
  progressCurrent: {
    height: '100%',
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 3,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  controlBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  playPauseBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  }
});

export default LearningContentDetailScreen;
