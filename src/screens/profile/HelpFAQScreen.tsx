import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
import { InputField } from '../../components/InputField';
import { supportService } from '../../services/supportService';
import { useAppContext } from '../../context/AppContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Category = 'All' | 'Expenses' | 'Budget' | 'Savings' | 'Account';

interface FAQItem {
  id: string;
  category: Category;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  // Expenses
  {
    id: 'e1',
    category: 'Expenses',
    question: 'How do I track expenses?',
    answer: 'Tap the + button on the home screen, enter your amount, select a category and tap Save.',
  },
  {
    id: 'e2',
    category: 'Expenses',
    question: 'How do I edit a transaction?',
    answer: 'Tap any transaction from the Expenses screen, then tap Edit Transaction.',
  },
  {
    id: 'e3',
    category: 'Expenses',
    question: 'Can I export my transactions?',
    answer: 'Yes! On the Expenses screen, tap the export icon next to the search bar.',
  },
  // Budget
  {
    id: 'b1',
    category: 'Budget',
    question: 'How do budgets work?',
    answer: 'You set a spending limit for each category. The app tracks your expenses and shows how close you are to the limit.',
  },
  {
    id: 'b2',
    category: 'Budget',
    question: 'How do I create a budget?',
    answer: 'Go to the Budget tab and tap the + button. Choose a category and set your limit.',
  },
  {
    id: 'b3',
    category: 'Budget',
    question: 'Can I reset my monthly budget?',
    answer: 'Budgets reset automatically at the start of each month.',
  },
  // Savings
  {
    id: 's1',
    category: 'Savings',
    question: 'How do I set a savings goal?',
    answer: 'Go to the Savings tab and tap +. Enter a goal name and target amount.',
  },
  {
    id: 's2',
    category: 'Savings',
    question: 'How do I add funds to my goal?',
    answer: 'Open any savings goal and tap Add Funds. Enter the amount you want to save.',
  },
  {
    id: 's3',
    category: 'Savings',
    question: 'Can I have multiple savings goals?',
    answer: 'Yes! You can create as many goals as you need.',
  },
  // Account
  {
    id: 'a1',
    category: 'Account',
    question: 'How do I change my password?',
    answer: 'Go to Profile > Security & Privacy > Change Password.',
  },
  {
    id: 'a2',
    category: 'Account',
    question: 'How do I delete my account?',
    answer: 'Go to Profile > Security & Privacy > Delete Account. Note: this action is permanent.',
  },
];

const ExpandableFAQ = ({ item, isExpanded, onToggle }: { item: FAQItem, isExpanded: boolean, onToggle: () => void }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onToggle}
      style={styles.faqItem}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={TEXT_SECONDARY} 
        />
      </View>
      {isExpanded && (
        <View style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswer}>{item.answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const LoadingSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((i) => (
        <Animated.View key={i} style={[styles.skeletonItem, { opacity }]} />
      ))}
    </View>
  );
};

