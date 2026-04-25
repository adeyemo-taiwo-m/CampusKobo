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
  FlatList,
  Modal,
  Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  PRIMARY_GREEN, 
  WHITE, 
  TEXT_PRIMARY, 
  TEXT_SECONDARY, 
  BG_LIGHT, 
  Fonts,
  DARK_GREEN 
} from '../../constants';
import { GLOSSARY_TERMS } from '../../constants/learningData';
import { GlossaryTerm } from '../../types';

const { width, height } = Dimensions.get('window');

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const GlossaryScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [expandedLetters, setExpandedLetters] = useState<string[]>([]);
  const [showDetail, setShowDetail] = useState(false);

  const termOfTheDay = useMemo(() => {
    const day = new Date().getDay();
    return GLOSSARY_TERMS[day % GLOSSARY_TERMS.length];
  }, []);

  const filteredTerms = useMemo(() => {
    let terms = GLOSSARY_TERMS;
    if (searchQuery) {
      terms = terms.filter(t => 
        t.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.definition.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Group by first letter
    const groups: { [key: string]: GlossaryTerm[] } = {};
    terms.forEach(term => {
      const firstLetter = term.term[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(term);
    });
    
    return groups;
  }, [searchQuery]);

  const toggleExpand = (letter: string) => {
    if (expandedLetters.includes(letter)) {
      setExpandedLetters(expandedLetters.filter(l => l !== letter));
    } else {
      setExpandedLetters([...expandedLetters, letter]);
    }
  };

  const openDetail = (term: GlossaryTerm) => {
    setSelectedTerm(term);
    setShowDetail(true);
  };

  const renderTermRow = (term: GlossaryTerm) => (
    <TouchableOpacity 
      key={term.id} 
      style={styles.termRow}
      onPress={() => openDetail(term)}
    >
      <View style={styles.termInfo}>
        <Text style={styles.termName}>{term.term}</Text>
        <Text style={styles.termShortDef} numberOfLines={1}>{term.definition}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Financial Glossary</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="search" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={TEXT_SECONDARY} style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search a financial term..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={TEXT_SECONDARY}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={TEXT_SECONDARY} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Term of the Day */}
        {!searchQuery && (
          <TouchableOpacity 
            style={styles.todCard}
            onPress={() => openDetail(termOfTheDay)}
          >
            <View style={styles.todBadge}>
              <Text style={styles.todBadgeText}>📅 Term of the Day</Text>
            </View>
            <Text style={styles.todTerm}>{termOfTheDay.term}</Text>
            <Text style={styles.todPOS}>{termOfTheDay.partOfSpeech}</Text>
            <Text style={styles.todDef} numberOfLines={2}>{termOfTheDay.definition}</Text>
          </TouchableOpacity>
        )}

        {/* Alphabet Filter */}
        <View style={styles.alphabetContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.alphabetScroll}
          >
            {ALPHABET.map(letter => (
              <TouchableOpacity 
                key={letter}
                style={[
                  styles.letterCircle,
                  selectedLetter === letter && styles.letterCircleActive
                ]}
                onPress={() => setSelectedLetter(letter)}
              >
                <Text style={[
                  styles.letterText,
                  selectedLetter === letter && styles.letterTextActive
                ]}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Good to Know */}
        {!searchQuery && (
          <View style={styles.gtmSection}>
            <Text style={styles.sectionTitle}>Good to Know</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.gtmScroll}
            >
              {[
                { name: 'Budget', color: '#E6F7ED', icon: 'wallet', termId: 'gt-005' },
                { name: 'Interest', color: '#E3F2FD', icon: 'trending-up', termId: 'gt-017' },
                { name: 'Credit Score', color: '#F3E5F5', icon: 'card', termId: 'gt-011' }
              ].map((item, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={[styles.gtmCard, { backgroundColor: item.color }]}
                  onPress={() => {
                    const term = GLOSSARY_TERMS.find(t => t.id === item.termId);
                    if (term) openDetail(term);
                  }}
                >
                  <Ionicons name={item.icon as any} size={24} color={TEXT_PRIMARY} style={{ marginBottom: 12 }} />
                  <Text style={styles.gtmCardName}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Terms List */}
        <View style={styles.termsList}>
          {Object.keys(filteredTerms).sort().map(letter => {
            const terms = filteredTerms[letter];
            const isExpanded = expandedLetters.includes(letter);
            const displayedTerms = isExpanded ? terms : terms.slice(0, 2);

            return (
              <View key={letter} style={styles.letterGroup}>
                <View style={styles.letterHeader}>
                  <Text style={styles.letterHeaderText}>{letter}</Text>
                </View>
                {displayedTerms.map(renderTermRow)}
                {terms.length > 2 && (
                  <TouchableOpacity 
                    style={styles.seeMoreBtn}
                    onPress={() => toggleExpand(letter)}
                  >
                    <Text style={styles.seeMoreText}>
                      {isExpanded ? 'See less ↑' : `See more (${terms.length - 2}) →`}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          {Object.keys(filteredTerms).length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="search-outline" size={60} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>Try different keywords or suggest this term to our team.</Text>
              <TouchableOpacity style={styles.suggestBtn}>
                <Text style={styles.suggestBtnText}>Suggest this term →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Term Detail Modal */}
      <Modal
        visible={showDetail}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetail(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowDetail(false)} />
          <View style={styles.modalContent}>
            <View style={styles.dragHandle} />
            {selectedTerm && (
              <ScrollView style={styles.modalScroll}>
                <Text style={styles.modalTerm}>{selectedTerm.term}</Text>
                <Text style={styles.modalPOS}>{selectedTerm.partOfSpeech}</Text>
                
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Simple Definition:</Text>
                  <Text style={styles.modalText}>{selectedTerm.definition}</Text>
                </View>

                {selectedTerm.example && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>Example:</Text>
                    <View style={styles.exampleBox}>
                       <Text style={styles.exampleText}>{selectedTerm.example}</Text>
                    </View>
                  </View>
                )}

                {selectedTerm.relatedTerms && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>Related terms:</Text>
                    <View style={styles.relatedChips}>
                      {selectedTerm.relatedTerms.map((t, i) => (
                        <TouchableOpacity key={i} style={styles.chip}>
                          <Text style={styles.chipText}>{t}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
                
                <View style={{ height: 40 }} />
                <TouchableOpacity 
                  style={styles.closeModalBtn}
                  onPress={() => setShowDetail(false)}
                >
                  <Text style={styles.closeModalBtnText}>Got it!</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    padding: 20,
    backgroundColor: WHITE,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  todCard: {
    backgroundColor: '#064E3B',
    margin: 20,
    borderRadius: 20,
    padding: 24,
  },
  todBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 16,
  },
  todBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#D1FAE5',
  },
  todTerm: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: WHITE,
    marginBottom: 4,
  },
  todPOS: {
    fontFamily: Fonts.italic,
    fontSize: 14,
    color: '#D1FAE5',
    opacity: 0.7,
    marginBottom: 12,
  },
  todDef: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: WHITE,
    lineHeight: 22,
  },
  alphabetContainer: {
    backgroundColor: WHITE,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  alphabetScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  letterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterCircleActive: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  letterText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  letterTextActive: {
    color: WHITE,
  },
  gtmSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  gtmScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  gtmCard: {
    width: 140,
    padding: 16,
    borderRadius: 16,
  },
  gtmCardName: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  termsList: {
    paddingHorizontal: 20,
  },
  letterGroup: {
    marginBottom: 24,
  },
  letterHeader: {
    height: 40,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 8,
  },
  letterHeaderText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_SECONDARY,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  termInfo: {
    flex: 1,
  },
  termName: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  termShortDef: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  seeMoreBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  seeMoreText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: height * 0.8,
    padding: 24,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalScroll: {},
  modalTerm: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  modalPOS: {
    fontFamily: Fonts.italic,
    fontSize: 16,
    color: TEXT_SECONDARY,
    marginBottom: 24,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalLabel: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_SECONDARY,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  modalText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: TEXT_PRIMARY,
    lineHeight: 24,
  },
  exampleBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_GREEN,
  },
  exampleText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: TEXT_PRIMARY,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  relatedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#E6F7ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: PRIMARY_GREEN,
  },
  closeModalBtn: {
    backgroundColor: PRIMARY_GREEN,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeModalBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: WHITE,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
    marginBottom: 24,
    paddingHorizontal: 40,
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
});

export default GlossaryScreen;
