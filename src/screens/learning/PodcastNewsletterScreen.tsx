import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LEARNING_CONTENT } from '../../constants/learningData';
import {
  PRIMARY_GREEN,
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BACKGROUND,
  Fonts,
  Colors,
} from '../../constants';

export const PodcastNewsletterScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState('All');
  const [email, setEmail] = useState('');

  // Get content
  const podcasts = LEARNING_CONTENT.filter(c => c.type === 'podcast');
  const latestPodcast = podcasts[0];

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    Alert.alert('Subscribed!', 'You will receive updates from BOF OAU.');
    setEmail('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.headerBtn} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>From BOF OAU</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.heroSection}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>BOF OAU</Text>
          </View>
          <Text style={styles.heroTitle}>Stay Informed & Keep Learning</Text>
          <Text style={styles.heroSubtitle}>Fresh financial content from the Bureau of Finance, OAU</Text>
        </View>

        {/* Category Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.chipsContainer}
        >
          {['All', 'Podcast', 'Newsletter'].map(tab => (
            <TouchableOpacity 
              key={tab}
              style={[styles.chip, selectedTab === tab && styles.chipActive]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.chipText, selectedTab === tab && styles.chipTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {(selectedTab === 'All' || selectedTab === 'Podcast') && (
          <>
            {/* Featured Banner Card */}
            <TouchableOpacity 
              style={styles.featuredCard}
              onPress={() => router.push({
                pathname: '/learning/detail' as any,
                params: { id: latestPodcast.id }
              })}
            >
              <View style={styles.featuredContent}>
                <View style={styles.latestBadge}>
                  <Text style={styles.latestBadgeText}>LATEST EPISODE</Text>
                </View>
                <Text style={styles.featuredTitle}>{latestPodcast.title}</Text>
                <View style={styles.featuredMeta}>
                  <Ionicons name="headset" size={14} color={WHITE} />
                  <Text style={styles.featuredMetaText}>Podcast • {latestPodcast.duration}</Text>
                </View>
                <View style={styles.listenNowBtn}>
                  <Text style={styles.listenNowText}>Listen Now →</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Podcast Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionLabel}>Market Pulse Podcast</Text>
                  <Text style={styles.sectionSublabel}>By BOF OAU Research Division</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.viewAll}>See all →</Text>
                </TouchableOpacity>
              </View>

              {podcasts.map((p, idx) => (
                <TouchableOpacity 
                  key={p.id} 
                  style={styles.podcastRow}
                  onPress={() => router.push({
                    pathname: '/learning/detail' as any,
                    params: { id: p.id }
                  })}
                >
                  <View style={styles.podcastCoverThumb}>
                    <Ionicons name="mic" size={24} color={PRIMARY_GREEN} />
                  </View>
                  <View style={styles.podcastInfo}>
                    <Text style={styles.podcastEpNum}>EP 0{idx + 1}</Text>
                    <Text style={styles.podcastTitle} numberOfLines={1}>{p.title}</Text>
                    <Text style={styles.podcastMeta}>{p.duration}</Text>
                  </View>
                  <View style={styles.playBtnSmall}>
                    <Text style={styles.playBtnText}>Play →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {(selectedTab === 'All' || selectedTab === 'Newsletter') && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionLabel}>BOF Newsletter</Text>
                <Text style={styles.sectionSublabel}>Stay updated with financial news and tips</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.newsletterCard}>
              <View style={styles.newsletterLeft}>
                <Text style={styles.newsletterDate}>April 2026</Text>
                <Text style={styles.newsletterTitle}>Monthly Finance Digest</Text>
                <View style={styles.newsletterMeta}>
                  <Text style={styles.newsletterMetaText}>📰 5 min read</Text>
                </View>
              </View>
              <View style={styles.readBtn}>
                <Text style={styles.readBtnText}>Read →</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.newsletterCard}>
              <View style={styles.newsletterLeft}>
                <Text style={styles.newsletterDate}>March 2026</Text>
                <Text style={styles.newsletterTitle}>Student Money Report</Text>
                <View style={styles.newsletterMeta}>
                  <Text style={styles.newsletterMetaText}>📰 4 min read</Text>
                </View>
              </View>
              <View style={styles.readBtn}>
                <Text style={styles.readBtnText}>Read →</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* About BOF OAU */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About BOF OAU</Text>
          <Text style={styles.aboutText}>
            The Bureau of Finance (BOF) at OAU is dedicated to improving financial literacy among students. Our mission is to provide you with the tools and knowledge needed for a secure financial future.
          </Text>
          <View style={styles.aboutSocials}>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="globe-outline" size={18} color={PRIMARY_GREEN} />
              <Text style={styles.socialText}>Website</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-instagram" size={18} color={PRIMARY_GREEN} />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subscribe Section */}
        <View style={styles.subscribeSection}>
          <Text style={styles.subscribeTitle}>Never Miss an Update</Text>
          <Text style={styles.subscribeSubtitle}>Get the latest financial tips and BOF news delivered straight to your inbox.</Text>
          
          <View style={styles.subscribeForm}>
            <TextInput
              style={styles.emailInput}
              placeholder="Your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe}>
              <Text style={styles.subscribeBtnText}>Subscribe</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
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
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  tagBadge: {
    backgroundColor: Colors.primary.P100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  tagText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: PRIMARY_GREEN,
  },
  heroTitle: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_SECONDARY,
    lineHeight: 22,
  },
  chipsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  chipText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  chipTextActive: {
    color: WHITE,
  },
  featuredCard: {
    marginHorizontal: 20,
    height: 200,
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 30,
  },
  featuredContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  latestBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  latestBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: WHITE,
  },
  featuredTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: WHITE,
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  featuredMetaText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: WHITE,
  },
  listenNowBtn: {
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  listenNowText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: PRIMARY_GREEN,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionLabel: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
  },
  sectionSublabel: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  viewAll: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  podcastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  podcastCoverThumb: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.primary.P100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  podcastInfo: {
    flex: 1,
  },
  podcastEpNum: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: PRIMARY_GREEN,
    marginBottom: 2,
  },
  podcastTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  podcastMeta: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  playBtnSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  playBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: PRIMARY_GREEN,
  },
  newsletterCard: {
    marginHorizontal: 20,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
  },
  newsletterLeft: {
    flex: 1,
  },
  newsletterDate: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginBottom: 4,
  },
  newsletterTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  newsletterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsletterMetaText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  readBtn: {
    backgroundColor: Colors.primary.P100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  readBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: PRIMARY_GREEN,
  },
  aboutCard: {
    marginHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
  },
  aboutTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  aboutText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: 20,
  },
  aboutSocials: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: WHITE,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  socialText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: TEXT_PRIMARY,
  },
  subscribeSection: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  subscribeTitle: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  subscribeSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: 24,
  },
  subscribeForm: {
    gap: 12,
  },
  emailInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 54,
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  subscribeBtn: {
    backgroundColor: PRIMARY_GREEN,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: WHITE,
  },
});