export const HelpFAQScreen = () => {
  const router = useRouter();
  const { user, apiUser, t } = useAppContext();
  const { tab } = useLocalSearchParams<{ tab: string }>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'FAQ' | 'Contact'>(tab === 'contact' ? 'Contact' : 'FAQ');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // FAQ State
  const [dynamicFaqs, setDynamicFaqs] = useState<FAQItem[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [faqsError, setFaqsError] = useState<string | null>(null);

  // Form State
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageSent, setMessageSent] = useState(false);

  const categories: Category[] = ['All', 'Expenses', 'Budget', 'Savings', 'Account'];

  useEffect(() => {
    const loadFAQs = async () => {
      setFaqsLoading(true);
      setFaqsError(null);
      try {
        const data = await supportService.getFAQs();
        if (data && data.length > 0) {
          setDynamicFaqs(data as FAQItem[]);
        }
      } catch (error: any) {
        setFaqsError("Could not load FAQs. Showing cached content.");
        console.warn('Failed to load dynamic FAQs:', error);
      } finally {
        setFaqsLoading(false);
      }
    };
    loadFAQs();
  }, []);

  const handleSendMessage = async () => {
    setMessageError(null);
    setMessageSent(false);

    if (!subject.trim() || !message.trim()) {
      setMessageError("Please fill in both the subject and message fields.");
      return;
    }

    setIsSendingMessage(true);
    try {
      await supportService.sendSupportMessage({ 
        subject, 
        message,
        name: apiUser?.full_name || user?.name || 'User',
        email: apiUser?.email || user?.email || 'no-email@campuskobo.com',
        user_id: user?.id
      });
      setMessageSent(true);
      setSubject("");
      setMessage("");
    } catch (error: any) {
      setMessageError(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const currentFaqs = dynamicFaqs.length > 0 ? dynamicFaqs : faqs;

  const filteredFAQs = currentFaqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const scrollToSection = (category: Category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    // For prototype, we'll just set the category
  };

  const renderFAQTab = () => (
    <>
      <InputField
        placeholder={t('help.search')}
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Ionicons name="search-outline" size={20} color={TEXT_SECONDARY} />}
        outerContainerStyle={styles.searchOuter}
      />

      <View style={styles.tabSwitcher}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'FAQ' && styles.activeTabItem]} 
          onPress={() => setActiveTab('FAQ')}
        >
          <Text style={[styles.tabText, activeTab === 'FAQ' && styles.activeTabText]}>{t('help.tabs.faq')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'Contact' && styles.activeTabItem]} 
          onPress={() => setActiveTab('Contact')}
        >
          <Text style={[styles.tabText, activeTab === 'Contact' && styles.activeTabText]}>{t('help.tabs.contact')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Help Grid */}
        <Text style={styles.sectionTitle}>{t('help.quick')}</Text>
        <View style={styles.quickHelpGrid}>
          <TouchableOpacity style={styles.quickHelpCard} onPress={() => scrollToSection('Expenses')}>
            <View style={[styles.quickIconWrapper, { backgroundColor: '#E7F5ED' }]}>
              <Ionicons name="receipt-outline" size={20} color={PRIMARY_GREEN} />
            </View>
            <Text style={styles.quickHelpText}>How do i track expenses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickHelpCard} onPress={() => scrollToSection('Budget')}>
            <View style={[styles.quickIconWrapper, { backgroundColor: '#E7F5ED' }]}>
              <Ionicons name="pie-chart-outline" size={20} color={PRIMARY_GREEN} />
            </View>
            <Text style={styles.quickHelpText}>How do I create a budget?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickHelpCard} onPress={() => scrollToSection('Savings')}>
            <View style={[styles.quickIconWrapper, { backgroundColor: '#E7F5ED' }]}>
              <Ionicons name="leaf-outline" size={20} color={PRIMARY_GREEN} />
            </View>
            <Text style={styles.quickHelpText}>How do I set a savings goal?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickHelpCard} onPress={() => scrollToSection('Account')}>
            <View style={[styles.quickIconWrapper, { backgroundColor: '#E7F5ED' }]}>
              <Ionicons name="key-outline" size={20} color={PRIMARY_GREEN} />
            </View>
            <Text style={styles.quickHelpText}>How do I reset my password?</Text>
          </TouchableOpacity>
        </View>

        {/* Category Chips */}
        <Text style={styles.sectionTitle}>{t('help.faqTitle')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.categoryChip, selectedCategory === cat && styles.activeCategoryChip]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.activeCategoryText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {faqsError && (
          <View style={styles.errorBanner}>
            <Ionicons name="information-circle-outline" size={16} color="#B45309" />
            <Text style={styles.errorBannerText}>{faqsError}</Text>
          </View>
        )}

        {/* FAQ List */}
        {faqsLoading && dynamicFaqs.length === 0 ? (
          <LoadingSkeleton />
        ) : (
        filteredFAQs.length > 0 ? (
          <View style={styles.faqList}>
            {categories.filter(c => c !== 'All').map(category => {
              const categoryFaqs = filteredFAQs.filter(f => f.category === category);
              if (categoryFaqs.length === 0) return null;
              
              return (
                <View key={category} style={styles.faqGroup}>
                  <Text style={styles.groupLabel}>{category}</Text>
                  {categoryFaqs.map(faq => (
                    <ExpandableFAQ 
                      key={faq.id} 
                      item={faq} 
                      isExpanded={expandedId === faq.id}
                      onToggle={() => toggleExpand(faq.id)}
                    />
                  ))}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>{t('help.noResults')}</Text>
            <Text style={styles.emptySubtitle}>{t('help.noResultsDesc')}</Text>
            <TouchableOpacity style={styles.contactSupportSmallBtn} onPress={() => setActiveTab('Contact')}>
              <Text style={styles.contactSupportSmallText}>{t('help.contactSupport')} →</Text>
            </TouchableOpacity>
          </View>
        )
      )}

        {/* Still Need Help Card */}
        <View style={styles.stillNeedHelpCard}>
          <View style={styles.stillNeedHelpHeader}>
            <View style={styles.whatsappIconWrapper}>
              <Ionicons name="logo-whatsapp" size={20} color={PRIMARY_GREEN} />
            </View>
            <View>
              <Text style={styles.stillNeedHelpTitle}>{t('help.stillNeedHelp')}</Text>
              <Text style={styles.stillNeedHelpSubtitle}>{t('help.noResultsDesc')}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.contactSupportBtn} onPress={() => setActiveTab('Contact')}>
            <Text style={styles.contactSupportText}>{t('help.contactSupport')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.fixedBottom}>
        <TouchableOpacity style={styles.sendMessageBtn}>
          <Text style={styles.sendMessageText}>Send message</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderContactTab = () => (
    <>
      <InputField
        placeholder="What are you looking for?"
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Ionicons name="search-outline" size={20} color={TEXT_SECONDARY} />}
        outerContainerStyle={styles.searchOuter}
      />

      <View style={styles.tabSwitcher}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'FAQ' && styles.activeTabItem]} 
          onPress={() => setActiveTab('FAQ')}
        >
          <Text style={[styles.tabText, activeTab === 'FAQ' && styles.activeTabText]}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'Contact' && styles.activeTabItem]} 
          onPress={() => setActiveTab('Contact')}
        >
          <Text style={[styles.tabText, activeTab === 'Contact' && styles.activeTabText]}>Contact Us</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.contactContent}>
          <Text style={styles.contactTitle}>{t('help.contactTitle')}</Text>
                    <View style={styles.contactCard}>
            <TouchableOpacity 
              style={styles.contactRow}
              onPress={() => Linking.openURL('mailto:bureauoffinance@gmail.com')}
            >
              <View style={styles.contactIconBox}>
                <Ionicons name="mail-outline" size={20} color={PRIMARY_GREEN} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email Support</Text>
                <Text style={styles.contactValue}>bureauoffinance@gmail.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
 
            <TouchableOpacity 
              style={styles.contactRow}
              onPress={() => Linking.openURL('https://wa.me/2347044059473')}
            >
              <View style={styles.contactIconBox}>
                <Ionicons name="logo-whatsapp" size={20} color={PRIMARY_GREEN} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>WhatsApp</Text>
                <Text style={styles.contactValue}>+234 704 405 9473</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
 
            <TouchableOpacity 
              style={styles.contactRow}
              onPress={() => Linking.openURL('https://www.instagram.com/bof_oau?igsh=MWppMGp4YnB3ZDRzNQ==')}
            >
              <View style={styles.contactIconBox}>
                <Ionicons name="logo-instagram" size={20} color={PRIMARY_GREEN} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Instagram</Text>
                <Text style={styles.contactValue}>@bof_oau</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
 
            <TouchableOpacity 
              style={styles.contactRow}
              onPress={() => Linking.openURL('https://www.linkedin.com/company/the-students-professional-bureau-of-finance-oau-ife/')}
            >
              <View style={styles.contactIconBox}>
                <Ionicons name="logo-linkedin" size={20} color={PRIMARY_GREEN} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>LinkedIn</Text>
                <Text style={styles.contactValue}>BOF OAU on LinkedIn</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
 
            <TouchableOpacity 
              style={[styles.contactRow, styles.noBorder]}
              onPress={() => Linking.openURL('https://maps.google.com/?q=Obafemi+Awolowo+University+Ile-Ife')}
            >
              <View style={styles.contactIconBox}>
                <Ionicons name="location-outline" size={20} color={PRIMARY_GREEN} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Location</Text>
                <Text style={styles.contactValue}>OAU, Ile-Ife, Nigeria</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>


          <Text style={styles.formTitle}>{t('help.formTitle')}</Text>
          
          {messageSent && (
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={styles.successText}>
                {t('help.formSuccess')}
              </Text>
            </View>
          )}

          {messageError && (
            <View style={styles.formErrorCard}>
              <Ionicons name="alert-circle-outline" size={18} color="#fff" />
              <Text style={styles.formErrorText}>{messageError || t('help.formError')}</Text>
            </View>
          )}
          
          <InputField
            placeholder={t('help.formSubject')}
            value={subject}
            onChangeText={setSubject}
            outerContainerStyle={styles.formFieldOuter}
          />
          <InputField
            placeholder={t('help.formMessage')}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            containerStyle={styles.formTextAreaContainer}
            style={styles.formTextAreaInput}
            outerContainerStyle={styles.formFieldOuter}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, (isSendingMessage || !subject.trim() || !message.trim()) && styles.disabledBtn]}
          onPress={handleSendMessage}
          disabled={isSendingMessage}
        >
          {isSendingMessage ? (
            <ActivityIndicator color={WHITE} size="small" />
          ) : (
            <Text style={styles.submitBtnText}>{t('help.formSend')}</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        title={t('help.title')} 
        showBack={true}
        onBack={() => router.back()} 
      />
      
      {activeTab === 'FAQ' ? renderFAQTab() : renderContactTab()}

      {/* Success Modal */}
      <Modal
        visible={isSuccessModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={80} color={PRIMARY_GREEN} />
            </View>
            
            <Text style={styles.successModalTitle}>Message Sent!</Text>
            <Text style={styles.successModalMessage}>
              Your message has been successfully sent. Our team will review it and get back to you within 24 hours.
            </Text>
            
            <TouchableOpacity 
              style={styles.successModalBtn}
              onPress={() => setIsSuccessModalVisible(false)}
            >
              <Text style={styles.successModalBtnText}>Great!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  searchOuter: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabItem: {
    backgroundColor: WHITE,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
  },
  activeTabText: {
    color: TEXT_PRIMARY,
    fontFamily: Fonts.medium,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: Fonts.medium,
    marginTop: 24,
    marginBottom: 16,
  },
  quickHelpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickHelpCard: {
    width: '48%',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  quickIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickHelpText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
    lineHeight: 20,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 20,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
  },
  activeCategoryText: {
    color: WHITE,
  },
  faqList: {
    marginBottom: 24,
  },
  faqGroup: {
    marginBottom: 24,
  },
  groupLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#9CA3AF',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  faqItem: {
    backgroundColor: WHITE,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
    flex: 1,
    marginRight: 10,
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
    paddingTop: 12,
  },
  faqAnswer: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 20,
    fontFamily: Fonts.regular,
  },
  stillNeedHelpCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  stillNeedHelpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  whatsappIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E7F5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stillNeedHelpTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
  },
  stillNeedHelpSubtitle: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
  },
  contactSupportBtn: {
    backgroundColor: '#E7F5ED',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactSupportText: {
    color: PRIMARY_GREEN,
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  fixedBottom: {
    padding: 20,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sendMessageBtn: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendMessageText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  errorBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  errorBannerText: {
    color: '#92400E',
    fontSize: 12,
    fontFamily: Fonts.medium,
    flex: 1,
  },
  successCard: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  successText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: Fonts.regular,
    flex: 1,
    lineHeight: 20,
  },
  formErrorCard: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  formErrorText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: Fonts.regular,
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    marginBottom: 16,
  },
  contactCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  contactIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E7F5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
  },
  formTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    marginBottom: 16,
  },
  formFieldOuter: {
    marginBottom: 12,
  },
  formTextAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  formTextAreaInput: {
    textAlignVertical: 'top',
    height: '100%',
  },
  submitBtn: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  submitBtnText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successModalContent: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E7F5ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successModalTitle: {
    fontSize: 22,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  successModalMessage: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  successModalBtn: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 12,
    height: 56,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalBtnText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  skeletonContainer: {
    marginBottom: 24,
    gap: 12,
  },
  skeletonItem: {
    height: 60,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
});
