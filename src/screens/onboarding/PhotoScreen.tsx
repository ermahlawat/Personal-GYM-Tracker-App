// PhotoScreen — Screen 4 of onboarding.
// Lets the user pick a profile photo from camera or gallery.
// This screen is OPTIONAL — "Skip for now" always available.
// Photo stored as a local file path in the profile record.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProfileStore } from '../../store/profileStore';
import { AppButton } from '../../components/common/AppButton';
import { obsidianTheme as darkTheme } from '../../theme/obsidian';
import { StepDots } from './components/StepDots';

const theme = darkTheme;

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function PhotoScreen({ navigation }: Props) {
  const { activeProfileId, updateProfile } = useProfileStore();
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Request permission and open gallery or camera
  const pickPhoto = async (source: 'gallery' | 'camera') => {
    let result;

    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return;
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],   // force square crop for circular avatar
        quality: 0.8,
      });
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    if (activeProfileId && photoUri) {
      updateProfile(activeProfileId, { avatarPath: photoUri });
    }
    navigation.navigate('Goal');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <StepDots total={5} current={3} />

        <Text style={styles.heading}>Add a profile photo</Text>
        <Text style={styles.sub}>
          Makes your profile feel personal. You can always change it later.
        </Text>

        {/* Photo zone */}
        <View style={styles.photoArea}>
          {photoUri ? (
            // Show selected photo in circular frame
            <TouchableOpacity
              onPress={() => pickPhoto('gallery')}
              activeOpacity={0.85}
            >
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              <Text style={styles.changePhotoHint}>Tap to change</Text>
            </TouchableOpacity>
          ) : (
            // Empty state — camera icon + dashed border
            <TouchableOpacity
              style={styles.emptyZone}
              onPress={() => pickPhoto('gallery')}
              activeOpacity={0.8}
            >
              {/* SVG camera icon drawn with View shapes */}
              <View style={styles.cameraIcon}>
                <View style={styles.cameraBody} />
                <View style={styles.cameraLens} />
              </View>
              <Text style={styles.zoneLabel}>Tap to choose photo</Text>
            </TouchableOpacity>
          )}

          {/* Source options */}
          {!photoUri && (
            <View style={styles.sourceRow}>
              <TouchableOpacity
                style={styles.sourceBtn}
                onPress={() => pickPhoto('camera')}
                activeOpacity={0.8}
              >
                <Text style={styles.sourceBtnText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sourceBtn}
                onPress={() => pickPhoto('gallery')}
                activeOpacity={0.8}
              >
                <Text style={styles.sourceBtnText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <AppButton
          label="Continue"
          onPress={handleContinue}
          style={styles.cta}
        />

        {/* Skip — clearly visible but secondary */}
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.navigate('Goal')}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: '500',
    color: theme.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  sub: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 40,
  },
  photoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  emptyZone: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cameraIcon: {
    alignItems: 'center',
    marginBottom: 2,
  },
  cameraBody: {
    width: 28,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLens: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#444444',
  },
  zoneLabel: {
    fontSize: 10,
    color: '#444444',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 14,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  changePhotoHint: {
    fontSize: 10,
    color: '#555555',
    textAlign: 'center',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sourceRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  sourceBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: theme.surface,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: theme.border,
  },
  sourceBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  cta: {
    width: '100%',
    marginBottom: 14,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 12,
    color: '#444444',
  },
});
