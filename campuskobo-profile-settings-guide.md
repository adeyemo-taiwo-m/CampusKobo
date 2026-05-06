# CampusKobo — Profile & Settings Implementation Guide

> **Scope:** Everything you need to implement for the Profile & Settings section, including Notification Settings, Security & Privacy, PIN flow, Help & FAQ, Change Password, and Change Email. Based on analysis of your existing codebase.

---

## PART 0 — WHAT YOU ALREADY HAVE (Do Not Rebuild)

The following screens are **fully implemented** in your provided files. Do not recreate them — just make sure they are correctly placed in your file system.

| File | Status |
|---|---|
| `ProfileSettingsScreen.tsx` | ✅ Complete — edit modal, logout, all rows wired |
| `SecurityPrivacyScreen.tsx` | ✅ Complete — all toggles, delete account, PIN nav |
| `NotificationSettingsScreen.tsx` | ✅ Complete — all toggle sections + quiet hours |
| `SetPINScreen.tsx` | ✅ Complete — keypad, progress dots, auto-navigate |
| `ConfirmPINScreen.tsx` | ✅ Complete — shake animation, mismatch error |
| `PINSuccessScreen.tsx` | ✅ Complete — API sync, done button |
| `HelpFAQScreen.tsx` | ✅ Complete — FAQ + Contact tabs, expandable items |
| `ChangePasswordScreen.tsx` | ✅ Complete — strength meter, API call |
| `ChangeEmailScreen.tsx` | ✅ Complete — validation, confirmation alert |

---

## PART 1 — FILE ROUTING SETUP

Your code uses `expo-router` with path strings like `/profile/security`, `/profile/set-pin`, etc. You must ensure your `app/` directory matches these routes **exactly**.

### Step 1.1 — Create the route files

Create each of the following files inside your `app/profile/` directory. Each file imports and default-exports the corresponding screen component.

**`app/profile/index.tsx`**
```typescript
export { ProfileSettingsScreen as default } from '../../src/screens/profile/ProfileSettingsScreen';
```

**`app/profile/security.tsx`**
```typescript
export { SecurityPrivacyScreen as default } from '../../src/screens/profile/SecurityPrivacyScreen';
```

**`app/profile/notifications.tsx`**
```typescript
export { NotificationSettingsScreen as default } from '../../src/screens/profile/NotificationSettingsScreen';
```

**`app/profile/set-pin.tsx`**
```typescript
export { SetPINScreen as default } from '../../src/screens/profile/SetPINScreen';
```

**`app/profile/confirm-pin.tsx`**
```typescript
export { ConfirmPINScreen as default } from '../../src/screens/profile/ConfirmPINScreen';
```

**`app/profile/pin-success.tsx`**
```typescript
export { PINSuccessScreen as default } from '../../src/screens/profile/PINSuccessScreen';
```

**`app/profile/help.tsx`**
```typescript
export { HelpFAQScreen as default } from '../../src/screens/profile/HelpFAQScreen';
```

**`app/profile/change-password.tsx`**
```typescript
export { ChangePasswordScreen as default } from '../../src/screens/profile/ChangePasswordScreen';
```

**`app/profile/change-email.tsx`**
```typescript
export { ChangeEmailScreen as default } from '../../src/screens/profile/ChangeEmailScreen';
```

### Step 1.2 — Verify your folder structure looks like this

```
app/
  profile/
    index.tsx
    security.tsx
    notifications.tsx
    set-pin.tsx
    confirm-pin.tsx
    pin-success.tsx
    help.tsx
    change-password.tsx
    change-email.tsx
src/
  screens/
    profile/
      ProfileSettingsScreen.tsx
      SecurityPrivacyScreen.tsx
      NotificationSettingsScreen.tsx
      SetPINScreen.tsx
      ConfirmPINScreen.tsx
      PINSuccessScreen.tsx
      HelpFAQScreen.tsx
      ChangePasswordScreen.tsx
      ChangeEmailScreen.tsx
```

---

## PART 2 — APP CONTEXT REQUIREMENTS

Your screens import several values and functions from `useAppContext()`. You must make sure every item below is defined and exported from your `AppContext.tsx`.

### Step 2.1 — Required context values

