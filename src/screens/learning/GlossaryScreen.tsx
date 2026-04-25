import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { GLOSSARY_TERMS } from '../../constants/learningData';
import { GlossaryTerm } from '../../types';
import {
  PRIMARY_GREEN,
  WHITE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BACKGROUND,
  Fonts,
  Colors,
} from '../../constants';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const { height } = Dimensions.get('window');

export const GlossaryScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [expandedLetters, setExpandedLetters] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isSuggestSheetVisible, setIsSuggestSheetVisible] = useState(false);

  // Term of the day (deterministic based on day of month)
  const termOfDay = useMemo(() => {
    const day = new Date().getDate();
    return GLOSSARY_TERMS[day % GLOSSARY_TERMS.length];
  }, []);

  // Filtered terms
  const filteredTerms = useMemo(() => {
    let results = GLOSSARY_TERMS;
    
    if (searchQuery) {
      results = results.filter(t => 
        t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.definition.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (selectedLetter !== 'All') {
      results = results.filter(t => t.term.startsWith(selectedLetter));
    }

    // Group by letter
    const grouped: { [key: string]: GlossaryTerm[] } = {};
    results.forEach(t => {
      const firstChar = t.term[0].toUpperCase();
      if (!grouped[firstChar]) grouped[firstChar] = [];
      grouped[firstChar].push(t);
    });

    return grouped;
  }, [searchQuery, selectedLetter]);

  const toggleLetterExpansion = (letter: string) => {
    if (expandedLetters.includes(letter)) {
      setExpandedLetters(expandedLetters.filter(l => l !== letter));
    } else {
      setExpandedLetters([...expandedLetters, letter]);
    }
  };

  const openTermDetail = (term: GlossaryTerm) => {
    setSelectedTerm(term);
    setIsSheetVisible(true);
  };

  const handleRelatedTerm = (termName: string) => {
    const term = GLOSSARY_TERMS.find(t => t.term.toLowerCase() === termName.toLowerCase());
    if (term) {
      setSelectedTerm(term);
    }
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
        <Text style={styles.headerTitle}>Financial Glossary</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="search" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={TEXT_SECONDARY} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search a financial term..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {!searchQuery && (
          <>
            {/* Term of the Day */}
            <TouchableOpacity 
              style={styles.todCard}
              onPress={() => openTermDetail(termOfDay)}
            >
              <View style={styles.todHeader}>
                <Ionicons name="calendar-outline" size={16} color="#10B981" />
                <Text style={styles.todLabel}>Term of the Day</Text>
              </View>
              <Text style={styles.todName}>{termOfDay.term}</Text>
              <Text style={styles.todPOS}>{termOfDay.partOfSpeech}</Text>
              <Text style={styles.todDef} numberOfLines={2}>{termOfDay.definition}</Text>
            </TouchableOpacity>

            {/* Alphabet Filter */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.alphabetContainer}
            >
              <TouchableOpacity 
                style={[styles.letterCircle, selectedLetter === 'All' && styles.letterCircleActive]}
                onPress={() => setSelectedLetter('All')}
              >
                <Text style={[styles.letterText, selectedLetter === 'All' && styles.letterTextActive]}>All</Text>
              </TouchableOpacity>
              {ALPHABET.map(letter => (
                <TouchableOpacity 
                  key={letter}
                  style={[styles.letterCircle, selectedLetter === letter && styles.letterCircleActive]}
                  onPress={() => setSelectedLetter(letter)}
                >
                  <Text style={[styles.letterText, selectedLetter === letter && styles.letterTextActive]}>{letter}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Good to Know Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Good to Know</Text>
              <View style={styles.quickCardsRow}>
                <TouchableOpacity 
                  style={[styles.quickCard, { backgroundColor: '#E8F5E9' }]}
                  onPress={() => openTermDetail(GLOSSARY_TERMS.find(t => t.term === 'Budget')!)}
                >
                  <Text style={[styles.quickCardText, { color: '#2E7D32' }]}>Budget</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.quickCard, { backgroundColor: '#E3F2FD' }]}
                  onPress={() => openTermDetail(GLOSSARY_TERMS.find(t => t.term === 'Interest')!)}
                >
                  <Text style={[styles.quickCardText, { color: '#1565C0' }]}>Interest</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.quickCard, { backgroundColor: '#F3E5F5' }]}
                  onPress={() => openTermDetail(GLOSSARY_TERMS.find(t => t.term === 'Credit Score')!)}
                >
                  <Text style={[styles.quickCardText, { color: '#7B1FA2' }]}>Credit Score</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Terms List */}
        <View style={styles.listSection}>
          {Object.keys(filteredTerms).length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search" size={40} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>Try different keywords or suggest this term to our team.</Text>
              <TouchableOpacity 
                style={styles.suggestBtn}
                onPress={() => setIsSuggestSheetVisible(true)}
              >
                <Text style={styles.suggestBtnText}>Suggest this term →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            Object.keys(filteredTerms).sort().map(letter => {
              const terms = filteredTerms[letter];
              const isExpanded = expandedLetters.includes(letter) || searchQuery.length > 0;
              const displayTerms = isExpanded ? terms : terms.slice(0, 2);

              return (
                <View key={letter} style={styles.letterGroup}>
                  <Text style={styles.groupHeader}>{letter}</Text>
                  {displayTerms.map(t => (
                    <TouchableOpacity 
                      key={t.id} 
                      style={styles.termRow}
                      onPress={() => openTermDetail(t)}
                    >
                      <View style={styles.termInfo}>
                        <Text style={styles.termName}>{t.term}</Text>
                        <Text style={styles.termShortDef} numberOfLines={1}>{t.definition}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  ))}
                  {!isExpanded && terms.length > 2 && (
                    <TouchableOpacity 
                      style={styles.seeMoreBtn}
                      onPress={() => toggleLetterExpansion(letter)}
                    >
                      <Text style={styles.seeMoreText}>See more ({terms.length - 2}) →</Text>
                    </TouchableOpacity>
                  )}
                  {isExpanded && terms.length > 2 && !searchQuery && (
                    <TouchableOpacity 
                      style={styles.seeMoreBtn}
                      onPress={() => toggleLetterExpansion(letter)}
                    >
                      <Text style={styles.seeMoreText}>See less ↑</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Term Detail Bottom Sheet */}
      <Modal
        isVisible={isSheetVisible}
        onBackdropPress={() => setIsSheetVisible(false)}
        onSwipeComplete={() => setIsSheetVisible(false)}
        swipeDirection="down"
        style={styles.modal}
        propagateSwipe
      >
        <View style={styles.sheetContent}>
          <View style={styles.dragHandle} />
          {selectedTerm && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.sheetTermName}>{selectedTerm.term}</Text>
              <Text style={styles.sheetPOS}>{selectedTerm.partOfSpeech}</Text>
              
              <View style={styles.sheetSection}>
                <Text style={styles.sheetLabel}>Simple Definition:</Text>
                <Text style={styles.sheetValue}>{selectedTerm.definition}</Text>
              </View>

              <View style={styles.sheetSection}>
                <Text style={styles.sheetLabel}>Example:</Text>
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleText}>{selectedTerm.example}</Text>
                </View>
              </View>

              {selectedTerm.relatedTerms && (
                <View style={styles.sheetSection}>
                  <Text style={styles.sheetLabel}>Related terms:</Text>
                  <View style={styles.relatedRow}>
                    {selectedTerm.relatedTerms.map(rt => (
                      <TouchableOpacity 
                        key={rt} 
                        style={styles.relatedChip}
                        onPress={() => handleRelatedTerm(rt)}
                      >
                        <Text style={styles.relatedChipText}>{rt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.closeSheetBtn}
                onPress={() => setIsSheetVisible(false)}
              >
                <Text style={styles.closeSheetBtnText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Suggest Term Bottom Sheet */}
      <Modal
        isVisible={isSuggestSheetVisible}
        onBackdropPress={() => setIsSuggestSheetVisible(false)}
        onSwipeComplete={() => setIsSuggestSheetVisible(false)}
        swipeDirection="down"
        style={styles.modal}
        avoidKeyboard
      >
        <View style={styles.sheetContent}>
          <View style={styles.dragHandle} />
          <Text style={styles.sheetTermName}>Suggest a Term</Text>
          <Text style={styles.sheetPOS}>Help us expand our glossary</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Term Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter the term..."
              defaultValue={searchQuery}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>What does it mean? (Optional)</Text>
            <TextInput 
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
              placeholder="Briefly describe the term..."
              multiline
            />
          </View>

          <TouchableOpacity 
            style={styles.submitSuggestBtn}
            onPress={() => {
              setIsSuggestSheetVisible(false);
              alert("Thank you! We've received your suggestion and will review it soon. 🚀");
            }}
          >
            <Text style={styles.submitSuggestBtnText}>Submit Suggestion</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  todCard: {
    marginHorizontal: 20,
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    marginTop: 10,
  },
  todHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  todLabel: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#10B981',
    textTransform: 'uppercase',
  },
  todName: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: WHITE,
    marginBottom: 4,
  },
  todPOS: {
    fontFamily: Fonts.italic,
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  todDef: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 22,
  },
  alphabetContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  letterCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterCircleActive: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  letterText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: TEXT_SECONDARY,
  },
  letterTextActive: {
    color: WHITE,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionLabel: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  quickCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickCard: {
    flex: 1,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  quickCardText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    textAlign: 'center',
  },
  listSection: {
    paddingHorizontal: 20,
  },
  letterGroup: {
    marginBottom: 24,
  },
  groupHeader: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 12,
    paddingLeft: 4,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  termInfo: {
    flex: 1,
    marginRight: 12,
  },
  termName: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  termShortDef: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  seeMoreBtn: {
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  seeMoreText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  emptyContainer: {
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
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  suggestBtn: {
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  suggestBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: WHITE,
  },
  // Modal Sheet
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheetContent: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: height * 0.8,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTermName: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  sheetPOS: {
    fontFamily: Fonts.italic,
    fontSize: 16,
    color: TEXT_SECONDARY,
    marginBottom: 24,
  },
  sheetSection: {
    marginBottom: 24,
  },
  sheetLabel: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  sheetValue: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  exampleBox: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_GREEN,
  },
  exampleText: {
    fontFamily: Fonts.italic,
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  relatedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relatedChip: {
    backgroundColor: Colors.primary.P100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  relatedChipText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: PRIMARY_GREEN,
  },
  closeSheetBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  closeSheetBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  // Suggest Form
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  submitSuggestBtn: {
    backgroundColor: PRIMARY_GREEN,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitSuggestBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: WHITE,
  },
});
