import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BACKGROUND,
  Fonts,
} from '../../constants';
import { Header } from '../../components/Header';
import { PodcastEpisodeCard } from '../../components/PodcastEpisodeCard';
import { LEARNING_CONTENT } from '../../constants/learningData';
import { InputField } from '../../components/InputField';

const PodcastNewsletterScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');

  const topics = ['All', 'Budgeting', 'Saving', 'Investing', 'Loans', 'Taxes'];
  const podcasts = LEARNING_CONTENT.filter(c => c.type === 'podcast').slice(0, 3);

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    Alert.alert('Subscribed!', 'You will receive updates from BOF OAU.');
    setEmail('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="From BOF OAU" showBack={true} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>BOF OAU</Text>
          </View>
          <Text style={styles.mainTitle}>Stay informed & keep learning</Text>
          <Text style={styles.subtitle}>
            Fresh financial content from the Bureau of Finance, OAU
          </Text>
        </View>

        {/* Topics Filter */}
        <View style={styles.topicsSection}>
          <Text style={styles.sectionLabel}>Browse by topic</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topicsList}>
            {topics.map(topic => (
              <TouchableOpacity
                key={topic}
                style={[styles.topicChip, selectedTopic === topic && styles.topicChipActive]}
                onPress={() => setSelectedTopic(topic)}
              >
                <Text style={[styles.topicText, selectedTopic === topic && styles.topicTextActive]}>
                  {topic}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Banner Card */}
        <PodcastEpisodeCard 
          title="Market Pulse — EP 05: How to invest as a student"
          duration="18 min"
          image={<View style={{ backgroundColor: '#E8F5E9', width: '100%', height: 160, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="megaphone-outline" size={60} color={PRIMARY_GREEN} /></View>}
          onPress={() => router.push({
            pathname: '/learning/detail',
            params: { id: 'l-005', type: 'podcast' }
          })}
        />

        {/* Podcast Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleGroup}>
              <Text style={styles.sectionTitle}>Market Pulse Podcast</Text>
              <Text style={styles.sectionSubTitle}>By BOF OAU Research Division</Text>
            </View>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.podcastList}>
            {podcasts.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.podcastItem}
                onPress={() => router.push({
                  pathname: '/learning/detail',
                  params: { id: item.id, type: 'podcast' }
                })}
              >
                <View style={[styles.podcastThumb, { backgroundColor: PRIMARY_GREEN, alignItems: 'center', justifyContent: 'center' }]}>
                  <Ionicons name="headset-outline" size={24} color={WHITE} />
                </View>
                <View style={styles.podcastInfo}>
                  <Text style={styles.podcastEp}>EP 0{5 - index}</Text>
                  <Text style={styles.podcastTitle} numberOfLines={1}>{item.title}</Text>
                  <View style={styles.podcastMeta}>
                    <Ionicons name="headset-outline" size={12} color={TEXT_SECONDARY} />
                    <Text style={styles.podcastMetaText}>{item.duration}</Text>
                  </View>
                </View>
                <View style={styles.playIconWrapper}>
                  <Ionicons name="play" size={18} color={WHITE} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Newsletter Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleGroup}>
              <Text style={styles.sectionTitle}>BOF Newsletter</Text>
              <Text style={styles.sectionSubTitle}>Stay updated with financial news and tips</Text>
            </View>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.podcastList}>
            <TouchableOpacity style={styles.podcastItem}>
              <View style={[styles.podcastThumb, { backgroundColor: '#E7F5ED', alignItems: 'center', justifyContent: 'center' }]}>
                <Ionicons name="mail-outline" size={24} color={PRIMARY_GREEN} />
              </View>
              <View style={styles.podcastInfo}>
                <Text style={styles.podcastEp}>April 2026</Text>
                <Text style={styles.podcastTitle}>Monthly Finance Digest</Text>
                <Text style={styles.podcastMetaText}>5 min read</Text>
              </View>
              <View style={[styles.playIconWrapper, { backgroundColor: PRIMARY_GREEN }]}>
                <Ionicons name="book-outline" size={18} color={WHITE} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.podcastItem}>
              <View style={[styles.podcastThumb, { backgroundColor: '#E7F5ED', alignItems: 'center', justifyContent: 'center' }]}>
                <Ionicons name="mail-outline" size={24} color={PRIMARY_GREEN} />
              </View>
              <View style={styles.podcastInfo}>
                <Text style={styles.podcastEp}>March 2026</Text>
                <Text style={styles.podcastTitle}>Student Money Report</Text>
                <Text style={styles.podcastMetaText}>4 min read</Text>
              </View>
              <View style={[styles.playIconWrapper, { backgroundColor: PRIMARY_GREEN }]}>
                <Ionicons name="book-outline" size={18} color={WHITE} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About BOF OAU</Text>
          <View style={styles.logoContainer}>
            <View style={{ backgroundColor: PRIMARY_GREEN, width: '100%', height: 160, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="mic-outline" size={60} color={WHITE} /></View>
          </View>
          <Text style={styles.aboutDesc}>
            The Students' Professional Bureau of Finance started in 2011 at Obafemi Awolowo University as a response to the gap between academic learning and real-world finance skills.{"\n\n"}
            Founded in the Dept. of Management and Accounting, it aimed to give students hands-on experience, operating like a real financial institution.{"\n\n"}
            Now, it's a leading finance ecosystem, producing top talents and empowering future African financial leaders.
          </Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialPill}>
              <Ionicons name="globe-outline" size={16} color={PRIMARY_GREEN} />
              <Text style={styles.socialPillText}>Website</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialPill}>
              <Ionicons name="logo-instagram" size={16} color={PRIMARY_GREEN} />
              <Text style={styles.socialPillText}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialPill}>
              <Ionicons name="logo-linkedin" size={16} color={PRIMARY_GREEN} />
              <Text style={styles.socialPillText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subscribe Section */}
        <View style={styles.subscribeSection}>
          <View style={styles.subscribeIcon}>
            <Ionicons name="mail-open-outline" size={32} color={PRIMARY_GREEN} />
          </View>
          <Text style={styles.subscribeTitle}>Never Miss an Update</Text>
          <Text style={styles.subscribeSubtitle}>
            Get the latest financial tips and news delivered straight to your inbox.
          </Text>
          <InputField
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={{ paddingRight: 4, paddingLeft: 4, borderColor: '#D1FAE5' }}
            rightIcon={
              <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe}>
                <Text style={styles.subscribeBtnText}>Subscribe</Text>
              </TouchableOpacity>
            }
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerSection: {
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#E7F5ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  tagText: {
    color: PRIMARY_GREEN,
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  mainTitle: {
    fontSize: 22,
    fontFamily: Fonts.semiBold,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    lineHeight: 22,
  },
  topicsSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  topicsList: {
    gap: 12,
  },
  topicChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  topicChipActive: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  topicText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
  },
  topicTextActive: {
    color: WHITE,
    fontFamily: Fonts.bold,
  },
  featuredCard: {
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 24,
    justifyContent: 'flex-end',
  },
  latestTag: {
    backgroundColor: WHITE,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  latestTagText: {
    color: TEXT_PRIMARY,
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  featuredTitle: {
    color: WHITE,
    fontSize: 20,
    fontFamily: Fonts.bold,
    marginBottom: 8,
    lineHeight: 28,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featuredMetaText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: Fonts.medium,
    marginLeft: 6,
  },
  listenBtn: {
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listenBtnText: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontFamily: Fonts.bold,
    marginRight: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitleGroup: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  sectionSubTitle: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
  },
  podcastList: {
    gap: 16,
  },
  podcastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  podcastThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  podcastLogo: {
    width: '100%',
    height: '100%',
  },
  podcastInfo: {
    flex: 1,
  },
  podcastEp: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: TEXT_SECONDARY,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  podcastTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  podcastMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  podcastMetaText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
    marginLeft: 4,
  },
  playIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsletterGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  newsletterCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  newsDate: {
    marginBottom: 8,
  },
  newsDateText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
  },
  newsTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 12,
    height: 40,
  },
  newsMeta: {
    marginBottom: 16,
  },
  newsMetaText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
  },
  readBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readBtnText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: PRIMARY_GREEN,
    marginRight: 4,
  },
  aboutSection: {
    marginBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 24,
  },
  logoContainer: {
    marginVertical: 16,
    alignItems: 'flex-start',
  },
  bofLogo: {
    width: 60,
    height: 60,
  },
  aboutDesc: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: Fonts.regular,
    lineHeight: 22,
    marginBottom: 20,
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  socialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F5ED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  socialPillText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: PRIMARY_GREEN,
  },
  subscribeSection: {
    backgroundColor: '#E7F5ED',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  subscribeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  subscribeTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  subscribeSubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  subscribeInputWrapper: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  subscribeInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
  subscribeBtn: {
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  subscribeBtnText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: Fonts.bold,
  }
});

export default PodcastNewsletterScreen;