Open `src/context/AppContext.tsx` and confirm the following are present. Add any that are missing.

```typescript
// Values your screens consume from context:

user: User | null                          // ProfileSettingsScreen, ChangeEmailScreen
apiUser: ApiUser | null                    // ProfileSettingsScreen, ChangeEmailScreen
setApiUser: (user: ApiUser) => void        // ProfileSettingsScreen
updateUser: (data: Partial<User>) => Promise<void>   // ProfileSettingsScreen
logout: () => Promise<void>                // ProfileSettingsScreen
isLoading: boolean                         // ProfileSettingsScreen
isBalanceHidden: boolean                   // SecurityPrivacyScreen → wired to Dashboard
toggleBalanceVisibility: () => void        // SecurityPrivacyScreen
```

### Step 2.2 — Add `isBalanceHidden` and `toggleBalanceVisibility` to context

This is the most important missing piece. Your `SecurityPrivacyScreen` calls `toggleBalanceVisibility()` but this needs to be defined in context so the Dashboard can react to it.

Add this to your `AppContext.tsx`:

```typescript
// Inside your context state:
const [isBalanceHidden, setIsBalanceHidden] = useState(false);

// Function to expose:
const toggleBalanceVisibility = () => {
  setIsBalanceHidden(prev => !prev);
};

// Add to context value:
isBalanceHidden,
toggleBalanceVisibility,
```

### Step 2.3 — Define the `ApiUser` type

Your `ProfileSettingsScreen` and `ChangeEmailScreen` reference `apiUser` which has `full_name`, `email`, and `avatar_url` fields. Add this type to `src/types/index.ts`:

```typescript
export type ApiUser = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
};
```

### Step 2.4 — Add `apiUser` state to context

Inside your `AppContext.tsx`, add:

```typescript
const [apiUser, setApiUser] = useState<ApiUser | null>(null);

// Load it when the app starts:
useEffect(() => {
  const loadApiUser = async () => {
    try {
      const user = await userService.getProfile(); // or from your API
      setApiUser(user);
    } catch (e) {
      console.warn('Could not load API user', e);
    }
  };
  loadApiUser();
}, []);

// Expose in context value:
apiUser,
setApiUser,
```

---

## PART 3 — SERVICES LAYER

Your screens import from `authService` and `userService`. You need to create these service files.

### Step 3.1 — Create `src/services/authService.ts`

