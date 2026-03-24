import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, TextInput, Image, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../theme';
import { useProfileStore } from '../../store/profileStore';
import { useSettingsStore } from '../../store/settingsStore';

interface Props { navigation: any; }

export default function ProfileDrawerScreen({ navigation }: Props) {
  const theme = useTheme();
  const { profiles, getActiveProfile, updateProfile, setActiveProfile } = useProfileStore();
  const { getSettings, updateMacroTargets, loadSettings } = useSettingsStore();
  const profile = getActiveProfile();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.name ?? '');
  const [editingMacros, setEditingMacros] = useState(false);
  const [macroInputs, setMacroInputs] = useState({ calories: '', protein: '', carbs: '', fat: '' });

  useEffect(() => {
    if (profile) loadSettings(profile.id);
  }, [profile?.id]);

  if (!profile) return null;

  const settings = getSettings(profile.id);
  const otherProfile = profiles.find((p) => p.id !== profile.id);

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    updateProfile(profile.id, { name: nameInput.trim() });
    setEditingName(false);
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Allow access to your photos.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      updateProfile(profile.id, { avatarPath: result.assets[0].uri });
    }
  };

  const handleSaveMacros = async () => {
    await updateMacroTargets(profile.id, {
      calories: macroInputs.calories ? parseInt(macroInputs.calories) : settings.macroTargets.calories,
      proteinG: macroInputs.protein  ? parseInt(macroInputs.protein)  : settings.macroTargets.proteinG,
      carbsG:   macroInputs.carbs    ? parseInt(macroInputs.carbs)    : settings.macroTargets.carbsG,
      fatG:     macroInputs.fat      ? parseInt(macroInputs.fat)      : settings.macroTargets.fatG,
    });
    setEditingMacros(false);
    setMacroInputs({ calories: '', protein: '', carbs: '', fat: '' });
  };

  const isPink = profile.theme === 'pink';
  const avatarBg = isPink ? '#F4C0D1' : '#1A3358';
  const avatarBorder = isPink ? '#D4537E' : '#4A9EFF';
  const avatarText = isPink ? '#72243E' : '#FFFFFF';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: theme.textSecondary }]}>Close</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Profile</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handlePickPhoto} activeOpacity={0.85}>
            <View style={[styles.avatarCircle, { backgroundColor: avatarBg, borderColor: avatarBorder }]}>
              {profile.avatarPath ? (
                <Image source={{ uri: profile.avatarPath }} style={styles.avatarImage} />
              ) : (
                <Text style={[styles.avatarInitials, { color: avatarText }]}>{profile.abbreviatedName}</Text>
              )}
            </View>
            <View style={[styles.editBadge, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.editBadgeText, { color: theme.textSecondary }]}>Edit</Text>
            </View>
          </TouchableOpacity>

          {editingName ? (
            <View style={styles.nameEditRow}>
              <TextInput
                style={[styles.nameInput, { backgroundColor: theme.surface, borderColor: theme.accent, color: theme.textPrimary }]}
                value={nameInput} onChangeText={setNameInput}
                autoFocus autoCapitalize="words" returnKeyType="done"
                onSubmitEditing={handleSaveName}
              />
              <TouchableOpacity onPress={handleSaveName} style={[styles.nameSaveBtn, { backgroundColor: theme.accent }]}>
                <Text style={[styles.nameSaveBtnText, { color: theme.buttonText }]}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => { setNameInput(profile.name); setEditingName(true); }}>
              <Text style={[styles.profileName, { color: theme.textPrimary }]}>{profile.name}</Text>
              <Text style={[styles.profileNameHint, { color: theme.textLabel }]}>Tap to edit name</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.section, { borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.textLabel }]}>FITNESS GOAL</Text>
          {([
            { id: 'muscle',      label: 'Build muscle',    desc: 'Track volume and progressive overload' },
            { id: 'weight_loss', label: 'Lose weight',     desc: 'Track weight trend and measurements' },
            { id: 'general',     label: 'General fitness', desc: 'Balanced tracking' },
          ] as const).map((g) => {
            const isActive = profile.goal === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                style={[styles.optionRow, { borderBottomColor: theme.border }]}
                onPress={() => updateProfile(profile.id, { goal: g.id })}
                activeOpacity={0.8}
              >
                <View style={[styles.radio, { borderColor: isActive ? theme.accent : theme.border }]}>
                  {isActive && <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.optionLabel, { color: theme.textPrimary }]}>{g.label}</Text>
                  <Text style={[styles.optionDesc, { color: theme.textLabel }]}>{g.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.section, { borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.textLabel }]}>THEME</Text>
          {([
            { id: 'blue',  label: 'Navy Blue',   desc: 'Dark navy with blue accents' },
            { id: 'pink',  label: 'Pink Light',  desc: 'White with rose pink accents' },
            { id: 'dark',  label: 'Nike Dark',   desc: 'Pure dark with white accents' },
            { id: 'clean', label: 'Clean Light', desc: 'Minimal white and grey' },
          ] as const).map((t) => {
            const isActive = profile.theme === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.optionRow, { borderBottomColor: theme.border }]}
                onPress={() => updateProfile(profile.id, { theme: t.id })}
                activeOpacity={0.8}
              >
                <View style={[styles.radio, { borderColor: isActive ? theme.accent : theme.border }]}>
                  {isActive && <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.optionLabel, { color: theme.textPrimary }]}>{t.label}</Text>
                  <Text style={[styles.optionDesc, { color: theme.textLabel }]}>{t.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.section, { borderColor: theme.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textLabel }]}>DAILY MACRO TARGETS</Text>
            <TouchableOpacity onPress={() => {
              setMacroInputs({
                calories: String(settings.macroTargets.calories),
                protein:  String(settings.macroTargets.proteinG),
                carbs:    String(settings.macroTargets.carbsG),
                fat:      String(settings.macroTargets.fatG),
              });
              setEditingMacros(!editingMacros);
            }}>
              <Text style={[styles.editLink, { color: theme.accent }]}>
                {editingMacros ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {editingMacros ? (
            <View style={styles.macroEditGrid}>
              {([
                { field: 'calories', label: 'Calories', unit: 'kcal' },
                { field: 'protein',  label: 'Protein',  unit: 'g' },
                { field: 'carbs',    label: 'Carbs',    unit: 'g' },
                { field: 'fat',      label: 'Fat',      unit: 'g' },
              ] as const).map((m) => (
                <View key={m.field} style={[styles.macroEditField, { borderColor: theme.border, backgroundColor: theme.background }]}>
                  <TextInput
                    style={[styles.macroEditInput, { color: theme.textPrimary }]}
                    value={macroInputs[m.field]}
                    onChangeText={(v) => setMacroInputs((p) => ({ ...p, [m.field]: v }))}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={theme.textLabel}
                  />
                  <Text style={[styles.macroEditLabel, { color: theme.textLabel }]}>{m.label} ({m.unit})</Text>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.macroSaveBtn, { backgroundColor: theme.buttonBackground }]}
                onPress={handleSaveMacros}
              >
                <Text style={[styles.macroSaveBtnText, { color: theme.buttonText }]}>Save targets</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.macroDisplayRow}>
              {[
                { label: 'KCAL',    value: String(settings.macroTargets.calories) },
                { label: 'PROTEIN', value: `${settings.macroTargets.proteinG}g` },
                { label: 'CARBS',   value: `${settings.macroTargets.carbsG}g` },
                { label: 'FAT',     value: `${settings.macroTargets.fatG}g` },
              ].map((m, i) => (
                <View key={i} style={styles.macroDisplayItem}>
                  <Text style={[styles.macroDisplayValue, { color: theme.textPrimary }]}>{m.value}</Text>
                  <Text style={[styles.macroDisplayLabel, { color: theme.textLabel }]}>{m.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={[styles.section, { borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.textLabel }]}>UNITS</Text>
          {[
            { label: 'Weight', value: 'kg' },
            { label: 'Measurements', value: 'cm (inches in brackets)' },
            { label: 'Distance', value: 'km' },
          ].map((u, i) => (
            <View key={i} style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{u.label}</Text>
              <Text style={[styles.infoValue, { color: theme.textLabel }]}>{u.value}</Text>
            </View>
          ))}
        </View>

        {otherProfile && (
          <View style={[styles.section, { borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textLabel }]}>SWITCH PROFILE</Text>
            <TouchableOpacity
              style={[styles.switchProfileBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => { setActiveProfile(otherProfile.id); navigation.goBack(); }}
              activeOpacity={0.8}
            >
              <View style={[styles.switchAvatar, {
                backgroundColor: otherProfile.theme === 'pink' ? '#F4C0D1' : '#1A3358',
                borderColor: otherProfile.theme === 'pink' ? '#D4537E' : '#4A9EFF',
              }]}>
                <Text style={{ fontSize: 12, fontWeight: '500', color: otherProfile.theme === 'pink' ? '#72243E' : '#FFFFFF' }}>
                  {otherProfile.abbreviatedName}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.switchName, { color: theme.textPrimary }]}>{otherProfile.name}</Text>
                <Text style={[styles.switchGoal, { color: theme.textLabel }]}>
                  {otherProfile.goal === 'muscle' ? 'Muscle gain' : otherProfile.goal === 'weight_loss' ? 'Weight loss' : 'General fitness'}
                </Text>
              </View>
              <Text style={[styles.switchArrow, { color: theme.textLabel }]}>→</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 0.5 },
  backBtn: { width: 50 },
  backText: { fontSize: 13 },
  headerTitle: { fontSize: 16, fontWeight: '500', letterSpacing: -0.2 },
  scroll: { padding: 20, paddingBottom: 60, gap: 20 },
  avatarSection: { alignItems: 'center', paddingVertical: 10, gap: 12 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  avatarInitials: { fontSize: 26, fontWeight: '500' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, borderWidth: 0.5 },
  editBadgeText: { fontSize: 9, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
  profileName: { fontSize: 20, fontWeight: '500', letterSpacing: -0.3, textAlign: 'center' },
  profileNameHint: { fontSize: 11, textAlign: 'center', marginTop: 3 },
  nameEditRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  nameInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15, fontWeight: '500', minWidth: 180 },
  nameSaveBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  nameSaveBtnText: { fontSize: 13, fontWeight: '500' },
  section: { borderWidth: 0.5, borderRadius: 12, overflow: 'hidden' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  sectionTitle: { fontSize: 9, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1.2, paddingHorizontal: 16, paddingVertical: 10 },
  editLink: { fontSize: 12, fontWeight: '500', paddingRight: 16 },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  optionLabel: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  optionDesc: { fontSize: 11, lineHeight: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5 },
  infoLabel: { fontSize: 13 },
  infoValue: { fontSize: 12, fontWeight: '500' },
  macroDisplayRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, paddingVertical: 14, paddingTop: 0 },
  macroDisplayItem: { alignItems: 'center' },
  macroDisplayValue: { fontSize: 18, fontWeight: '500', letterSpacing: -0.3 },
  macroDisplayLabel: { fontSize: 8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 3 },
  macroEditGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 14, paddingTop: 0 },
  macroEditField: { width: '47%', borderWidth: 0.5, borderRadius: 8, padding: 10, alignItems: 'center' },
  macroEditInput: { fontSize: 20, fontWeight: '500', textAlign: 'center', width: '100%', marginBottom: 4 },
  macroEditLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 },
  macroSaveBtn: { width: '100%', borderRadius: 8, paddingVertical: 11, alignItems: 'center', marginTop: 4 },
  macroSaveBtnText: { fontSize: 13, fontWeight: '500' },
  switchProfileBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, margin: 12, borderRadius: 10, borderWidth: 0.5, padding: 12 },
  switchAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  switchName: { fontSize: 14, fontWeight: '500', marginBottom: 2 },
  switchGoal: { fontSize: 11 },
  switchArrow: { fontSize: 16 },
});