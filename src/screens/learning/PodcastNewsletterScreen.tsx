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
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { 
  PRIMARY_GREEN, 
  WHITE, 
  TEXT_PRIMARY, 
  TEXT_SECONDARY, 
  BG_LIGHT, 
  Fonts,
  DARK_GREEN 
} from '../../constants';
import { LEARNING_CONTENT } from '../../constants/learningData';

const { width } = Dimensions.get('window');

const PodcastNewsletterScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'podcasts' | 'newsletters'>('all');

  const podcasts = useMemo(() => 
    LEARNING_CONTENT.filter(item => item.type === 'podcast'), []
  );

  const displayedContent = useMemo(() => {
    if (activeTab === 'podcasts') return podcasts;
    // For now newsletters are mock articles or similar, we'll just show podcasts if no newsletters defined
    return podcasts; 
  }, [activeTab, podcasts]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>From BOF OAU</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.heroSection}>
          <View style={styles.bofChip}>
            <Text style={styles.bofChipText}>BOF OAU</Text>
          </View>
          <Text style={styles.heroTitle}>Stay Informed & Keep Learning</Text>
          <Text style={styles.heroSubtitle}>Fresh financial content from the Bureau of Finance, OAU</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {[
              { id: 'all', label: 'All Content' },
              { id: 'podcasts', label: 'Podcasts' },
              { id: 'newsletters', label: 'Newsletters' }
            ].map(tab => (
              <TouchableOpacity 
                key={tab.id}
                style={[
                  styles.tab,
                  activeTab === tab.id && styles.tabActive
                ]}
                onPress={() => setActiveTab(tab.id as any)}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive
                ]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Podcast Card */}
        {activeTab !== 'newsletters' && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionLabel}>Latest Episode</Text>
            <TouchableOpacity 
              style={styles.featuredPodcast}
              onPress={() => router.push({
                pathname: '/learning/detail' as any,
                params: { id: podcasts[0].id }
              })}
            >
              <Image 
                source={require('../../../assets/images/Market Pulse.svg')} 
                style={styles.featuredCover}
                contentFit="contain"
              />
              <View style={styles.featuredInfo}>
                <View style={styles.liveBadge}>
                   <View style={styles.liveDot} />
                   <Text style={styles.liveText}>NEW RELEASE</Text>
                </View>
                <Text style={styles.featuredTitle}>{podcasts[0].title}</Text>
                <Text style={styles.featuredMeta}>EP 0{podcasts[0].episodeNumber} • {podcasts[0].duration}</Text>
                <View style={styles.listenBtn}>
                  <Ionicons name="play" size={16} color={WHITE} />
                  <Text style={styles.listenBtnText}>Listen Now</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* List Items */}
        <View style={styles.listSection}>
          <Text style={styles.sectionLabel}>Past Episodes</Text>
          {displayedContent.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.itemRow}
              onPress={() => router.push({
                pathname: '/learning/detail' as any,
                params: { id: item.id }
              })}
            >
              <View style={styles.itemIconBox}>
                <Image 
                  source={require('../../../assets/images/Market Pulse.svg')} 
                  style={styles.itemThumb}
                  contentFit="contain"
                />
                <View style={styles.itemPlayOverlay}>
                  <Ionicons name="play" size={12} color={WHITE} />
                </View>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.itemMeta}>EP 0{item.episodeNumber} • {item.duration} • 2 days ago</Text>
              </View>
              <TouchableOpacity style={styles.downloadBtn}>
                <Ionicons name="download-outline" size={20} color={TEXT_SECONDARY} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
  heroSection: {
    padding: 20,
    backgroundColor: WHITE,
  },
  bofChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F7ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  bofChipText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: PRIMARY_GREEN,
  },
  heroTitle: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: TEXT_PRIMARY,
    marginBottom: 8,
    lineHeight: 32,
  },
  heroSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_SECONDARY,
    lineHeight: 22,
  },
  tabsContainer: {
    backgroundColor: WHITE,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: PRIMARY_GREEN,
  },
  tabText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  tabTextActive: {
    color: WHITE,
  },
  featuredSection: {
    padding: 20,
  },
  sectionLabel: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  featuredPodcast: {
    flexDirection: 'row',
    backgroundColor: '#111827', // Dark Card
    borderRadius: 20,
    overflow: 'hidden',
    padding: 16,
  },
  featuredCover: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  featuredInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  liveText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: '#10B981',
  },
  featuredTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: WHITE,
    marginBottom: 4,
  },
  featuredMeta: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  listenBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: WHITE,
    marginLeft: 6,
  },
  listSection: {
    paddingHorizontal: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  itemIconBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    position: 'relative',
  },
  itemThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  itemPlayOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: WHITE,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  itemMeta: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  downloadBtn: {
    padding: 8,
  },
});

export default PodcastNewsletterScreen;
