import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  BORDER_GRAY,
} from '../../constants';
import { Header } from '../../components/Header';
import { GLOSSARY_TERMS } from '../../constants/learningData';

export const GlossaryScreen = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  
  const filteredTerms = GLOSSARY_TERMS.filter(t => 
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Finance Glossary" showBack={true} onBack={() => router.back()} />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={TEXT_SECONDARY} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search financial terms..."
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={TEXT_SECONDARY} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item) => (
            <View key={item.id} style={styles.termCard}>
              <View style={styles.termHeader}>
                <Text style={styles.termText}>{item.term}</Text>
                <Text style={styles.partOfSpeech}>{item.partOfSpeech}</Text>
              </View>
              <Text style={styles.definitionText}>{item.definition}</Text>
              <Text style={styles.exampleText}>
                <Text style={{ fontFamily: Fonts.bold }}>Example: </Text>
                {item.example}
              </Text>
              
              {item.relatedTerms && (
                <View style={styles.relatedRow}>
                  <Text style={styles.relatedLabel}>Related: </Text>
                  {item.relatedTerms.map((rt, idx) => (
                    <TouchableOpacity key={idx} style={styles.relatedChip}>
                      <Text style={styles.relatedChipText}>{rt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
             <Ionicons name="search-outline" size={64} color="#E5E7EB" />
             <Text style={styles.emptyTitle}>No terms found</Text>
             <Text style={styles.emptySub}>Try searching for something else</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  scrollPadding: {
    padding: 20,
    paddingBottom: 40,
  },
  termCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 20,
    elevation: 1,
  },
  termHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 10,
  },
  termText: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: TEXT_PRIMARY,
  },
  partOfSpeech: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: PRIMARY_GREEN,
    fontStyle: 'italic',
  },
  definitionText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: TEXT_PRIMARY,
    lineHeight: 22,
    marginBottom: 12,
  },
  exampleText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: 16,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#F0FDF4',
  },
  relatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  relatedLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  relatedChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  relatedChipText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: TEXT_SECONDARY,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginTop: 16,
  },
  emptySub: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginTop: 8,
  },
});

export default GlossaryScreen;
