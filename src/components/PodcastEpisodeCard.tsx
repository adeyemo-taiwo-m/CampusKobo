import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WHITE, TEXT_PRIMARY, TEXT_SECONDARY, Fonts } from '../constants';

const { width } = Dimensions.get('window');

interface PodcastEpisodeCardProps {
  title: string;
  episode?: string;
  duration: string;
  image: any;
  onPress?: () => void;
  isLatest?: boolean;
}

export const PodcastEpisodeCard = ({
  title,
  episode,
  duration,
  image,
  onPress,
  isLatest = true,
}: PodcastEpisodeCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9} 
      onPress={onPress}
    >
      <ImageBackground 
        source={image} 
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
          style={styles.overlay}
        >
          <View style={styles.content}>
            {isLatest && (
              <View style={styles.latestBadge}>
                <Text style={styles.latestBadgeText}>Latest Episode</Text>
              </View>
            )}
            
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            
            <View style={styles.metaRow}>
              <Ionicons name="headset" size={14} color="#D1D5DB" />
              <Text style={styles.metaText}>Podcast • {duration}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={onPress}
              activeOpacity={0.8}
            >
              <Text style={styles.ctaText}>Listen now</Text>
              <Ionicons name="arrow-forward" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 400,
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 20,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    opacity: 0.8, // For monochrome grayscale feel
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  content: {
    gap: 10,
  },
  latestBadge: {
    backgroundColor: WHITE,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  latestBadgeText: {
    color: '#000',
    fontSize: 11,
    fontFamily: Fonts.bold,
  },
  title: {
    color: WHITE,
    fontSize: 20,
    fontFamily: Fonts.bold,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  metaText: {
    color: '#D1D5DB', // light gray
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  ctaButton: {
    backgroundColor: WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  ctaText: {
    color: '#000',
    fontSize: 15,
    fontFamily: Fonts.bold,
  },
});
