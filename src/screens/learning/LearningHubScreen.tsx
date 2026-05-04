import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PRIMARY_GREEN,
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BACKGROUND,
  Fonts,
  Colors,
} from '../../constants';
import {
  LEARNING_CONTENT,
  FINANCE_101_SERIES,
  GLOSSARY_TERMS,
} from '../../constants/learningData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.45;

const CATEGORIES = ['All', 'Budgeting', 'Saving', 'Investing', 'Loans', 'Credit'];

export const LearningHubScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredContent = useMemo(() => {
    if (selectedCategory === 'All') return LEARNING_CONTENT;
    return LEARNING_CONTENT.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const featuredItem = useMemo(() => {
    return LEARNING_CONTENT.find((item) => item.isFeatured) || LEARNING_CONTENT[0];
  }, []);

  const latestContent = useMemo(() => {
    return LEARNING_CONTENT.filter((item) => !item.isFeatured).slice(0, 5);
  }, []);

  const EPISODE_COLORS = [
    '#E8F5E9', // green
    '#E3F2FD', // blue
    '#F3E5F5', // purple
    '#FFF3E0', // orange
    '#E0F2F1', // teal
    '#FFEBEE', // red
    '#FCE4EC', // pink
    '#FFFDE7', // yellow
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Hub</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Learn Finance</Text>
          <Text style={styles.welcomeSubtitle}>Grow your money knowledge</Text>
        </View>

        {/* Category Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Browse by topic</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category && styles.categoryChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Content */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Featured</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredCarousel}
            snapToInterval={width - 40 + 16}
            decelerationRate="fast"
          >
            {LEARNING_CONTENT.filter(item => item.isFeatured).map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={styles.featuredCard}
                onPress={() => router.push({
                  pathname: '/learning/detail' as any,
                  params: { id: item.id, type: item.type }
                })}
              >
                <View style={[styles.featuredImagePlaceholder, { backgroundColor: '#F0F9F4' }]}>
                  <Ionicons name="school-outline" size={80} color={PRIMARY_GREEN} />
                </View>
                <View style={styles.featuredInfo}>
                  <View style={styles.chipSmall}>
                    <Text style={styles.chipSmallText}>{item.category}</Text>
                  </View>
                  <Text style={styles.featuredTitle}>{item.title}</Text>
                  <View style={styles.featuredMetaRow}>
                    <Ionicons 
                      name={item.type === 'article' ? 'document-text-outline' : 'play-circle-outline'} 
                      size={14} 
                      color={TEXT_SECONDARY} 
                    />
                    <Text style={styles.featuredMeta}>
                      {item.type === 'article' ? 'Article' : 'Video'} • {item.duration}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Finance 101 Series */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionLabel}>Finance 101 Series</Text>
              <Text style={styles.sectionSublabel}>By BOF OAU</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/learning/finance101')}>
              <Text style={styles.viewAll}>View all →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.seriesContainer}
          >
            {FINANCE_101_SERIES.map((episode, index) => (
              <TouchableOpacity 
                key={episode.id}
                style={[
                  styles.episodeCard,
                  { backgroundColor: EPISODE_COLORS[index % EPISODE_COLORS.length] }
                ]}
                onPress={() => router.push({
                  pathname: '/learning/detail' as any,
                  params: { id: episode.id, isSeries: 'true', type: 'article' }
                })}
              >
                <Text style={styles.episodeNumber}>EP 0{episode.episodeNumber}</Text>
                <Text style={styles.episodeTitle} numberOfLines={2}>{episode.title}</Text>
                <Text style={styles.episodeDuration}>{episode.duration}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Latest Content */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Latest</Text>
          {latestContent.map((item, index) => {
            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.latestCard}
                onPress={() => router.push({
                  pathname: '/learning/detail' as any,
                  params: { id: item.id, type: item.type }
                })}
              >
                <View style={[styles.latestImagePlaceholder, { backgroundColor: '#F0F9F4' }]}>
                  <Ionicons 
                    name={item.type === 'article' ? 'document-text' : 'play-circle'} 
                    size={30} 
                    color={PRIMARY_GREEN} 
                  />
                </View>
                <View style={styles.latestInfo}>
                  <View style={styles.chipTiny}>
                    <Text style={styles.chipTinyText}>{item.category}</Text>
                  </View>
                  <Text style={styles.latestTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.latestMetaRow}>
                    <Ionicons 
                      name={item.type === 'article' ? 'book-outline' : 
                            item.type === 'video' ? 'videocam-outline' : 'headset-outline'} 
                      size={14} 
                      color={TEXT_SECONDARY} 
                    />
                    <Text style={styles.latestMetaText}>{item.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* From BOF OAU */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>From BOF OAU</Text>
            <TouchableOpacity onPress={() => router.push('/learning/podcast')}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.podcastContainer}
          >
            {LEARNING_CONTENT.filter(item => item.type === 'podcast').map((pod, index) => (
              <TouchableOpacity 
                key={pod.id}
                style={styles.podcastCard}
                onPress={() => router.push({
                  pathname: '/learning/detail' as any,
                  params: { id: pod.id, type: 'podcast' }
                })}
              >
                <View style={styles.podcastIconWrapper}>
                   <View style={styles.podcastIconCircle}>
                      <MaterialCommunityIcons name="podcasts" size={28} color={WHITE} />
                   </View>
                </View>
                <Text style={styles.podcastEpText}>EP 0{pod.episodeNumber} • {pod.title}</Text>
                <Text style={styles.podcastAction}>Listen now →</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Financial Glossary */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Financial Glossary</Text>
            <TouchableOpacity onPress={() => router.push('/learning/glossary')}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.glossaryList}>
            {GLOSSARY_TERMS.slice(0, 3).map((term, index) => (
              <TouchableOpacity 
                key={term.id}
                style={[
                  styles.glossaryRow,
                  index < 2 && styles.glossaryDivider
                ]}
                onPress={() => router.push('/learning/glossary')}
              >
                <View style={styles.glossaryIconBox}>
                  <Ionicons 
                    name={index === 0 ? 'wallet' : index === 1 ? 'book' : 'receipt'} 
                    size={24} 
                    color={PRIMARY_GREEN} 
                  />
                </View>
                <View style={styles.glossaryTextContent}>
                  <Text style={styles.glossaryTerm}>{term.term}</Text>
                  <Text style={styles.glossaryDef} numberOfLines={2}>
                    {term.definition}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: WHITE,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeTitle: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: TEXT_PRIMARY,
  },
  welcomeSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: TEXT_SECONDARY,
    marginTop: 4,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionLabel: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionSublabel: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginTop: -8,
  },
  viewAll: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryChipActive: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  categoryChipText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  categoryChipTextActive: {
    color: WHITE,
  },
  featuredCarousel: {
    paddingLeft: 20,
    paddingRight: 10,
    gap: 16,
  },
  featuredCard: {
    width: width - 56, // Peek effect
    backgroundColor: WHITE,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  featuredImagePlaceholder: {
    height: 180,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredIllustration: {
    width: '100%',
    height: '100%',
  },
  featuredInfo: {
    padding: 20,
    paddingTop: 12,
  },
  chipSmall: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipSmallText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: PRIMARY_GREEN,
  },
  featuredTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: TEXT_PRIMARY,
    lineHeight: 28,
    marginBottom: 8,
  },
  featuredMeta: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  seriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  episodeCard: {
    width: CARD_WIDTH,
    padding: 16,
    borderRadius: 16,
    minHeight: 120,
  },
  episodeNumber: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: TEXT_SECONDARY,
    opacity: 0.7,
    marginBottom: 6,
  },
  episodeTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: TEXT_PRIMARY,
    marginBottom: 8,
    flex: 1,
  },
  episodeDuration: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  latestCard: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  latestImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  latestIllustration: {
    width: '100%',
    height: '100%',
  },
  latestInfo: {
    flex: 1,
  },
  chipTiny: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  chipTinyText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: TEXT_SECONDARY,
  },
  latestTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: TEXT_PRIMARY,
    marginBottom: 6,
  },
  latestMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  latestMetaText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  podcastContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  podcastCard: {
    width: width * 0.65,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  podcastIconWrapper: {
    marginBottom: 16,
  },
  podcastIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  marketPulseBadge: {
    position: 'absolute',
    top: -4,
    left: 40,
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    width: 80,
  },
  marketPulseText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: WHITE,
    textAlign: 'center',
  },
  podcastLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  podcastEpText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
    lineHeight: 22,
    marginBottom: 8,
  },
  podcastAction: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  glossaryList: {
    marginHorizontal: 20,
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  glossaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  glossaryDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  glossaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E6F7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  glossaryTextContent: {
    flex: 1,
    marginRight: 8,
  },
  glossaryTerm: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  glossaryDef: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
  },
});
