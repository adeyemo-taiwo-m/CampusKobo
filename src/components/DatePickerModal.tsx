import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { WHITE, PRIMARY_GREEN, TEXT_PRIMARY, TEXT_SECONDARY, Fonts, BORDER_GRAY } from '../constants';

interface DatePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  selectedDate: Date;
}

export const DatePickerModal = ({ isVisible, onClose, onSelect, selectedDate }: DatePickerModalProps) => {
  // Generate dates for the next 30 days
  const dates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const renderItem = ({ item }: { item: Date }) => {
    const isSelected = item.toDateString() === selectedDate.toDateString();
    return (
      <TouchableOpacity 
        style={[styles.dateItem, isSelected && styles.selectedDateItem]}
        onPress={() => {
          onSelect(item);
          onClose();
        }}
      >
        <Text style={[styles.dayText, isSelected && styles.selectedText]}>
          {item.toLocaleDateString('en-US', { weekday: 'short' })}
        </Text>
        <Text style={[styles.dateText, isSelected && styles.selectedText]}>
          {item.getDate()}
        </Text>
        <Text style={[styles.monthText, isSelected && styles.selectedText]}>
          {item.toLocaleDateString('en-US', { month: 'short' })}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.handle} />
        <Text style={styles.title}>Choose Start Date</Text>
        
        <FlatList
          data={dates}
          renderItem={renderItem}
          keyExtractor={(item) => item.toISOString()}
          numColumns={4}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: BORDER_GRAY,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
  dateItem: {
    flex: 1,
    aspectRatio: 0.8,
    margin: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  selectedDateItem: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  dayText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
  monthText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  selectedText: {
    color: WHITE,
  },
  closeButton: {
    marginTop: 10,
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#E03A3A',
  },
});
