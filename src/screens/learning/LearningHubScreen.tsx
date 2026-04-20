import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  BACKGROUND,
  WHITE,
  PRIMARY_GREEN,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  Fonts,
  BORDER_GRAY,
} from '../../constants';
import { Header } from '../../components/Header';
import { LEARNING_CONTENT, FINANCE_101_SERIES } from '../../constants/learningData';

export const LearningHubScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Budgeting', 'Saving', 'Investing', 'Loans', 'Credit'];

  const featured = LEARNING_CONTENT.find(c => c.isFeatured);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Learning Hub" 
        showBack={true} 
        onBack={() => router.back()}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryRow}
        >
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat}
              style={[styles.catChip, selectedCategory === cat && styles.activeCatChip]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catChipText, selectedCategory === cat && styles.activeCatChipText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.content}>
          {/* Featured Content */}
          <Text style={styles.sectionTitle}>Featured</Text>
          {featured && (
            <TouchableOpacity 
              style={styles.featuredCard}
              onPress={() => router.push({ pathname: '/learning/detail', params: { id: featured.id } })}
            >
              <View style={styles.featuredVisual}>
                <Ionicons name="book-outline" size={40} color={PRIMARY_GREEN} />
              </View>
              <View style={styles.featuredInfo}>
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>{featured.category}</Text>
                </View>
                <Text style={styles.featuredTitle}>{featured.title}</Text>
                <Text style={styles.featuredMeta}>📄 Article • {featured.duration}</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Finance 101 Series */}
          <View style={styles.sectionHeader}>
            <View>
                <Text style={styles.sectionTitle}>Finance 101 Series</Text>
                <Text style={styles.sectionSubtitle}>By BOF OAU</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/learning/finance101")}>
                <Text style={styles.seeAllText}>See all →</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={FINANCE_101_SERIES}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.seriesCard, { backgroundColor: item.color }]}
                onPress={() => router.push({ pathname: '/learning/detail', params: { id: item.id } })}
              >
                <Text style={styles.seriesNumber}>EP 0{item.id}</Text>
                <Text style={styles.seriesTitle}>{item.title}</Text>
                <Text style={styles.seriesDuration}>{item.duration}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.seriesList}
          />

          {/* Quick Access */}
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity style={styles.quickCard} onPress={() => router.push("/learning/finance101")}>
                <View style={[styles.quickIconCircle, { backgroundColor: '#E3F2FD' }]}>
                    <Ionicons name="book" size={24} color="#1E88E5" />
                </View>
                <Text style={styles.quickLabel}>Finance 101</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => router.push("/learning/glossary")}>
                <View style={[styles.quickIconCircle, { backgroundColor: '#F3E5F5' }]}>
                    <Ionicons name="document-text" size={24} color="#8E24AA" />
                </View>
                <Text style={styles.quickLabel}>Glossary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => router.push("/learning/podcast")}>
                <View style={[styles.quickIconCircle, { backgroundColor: '#FFF3E0' }]}>
                    <Ionicons name="headphones" size={24} color="#FB8C00" />
                </View>
                <Text style={styles.quickLabel}>Podcast</Text>
            </TouchableOpacity>
          </View>

          {/* Latest Content */}
          <Text style={styles.sectionTitle}>Latest</Text>
          <View style={styles.latestList}>
            {LEARNING_CONTENT.map(item => (
                <TouchableOpacity 
                    key={item.id} 
                    style={styles.latestItem}
                    onPress={() => router.push({ pathname: '/learning/detail', params: { id: item.id } })}
                >
                    <View style={styles.latestThumb}>
                        <Ionicons 
                            name={item.type === 'video' ? 'play-circle' : item.type === 'podcast' ? 'mic' : 'document-text'} 
                            size={20} 
                            color={PRIMARY_GREEN} 
                        />
                    </View>
                    <View style={styles.latestInfo}>
                        <Text style={styles.latestCat}>{item.category}</Text>
                        <Text style={styles.latestTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.latestMeta}>
                            {item.type === 'article' ? '📄' : item.type === 'video' ? '🎥' : '🎧'} {item.duration}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={TEXT_SECONDARY} />
                </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  categoryRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeCatChip: {
    backgroundColor: PRIMARY_GREEN,
  },
  catChipText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  activeCatChipText: {
    color: WHITE,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 32,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  seeAllText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  featuredCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  featuredVisual: {
    height: 140,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredInfo: {
    padding: 20,
  },
  catBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  catBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: '#16A34A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  featuredTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 8,
    lineHeight: 24,
  },
  featuredMeta: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  seriesList: {
    gap: 16,
    paddingBottom: 8,
  },
  seriesCard: {
    width: 140,
    padding: 16,
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  seriesNumber: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: WHITE,
    opacity: 0.8,
  },
  seriesTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: WHITE,
    marginVertical: 16,
    lineHeight: 20,
  },
  seriesDuration: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: WHITE,
    opacity: 0.9,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 32,
  },
  quickCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: TEXT_PRIMARY,
  },
  latestList: {
    gap: 12,
  },
  latestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    gap: 12,
  },
  latestThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  latestInfo: {
    flex: 1,
  },
  latestCat: {
    fontFamily: Fonts.semiBold,
    fontSize: 10,
    color: PRIMARY_GREEN,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  latestTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  latestMeta: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: TEXT_SECONDARY,
  },
});

export default LearningHubScreen;
