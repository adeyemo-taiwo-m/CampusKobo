import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { 
  PRIMARY_GREEN, 
  WHITE, 
  TEXT_PRIMARY, 
  TEXT_SECONDARY, 
  BG_LIGHT, 
  Fonts 
} from '../../constants/theme';
import { LEARNING_CONTENT } from '../../constants/learningData';

const { width } = Dimensions.get('window');

const LearningContentDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const content = useMemo(() => {
    return LEARNING_CONTENT.find(item => item.id === id) || LEARNING_CONTENT[0];
  }, [id]);

  const relatedContent = useMemo(() => {
    if (!content.relatedContentIds) return LEARNING_CONTENT.filter(item => item.id !== content.id).slice(0, 3);
    return LEARNING_CONTENT.filter(item => content.relatedContentIds?.includes(item.id));
  }, [content]);

  const renderArticle = () => (
    <View style={styles.articleContainer}>
      <Image 
        source={require('../../../assets/images/featured-learning.png')} 
        style={styles.heroImage}
        contentFit="cover"
      />
      <View style={styles.contentPadding}>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>📄 Article • {content.duration} • 24 Oct 2024 • By BOF OAU</Text>
        </View>
        <Text style={styles.titleText}>{content.title}</Text>
        
        <Text style={styles.bodyText}>{content.content}</Text>

        {content.keyTakeaways && (
          <View style={styles.takeawaysBox}>
            <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
            {content.keyTakeaways.map((point, index) => (
              <View key={index} style={styles.takeawayItem}>
                <Text style={styles.takeawayCheck}>✅</Text>
                <Text style={styles.takeawayText}>{point}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Cards */}
        <View style={styles.actionSection}>
          <Text style={styles.sectionHeader}>Apply What You Learned</Text>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/budget/create')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.actionEmoji}>📊</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Create a Budget</Text>
              <Text style={styles.actionDesc}>Set spending limits for food, transport and more →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/savings/create')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#F3E5F5' }]}>
              <Text style={styles.actionEmoji}>🎯</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Set a Savings Goal</Text>
              <Text style={styles.actionDesc}>Start putting money aside for something you love →</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderVideo = () => (
    <View style={styles.videoContainer}>
      <View style={styles.videoPlayerPlaceholder}>
        <Ionicons name="play-circle" size={80} color={WHITE} />
        <Text style={styles.videoTime}>00:00 / {content.duration}</Text>
      </View>
      <View style={styles.contentPadding}>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>🎥 Video • {content.duration} • By BOF OAU</Text>
        </View>
        <Text style={styles.titleText}>{content.title}</Text>
        
        <Text style={styles.sectionHeader}>About this video</Text>
        <Text style={styles.bodyText}>{content.content}</Text>

        {/* Action Cards */}
        <View style={styles.actionSection}>
          <Text style={styles.sectionHeader}>Apply What You Learned</Text>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/budget/create')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.actionEmoji}>📊</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Create a Budget</Text>
              <Text style={styles.actionDesc}>Set spending limits for food, transport and more →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/savings/create')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#F3E5F5' }]}>
              <Text style={styles.actionEmoji}>🎯</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Set a Savings Goal</Text>
              <Text style={styles.actionDesc}>Start putting money aside for something you love →</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPodcast = () => (
    <View style={styles.podcastContainer}>
      <View style={styles.podcastHeader}>
        <Image 
          source={require('../../../assets/images/market-pulse.png')} 
          style={styles.podcastCover}
          contentFit="cover"
        />
        <View style={styles.audioControls}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '30%' }]} />
              <View style={styles.progressKnob} />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>04:20</Text>
              <Text style={styles.timeText}>{content.duration}</Text>
            </View>
          </View>
          
          <View style={styles.playbackButtons}>
            <TouchableOpacity>
              <MaterialCommunityIcons name="replay-15" size={32} color={TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.playBtn}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Ionicons name={isPlaying ? "pause" : "play"} size={32} color={WHITE} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons name="fast-forward-15" size={32} color={TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.contentPadding}>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>🎧 Podcast • {content.duration} • By BOF OAU</Text>
        </View>
        <Text style={styles.titleText}>{content.title}</Text>
        
        <Text style={styles.sectionHeader}>Show Notes</Text>
        <Text style={styles.bodyText}>{content.content}</Text>

        {/* Action Cards */}
        <View style={styles.actionSection}>
          <Text style={styles.sectionHeader}>Apply What You Learned</Text>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/budget/create')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.actionEmoji}>📊</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Create a Budget</Text>
              <Text style={styles.actionDesc}>Set spending limits for food, transport and more →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/savings/create')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#F3E5F5' }]}>
              <Text style={styles.actionEmoji}>🎯</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Set a Savings Goal</Text>
              <Text style={styles.actionDesc}>Start putting money aside for something you love →</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{content.category}</Text>
        <TouchableOpacity 
          onPress={() => setIsBookmarked(!isBookmarked)}
          style={styles.headerBtn}
        >
          <Ionicons 
            name={isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={isBookmarked ? PRIMARY_GREEN : TEXT_PRIMARY} 
          />
        </TouchableOpacity>
      </View>

      {/* Progress Bar (Articles) */}
      {content.type === 'article' && (
        <View style={styles.readingProgressContainer}>
          <View style={[styles.readingProgressBar, { width: '45%' }]} />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {content.type === 'article' && renderArticle()}
        {content.type === 'video' && renderVideo()}
        {content.type === 'podcast' && renderPodcast()}

        {/* Footer Feedback */}
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackText}>Was this helpful?</Text>
          <View style={styles.feedbackBtns}>
            <TouchableOpacity 
              style={[styles.feedbackBtn, feedback === 'up' && styles.feedbackBtnActive]}
              onPress={() => setFeedback('up')}
            >
              <Ionicons 
                name={feedback === 'up' ? "thumbs-up" : "thumbs-up-outline"} 
                size={24} 
                color={feedback === 'up' ? WHITE : TEXT_SECONDARY} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.feedbackBtn, feedback === 'down' && styles.feedbackBtnActive]}
              onPress={() => setFeedback('down')}
            >
              <Ionicons 
                name={feedback === 'down' ? "thumbs-down" : "thumbs-down-outline"} 
                size={24} 
                color={feedback === 'down' ? WHITE : TEXT_SECONDARY} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Related Content */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Related Content</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedCarousel}
          >
            {relatedContent.map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={styles.relatedCard}
                onPress={() => router.push({
                  pathname: '/learning/content-detail' as any,
                  params: { id: item.id }
                })}
              >
                <View style={styles.relatedIconBox}>
                  <Ionicons 
                    name={item.type === 'article' ? 'document-text' : 
                          item.type === 'video' ? 'play-circle' : 'mic'} 
                    size={24} 
                    color={PRIMARY_GREEN} 
                  />
                </View>
                <Text style={styles.relatedCardTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.relatedCardMeta}>{item.duration}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerBtn: {
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
  contentPadding: {
    padding: 20,
  },
  metaRow: {
    marginBottom: 12,
  },
  metaText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleText: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: TEXT_PRIMARY,
    lineHeight: 34,
    marginBottom: 20,
  },
  bodyText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: TEXT_PRIMARY,
    lineHeight: 26,
    marginBottom: 24,
  },
  sectionHeader: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  
  // Article Styles
  articleContainer: {},
  heroImage: {
    width: '100%',
    height: 220,
  },
  takeawaysBox: {
    backgroundColor: '#E6F7ED',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  takeawaysTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: PRIMARY_GREEN,
    marginBottom: 12,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PRIMARY_GREEN,
    marginTop: 8,
    marginRight: 10,
  },
  takeawayCheck: {
    fontSize: 14,
    marginRight: 10,
    marginTop: 2,
  },
  takeawayText: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_PRIMARY,
    lineHeight: 20,
  },

  // Action Cards Styles
  actionSection: {
    marginTop: 10,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  actionDesc: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
  },

  // Reading Progress Style
  readingProgressContainer: {
    height: 3,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  readingProgressBar: {
    height: '100%',
    backgroundColor: PRIMARY_GREEN,
  },

  // Video Styles
  videoContainer: {},
  videoPlayerPlaceholder: {
    width: '100%',
    height: 220,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTime: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: WHITE,
    marginTop: 12,
  },

  // Podcast Styles
  podcastContainer: {},
  podcastHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: WHITE,
  },
  podcastCover: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  audioControls: {
    width: '100%',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    position: 'relative',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 2,
  },
  progressKnob: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY_GREEN,
    position: 'absolute',
    top: -4,
    left: '30%',
    marginLeft: -6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  playbackButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: PRIMARY_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  // Related Styles
  relatedSection: {
    marginTop: 20,
  },
  relatedTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  relatedCarousel: {
    paddingHorizontal: 20,
    gap: 16,
  },
  relatedCard: {
    width: 160,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  relatedIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E6F7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  relatedCardTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_PRIMARY,
    lineHeight: 18,
    marginBottom: 6,
  },
  relatedCardMeta: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },

  // Feedback Styles
  feedbackSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: WHITE,
    marginVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  feedbackText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  feedbackBtns: {
    flexDirection: 'row',
    gap: 20,
  },
  feedbackBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackBtnActive: {
    backgroundColor: PRIMARY_GREEN,
  },
});

export default LearningContentDetailScreen;
