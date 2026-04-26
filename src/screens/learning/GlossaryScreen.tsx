import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
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
import { GLOSSARY_TERMS } from '../../constants/learningData';
import { GlossaryTerm } from '../../types';

const { width, height } = Dimensions.get('window');

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const GOOD_TO_KNOW = [
  { id: 'budget', name: 'Budget', color: '#E7F5ED', icon: 'wallet-outline', iconColor: PRIMARY_GREEN },
  { id: 'interest', name: 'Interest', color: '#E0F2FE', icon: 'flash-outline', iconColor: '#0EA5E9' },
  { id: 'credit_score', name: 'Credit Score', color: '#F3E8FF', icon: 'speedometer-outline', iconColor: '#8B5CF6' },
];

const GlossaryScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [isTermModalVisible, setIsTermModalVisible] = useState(false);
  const [isSuggestModalVisible, setIsSuggestModalVisible] = useState(false);
  const [suggestedTerm, setSuggestedTerm] = useState('');
  const [suggestedDef, setSuggestedDef] = useState('');

  const [sectionLayouts, setSectionLayouts] = useState<Record<string, number>>({});

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(term => 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const termsByLetter = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.sort((a, b) => a.term.localeCompare(b.term)).forEach(term => {
      const firstLetter = term.term.charAt(0).toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const scrollToLetter = (letter: string) => {
    setSelectedLetter(letter);
    if (sectionLayouts[letter] !== undefined) {
      scrollRef.current?.scrollTo({
        y: sectionLayouts[letter],
        animated: true,
      });
    }
  };

  const termOfTheDay = useMemo(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return GLOSSARY_TERMS[dayOfYear % GLOSSARY_TERMS.length];
  }, []);

  const toggleSection = (letter: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [letter]: !prev[letter]
    }));
  };

  const handleOpenTerm = (term: GlossaryTerm) => {
    setSelectedTerm(term);
    setIsTermModalVisible(true);
  };

  const handleSuggest = () => {
    if (!suggestedTerm.trim()) {
      Alert.alert('Error', 'Please enter a term name');
      return;
    }
    Alert.alert('Thank You!', `Your suggestion for "${suggestedTerm}" has been submitted for review.`, [
      { text: 'OK', onPress: () => {
        setIsSuggestModalVisible(false);
        setSuggestedTerm('');
        setSuggestedDef('');
      }}
    ]);
  };

  const renderTermRow = (term: GlossaryTerm) => (
    <TouchableOpacity 
      key={term.id} 
      style={styles.termRow}
      onPress={() => handleOpenTerm(term)}
    >
      <View style={styles.termInfo}>
        <Text style={styles.termName}>{term.term}</Text>
        <Text style={styles.termSnippet} numberOfLines={1}>{term.definition}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        title="Financial Glossary" 
        showBack={true} 
        onBack={() => router.back()}
        showSearch={true}
        onSearch={() => {}}
      />

      <ScrollView 
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={TEXT_SECONDARY} style={styles.searchIcon} />
            <TextInput
              placeholder="Search a financial term..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={TEXT_SECONDARY}
            />
          </View>
        </View>

        {/* Term of the Day */}
        <TouchableOpacity 
          style={styles.todCard}
          onPress={() => handleOpenTerm(termOfTheDay)}
        >
          <Text style={styles.todLabel}>📅 Term of the Day</Text>
          <View style={styles.todHeader}>
            <Text style={styles.todTerm}>{termOfTheDay.term}</Text>
            <Text style={styles.todPos}>noun</Text>
          </View>
          <Text style={styles.todDef} numberOfLines={2}>{termOfTheDay.definition}</Text>
        </TouchableOpacity>

        {/* Alphabet Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.alphabetScroll}
          contentContainerStyle={styles.alphabetContent}
        >
          {ALPHABET.map(letter => {
            const hasTerms = !!termsByLetter[letter];
            return (
              <TouchableOpacity 
                key={letter} 
                style={[
                  styles.letterCircle,
                  selectedLetter === letter && styles.letterCircleActive,
                  !hasTerms && styles.letterCircleDisabled
                ]}
                onPress={() => scrollToLetter(letter)}
              >
                <Text style={[
                  styles.letterText,
                  selectedLetter === letter && styles.letterTextActive
                ]}>{letter}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Good to Know */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Good to know</Text>
          <View style={styles.goodToKnowGrid}>
            {GOOD_TO_KNOW.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.gtkCard}
                onPress={() => {
                  const term = GLOSSARY_TERMS.find(t => t.term.toLowerCase() === item.name.toLowerCase());
                  if (term) handleOpenTerm(term);
                }}
              >
                <View style={[styles.gtkIconWrapper, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
                </View>
                <Text style={styles.gtkText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Terms List */}
        <View style={styles.listSection}>
          {Object.keys(termsByLetter).sort().map(letter => {
            const terms = termsByLetter[letter];
            const isExpanded = expandedSections[letter];
            const displayTerms = isExpanded ? terms : terms.slice(0, 2);
            const remainingCount = terms.length - 2;

            return (
              <View 
                key={letter} 
                style={styles.letterGroup}
                onLayout={(e) => {
                  const y = e.nativeEvent.layout.y;
                  setSectionLayouts(prev => ({ ...prev, [letter]: y }));
                }}
              >
                <View style={styles.letterHeader}>
                  <Text style={styles.letterHeaderText}>{letter}</Text>
                </View>
                <View style={styles.termsContainer}>
                  {displayTerms.map(renderTermRow)}
                  {terms.length > 2 && (
                    <TouchableOpacity 
                      style={styles.seeMoreBtn}
                      onPress={() => toggleSection(letter)}
                    >
                      <Text style={styles.seeMoreText}>
                        {isExpanded ? 'See less ↑' : `See more (${remainingCount}) →`}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          {filteredTerms.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search" size={40} color={TEXT_SECONDARY} />
              </View>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>Try different keywords or suggest this term</Text>
              <TouchableOpacity 
                style={styles.suggestCta}
                onPress={() => {
                  setSuggestedTerm(searchQuery);
                  setIsSuggestModalVisible(true);
                }}
              >
                <Text style={styles.suggestCtaText}>Suggest this term →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Term Detail Modal */}
      <Modal
        visible={isTermModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsTermModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsTermModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.sheetContainer}>
                <View style={styles.dragHandle} />
                {selectedTerm && (
                  <>
                    <Text style={styles.modalTerm}>{selectedTerm.term}</Text>
                    <Text style={styles.modalPos}>{selectedTerm.partOfSpeech || 'noun'}</Text>
                    
                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>Simple Definition:</Text>
                      <Text style={styles.modalDef}>{selectedTerm.definition}</Text>
                    </View>

                    {selectedTerm.example && (
                      <View style={styles.modalSection}>
                        <Text style={styles.modalLabel}>Example:</Text>
                        <Text style={styles.modalExample}>{selectedTerm.example}</Text>
                      </View>
                    )}

                    {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
                      <View style={styles.modalSection}>
                        <Text style={styles.modalLabel}>Related terms:</Text>
                        <View style={styles.tagContainer}>
                          {selectedTerm.relatedTerms.map(tag => (
                            <TouchableOpacity 
                              key={tag} 
                              style={styles.tag}
                              onPress={() => {
                                const nextTerm = GLOSSARY_TERMS.find(t => t.term.toLowerCase() === tag.toLowerCase());
                                if (nextTerm) setSelectedTerm(nextTerm);
                              }}
                            >
                              <Text style={styles.tagText}>{tag}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Suggest Term Modal */}
      <Modal
        visible={isSuggestModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSuggestModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsSuggestModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.sheetContainer}>
                <View style={styles.dragHandle} />
                <Text style={styles.modalTerm}>Suggest a Term</Text>
                <Text style={styles.modalSubtitle}>Help us grow our glossary for students</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Term Name</Text>
                  <TextInput 
                    style={styles.modalInput}
                    placeholder="Enter term..."
                    value={suggestedTerm}
                    onChangeText={setSuggestedTerm}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Definition (Optional)</Text>
                  <TextInput 
                    style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]}
                    placeholder="Tell us what it means..."
                    multiline
                    value={suggestedDef}
                    onChangeText={setSuggestedDef}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.submitBtn}
                  onPress={handleSuggest}
                >
                  <Text style={styles.submitBtnText}>Submit Suggestion</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  scrollContent: {
    paddingTop: 10,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: TEXT_PRIMARY,
  },
  todCard: {
    backgroundColor: PRIMARY_GREEN,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  todLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  todHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  todTerm: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: WHITE,
  },
  todPos: {
    fontSize: 12,
    fontFamily: Fonts.italic,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  todDef: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  alphabetScroll: {
    marginBottom: 24,
  },
  alphabetContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  letterCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterCircleActive: {
    backgroundColor: PRIMARY_GREEN,
  },
  letterCircleDisabled: {
    opacity: 0.4,
  },
  letterText: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#9CA3AF',
  },
  letterTextActive: {
    color: WHITE,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  goodToKnowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  gtkCard: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: WHITE,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },
  gtkIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gtkText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
  listSection: {
    paddingBottom: 40,
  },
  letterGroup: {
    marginBottom: 16,
  },
  letterHeader: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 6,
    width: '100%',
    marginBottom: 8,
  },
  letterHeaderText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: PRIMARY_GREEN,
  },
  termsContainer: {
    paddingHorizontal: 20,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  termInfo: {
    flex: 1,
  },
  termName: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  termSnippet: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
  },
  seeMoreBtn: {
    padding: 12,
    alignItems: 'center',
  },
  seeMoreText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: TEXT_SECONDARY,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    marginBottom: 24,
  },
  suggestCta: {
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  suggestCtaText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: Fonts.bold,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    maxHeight: height * 0.8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTerm: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  modalPos: {
    fontSize: 14,
    fontFamily: Fonts.italic,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  modalDef: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    fontFamily: Fonts.regular,
  },
  modalExample: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    fontFamily: Fonts.regular,
    fontStyle: 'italic',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E7F5ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: PRIMARY_GREEN,
  },
  modalSubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.regular,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  submitBtn: {
    backgroundColor: PRIMARY_GREEN,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: Fonts.bold,
  }
});

export default GlossaryScreen;
