import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { WHITE, PRIMARY_GREEN, TEXT_PRIMARY, TEXT_SECONDARY, Fonts, BORDER_GRAY } from '../constants';

const { height } = Dimensions.get('window');

interface TimePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (hour: number) => void;
  selectedHour: number;
  title?: string;
}

export const TimePickerModal = ({ isVisible, onClose, onSelect, selectedHour, title = "Select Hour" }: TimePickerModalProps) => {
  // Generate hours 0-23
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (h: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  const renderItem = ({ item }: { item: number }) => {
    const isSelected = item === selectedHour;
    return (
      <TouchableOpacity 
        style={[styles.hourItem, isSelected && styles.selectedHourItem]}
        onPress={() => {
          onSelect(item);
          onClose();
        }}
      >
        <Text style={[styles.hourText, isSelected && styles.selectedText]}>
          {formatHour(item)}
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
        <Text style={styles.title}>{title}</Text>
        
        <FlatList
          data={hours}
          renderItem={renderItem}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={selectedHour > 3 ? selectedHour - 2 : 0}
          getItemLayout={(data, index) => (
            {length: 60, offset: 60 * index, index}
          )}
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
    height: height * 0.5,
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
  hourItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  selectedHourItem: {
    backgroundColor: '#F0FDF4',
    borderBottomColor: PRIMARY_GREEN,
  },
  hourText: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
  },
  selectedText: {
    color: PRIMARY_GREEN,
    fontFamily: Fonts.bold,
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
