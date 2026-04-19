import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WHITE, TEXT_PRIMARY, TEXT_SECONDARY, SPACING, BORDER_GRAY, Fonts } from '../constants';

const { height } = Dimensions.get('window');

interface ExportBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'excel') => void;
}

export const ExportBottomSheet = ({ isVisible, onClose, onExport }: ExportBottomSheetProps) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.handle} />
              <Text style={styles.title}>Export Transactions</Text>
              
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={styles.optionItem} 
                  onPress={() => onExport('pdf')}
                >
                  <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="document-text" size={24} color="#EF4444" />
                  </View>
                  <Text style={styles.optionText}>Export as PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.optionItem} 
                  onPress={() => onExport('excel')}
                >
                  <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="stats-chart" size={24} color="#10B981" />
                  </View>
                  <Text style={styles.optionText}>Export as Excel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={onClose}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: SPACING.LG,
    paddingBottom: SPACING.XXL,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: BORDER_GRAY,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.MD,
  },
  title: {
    fontSize: 20,
    color: TEXT_PRIMARY,
    marginBottom: SPACING.XL,
    textAlign: 'center',
    fontFamily: Fonts.semiBold,
  },
  optionsContainer: {
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: TEXT_PRIMARY,
  },
  cancelButton: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: TEXT_SECONDARY,
  },
});
