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
          <TouchableOpacity 
            style={styles.featuredCard}
            onPress={() => router.push({
              pathname: '/learning/content-detail' as any,
              params: { id: featuredItem.id }
            })}
          >
            <View style={styles.featuredImagePlaceholder}>
              <MaterialCommunityIcons name="image-outline" size={48} color={Colors.primary.P200} />
              <Text style={styles.illustrationText}>Illustration</Text>
            </View>
            <View style={styles.featuredInfo}>
              <View style={styles.chipSmall}>
                <Text style={styles.chipSmallText}>{featuredItem.category}</Text>
              </View>
              <Text style={styles.featuredTitle}>{featuredItem.title}</Text>
              <Text style={styles.featuredMeta}>
                {featuredItem.type === 'article' ? '📄 Article' : 
                 featuredItem.type === 'video' ? '🎥 Video' : '🎧 Podcast'} • {featuredItem.duration}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Finance 101 Series */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionLabel}>Finance 101 Series</Text>
              <Text style={styles.sectionSublabel}>By BOF OAU</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/learning/series')}>
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
                  pathname: '/learning/content-detail' as any,
                  params: { id: episode.id, isSeries: 'true' }
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
          {latestContent.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.latestCard}
              onPress={() => router.push({
                pathname: '/learning/content-detail' as any,
                params: { id: item.id }
              })}
            >
              <View style={styles.latestImagePlaceholder}>
                <Ionicons 
                  name={item.type === 'article' ? 'document-text' : 
                        item.type === 'video' ? 'play-circle' : 'mic'} 
                  size={24} 
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
          ))}
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={() => router.push('/learning/series')}
            >
              <View style={[styles.quickIconBox, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="book" size={20} color="#2196F3" />
              </View>
              <Text style={styles.quickText}>Finance 101</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={() => router.push('/learning/glossary')}
            >
              <View style={[styles.quickIconBox, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="document" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.quickText}>Glossary</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={() => router.push('/learning/podcast')}
            >
              <View style={[styles.quickIconBox, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="headphones" size={20} color="#FF9800" />
              </View>
              <Text style={styles.quickText}>Podcast</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* From BOF OAU */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>From BOF OAU</Text>
          <View style={styles.bofGrid}>
            <TouchableOpacity 
              style={styles.bofCard}
              onPress={() => router.push('/learning/podcast')}
            >
              <Text style={styles.bofEmoji}>🎧</Text>
              <Text style={styles.bofTitle}>Market Pulse Podcast</Text>
              <Text style={styles.bofLink}>Listen now →</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bofCard}
              onPress={() => router.push('/learning/podcast')}
            >
              <Text style={styles.bofEmoji}>📰</Text>
              <Text style={styles.bofTitle}>BOF Newsletter</Text>
              <Text style={styles.bofLink}>Read now →</Text>
            </TouchableOpacity>
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
  featuredCard: {
    marginHorizontal: 20,
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  featuredImagePlaceholder: {
    height: 160,
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.primary.P300,
    marginTop: 8,
  },
  featuredInfo: {
    padding: 20,
  },
  chipSmall: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
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
  quickAccessGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickAccessCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  quickIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: TEXT_PRIMARY,
    textAlign: 'center',
  },
  bofGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  bofCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  bofEmoji: {
    fontSize: 24,
    marginBottom: 12,
  },
  bofTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  bofLink: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: PRIMARY_GREEN,
  },
});
