import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BACKGROUND,
  Fonts,
  BORDER_GRAY,
} from '../../constants';
import { Header } from '../../components/Header';
import { useAppContext } from '../../context/AppContext';

const { width } = Dimensions.get('window');

const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <View style={styles.featureCard}>
    <View style={styles.featureIconContainer}>
      <Ionicons name={icon as any} size={28} color={PRIMARY_GREEN} />
    </View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

const TechItem = ({ label, tech }: { label: string, tech: string }) => (
  <View style={styles.techRow}>
    <Text style={styles.techLabel}>{label}</Text>
    <Text style={styles.techValue}>{tech}</Text>
  </View>
);

export const AboutCampusKoboScreen = () => {
  const router = useRouter();
  const { t } = useAppContext();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title={t('about.campusTitle')} showBack={true} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={require('../../../assets/images/campuskobo-logo.svg')} 
            style={styles.logoImage} 
            contentFit="contain"
          />
          <Text style={styles.appName}>CampusKobo</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v1.1.0</Text>
          </View>
          <Text style={styles.heroDescription}>
            {t('about.campusHero')}
          </Text>
        </View>

        {/* The Why */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>{t('about.whyTitle')}</Text>
          <Text style={styles.introText}>
            {t('about.whyText')}
          </Text>
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline-outline" size={16} color={PRIMARY_GREEN} />
            <Text style={styles.offlineText}>{t('about.offline')}</Text>
          </View>
        </View>

        {/* Key Features */}
        <Text style={styles.sectionHeading}>{t('about.features')}</Text>
        <View style={styles.featuresGrid}>
          <FeatureCard 
            icon="wallet-outline" 
            title={t('about.feature1')} 
            description={t('about.feature1Desc')} 
          />
          <FeatureCard 
            icon="pie-chart-outline" 
            title={t('about.feature2')} 
            description={t('about.feature2Desc')} 
          />
          <FeatureCard 
            icon="flag-outline" 
            title={t('about.feature3')} 
            description={t('about.feature3Desc')} 
          />
          <FeatureCard 
            icon="school-outline" 
            title={t('about.feature4')} 
            description={t('about.feature4Desc')} 
          />
        </View>

        {/* Tech Stack */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('about.techTitle')}</Text>
          <TechItem label="Framework" tech="React Native (Expo)" />
          <TechItem label="Language" tech="TypeScript" />
          <TechItem label="Storage" tech="Local AsyncStorage" />
          <TechItem label="Design" tech="BOF Creative Division" />
          <View style={[styles.techRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.techLabel}>Security</Text>
            <Text style={styles.techValue}>AES Encryption & Biometrics</Text>
          </View>
        </View>


        <View style={styles.footer}>
          <Text style={styles.madeBy}>{t('about.madeBy')}</Text>
          <Text style={styles.legal}>© 2025 Bureau of Finance, OAU</Text>
        </View>

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
  scrollContent: {
    padding: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 10,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },   appName: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
  versionBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  versionText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: PRIMARY_GREEN,
  },
  heroDescription: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  introCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  introTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  introText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
    lineHeight: 24,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  offlineText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: PRIMARY_GREEN,
    marginLeft: 8,
  },
  sectionHeading: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 16,
    marginLeft: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featureCard: {
    width: (width - 40 - 16) / 2,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
    lineHeight: 18,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  techRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  techLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
  },
  techValue: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  madeBy: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: PRIMARY_GREEN,
    marginBottom: 4,
  },
  legal: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
  },

});
