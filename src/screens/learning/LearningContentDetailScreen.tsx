import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  SPACING,
  BACKGROUND,
  BORDER_GRAY,
} from '../../constants';
import { Header } from '../../components/Header';
import { ProgressBar } from '../../components/ProgressBar';
import { LearningContent } from '../../types';

import {
  LEARNING_CONTENT,
  FINANCE_101_SERIES,
} from '../../constants/learningData';

const { width } = Dimensions.get('window');

const LearningContentDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, isSeries, type: paramType } = params;
  
  // Find content from data constants
  const foundContent = isSeries === 'true' 
    ? FINANCE_101_SERIES.find(e => e.id === id)
    : LEARNING_CONTENT.find(c => c.id === id);

  const content = params.content ? JSON.parse(params.content as string) as LearningContent : foundContent;
  const type = (paramType as 'article' | 'video' | 'podcast') || (content as any)?.type || 'article';

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Map FinanceSeriesEpisode to LearningContent structure if needed
  const displayContent = {
    id: content?.id || '1',
    title: content?.title || (type === 'article' ? 'How to stop overspending as a student' : 
           type === 'video' ? 'How to create your first budget' : 
           'Market Pulse Podcast - Ep 1'),
    category: (content as any)?.category || 'Budgeting',
    duration: content?.duration || (type === 'article' ? '3 mins read' : type === 'video' ? '5:00' : '15:00'),
    type: type,
    content: content?.content || 'As a student at OAU, managing your money can feel overwhelming...',
    keyTakeaways: (content as any)?.keyTakeaways || [
      'Separate needs from wants',
      'Use the 50/30/20 rule',
      'Track every expense daily',
      'Review your spending weekly',
    ],
    isFeatured: (content as any)?.isFeatured || false,
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (type !== 'article') return;
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const totalHeight = contentSize.height - layoutMeasurement.height;
    const currentProgress = totalHeight > 0 ? contentOffset.y / totalHeight : 0;
    setScrollProgress(Math.min(1, Math.max(0, currentProgress)));
  };

  const renderActionCTAs = () => (
    <View style={styles.ctaSection}>
      <Text style={styles.ctaHeader}>Apply what you learned</Text>
      <View style={styles.ctaContainer}>
        <TouchableOpacity 
          style={styles.ctaCard}
          onPress={() => router.push('/budget/create')}
        >
          <View style={[styles.ctaIconWrapper, { backgroundColor: '#E7F5ED' }]}>
            <Ionicons name="wallet-outline" size={20} color={PRIMARY_GREEN} />
          </View>
          <Text style={styles.ctaTitle}>Create a Budget</Text>
          <View style={styles.ctaRow}>
            <Text style={styles.ctaSubtitle}>Set spending limits for food, transport and more</Text>
            <Ionicons name="arrow-forward" size={14} color={TEXT_SECONDARY} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.ctaCard}
          onPress={() => router.push('/savings/create')}
        >
          <View style={[styles.ctaIconWrapper, { backgroundColor: '#E0F2FE' }]}>
            <Ionicons name="target" size={20} color="#0EA5E9" />
          </View>
          <Text style={styles.ctaTitle}>Set a Savings Goal</Text>
          <View style={styles.ctaRow}>
            <Text style={styles.ctaSubtitle}>Start putting money aside for something you love</Text>
            <Ionicons name="arrow-forward" size={14} color={TEXT_SECONDARY} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderKeyTakeaways = () => (
    <View style={styles.takeawaysCard}>
      <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
      {displayContent.keyTakeaways?.map((item, index) => (
        <View key={index} style={styles.takeawayItem}>
          <Text style={styles.takeawayIcon}>✅</Text>
          <Text style={styles.takeawayText}>{item}</Text>
        </View>
      ))}
    </View>
  );

  const renderArticle = () => (
    <>
      <Image 
        source={require('../../../assets/images/learning-article.png')} 
        style={styles.heroImage}
        resizeMode="cover"
      />
      
      <View style={styles.contentPadding}>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{displayContent.category}</Text>
        </View>
        
        <Text style={styles.title}>{displayContent.title}</Text>
        
        <View style={styles.metaRow}>
          <Ionicons name="document-text-outline" size={14} color={TEXT_SECONDARY} />
          <Text style={styles.metaText}> Article • {displayContent.duration} • April 2026</Text>
          <Text style={styles.timeRemainingText}>{Math.round((1 - scrollProgress) * 3)} min left</Text>
          <Text style={styles.percentText}>{Math.round(scrollProgress * 100)}%</Text>
        </View>

        <View style={styles.progressWrapper}>
          <ProgressBar progress={scrollProgress} height={4} fillColor={PRIMARY_GREEN} />
        </View>

        <Text style={styles.bodyText}>{displayContent.content}</Text>

        {renderKeyTakeaways()}
        {renderActionCTAs()}

        <View style={styles.relatedSection}>
          <Text style={styles.relatedHeader}>You Might Also Like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relatedScroll}>
            <TouchableOpacity style={styles.relatedCard}>
              <Image source={require('../../../assets/images/learning-related1.png')} style={styles.relatedImage} />
              <Text style={styles.relatedTitle} numberOfLines={2}>How to save on a student budget</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.relatedCard}>
              <Image source={require('../../../assets/images/learning-related2.png')} style={styles.relatedImage} />
              <Text style={styles.relatedTitle} numberOfLines={2}>Understanding investment risks</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </>
  );

  const renderVideo = () => (
    <>
      <View style={styles.videoPlayer}>
        <Image 
          source={require('../../../assets/images/market-pulse.png')} 
          style={styles.videoThumbnail}
          resizeMode="cover"
        />
        <View style={styles.videoOverlay}>
          <TouchableOpacity style={styles.playButtonLarge}>
            <Ionicons name="play" size={40} color={WHITE} />
          </TouchableOpacity>
          
          {/* Video Controls Overlay */}
          <View style={styles.videoControlsOverlay}>
            <View style={styles.videoControlsLeft}>
              <TouchableOpacity><Ionicons name="play-skip-back" size={24} color={WHITE} /></TouchableOpacity>
              <TouchableOpacity style={styles.controlMargin}><Ionicons name="refresh" size={24} color={WHITE} style={{ transform: [{ scaleX: -1 }] }} /></TouchableOpacity>
              <TouchableOpacity style={styles.controlMargin}><Ionicons name="refresh" size={24} color={WHITE} /></TouchableOpacity>
            </View>
            <View style={styles.videoControlsRight}>
              <TouchableOpacity><Ionicons name="settings-outline" size={20} color={WHITE} /></TouchableOpacity>
              <TouchableOpacity style={styles.controlMargin}><Ionicons name="play-skip-forward" size={24} color={WHITE} /></TouchableOpacity>
            </View>
          </View>
          <View style={styles.videoBottomProgress}>
             <ProgressBar progress={0.6} height={3} backgroundColor="rgba(255,255,255,0.3)" fillColor={WHITE} />
          </View>
        </View>
      </View>

      <View style={styles.contentPadding}>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{displayContent.category}</Text>
        </View>
        
        <Text style={styles.title}>{displayContent.title}</Text>
        
        <View style={styles.metaRow}>
          <Ionicons name="videocam-outline" size={14} color={TEXT_SECONDARY} />
          <Text style={styles.metaText}> Video • {displayContent.duration} • April 2026</Text>
          <Text style={styles.timeRemainingText}>2:00 / 3:00</Text>
          <Text style={styles.percentText}>60%</Text>
        </View>

        <View style={styles.progressWrapper}>
          <ProgressBar progress={0.6} height={8} fillColor={PRIMARY_GREEN} />
        </View>

        <Text style={styles.bodyText}>
          In this video, you will learn how to create your first budget, guiding you through the step by step process.
        </Text>
        
        <Text style={styles.subHeader}>In this video you will learn:</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• What a budget is</Text>
          <Text style={styles.bulletItem}>• How to set spending limits</Text>
          <Text style={styles.bulletItem}>• How to track your money</Text>
        </View>

        {renderKeyTakeaways()}
        {renderActionCTAs()}

        <View style={styles.relatedSection}>
          <Text style={styles.relatedHeader}>You Might Also Like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relatedScroll}>
            <TouchableOpacity style={styles.relatedCard}>
              <Image source={require('../../../assets/images/learning-article.png')} style={styles.relatedImage} />
              <Text style={styles.relatedTitle} numberOfLines={2}>How to stop overspending</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.relatedCard}>
              <Image source={require('../../../assets/images/learning-related1.png')} style={styles.relatedImage} />
              <Text style={styles.relatedTitle} numberOfLines={2}>Saving: Simple Hacks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.relatedCard}>
              <Image source={require('../../../assets/images/market-pulse.png')} style={styles.relatedImage} />
              <Text style={styles.relatedTitle} numberOfLines={2}>Investing Basics</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </>
  );

  const renderPodcast = () => (
    <View style={styles.podcastContainer}>
      <View style={styles.coverArtContainer}>
        <Image 
          source={require('../../../assets/images/market-pulse.png')} 
          style={styles.coverArtImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.contentPadding}>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{displayContent.category}</Text>
        </View>
        
        <Text style={styles.title}>{displayContent.title}</Text>
        <Text style={styles.podcastSubtitle}>By BOF OAU • April 2026</Text>

        <View style={styles.audioPlayer}>
          <View style={styles.audioProgressContainer}>
            <ProgressBar progress={0.3} height={4} fillColor={PRIMARY_GREEN} />
            <View style={styles.audioTimeRow}>
              <Text style={styles.audioTimeText}>5:30</Text>
              <Text style={styles.audioTimeText}>{displayContent.duration}</Text>
            </View>
          </View>

          <View style={styles.audioControls}>
            <TouchableOpacity><Ionicons name="play-skip-back" size={28} color={TEXT_PRIMARY} /></TouchableOpacity>
            <TouchableOpacity><Ionicons name="refresh" size={28} color={TEXT_PRIMARY} style={{ transform: [{ scaleX: -1 }] }} /></TouchableOpacity>
            <TouchableOpacity 
              style={styles.playPauseButton}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Ionicons name={isPlaying ? "pause" : "play"} size={32} color={WHITE} />
            </TouchableOpacity>
            <TouchableOpacity><Ionicons name="refresh" size={28} color={TEXT_PRIMARY} /></TouchableOpacity>
            <TouchableOpacity><Ionicons name="play-skip-forward" size={28} color={TEXT_PRIMARY} /></TouchableOpacity>
          </View>

          <View style={styles.audioExtraRow}>
            <TouchableOpacity><Ionicons name="volume-medium-outline" size={24} color={TEXT_PRIMARY} /></TouchableOpacity>
            <View style={styles.volumeBar}>
              <View style={[styles.volumeFill, { width: '40%' }]} />
            </View>
            <TouchableOpacity style={styles.speedButton}><Text style={styles.speedText}>1x</Text></TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subHeader}>About this episode</Text>
        <Text style={styles.bodyText}>
          Learn how to make your allowance last all month with simple money habits.
        </Text>

        {renderKeyTakeaways()}

        <View style={styles.moreEpisodesSection}>
          <Text style={styles.relatedHeader}>More Episodes</Text>
          {[
            { id: '1', title: 'The Nigerian Economy Explained', duration: '24 min' },
            { id: '2', title: 'How to Invest in Stocks Locally', duration: '31 min' },
            { id: '3', title: 'Crypto in Nigeria — Risk or Reward?', duration: '18 min' },
            { id: '4', title: 'Saving on a Student Budget', duration: '12 min' },
          ].map((item) => (
            <TouchableOpacity key={item.id} style={styles.episodeItem}>
              <View style={styles.episodeCover}>
                <Image 
                  source={require('../../../assets/images/market-pulse.png')} 
                  style={styles.episodeLogo} 
                />
              </View>
              <View style={styles.episodeInfo}>
                <Text style={styles.episodeTitle}>{item.title}</Text>
                <Text style={styles.episodeDuration}>{item.duration}</Text>
              </View>
              <TouchableOpacity style={styles.episodePlayBtn}>
                <Ionicons name="play-circle" size={32} color={PRIMARY_GREEN} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {renderActionCTAs()}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title={type.charAt(0).toUpperCase() + type.slice(1)} 
        showBack={true} 
        onBack={() => router.back()}
        showBookmark={true}
        isBookmarked={isBookmarked}
        onBookmark={() => setIsBookmarked(!isBookmarked)}
      />

      <ScrollView 
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {type === 'article' && renderArticle()}
        {type === 'video' && renderVideo()}
        {type === 'podcast' && renderPodcast()}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  contentPadding: {
    padding: 20,
  },
  categoryChip: {
    backgroundColor: '#E7F5ED',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: 8,
  },
  categoryText: {
    color: PRIMARY_GREEN,
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 12,
    lineHeight: 32,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
  },
  timeRemainingText: {
    marginLeft: 'auto',
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
  },
  percentText: {
    marginLeft: 8,
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
  },
  progressWrapper: {
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    fontFamily: Fonts.regular,
    marginBottom: 24,
  },
  subHeader: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  bulletList: {
    marginBottom: 24,
    paddingLeft: 4,
  },
  bulletItem: {
    fontSize: 15,
    color: '#4B5563',
    marginBottom: 8,
    fontFamily: Fonts.regular,
  },
  takeawaysCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  takeawaysTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  takeawayItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  takeawayIcon: {
    marginRight: 10,
    fontSize: 16,
  },
  takeawayText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    fontFamily: Fonts.regular,
  },
  ctaSection: {
    marginBottom: 32,
  },
  ctaHeader: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  ctaContainer: {
    gap: 12,
  },
  ctaCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  ctaIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ctaTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaSubtitle: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    flex: 1,
    marginRight: 8,
  },
  relatedSection: {
    marginBottom: 20,
  },
  relatedHeader: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  relatedScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  relatedCard: {
    width: 180,
    marginRight: 16,
  },
  relatedImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  relatedTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
    lineHeight: 20,
  },

  // Video Styles
  videoPlayer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  videoThumbnail: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoControlsOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoControlsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoControlsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlMargin: {
    marginLeft: 15,
  },
  videoBottomProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  playButtonLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: WHITE,
  },
  videoDurationLabel: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    color: WHITE,
    fontSize: 12,
    fontFamily: Fonts.medium,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },

  // Podcast Styles
  podcastContainer: {
    flex: 1,
  },
  coverArtContainer: {
    padding: 40,
    alignItems: 'center',
  },
  coverArtImage: {
    width: 220,
    height: 220,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  podcastSubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
    marginBottom: 24,
  },
  audioPlayer: {
    marginBottom: 32,
  },
  audioProgressContainer: {
    marginBottom: 20,
  },
  audioTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  audioTimeText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  playPauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioExtraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volumeBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
  },
  volumeFill: {
    height: '100%',
    backgroundColor: TEXT_PRIMARY,
    borderRadius: 2,
  },
  speedButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  speedText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
  moreEpisodesSection: {
    marginBottom: 32,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  episodeCover: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  episodeLogo: {
    width: '100%',
    height: '100%',
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  episodeDuration: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
  },
  episodePlayBtn: {
    marginLeft: 8,
  }
});

export default LearningContentDetailScreen;
