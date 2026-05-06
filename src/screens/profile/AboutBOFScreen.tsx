import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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

const { width } = Dimensions.get('window');

const StatCard = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const SectionTitle = ({ title }: { title: string }) => (
  <View style={styles.sectionTitleContainer}>
    <View style={styles.sectionLine} />
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionLine} />
  </View>
);

const FeatureItem = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIconContainer}>
      <Ionicons name={icon as any} size={24} color={PRIMARY_GREEN} />
    </View>
    <View style={styles.featureTextContainer}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const LeaderRow = ({ name, role, isLast = false }: { name: string, role: string, isLast?: boolean }) => (
  <View style={[styles.leaderRow, isLast && styles.noBorder]}>
    <Text style={styles.leaderName}>{name}</Text>
    <Text style={styles.leaderRole}>{role}</Text>
  </View>
);

export const AboutBOFScreen = () => {
  const router = useRouter();

  const handleContact = (type: 'email' | 'location') => {
    if (type === 'email') {
      Linking.openURL('mailto:bureauoffinance@gmail.com');
    } else {
      Linking.openURL('https://maps.google.com/?q=Obafemi+Awolowo+University+Ile-Ife');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="About BOF OAU" showBack={true} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoPlaceholder}>
            <Ionicons name="business" size={60} color={WHITE} />
          </View>
          <Text style={styles.heroTitle}>The Students' Professional Bureau of Finance</Text>
          <Text style={styles.heroSubtitle}>Obafemi Awolowo University, Ile-Ife</Text>
          
          <View style={styles.quoteContainer}>
            <Ionicons name="quote" size={20} color={PRIMARY_GREEN} style={styles.quoteIcon} />
            <Text style={styles.quoteText}>Empowering future financial leaders — one analyst at a time.</Text>
          </View>
        </View>

        {/* Overview */}
        <View style={styles.contentCard}>
          <Text style={styles.overviewText}>
            Nigeria's <Text style={styles.boldText}>first student-led finance organisation</Text>, founded in 2011. 
            BOF OAU unites passionate students from all faculties at OAU to cultivate the next generation 
            of financial professionals through practical training, competitions, and real-world exposure.
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard value="500+" label="Active Members" />
          <StatCard value="20+" label="Competition Wins" />
          <StatCard value="14+" label="Years of Impact" />
          <StatCard value="All" label="Faculties" />
        </View>

        {/* Vision & Mission */}
        <View style={styles.row}>
          <View style={[styles.infoCard, { marginRight: 8 }]}>
            <Ionicons name="eye-outline" size={24} color={PRIMARY_GREEN} />
            <Text style={styles.infoCardTitle}>Our Vision</Text>
            <Text style={styles.infoCardText}>To be Africa's leading student-led finance organisation.</Text>
          </View>
          <View style={[styles.infoCard, { marginLeft: 8 }]}>
            <Ionicons name="rocket-outline" size={24} color={PRIMARY_GREEN} />
            <Text style={styles.infoCardTitle}>Our Mission</Text>
            <Text style={styles.infoCardText}>Empower students with practical financial skills.</Text>
          </View>
        </View>

        {/* What We Do */}
        <SectionTitle title="WHAT WE DO" />
        <View style={styles.card}>
          <FeatureItem 
            icon="trophy-outline" 
            title="CFA Institute Challenges" 
            description="Consistent top-three finishes in global research competitions." 
          />
          <FeatureItem 
            icon="stats-chart-outline" 
            title="Corporate Strategy & M&A" 
            description="Investment banking and deal structuring case simulations." 
          />
          <FeatureItem 
            icon="code-slash-outline" 
            title="Fintech & Innovation" 
            description="Hackathons and projects at the intersection of tech and finance." 
          />
          <FeatureItem 
            icon="people-outline" 
            title="Finance 360 Conference" 
            description="Flagship annual event bringing together students and leaders." 
          />
        </View>

        {/* Leadership */}
        <SectionTitle title="OUR LEADERSHIP" />
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Executive Team</Text>
          <LeaderRow name="Esther Mac-Sanddy" role="President (CEO)" />
          <LeaderRow name="Adurasanmi David" role="VP, Research" />
          <LeaderRow name="Deborah Okesanjo" role="VP, Operations" />
          <LeaderRow name="Abdulquadri Fasasi" role="Head, Strategy & Branding" />
          <LeaderRow name="Favour Abanum" role="Head, Fintech" />
          <LeaderRow name="Adekunle Okunniyi" role="Head, Investment Banking" />
          <LeaderRow name="Eniola Oyebode" role="Head, Energy & Infra" />
          <LeaderRow name="Shukurat Azeez" role="Head, Operations" />
          <LeaderRow name="Jumoke Akande" role="Head, Consulting" />
          <LeaderRow name="Enoch Eyiaro" role="Head, Research & Academics" />
          <LeaderRow name="Simeon Olalude" role="Head, Public Engagements" />
          <LeaderRow name="Roqeeb Sorunke" role="Head, Sales & Trading" />
          <LeaderRow name="Faith Adeniji" role="Head, Programme & Events" isLast={true} />
        </View>

        {/* Contact */}
        <SectionTitle title="GET IN TOUCH" />
        <View style={styles.card}>
          <TouchableOpacity style={styles.contactRow} onPress={() => handleContact('email')}>
            <Ionicons name="mail-outline" size={20} color={PRIMARY_GREEN} />
            <Text style={styles.contactText}>bureauoffinance@gmail.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactRow, styles.noBorder]} onPress={() => handleContact('location')}>
            <Ionicons name="location-outline" size={20} color={PRIMARY_GREEN} />
            <Text style={styles.contactText}>OAU, Ile-Ife, Nigeria</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2025 BOF OAU. All rights reserved.</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
            <Text style={styles.footerDot}>•</Text>
            <Text style={styles.footerLink}>Terms of Use</Text>
          </View>
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
    padding: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PRIMARY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: Fonts.Bold,
    color: TEXT_PRIMARY,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
    color: PRIMARY_GREEN,
    marginTop: 4,
  },
  quoteContainer: {
    marginTop: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  quoteIcon: {
    marginBottom: 8,
    opacity: 0.5,
  },
  quoteText: {
    fontSize: 15,
    fontFamily: Fonts.Medium,
    fontStyle: 'italic',
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  contentCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  overviewText: {
    fontSize: 15,
    fontFamily: Fonts.Regular,
    color: TEXT_PRIMARY,
    lineHeight: 24,
    textAlign: 'center',
  },
  boldText: {
    fontFamily: Fonts.Bold,
    color: PRIMARY_GREEN,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: (width - 40 - 12) / 2,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 22,
    fontFamily: Fonts.Bold,
    color: PRIMARY_GREEN,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.Medium,
    color: TEXT_SECONDARY,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoCardTitle: {
    fontSize: 14,
    fontFamily: Fonts.Bold,
    color: TEXT_PRIMARY,
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardText: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER_GRAY,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Fonts.Bold,
    color: TEXT_SECONDARY,
    marginHorizontal: 12,
    letterSpacing: 1.2,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  featureItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: Fonts.Bold,
    color: TEXT_PRIMARY,
  },
  featureDescription: {
    fontSize: 13,
    fontFamily: Fonts.Regular,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  cardHeader: {
    fontSize: 15,
    fontFamily: Fonts.Bold,
    color: TEXT_PRIMARY,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  leaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  leaderName: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
    color: TEXT_PRIMARY,
  },
  leaderRole: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: TEXT_SECONDARY,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  contactText: {
    fontSize: 15,
    fontFamily: Fonts.Medium,
    color: TEXT_PRIMARY,
    marginLeft: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  copyright: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: TEXT_SECONDARY,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  footerLink: {
    fontSize: 12,
    fontFamily: Fonts.Medium,
    color: PRIMARY_GREEN,
  },
  footerDot: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginHorizontal: 8,
  },
});