```typescript
// src/services/authService.ts

const BASE_URL = 'https://your-api-url.com'; // Replace with your actual API URL

export const authService = {

  async changePassword(payload: { old_password: string; new_password: string }) {
    const response = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }
    return response.json();
  },

  async changeEmail(payload: { new_email: string; password: string }) {
    const response = await fetch(`${BASE_URL}/auth/change-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change email');
    }
    return response.json();
  },

  async createPin(payload: { pin: string }) {
    const response = await fetch(`${BASE_URL}/auth/set-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save PIN');
    }
    return response.json();
  },

};
```

> **If you have no backend yet:** Replace each function body with a mock that returns a resolved promise after a short delay, so the UI flow still works:
> ```typescript
> async changePassword(payload) {
>   await new Promise(resolve => setTimeout(resolve, 800));
>   return { success: true };
> }
> ```

### Step 3.2 — Create `src/services/userService.ts`

```typescript
// src/services/userService.ts

const BASE_URL = 'https://your-api-url.com'; // Replace with your actual API URL

export const userService = {

  async getProfile() {
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json(); // Returns ApiUser shape
  },

  async updateProfile(payload: { full_name: string }) {
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }
    return response.json(); // Returns updated ApiUser
  },

};
```

### Step 3.3 — Create the services index file

```typescript
// src/services/index.ts
export { authService } from './authService';
export { userService } from './userService';
```

---

## PART 4 — SHARED COMPONENTS REQUIRED

Your screens use several shared components that must exist. Check each one and create it if missing.

### Step 4.1 — `SuccessModal` component

Your `ChangePasswordScreen` imports `SuccessModal` from `'../../components/SuccessScreen'`. Make sure your `SuccessScreen.tsx` exports **both** a default `SuccessScreen` component **and** a named `SuccessModal` export.

Add this to `src/components/SuccessScreen.tsx`:

```typescript
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY_GREEN, WHITE, TEXT_PRIMARY, TEXT_SECONDARY, Fonts } from '../constants';

type SuccessModalProps = {
  isVisible: boolean;
  title: string;
  subtitle: string;
  onDone: () => void;
};

export const SuccessModal = ({ isVisible, title, subtitle, onDone }: SuccessModalProps) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.circle}>
            <Ionicons name="checkmark" size={48} color={WHITE} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <TouchableOpacity style={styles.button} onPress={onDone}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 12,
    height: 52,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});
```

### Step 4.2 — `OfflineBanner` component

Your `ProfileSettingsScreen` imports `OfflineBanner` from `'../../components/OfflineBanner'`. Create this file if it does not exist:

```typescript
// src/components/OfflineBanner.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    return unsubscribe;
  }, []);

  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>You are offline. Some features may be unavailable.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
```

Then install the dependency:
```bash
npx expo install @react-native-community/netinfo
```

> **If you want to skip NetInfo for now**, simplify `OfflineBanner` to just return `null` — it will still satisfy the import without crashing.

### Step 4.3 — `Button` component with `icon` prop

Your `ChangePasswordScreen` uses `<Button icon={...} />`. Make sure your `Button.tsx` accepts an optional `icon` prop and renders it inside the button when no title is shown:

```typescript
// Add to your existing Button component props:
type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: object;
  icon?: React.ReactNode;   // ← ADD THIS
};

// Inside the button render:
<TouchableOpacity style={...} onPress={onPress} disabled={disabled}>
  {icon ? icon : <Text style={...}>{title}</Text>}
</TouchableOpacity>
```

### Step 4.4 — `InputField` component with extra props

Your screens pass several additional props to `InputField` that your basic component may not support. Add these props if missing:

```typescript
type InputFieldProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;          // ← used in HelpFAQScreen search bar
  error?: string;
  editable?: boolean;                  // ← used in ProfileSettingsScreen email field
  state?: 'default' | 'disabled';     // ← used in ProfileSettingsScreen email field
  multiline?: boolean;                 // ← used in HelpFAQScreen contact form
  numberOfLines?: number;
  textAlignVertical?: 'top' | 'center' | 'bottom' | 'auto';
  containerStyle?: object;
  outerContainerStyle?: object;        // ← wrapper style used across multiple screens
  style?: object;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};
```

---

## PART 5 — APPCONTEXT LOGOUT FUNCTION

Your `ProfileSettingsScreen` calls `logout()` from context and expects it to clear all user data and redirect to onboarding. Make sure this function exists in your context:

```typescript
// In AppContext.tsx

const logout = async () => {
  try {
    // 1. Clear all local storage
    await StorageService.clearAllData();

    // 2. Reset all context state
    setUser(null);
    setApiUser(null);
    setTransactions([]);
    setBudgets([]);
    setSavingsGoals([]);
    setRecurringExpenses([]);

  } catch (error) {
    console.error('Logout error:', error);
    throw error; // Let the screen handle showing an error
  }
};
```

After calling `logout()`, the navigation is handled by your root layout (`app/_layout.tsx`). Make sure your root layout watches the `user` value from context and redirects to onboarding when it becomes `null`:

```typescript
// In app/_layout.tsx
import { useAppContext } from '../src/context/AppContext';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const { user } = useAppContext();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(onboarding)';

    if (!user?.hasCompletedOnboarding && !inAuthGroup) {
      router.replace('/(onboarding)/welcome-1');
    } else if (user?.hasCompletedOnboarding && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, segments]);

  return <Slot />;
}
```

---

## PART 6 — DASHBOARD BALANCE VISIBILITY WIRING

Your `SecurityPrivacyScreen` toggles `isBalanceHidden` in context. You now need to wire this into your `DashboardScreen` so the balance actually hides.

### Step 6.1 — In `DashboardScreen.tsx`, consume `isBalanceHidden` from context

```typescript
// At the top of DashboardScreen, pull from context:
const { transactions, budgets, savingsGoals, isBalanceHidden } = useAppContext();

// Note: isBalanceHidden from context overrides the local eye-icon toggle.
// Decide which behaviour you want:
//
// Option A: Security setting overrides everything (balance always masked if Hide Balance is ON)
// Option B: The eye icon on dashboard is a session-only override
//
// Recommended — Option A:
// Remove the local showBalance state and use isBalanceHidden directly.
```

### Step 6.2 — Update the balance display in DashboardScreen

```typescript
// Replace your balance text with:
<Text style={styles.balanceAmount}>
  {isBalanceHidden ? '₦ ••••••' : formatCurrency(totalBalance)}
</Text>

// If you want to keep the eye icon as an additional session toggle, combine both:
const [sessionHide, setSessionHide] = useState(false);
const shouldHide = isBalanceHidden || sessionHide;

<Text>{shouldHide ? '₦ ••••••' : formatCurrency(totalBalance)}</Text>
<TouchableOpacity onPress={() => setSessionHide(prev => !prev)}>
  <Ionicons name={shouldHide ? 'eye-off-outline' : 'eye-outline'} size={20} color={WHITE} />
</TouchableOpacity>
```

---

## PART 7 — NOTIFICATION SETTINGS PERSISTENCE

Currently your `NotificationSettingsScreen` uses only local `useState` — the toggle values reset every time the user leaves the screen. To make them persist:

### Step 7.1 — Save notification preferences to AsyncStorage

Add these functions to `StorageService.ts`:

```typescript
// In StorageService.ts

export const saveNotificationPreferences = async (prefs: Record<string, boolean>) => {
  try {
    await AsyncStorage.setItem('campuskobo_notification_prefs', JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save notification prefs', e);
  }
};

export const getNotificationPreferences = async (): Promise<Record<string, boolean> | null> => {
  try {
    const data = await AsyncStorage.getItem('campuskobo_notification_prefs');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load notification prefs', e);
    return null;
  }
};
```

### Step 7.2 — Load and save prefs in `NotificationSettingsScreen`

```typescript
// At the top of NotificationSettingsScreen, load saved prefs:

useEffect(() => {
  const loadPrefs = async () => {
    const saved = await StorageService.getNotificationPreferences();
    if (saved) {
      if (saved.allNotifications !== undefined) setAllNotifications(saved.allNotifications);
      if (saved.budgetAlerts !== undefined) setBudgetAlerts(saved.budgetAlerts);
      if (saved.savingsReminders !== undefined) setSavingsReminders(saved.savingsReminders);
      if (saved.billReminders !== undefined) setBillReminders(saved.billReminders);
      if (saved.newContent !== undefined) setNewContent(saved.newContent);
      if (saved.finance101 !== undefined) setFinance101(saved.finance101);
      if (saved.podcastUpdates !== undefined) setPodcastUpdates(saved.podcastUpdates);
      if (saved.appUpdates !== undefined) setAppUpdates(saved.appUpdates);
      if (saved.bofAnnouncements !== undefined) setBofAnnouncements(saved.bofAnnouncements);
      if (saved.doNotDisturb !== undefined) setDoNotDisturb(saved.doNotDisturb);
    }
  };
  loadPrefs();
}, []);

// Create a helper to save all current values whenever any toggle changes:
const savePrefs = async (overrides: Record<string, boolean> = {}) => {
  await StorageService.saveNotificationPreferences({
    allNotifications,
    budgetAlerts,
    savingsReminders,
    billReminders,
    newContent,
    finance101,
    podcastUpdates,
    appUpdates,
    bofAnnouncements,
    doNotDisturb,
    ...overrides,
  });
};

// Wrap each onValueChange to also call savePrefs:
// Example:
<NotificationRow
  ...
  onValueChange={(v) => { setBudgetAlerts(v); savePrefs({ budgetAlerts: v }); }}
/>
```

---

## PART 8 — SECURITY SETTINGS PERSISTENCE

Similarly, the Security screen uses local state only. PIN and biometric toggles should persist.

### Step 8.1 — Save security preferences to AsyncStorage

```typescript
// In StorageService.ts

export const saveSecurityPreferences = async (prefs: Record<string, boolean>) => {
  try {
    await AsyncStorage.setItem('campuskobo_security_prefs', JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save security prefs', e);
  }
};

export const getSecurityPreferences = async (): Promise<Record<string, boolean> | null> => {
  try {
    const data = await AsyncStorage.getItem('campuskobo_security_prefs');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};
```

### Step 8.2 — Load prefs in `SecurityPrivacyScreen`

```typescript
useEffect(() => {
  const loadPrefs = async () => {
    const saved = await StorageService.getSecurityPreferences();
    if (saved) {
      if (saved.appLock !== undefined) setAppLock(saved.appLock);
      if (saved.biometricUnlock !== undefined) setBiometricUnlock(saved.biometricUnlock);
      if (saved.pinLock !== undefined) setPinLock(saved.pinLock);
      if (saved.fingerprintLogin !== undefined) setFingerprintLogin(saved.fingerprintLogin);
      if (saved.faceId !== undefined) setFaceId(saved.faceId);
      if (saved.dataAnalytics !== undefined) setDataAnalytics(saved.dataAnalytics);
    }
  };
  loadPrefs();
}, []);
```

---

## PART 9 — PIN PERSISTENCE IN CONTEXT

Your `PINSuccessScreen` calls `authService.createPin()` but the PIN also needs to be saved locally so the app knows a PIN has been set.

### Step 9.1 — Save PIN to user in context

In `PINSuccessScreen.tsx`, after the API call, also update the user in context:

```typescript
const { updateUser } = useAppContext();

const handleDone = async () => {
  if (pin) {
    try {
      await authService.createPin({ pin });
    } catch (error) {
      console.warn('Failed to sync PIN with server, saved locally:', error);
    }
    // Save PIN locally to user object
    await updateUser({ hasPIN: true, pin });
  }
  router.replace('/profile/security');
};
```

### Step 9.2 — Show PIN status in `SecurityPrivacyScreen`

After a PIN is set, the "Set PIN" row should update its description to reflect this. Pull `user` from context and check `user.hasPIN`:

```typescript
const { user } = useAppContext();

// Then in your Set PIN row:
<SecurityRow
  icon="key-outline"
  title="Set PIN"
  description={user?.hasPIN ? "PIN is set — tap to change" : "Create a 4-digit PIN for app lock"}
  type="arrow"
  onPress={() => router.push('/profile/set-pin')}
/>
```

---

## PART 10 — DELETE ACCOUNT WIRING

Your `SecurityPrivacyScreen` calls `clearAllData()` on delete but the import is commented out. Wire it up properly.

### Step 10.1 — Import and call `clearAllData`

In `SecurityPrivacyScreen.tsx`, update the delete handler:

```typescript
import { StorageService } from '../../storage/StorageService';
import { useAppContext } from '../../context/AppContext';

// Inside the component:
const { logout } = useAppContext();

const handleDeleteAccount = () => {
  Alert.alert(
    'Delete Account',
    'This will permanently delete all your data. This action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await StorageService.clearAllData();
            await logout(); // This clears context state and redirects
          } catch (error) {
            Alert.alert('Error', 'Failed to delete account. Please try again.');
          }
        }
      }
    ]
  );
};
```

---

## PART 11 — NAVIGATION ENTRY POINTS

Profile is accessed from the Dashboard avatar. Make sure this navigation is wired up.

### Step 11.1 — Dashboard avatar navigation

In `DashboardScreen.tsx`, the avatar in the header should navigate to the profile screen:

```typescript
// In your Header usage on DashboardScreen:
<TouchableOpacity onPress={() => router.push('/profile')}>
  <View style={styles.avatarCircle}>
    <Text style={styles.avatarText}>
      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U'}
    </Text>
  </View>
</TouchableOpacity>
```

### Step 11.2 — Header `showProfile` prop

Your `Header` component accepts a `showProfile` prop. Make sure the Header renders the avatar and wires `onPress` to navigate to `/profile` when this prop is true.

```typescript
// In Header.tsx, when showProfile is true:
{showProfile && (
  <TouchableOpacity onPress={onProfile} style={styles.avatarButton}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{userInitials}</Text>
    </View>
  </TouchableOpacity>
)}
```

You'll need to pass `userInitials` into the Header or compute them inside it from context.

---

## PART 12 — CONSTANTS VERIFICATION

Your screens import `Fonts` from `'../../constants'`. Make sure your constants index exports `Fonts` as an object:

```typescript
// In src/constants/typography.ts or a new fonts.ts:
export const Fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  bold: 'Inter_700Bold',
};

// In src/constants/index.ts:
export { Fonts } from './typography';
export * from './colors';
export * from './spacing';
```

Make sure these font names match what you load in `App.tsx` with `useFonts`.

---

## PART 13 — COMPLETE IMPLEMENTATION CHECKLIST

Use this to track your progress. Check each item as you complete it.

### Routing
- [ ] `app/profile/index.tsx` created
- [ ] `app/profile/security.tsx` created
- [ ] `app/profile/notifications.tsx` created
- [ ] `app/profile/set-pin.tsx` created
- [ ] `app/profile/confirm-pin.tsx` created
- [ ] `app/profile/pin-success.tsx` created
- [ ] `app/profile/help.tsx` created
- [ ] `app/profile/change-password.tsx` created
- [ ] `app/profile/change-email.tsx` created

### App Context
- [ ] `user` exposed from context
- [ ] `apiUser` and `setApiUser` added to context
- [ ] `updateUser()` function exists and persists to storage
- [ ] `logout()` function clears storage and resets state
- [ ] `isBalanceHidden` added to context state
- [ ] `toggleBalanceVisibility()` added to context

### Services
- [ ] `src/services/authService.ts` created with `changePassword`, `changeEmail`, `createPin`
- [ ] `src/services/userService.ts` created with `getProfile`, `updateProfile`
- [ ] `src/services/index.ts` created
- [ ] All API calls wrapped in try/catch

### Shared Components
- [ ] `SuccessModal` exported from `SuccessScreen.tsx`
- [ ] `OfflineBanner.tsx` created (or stubbed to return null)
- [ ] `Button.tsx` supports `icon` prop
- [ ] `InputField.tsx` supports `leftIcon`, `editable`, `state`, `multiline`, `outerContainerStyle` props

### Feature Wiring
- [ ] Dashboard balance respects `isBalanceHidden` from context
- [ ] Dashboard avatar taps navigate to `/profile`
- [ ] Notification preferences saved to AsyncStorage and loaded on mount
- [ ] Security preferences saved to AsyncStorage and loaded on mount
- [ ] PIN saved to user context after `PINSuccessScreen`
- [ ] "Set PIN" row in Security shows correct description based on `user.hasPIN`
- [ ] Delete Account calls `clearAllData()` then `logout()`
- [ ] Root layout (`_layout.tsx`) watches `user` and redirects on logout

### Constants
- [ ] `Fonts` object exported from `src/constants/index.ts`
- [ ] Font names in `Fonts` match what is loaded in `App.tsx` via `useFonts`

---

## PART 14 — TESTING EACH SCREEN

After wiring everything, test each screen in this order:

1. **Open Profile** — tap avatar on Dashboard → Profile screen loads with correct name and email
2. **Edit Profile** — tap "Edit Profile" → modal opens → change name → tap Save → name updates everywhere
3. **Notifications** — tap Notifications → toggle Budget Alerts OFF → close screen → return → toggle should still be OFF (persistence check)
4. **Security** — tap Security → toggle Hide Balance ON → go back to Dashboard → balance should show `₦ ••••••`
5. **Set PIN** — tap Set PIN → enter 4 digits → auto-navigates to Confirm PIN → enter same PIN → success screen shows
6. **PIN Mismatch** — tap Set PIN → enter 1234 → on Confirm screen enter 5678 → dots should shake red and reset
7. **Change Password** — tap Change Password → fill all fields → tap Update → success modal appears
8. **Change Email** — tap Change Email → enter new email + password → confirmation alert appears
9. **Help FAQ** — tap Help & FAQ → search "budget" → only budget questions show → tap question → expands
10. **Contact Tab** — switch to Contact Us tab → fill form → tap Send → success alert appears
11. **Logout** — tap Log Out → confirm → redirected to Welcome screen → all data gone
12. **Delete Account** — tap Delete Account → confirm → redirected to Welcome screen → re-open app → onboarding shows

---

*Guide prepared for CampusKobo — BOF OAU*
*Based on codebase analysis — May 2026*
