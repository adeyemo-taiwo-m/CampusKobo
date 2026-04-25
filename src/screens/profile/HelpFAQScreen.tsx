import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
  {
    id: 1,
    q: "How do I create a budget?",
    a: "To create a budget, go to the 'Budget' tab from the bottom navigation. Tap the '+' (Add) button, give your budget a name, set your total monthly limit, and add categories like 'Food' or 'Transport'."
  },
  {
    id: 2,
    q: "Is my financial data secure?",
    a: "Absolutely. CampusKobo encrypts all your sensitive data and stores it securely. We do not have access to your bank account passwords, and you can add a PIN or Biometric lock for extra security."
  },
  {
    id: 3,
    q: "How does the Savings Goal work?",
    a: "Savings goals help you put money aside for specific needs. You set a target amount and a deadline, and we'll track your progress and remind you to save regularly."
  },
  {
    id: 4,
    q: "Can I use CampusKobo offline?",
    a: "Yes! Core features like adding expenses, updating budgets, and tracking savings work perfectly offline. You only need the internet to access the Learning Hub and receive app updates."
  },
  {
    id: 5,
    q: "What is the BOF OAU?",
    a: "The Bureau of Finance (BOF) at OAU is a specialized student body dedicated to promoting financial literacy, wealth management, and fiscal discipline among the student population."
  }
];

export const HelpFAQScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFaqs = FAQS.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={styles.headerTitle}>Help & FAQ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={TEXT_SECONDARY} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search help topics..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {!searchQuery && (
          <View style={styles.categoriesRow}>
            <TouchableOpacity style={styles.catCard}>
              <View style={[styles.catIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="person" size={20} color="#1565C0" />
              </View>
              <Text style={styles.catLabel}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.catCard}>
              <View style={[styles.catIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="bar-chart" size={20} color={PRIMARY_GREEN} />
              </View>
              <Text style={styles.catLabel}>Budget</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.catCard}>
              <View style={[styles.catIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="wallet" size={20} color="#E65100" />
              </View>
              <Text style={styles.catLabel}>Savings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.catCard}>
              <View style={[styles.catIcon, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="shield-checkmark" size={20} color="#7B1FA2" />
              </View>
              <Text style={styles.catLabel}>Privacy</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Top Questions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Questions</Text>
          {filteredFaqs.map((faq) => (
            <TouchableOpacity 
              key={faq.id} 
              style={styles.faqItem}
              onPress={() => toggleExpand(faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                <Ionicons 
                  name={expandedId === faq.id ? "chevron-up" : "chevron-down"} 
                  size={18} 
                  color={TEXT_SECONDARY} 
                />
              </View>
              {expandedId === faq.id && (
                <Text style={styles.faqAnswer}>{faq.a}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Support */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Still need help?</Text>
          <View style={styles.supportCards}>
            <TouchableOpacity 
              style={styles.supportCard}
              onPress={() => Linking.openURL('mailto:support@campuskobo.com')}
            >
              <Ionicons name="mail-outline" size={24} color={PRIMARY_GREEN} />
              <Text style={styles.supportCardTitle}>Email Support</Text>
              <Text style={styles.supportCardSub}>Response in 24h</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.supportCard}
              onPress={() => router.push('/learning/hub')}
            >
              <Ionicons name="book-outline" size={24} color={PRIMARY_GREEN} />
              <Text style={styles.supportCardTitle}>Learning Hub</Text>
              <Text style={styles.supportCardSub}>Self-help guides</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.bugBtn}>
            <Ionicons name="bug-outline" size={20} color={TEXT_PRIMARY} />
            <Text style={styles.bugBtnText}>Report a bug</Text>
          </TouchableOpacity>
        </View>

        {/* BOF Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerTitle}>About BOF OAU</Text>
          <Text style={styles.footerText}>
            This application is an initiative of the Bureau of Finance (BOF) at Obafemi Awolowo University. We empower students with financial intelligence.
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://bofoau.com')}>
            <Text style={styles.footerLink}>Visit our website →</Text>
          </TouchableOpacity>
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
  searchContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
    marginBottom: 20,
  },
  catCard: {
    flex: 1,
    alignItems: 'center',
  },
  catIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catLabel: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: TEXT_PRIMARY,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: TEXT_PRIMARY,
    marginRight: 10,
  },
  faqAnswer: {
    marginTop: 12,
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  supportSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  supportCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  supportCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  supportCardTitle: {
    marginTop: 12,
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  supportCardSub: {
    marginTop: 4,
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: TEXT_SECONDARY,
  },
  bugBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bugBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  footerInfo: {
    marginHorizontal: 20,
    padding: 24,
    backgroundColor: Colors.primary.P100,
    borderRadius: 24,
  },
  footerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: PRIMARY_GREEN,
    marginBottom: 8,
  },
  footerText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 16,
  },
  footerLink: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: PRIMARY_GREEN,
  },
});
