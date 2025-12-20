import React from 'react';
import { Modal, Pressable, View, Text, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../store/SettingsStore';
import { FlashList } from '@shopify/flash-list';

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ visible, onClose }) => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useSettingsStore();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'az', label: 'Azərbaycan dili' },
    { code: 'uz', label: 'O\'zbek tili' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'ur', label: 'اردو' },
    { code: 'ar', label: 'العربية' },
    { code: 'es', label: 'Español' },
    { code: 'ru', label: 'Русский' },
  ];

  const handleLanguageSelect = async (langCode: string) => {
    await setLanguage(langCode);
    await i18n.changeLanguage(langCode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#1f2937',
            borderRadius: 16,
            padding: 24,
            width: '80%',
            maxWidth: 400,
            maxHeight: '80%',
          }}
        >
          <View>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              {t('language.select')}
            </Text>

            <View style={{ height: Math.min(languages.length * 60, Dimensions.get('window').height * 0.4), marginBottom: 8 }}>
              <FlashList
                data={languages}
                renderItem={({ item: lang }) => (
                  <Pressable
                    onPress={() => handleLanguageSelect(lang.code)}
                    style={{
                      backgroundColor: language === lang.code ? '#7e22ce' : '#374151',
                      padding: 16,
                      borderRadius: 8,
                      marginVertical: 4,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                        }}
                      >
                        {lang.label}
                      </Text>
                      {language === lang.code && (
                        <Text style={{ color: 'white', fontSize: 18 }}>✓</Text>
                      )}
                    </View>
                  </Pressable>
                )}
                estimatedItemSize={60}
                keyExtractor={(item) => item.code}
                showsVerticalScrollIndicator={false}
              />
            </View>

            <Pressable
              onPress={onClose}
              style={{
                backgroundColor: '#374151',
                padding: 12,
                borderRadius: 8,
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  textAlign: 'center',
                }}
              >
                {t('common.cancel')}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

