# CampusKobo — Profile & Settings Backend Integration Guide

### Connecting Profile & Settings Screens to the Live API

---

> **Who this document is for:** Your AI coding agent. This guide walks through every step required to connect all Profile & Settings features to the live CampusKobo backend API. Follow each step in order. Do not skip steps or combine them.
>
> **Base API URL:** `https://campus-kobo-backend-gmiq.vercel.app/api/v1`
> **Relevant endpoint prefix:** `/users/`, `/auth/`, `/notifications/`, `/support/`
> **Prerequisites:** Parts 1–3 of the main Backend Integration Guide must already be complete (apiClient, TokenStorage, authEvents, authService skeleton).

---

## BEFORE YOU START — Read This First

### What This Guide Covers

This guide wires every screen in the Profile & Settings section to the real backend API:

| Feature                    | Screens Affected                                       | API Endpoints                                               |
| -------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| Edit Profile / Avatar      | `ProfileSettingsScreen`                                | `PUT /users/profile`, `POST /users/avatar`                  |
| Change Password            | `ChangePasswordScreen`                                 | `POST /auth/change-password`                                |
| Change Email               | `ChangeEmailScreen`                                    | `POST /auth/change-email`                                   |
| Create / Update PIN        | `SetPINScreen`, `ConfirmPINScreen`, `PINSuccessScreen` | `POST /auth/create-pin`                                     |
| Security & Privacy toggles | `SecurityPrivacyScreen`                                | `PUT /users/security/biometrics`, `PUT /users/privacy`      |
| Notification Settings      | `NotificationSettingsScreen`                           | `GET/PUT /notifications/preferences`                        |
| Help & FAQ / Support       | `HelpFAQScreen`                                        | `GET /support/faqs`, `POST /support/messages`               |
| Logout                     | `ProfileSettingsScreen`                                | `POST /auth/logout`                                         |
| Delete Account             | `SecurityPrivacyScreen`                                | _(local clear only — no backend delete endpoint confirmed)_ |

### Architecture Principle

> **The offline-first rule applies here too.** Every API call must be wrapped so that if it fails, the UI falls back to local state gracefully. Profile features must never crash because of a network error — they may show a toast, but the user must always be able to navigate away.

---

## PART 1 — EXTEND THE SERVICES LAYER

### Step 1 — Extend `authService.ts` with Profile Auth Methods

> "Open `/src/services/authService.ts`. It should already exist from the main integration guide. Add the following functions if they are not already present.
>
> Add these TypeScript interfaces at the top of the file (after the existing interfaces):
>
> ```typescript
> export interface ChangePasswordRequest {
>   old_password: string;
>   new_password: string;
> }
>
> export interface ChangeEmailRequest {
>   new_email: string;
>   password: string;
> }
>
> export interface CreatePinRequest {
>   pin: string;
> }
> ```
>
> Add the following functions to the exported `authService` object (or as standalone exports, whichever pattern is used in your existing file):
>
> **`changePassword(data: ChangePasswordRequest): Promise<any>`**
>
> - POST to `API_ENDPOINTS.CHANGE_PASSWORD` with `data`
> - Does NOT save tokens — this is a settings action, not an auth action
> - Throws on error so the calling screen can catch it
>
> **`changeEmail(data: ChangeEmailRequest): Promise<any>`**
>
> - POST to `API_ENDPOINTS.CHANGE_EMAIL` with `data`
> - Returns the response (which will include a message about verification email being sent)
> - Throws on error
>
> **`createPin(data: CreatePinRequest): Promise<any>`**
>
> - POST to `API_ENDPOINTS.CREATE_PIN` with `data`
> - Returns the response
> - Throws on error
>
> Verify that `API_ENDPOINTS.CHANGE_PASSWORD`, `API_ENDPOINTS.CHANGE_EMAIL`, and `API_ENDPOINTS.CREATE_PIN` are defined in `/src/constants/api.ts`. If any are missing, add them now:
>
> ````typescript
> CHANGE_PASSWORD: '/auth/change-password',
> CHANGE_EMAIL: '/auth/change-email',
> CREATE_PIN: '/auth/create-pin',
> ```"
> ````

---

### Step 2 — Extend `userService.ts` with Full Profile Methods

> "Open `/src/services/userService.ts`. It should already exist from the main integration guide. Extend it with the following.
>
> Add these TypeScript interfaces at the top of the file:
>
> ```typescript
> export interface UpdateProfileRequest {
>   full_name?: string;
> }
>
> export interface BiometricSettingsRequest {
>   biometric_enabled: boolean;
>   face_id_enabled?: boolean;
>   fingerprint_enabled?: boolean;
> }
>
> export interface PrivacySettingsRequest {
>   hide_balance?: boolean;
>   data_analytics?: boolean;
> }
>
> export interface AvatarUploadResponse {
>   avatar_url: string;
> }
> ```
>
> Add these functions if they do not already exist:
>
> **`getMe(): Promise<UserProfileResponse>`**
>
> - GET to `API_ENDPOINTS.GET_ME`
> - Returns the full user profile from the server
>
> **`updateProfile(data: UpdateProfileRequest): Promise<UserProfileResponse>`**
>
> - PUT to `API_ENDPOINTS.UPDATE_PROFILE` with `data`
> - Returns the updated user profile
>
> **`uploadAvatar(imageUri: string): Promise<AvatarUploadResponse>`**
>
> - POST to `API_ENDPOINTS.UPLOAD_AVATAR`
> - Must use `FormData` — NOT `application/json`
> - Create the FormData object like this:
>   ```typescript
>   const formData = new FormData();
>   const filename = imageUri.split("/").pop() ?? "avatar.jpg";
>   const match = /\.(\w+)$/.exec(filename);
>   const type = match ? `image/${match[1]}` : "image/jpeg";
>   formData.append("file", { uri: imageUri, name: filename, type } as any);
>   ```
> - Use `apiClient.post(API_ENDPOINTS.UPLOAD_AVATAR, formData, { headers: { 'Content-Type': 'multipart/form-data' } })`
> - Returns `{ avatar_url: string }`
>
> **`updateBiometricSettings(data: BiometricSettingsRequest): Promise<any>`**
>
> - PUT to `API_ENDPOINTS.UPDATE_BIOMETRICS` with `data`
> - Returns response
>
> **`updatePrivacySettings(data: PrivacySettingsRequest): Promise<any>`**
>
> - PUT to `API_ENDPOINTS.UPDATE_PRIVACY` with `data`
> - Returns response
>
> Verify these constants exist in `/src/constants/api.ts` and add any missing ones:
>
> ````typescript
> GET_ME: '/users/me',
> UPDATE_PROFILE: '/users/profile',
> UPLOAD_AVATAR: '/users/avatar',
> UPDATE_BIOMETRICS: '/users/security/biometrics',
> UPDATE_PRIVACY: '/users/privacy',
> ```"
> ````

---

### Step 3 — Create `notificationService.ts`

> "Create the file `/src/services/notificationService.ts`.
>
> Add this TypeScript interface:
>
> ```typescript
> export interface NotificationPreferences {
>   all_notifications: boolean;
>   budget_alerts: boolean;
>   savings_reminders: boolean;
>   bill_reminders: boolean;
>   new_content: boolean;
>   finance_101: boolean;
>   podcast_updates: boolean;
>   app_updates: boolean;
>   bof_announcements: boolean;
>   do_not_disturb: boolean;
>   quiet_hours_start?: string; // e.g. '22:00'
>   quiet_hours_end?: string; // e.g. '08:00'
> }
> ```
>
> Import `apiClient` from `./apiClient` and `API_ENDPOINTS` from `../constants/api`.
>
> Create and export these functions:
>
> **`getPreferences(): Promise<NotificationPreferences>`**
>
> - GET to `API_ENDPOINTS.NOTIFICATION_PREFERENCES`
> - Returns the user's saved notification preferences from the server
>
> **`updatePreferences(data: Partial<NotificationPreferences>): Promise<NotificationPreferences>`**
>
> - PUT to `API_ENDPOINTS.NOTIFICATION_PREFERENCES` with `data`
> - Returns the updated preferences
>
> Add to `/src/constants/api.ts` if missing:
>
> ````typescript
> NOTIFICATION_PREFERENCES: '/notifications/preferences',
> ```"
> ````

---

### Step 4 — Create `supportService.ts`

> "Create the file `/src/services/supportService.ts`.
>
> Add these TypeScript interfaces:
>
> ```typescript
> export interface FAQ {
>   id: string;
>   question: string;
>   answer: string;
>   category?: string;
> }
>
> export interface SupportMessageRequest {
>   subject: string;
>   message: string;
>   category?: string;
> }
> ```
>
> Import `apiClient` from `./apiClient` and `API_ENDPOINTS` from `../constants/api`.
>
> Create and export:
>
> **`getFAQs(): Promise<FAQ[]>`**
>
> - GET to `API_ENDPOINTS.FAQS`
> - Returns an array of FAQ objects
>
> **`sendSupportMessage(data: SupportMessageRequest): Promise<any>`**
>
> - POST to `API_ENDPOINTS.SUPPORT_MESSAGES` with `data`
> - Returns the response
>
> Add to `/src/constants/api.ts` if missing:
>
> ````typescript
> FAQS: '/support/faqs',
> SUPPORT_MESSAGES: '/support/messages',
> ```"
> ````

---

## PART 2 — UPDATE APP CONTEXT FOR PROFILE STATE

### Step 5 — Add Profile-Specific State to `AppContext.tsx`

> "Open `/src/context/AppContext.tsx`. Add the following new state variables alongside the existing ones:
>
> ```typescript
> import { NotificationPreferences } from "../services/notificationService";
>
> // New state:
> const [notificationPrefs, setNotificationPrefs] =
>   useState<NotificationPreferences | null>(null);
> const [prefsLoading, setPrefsLoading] = useState(false);
> ```
>
> Add a new function **`loadNotificationPrefs()`**:
>
> ```typescript
> const loadNotificationPrefs = async () => {
>   setPrefsLoading(true);
>   try {
>     const prefs = await notificationService.getPreferences();
>     setNotificationPrefs(prefs);
>   } catch (error) {
>     // Server not reachable — load from local AsyncStorage fallback
>     try {
>       const local = await AsyncStorage.getItem(
>         "campuskobo_notification_prefs",
>       );
>       if (local) setNotificationPrefs(JSON.parse(local));
>     } catch {
>       // No local data either — use defaults (handled in the screen)
>     }
>   } finally {
>     setPrefsLoading(false);
>   }
> };
> ```
>
> Add a new function **`saveNotificationPrefs(prefs: Partial<NotificationPreferences>)`**:
>
> ```typescript
> const saveNotificationPrefs = async (
>   prefs: Partial<NotificationPreferences>,
> ) => {
>   // Optimistic update: immediately update local context state
>   const merged = {
>     ...notificationPrefs,
>     ...prefs,
>   } as NotificationPreferences;
>   setNotificationPrefs(merged);
>
>   // Persist locally as cache
>   try {
>     await AsyncStorage.setItem(
>       "campuskobo_notification_prefs",
>       JSON.stringify(merged),
>     );
>   } catch {
>     console.warn("Could not save notification prefs to local storage");
>   }
>
>   // Sync to server in the background — do not block UI or throw
>   try {
>     await notificationService.updatePreferences(prefs);
>   } catch (error) {
>     console.warn("Could not sync notification prefs to server:", error);
>   }
> };
> ```
>
> Call `loadNotificationPrefs()` inside the existing `useEffect` that runs on app start, alongside `loadAllData()` and `checkAuthStatus()`:
>
> ```typescript
> useEffect(() => {
>   loadAllData();
>   checkAuthStatus();
>   loadNotificationPrefs(); // ← add this line
> }, []);
> ```
>
> Add all new state and functions to the context value object:
>
> ````typescript
> notificationPrefs,
> prefsLoading,
> loadNotificationPrefs,
> saveNotificationPrefs,
> ```"
> ````

---

## PART 3 — PROFILE SETTINGS SCREEN

### Step 6 — Update `ProfileSettingsScreen.tsx` — Edit Profile with API

> "Open `/src/screens/profile/ProfileSettingsScreen.tsx`.
>
> Add these imports at the top:
>
> ```typescript
> import { userService } from "../../services/userService";
> import * as ImagePicker from "expo-image-picker";
> ```
>
> Add these state variables inside the component:
>
> ```typescript
> const [isSaving, setIsSaving] = useState(false);
> const [saveError, setSaveError] = useState<string | null>(null);
> const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
> ```
>
> **Replace the existing `handleSaveProfile` function** (or create it if it does not exist) with this version:
>
> ```typescript
> const handleSaveProfile = async (newName: string) => {
>   setSaveError(null);
>   setIsSaving(true);
>   try {
>     const updated = await userService.updateProfile({ full_name: newName });
>     // Update API user in context
>     setApiUser(updated);
>     // Also update local user name for consistency
>     await updateUser({ name: updated.full_name });
>     // Close the edit modal
>     setEditModalVisible(false);
>   } catch (error: any) {
>     setSaveError(
>       error.message || "Failed to update profile. Please try again.",
>     );
>   } finally {
>     setIsSaving(false);
>   }
> };
> ```
>
> **Add a new `handleAvatarUpload` function:**
>
> ```typescript
> const handleAvatarUpload = async () => {
>   // Request permission
>   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
>   if (status !== "granted") {
>     Alert.alert(
>       "Permission needed",
>       "Please allow access to your photo library to upload an avatar.",
>     );
>     return;
>   }
>
>   const result = await ImagePicker.launchImageLibraryAsync({
>     mediaTypes: ImagePicker.MediaTypeOptions.Images,
>     allowsEditing: true,
>     aspect: [1, 1],
>     quality: 0.8,
>   });
>
>   if (result.canceled) return;
>
>   const imageUri = result.assets[0].uri;
>   setIsUploadingAvatar(true);
>   try {
>     const { avatar_url } = await userService.uploadAvatar(imageUri);
>     setApiUser((prev) => (prev ? { ...prev, avatar_url } : prev));
>   } catch (error: any) {
>     Alert.alert(
>       "Upload failed",
>       error.message || "Could not upload avatar. Please try again.",
>     );
>   } finally {
>     setIsUploadingAvatar(false);
>   }
> };
> ```
>
> **Update the profile avatar display in the JSX:**
>
> - If `apiUser?.avatar_url` exists, show it inside an `<Image>` component with `source={{ uri: apiUser.avatar_url }}`
> - If `isUploadingAvatar` is true, show an `ActivityIndicator` (PRIMARY_GREEN) overlaid on the avatar circle
> - The avatar circle or image should have an `onPress={handleAvatarUpload}` camera icon overlay (small camera icon in bottom-right corner of the avatar)
>
> **Update the edit modal save button:**
>
> - When `isSaving` is true: show `ActivityIndicator` (white, size 'small') instead of the 'Save' text label
> - Disable the button while `isSaving` is true
>
> **Add error display inside the edit modal:**
>
> - Below the name input field, if `saveError` is not null, show a red text label with the error message
> - Clear `saveError` whenever the modal is opened
>
> **Update the Logout button handler:**
>
> - Replace any direct local-clear logout logic with a call to `logoutFromApi()` from AppContext
> - Wrap in try/catch — show `Alert.alert('Error', 'Failed to log out. Please try again.')` on failure
> - While logging out, show an ActivityIndicator in the logout button (add `isLoggingOut` state)
>
> Install `expo-image-picker` if not already installed:
>
> ````bash
> npx expo install expo-image-picker
> ```"
> ````

---

## PART 4 — CHANGE PASSWORD SCREEN

### Step 7 — Update `ChangePasswordScreen.tsx`

> "Open `/src/screens/profile/ChangePasswordScreen.tsx`.
>
> Add these imports:
>
> ```typescript
> import { authService } from "../../services/authService";
> ```
>
> Ensure these state variables exist:
>
> ```typescript
> const [oldPassword, setOldPassword] = useState("");
> const [newPassword, setNewPassword] = useState("");
> const [confirmPassword, setConfirmPassword] = useState("");
> const [isLoading, setIsLoading] = useState(false);
> const [apiError, setApiError] = useState<string | null>(null);
> const [showSuccess, setShowSuccess] = useState(false);
>
> // Password visibility toggles
> const [showOld, setShowOld] = useState(false);
> const [showNew, setShowNew] = useState(false);
> const [showConfirm, setShowConfirm] = useState(false);
> ```
>
> **Replace the existing `handleSubmit` function** with this version:
>
> ```typescript
> const handleSubmit = async () => {
>   setApiError(null);
>
>   // Local validation first
>   if (!oldPassword || !newPassword || !confirmPassword) {
>     setApiError("Please fill in all fields.");
>     return;
>   }
>   if (newPassword.length < 6) {
>     setApiError("New password must be at least 6 characters.");
>     return;
>   }
>   if (newPassword !== confirmPassword) {
>     setApiError("New passwords do not match.");
>     return;
>   }
>
>   setIsLoading(true);
>   try {
>     await authService.changePassword({
>       old_password: oldPassword,
>       new_password: newPassword,
>     });
>     setShowSuccess(true);
>   } catch (error: any) {
>     setApiError(
>       error.message || "Failed to update password. Please try again.",
>     );
>   } finally {
>     setIsLoading(false);
>   }
> };
> ```
>
> **Add a `SuccessModal` at the bottom of the JSX** (outside the scroll view, inside the root container):
>
> ```tsx
> <SuccessModal
>   isVisible={showSuccess}
>   title="Password Updated!"
>   subtitle="Your password has been changed successfully. Use your new password next time you log in."
>   onDone={() => {
>     setShowSuccess(false);
>     navigation.goBack();
>   }}
> />
> ```
>
> **Add an error card in the JSX** above the Submit button:
>
> ```tsx
> {
>   apiError && (
>     <View style={styles.errorCard}>
>       <Ionicons name="alert-circle-outline" size={18} color="#fff" />
>       <Text style={styles.errorText}>{apiError}</Text>
>     </View>
>   );
> }
> ```
>
> Add these styles:
>
> ```typescript
> errorCard: {
>   backgroundColor: '#EF4444',
>   borderRadius: 10,
>   flexDirection: 'row',
>   alignItems: 'center',
>   gap: 8,
>   padding: 12,
>   marginBottom: 16,
> },
> errorText: {
>   color: '#fff',
>   fontSize: 14,
>   fontFamily: Fonts.regular,
>   flex: 1,
> },
> ```
>
> **Update the Submit button:**
>
> - Show `ActivityIndicator` (white, small) instead of button text when `isLoading` is true
> - Disable when `isLoading` is true OR any field is empty"

---

## PART 5 — CHANGE EMAIL SCREEN

### Step 8 — Update `ChangeEmailScreen.tsx`

> "Open `/src/screens/profile/ChangeEmailScreen.tsx`.
>
> Add this import:
>
> ```typescript
> import { authService } from "../../services/authService";
> ```
>
> Ensure these state variables exist:
>
> ```typescript
> const [newEmail, setNewEmail] = useState("");
> const [password, setPassword] = useState("");
> const [isLoading, setIsLoading] = useState(false);
> const [apiError, setApiError] = useState<string | null>(null);
> const [successMessage, setSuccessMessage] = useState<string | null>(null);
> ```
>
> **Replace the existing `handleSubmit` function:**
>
> ```typescript
> const handleSubmit = async () => {
>   setApiError(null);
>   setSuccessMessage(null);
>
>   // Local validation
>   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
>   if (!newEmail || !emailRegex.test(newEmail)) {
>     setApiError("Please enter a valid email address.");
>     return;
>   }
>   if (!password) {
>     setApiError("Please enter your current password to confirm.");
>     return;
>   }
>
>   setIsLoading(true);
>   try {
>     await authService.changeEmail({ new_email: newEmail, password });
>     setSuccessMessage(
>       `A verification email has been sent to ${newEmail}. Please verify it to complete the change.`,
>     );
>     // Update the local apiUser email optimistically
>     setApiUser((prev) => (prev ? { ...prev, email: newEmail } : prev));
>   } catch (error: any) {
>     setApiError(error.message || "Failed to update email. Please try again.");
>   } finally {
>     setIsLoading(false);
>   }
> };
> ```
>
> **Add a success banner in the JSX** (shown above the button when `successMessage` is not null):
>
> ```tsx
> {
>   successMessage && (
>     <View style={styles.successCard}>
>       <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
>       <Text style={styles.successText}>{successMessage}</Text>
>     </View>
>   );
> }
> ```
>
> Add styles (mirror the `errorCard` style but with green background `#10B981`).
>
> **Add the same error card as `ChangePasswordScreen`** above the button.
>
> **Update the Submit button** to show `ActivityIndicator` while loading and to be disabled when loading."

---

## PART 6 — PIN SCREENS

### Step 9 — Update `PINSuccessScreen.tsx` — Sync PIN to API

> "Open `/src/screens/profile/PINSuccessScreen.tsx`.
>
> Add this import:
>
> ```typescript
> import { authService } from "../../services/authService";
> ```
>
> The PIN value must be passed through navigation params. Confirm that `ConfirmPINScreen.tsx` navigates to `PINSuccessScreen` with the confirmed PIN:
>
> ```typescript
> // In ConfirmPINScreen.tsx — when PINs match:
> navigation.navigate("PINSuccess", { pin: enteredPin });
> // OR for expo-router:
> router.push({
>   pathname: "/profile/pin-success",
>   params: { pin: enteredPin },
> });
> ```
>
> In `PINSuccessScreen.tsx`, read the PIN from params:
>
> ```typescript
> // For React Navigation:
> const { pin } = route.params as { pin: string };
> // For expo-router:
> const { pin } = useLocalSearchParams<{ pin: string }>();
> ```
>
> **Update the `handleDone` function:**
>
> ```typescript
> const handleDone = async () => {
>   // 1. Save PIN to local user context (keep existing behaviour)
>   await updateUser({ hasPIN: true, pin });
>
>   // 2. Sync to server in the background — do NOT block navigation on failure
>   try {
>     await authService.createPin({ pin });
>   } catch (error) {
>     // Log silently — PIN is saved locally, app lock still works
>     console.warn("PIN sync to server failed:", error);
>   }
>
>   // 3. Navigate back to security settings
>   // For React Navigation:
>   navigation.navigate("SecurityPrivacy");
>   // For expo-router:
>   router.replace("/profile/security");
> };
> ```
>
> No visual changes are needed for this screen. The API sync is a background operation."

---

## PART 7 — SECURITY & PRIVACY SCREEN

### Step 10 — Update `SecurityPrivacyScreen.tsx` — Sync Toggles to API

> "Open `/src/screens/profile/SecurityPrivacyScreen.tsx`.
>
> Add this import:
>
> ```typescript
> import { userService } from "../../services/userService";
> ```
>
> The screen currently uses local `useState` for all toggle values. Keep those — they control the UI. Add API sync calls alongside them.
>
> **Create a helper function `syncSecurityToServer`:**
>
> ```typescript
> const syncSecurityToServer = async (updates: {
>   biometric_enabled?: boolean;
>   face_id_enabled?: boolean;
>   fingerprint_enabled?: boolean;
> }) => {
>   try {
>     await userService.updateBiometricSettings(updates);
>   } catch (error) {
>     console.warn("Could not sync biometric settings to server:", error);
>     // Do not show an error to the user — local state is the source of truth for security toggles
>   }
> };
> ```
>
> **Create a helper function `syncPrivacyToServer`:**
>
> ```typescript
> const syncPrivacyToServer = async (updates: {
>   hide_balance?: boolean;
>   data_analytics?: boolean;
> }) => {
>   try {
>     await userService.updatePrivacySettings(updates);
>   } catch (error) {
>     console.warn("Could not sync privacy settings to server:", error);
>   }
> };
> ```
>
> **Update each toggle's `onValueChange` handler to also call the appropriate sync function:**
>
> ```typescript
> // App Lock toggle:
> onValueChange={(v) => {
>   setAppLock(v);
>   saveSecurityPrefs({ appLock: v }); // existing local save
>   syncSecurityToServer({ biometric_enabled: v });
> }}
>
> // Biometric Unlock toggle:
> onValueChange={(v) => {
>   setBiometricUnlock(v);
>   saveSecurityPrefs({ biometricUnlock: v });
>   syncSecurityToServer({ biometric_enabled: v });
> }}
>
> // Fingerprint Login toggle:
> onValueChange={(v) => {
>   setFingerprintLogin(v);
>   saveSecurityPrefs({ fingerprintLogin: v });
>   syncSecurityToServer({ fingerprint_enabled: v });
> }}
>
> // Face ID toggle:
> onValueChange={(v) => {
>   setFaceId(v);
>   saveSecurityPrefs({ faceId: v });
>   syncSecurityToServer({ face_id_enabled: v });
> }}
>
> // Hide Balance toggle (also updates context for Dashboard):
> onValueChange={(v) => {
>   setIsBalanceHiddenLocal(v);
>   saveSecurityPrefs({ hideBalance: v });
>   toggleBalanceVisibility(); // updates AppContext for Dashboard
>   syncPrivacyToServer({ hide_balance: v });
> }}
>
> // Data Analytics toggle:
> onValueChange={(v) => {
>   setDataAnalytics(v);
>   saveSecurityPrefs({ dataAnalytics: v });
>   syncPrivacyToServer({ data_analytics: v });
> }}
> ```
>
> All sync calls are fire-and-forget. The local toggle is the source of truth for UX."

---

## PART 8 — NOTIFICATION SETTINGS SCREEN

### Step 11 — Update `NotificationSettingsScreen.tsx` — Load and Sync Preferences

> "Open `/src/screens/notification/NotificationSettingsScreen.tsx` (or `/src/screens/profile/NotificationSettingsScreen.tsx` — use whichever path is correct for your project).
>
> Add this import:
>
> ```typescript
> import { useAppContext } from "../../context/AppContext";
> ```
>
> Pull `notificationPrefs` and `saveNotificationPrefs` from context:
>
> ```typescript
> const { notificationPrefs, saveNotificationPrefs } = useAppContext();
> ```
>
> **Replace the local `useState` initializers with context-aware ones:**
>
> Instead of initializing all toggles as `useState(true)` or `useState(false)`, initialize them from `notificationPrefs` if it exists:
>
> ```typescript
> const [allNotifications, setAllNotifications] = useState(
>   notificationPrefs?.all_notifications ?? true,
> );
> const [budgetAlerts, setBudgetAlerts] = useState(
>   notificationPrefs?.budget_alerts ?? true,
> );
> const [savingsReminders, setSavingsReminders] = useState(
>   notificationPrefs?.savings_reminders ?? true,
> );
> const [billReminders, setBillReminders] = useState(
>   notificationPrefs?.bill_reminders ?? true,
> );
> const [newContent, setNewContent] = useState(
>   notificationPrefs?.new_content ?? true,
> );
> const [finance101, setFinance101] = useState(
>   notificationPrefs?.finance_101 ?? true,
> );
> const [podcastUpdates, setPodcastUpdates] = useState(
>   notificationPrefs?.podcast_updates ?? false,
> );
> const [appUpdates, setAppUpdates] = useState(
>   notificationPrefs?.app_updates ?? true,
> );
> const [bofAnnouncements, setBofAnnouncements] = useState(
>   notificationPrefs?.bof_announcements ?? true,
> );
> const [doNotDisturb, setDoNotDisturb] = useState(
>   notificationPrefs?.do_not_disturb ?? false,
> );
> ```
>
> **Add a `useEffect` to sync from context when `notificationPrefs` loads:**
>
> ```typescript
> useEffect(() => {
>   if (notificationPrefs) {
>     setAllNotifications(notificationPrefs.all_notifications ?? true);
>     setBudgetAlerts(notificationPrefs.budget_alerts ?? true);
>     setSavingsReminders(notificationPrefs.savings_reminders ?? true);
>     setBillReminders(notificationPrefs.bill_reminders ?? true);
>     setNewContent(notificationPrefs.new_content ?? true);
>     setFinance101(notificationPrefs.finance_101 ?? true);
>     setPodcastUpdates(notificationPrefs.podcast_updates ?? false);
>     setAppUpdates(notificationPrefs.app_updates ?? true);
>     setBofAnnouncements(notificationPrefs.bof_announcements ?? true);
>     setDoNotDisturb(notificationPrefs.do_not_disturb ?? false);
>   }
> }, [notificationPrefs]);
> ```
>
> **Update each toggle's `onValueChange` to call `saveNotificationPrefs` from context:**
>
> ```typescript
> // Budget Alerts toggle example:
> onValueChange={(v) => {
>   setBudgetAlerts(v);
>   saveNotificationPrefs({ budget_alerts: v });
> }}
>
> // All Notifications master toggle example:
> onValueChange={(v) => {
>   setAllNotifications(v);
>   // When turning off all notifications, turn off all sub-toggles too
>   if (!v) {
>     setBudgetAlerts(false);
>     setSavingsReminders(false);
>     setBillReminders(false);
>     setNewContent(false);
>     setFinance101(false);
>     setPodcastUpdates(false);
>     setAppUpdates(false);
>     setBofAnnouncements(false);
>     saveNotificationPrefs({
>       all_notifications: false,
>       budget_alerts: false,
>       savings_reminders: false,
>       bill_reminders: false,
>       new_content: false,
>       finance_101: false,
>       podcast_updates: false,
>       app_updates: false,
>       bof_announcements: false,
>     });
>   } else {
>     saveNotificationPrefs({ all_notifications: true });
>   }
> }}
>
> // Do Not Disturb toggle:
> onValueChange={(v) => {
>   setDoNotDisturb(v);
>   saveNotificationPrefs({ do_not_disturb: v });
> }}
> ```
>
> Apply the same pattern to every remaining toggle (Savings Reminders, Bill Reminders, New Content, Finance 101, Podcast Updates, App Updates, BOF Announcements).
>
> The `saveNotificationPrefs` function in AppContext handles both the optimistic local update and the background server sync — the screen does not need any additional loading states."

---

## PART 9 — HELP & FAQ SCREEN

### Step 12 — Update `HelpFAQScreen.tsx` — Load FAQs from API

> "Open `/src/screens/profile/HelpFAQScreen.tsx`.
>
> Add these imports:
>
> ```typescript
> import { supportService, FAQ } from "../../services/supportService";
> ```
>
> Add state variables:
>
> ```typescript
> const [faqs, setFaqs] = useState<FAQ[]>([]);
> const [faqsLoading, setFaqsLoading] = useState(true);
> const [faqsError, setFaqsError] = useState<string | null>(null);
>
> // Support message form state
> const [subject, setSubject] = useState("");
> const [message, setMessage] = useState("");
> const [isSendingMessage, setIsSendingMessage] = useState(false);
> const [messageError, setMessageError] = useState<string | null>(null);
> const [messageSent, setMessageSent] = useState(false);
> ```
>
> **Add a `useEffect` to load FAQs when the screen mounts:**
>
> ```typescript
> useEffect(() => {
>   const loadFaqs = async () => {
>     setFaqsLoading(true);
>     setFaqsError(null);
>     try {
>       const data = await supportService.getFAQs();
>       setFaqs(data);
>     } catch (error: any) {
>       setFaqsError("Could not load FAQs. Showing cached content.");
>       // If API fails, the static FAQ list already rendered in JSX serves as fallback
>       // No need to clear faqs — if it was empty, the static list is fine
>     } finally {
>       setFaqsLoading(false);
>     }
>   };
>   loadFaqs();
> }, []);
> ```
>
> **Update the FAQ list rendering:**
>
> - If `faqsLoading` is true AND `faqs` is empty: show a loading skeleton (3 gray rounded rectangles stacked, animated with `Animated.loop` opacity pulse)
> - If `faqs.length > 0`: render the API data (map over `faqs` array instead of the static hardcoded array)
> - If `faqs.length === 0` AND NOT loading: render the existing static FAQ items as a fallback (do not delete the static data)
> - If `faqsError` is not null: show a small yellow info banner at the top of the FAQ tab: 'Could not load latest FAQs. Showing saved content.'
>
> The search filter should work the same way regardless of data source — it filters `faqs` (API data) OR the static fallback array depending on which is populated.
>
> **Add a `handleSendMessage` function for the Contact Us tab:**
>
> ```typescript
> const handleSendMessage = async () => {
>   setMessageError(null);
>
>   if (!subject.trim() || !message.trim()) {
>     setMessageError("Please fill in both the subject and message fields.");
>     return;
>   }
>
>   setIsSendingMessage(true);
>   try {
>     await supportService.sendSupportMessage({ subject, message });
>     setMessageSent(true);
>     setSubject("");
>     setMessage("");
>   } catch (error: any) {
>     setMessageError(
>       error.message || "Failed to send message. Please try again.",
>     );
>   } finally {
>     setIsSendingMessage(false);
>   }
> };
> ```
>
> **Update the 'Send Message' button in the Contact Us tab:**
>
> - Show `ActivityIndicator` while `isSendingMessage` is true
> - Disable while sending or when subject/message are empty
>
> **Replace the existing success `Alert.alert` with an inline success state:**
>
> When `messageSent` is true, show a green success card above the form:
>
> ```tsx
> {
>   messageSent && (
>     <View style={styles.successCard}>
>       <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
>       <Text style={styles.successText}>
>         Message sent! Our team will get back to you within 24 hours.
>       </Text>
>     </View>
>   );
> }
> ```
>
> Add an error card above the Send button that shows `messageError` in red if not null."

---

## PART 10 — ERROR HANDLING AUDIT (PROFILE-SPECIFIC)

### Step 13 — Audit All Profile API Calls

> "Perform a targeted audit of all profile-related screens and service calls. Check every item in this list and fix any issues found:
>
> **1. Service functions do NOT have internal try/catch**
>
> Open each of these files and verify that none of the exported functions contain try/catch blocks inside them:
>
> - `authService.ts` → `changePassword`, `changeEmail`, `createPin`
> - `userService.ts` → `updateProfile`, `uploadAvatar`, `updateBiometricSettings`, `updatePrivacySettings`
> - `notificationService.ts` → `getPreferences`, `updatePreferences`
> - `supportService.ts` → `getFAQs`, `sendSupportMessage`
>
> Each service function should either return the `apiClient` response directly or throw. No internal error handling.
>
> **2. Every screen that calls a service uses this pattern:**
>
> ```typescript
> setIsLoading(true);
> setApiError(null);
> try {
>   const result = await someService.someMethod(data);
>   // handle success
> } catch (error: any) {
>   setApiError(error.message || "Something went wrong.");
> } finally {
>   setIsLoading(false);
> }
> ```
>
> Verify this pattern in: `ProfileSettingsScreen`, `ChangePasswordScreen`, `ChangeEmailScreen`, `HelpFAQScreen`.
>
> **3. Background sync calls (SecurityPrivacyScreen, NotificationSettingsScreen, PINSuccessScreen) are wrapped in their OWN try/catch**
>
> These screens call sync functions that must never crash the screen. Each sync helper (`syncSecurityToServer`, `syncPrivacyToServer`, `saveNotificationPrefs`) must silently swallow errors and log a console warning only.
>
> **4. Avatar upload handles large files gracefully**
>
> In `ProfileSettingsScreen.handleAvatarUpload`, add a file size check before uploading:
>
> ```typescript
> // After getting the image URI:
> const fileInfo = await FileSystem.getInfoAsync(imageUri);
> if (fileInfo.exists && fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
>   Alert.alert("File too large", "Please choose an image under 5MB.");
>   return;
> }
> ```
>
> Install expo-file-system if not already present: `npx expo install expo-file-system`
> Import it: `import * as FileSystem from 'expo-file-system'`
>
> **5. Offline state handled in all profile screens**
>
> Confirm that the `OfflineBanner` component is imported and placed at the top of `ProfileSettingsScreen`. Other profile screens do not need it — they are nested and the user would need internet to navigate to them anyway.
>
> **6. 401 errors auto-redirect to login**
>
> The `apiClient` interceptor handles this globally. Do NOT add manual 401 handling in any profile screen. Verify no profile screen has a `catch` block that checks `error.status === 401` or `error.response?.status === 401` — remove any such checks."

---

## PART 11 — TESTING PROFILE FEATURES

### Step 14 — Test All Profile Features End to End

> "After completing all previous steps, perform the following manual tests on Expo Go. Fix any issues found before marking the integration complete.
>
> **Test 1: Edit Profile Name**
>
> 1. Open Profile screen — confirm name and email shown match `apiUser` from context
> 2. Tap 'Edit Profile'
> 3. Change name to something new — tap 'Save'
> 4. Expected: name updates in the profile card immediately (optimistic)
> 5. Navigate away and return — Expected: new name still shown (persisted to API and local)
>
> **Test 2: Avatar Upload**
>
> 1. Tap the avatar circle on Profile screen
> 2. Select a photo from library
> 3. Expected: uploading spinner shown briefly, then avatar updates to new photo
> 4. Restart the app — Expected: avatar still shown (loaded from `apiUser.avatar_url`)
>
> **Test 3: Change Password**
>
> 1. Navigate to Security → Change Password
> 2. Enter wrong current password — tap Update
> 3. Expected: red error card with message from API ('incorrect password' or equivalent)
> 4. Enter correct current password + matching new passwords — tap Update
> 5. Expected: SuccessModal appears with 'Password Updated!' — tap Done — navigates back
>
> **Test 4: Change Email**
>
> 1. Navigate to Security → Change Email
> 2. Enter invalid email format — tap Update
> 3. Expected: inline validation error ('valid email address')
> 4. Enter valid new email + correct password — tap Update
> 5. Expected: green success banner appears with verification email message
>
> **Test 5: Set PIN**
>
> 1. Navigate to Security → Set PIN
> 2. Enter a 4-digit PIN — auto-navigates to Confirm PIN
> 3. Enter different digits — Expected: shake animation + mismatch error, inputs cleared
> 4. Re-enter the same PIN — Expected: PINSuccessScreen shown
> 5. Tap Done — Expected: navigates to Security screen, 'Set PIN' row description says 'PIN is set'
>
> **Test 6: Notification Settings Persistence**
>
> 1. Open Notification Settings — note current toggle states
> 2. Toggle 'Budget Alerts' OFF
> 3. Navigate away (back to Profile, then to Dashboard)
> 4. Return to Notification Settings
> 5. Expected: 'Budget Alerts' is still OFF (persisted via context and AsyncStorage)
> 6. Kill and reopen the app — navigate back to Notification Settings
> 7. Expected: 'Budget Alerts' still OFF (loaded from context which loaded from server/local cache)
>
> **Test 7: Security Toggles + Dashboard Balance**
>
> 1. Open Security & Privacy — toggle 'Hide Balance' ON
> 2. Navigate to Dashboard
> 3. Expected: balance shows as '₦ ••••••'
> 4. Return to Security — toggle 'Hide Balance' OFF
> 5. Navigate to Dashboard — Expected: balance amount visible again
>
> **Test 8: Help FAQs from API**
>
> 1. Open Help & FAQ
> 2. Expected: FAQ items load from API (brief loading skeleton may flash)
> 3. Turn off internet — open Help & FAQ again
> 4. Expected: FAQs still shown (cached or static fallback), yellow banner 'Could not load latest FAQs'
>
> **Test 9: Send Support Message**
>
> 1. Open Help & FAQ → Contact Us tab
> 2. Fill in subject and message — tap Send
> 3. Expected: loading spinner on button, then green success card appears, form clears
> 4. Send empty form — Expected: error card shown, button does nothing
>
> **Test 10: Logout**
>
> 1. Tap Log Out on Profile screen — confirm in alert
> 2. Expected: redirected to Welcome/Login screen
> 3. Reopen app — Expected: login screen shown (no auto-login)
>
> Document all failures and fix before shipping."

---

## QUICK REFERENCE — File Changes Summary

| File                                                  | Action     | Purpose                                                                                          |
| ----------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `/src/services/authService.ts`                        | **Update** | Add `changePassword`, `changeEmail`, `createPin`                                                 |
| `/src/services/userService.ts`                        | **Update** | Add `getMe`, `updateProfile`, `uploadAvatar`, `updateBiometricSettings`, `updatePrivacySettings` |
| `/src/services/notificationService.ts`                | **Create** | All `/notifications/preferences` calls                                                           |
| `/src/services/supportService.ts`                     | **Create** | FAQ fetch + support message send                                                                 |
| `/src/context/AppContext.tsx`                         | **Update** | Add `notificationPrefs`, `saveNotificationPrefs`, `loadNotificationPrefs`                        |
| `/src/screens/profile/ProfileSettingsScreen.tsx`      | **Update** | API edit profile, avatar upload, API logout                                                      |
| `/src/screens/profile/ChangePasswordScreen.tsx`       | **Update** | API change password + SuccessModal                                                               |
| `/src/screens/profile/ChangeEmailScreen.tsx`          | **Update** | API change email + success banner                                                                |
| `/src/screens/profile/PINSuccessScreen.tsx`           | **Update** | Background PIN API sync                                                                          |
| `/src/screens/profile/SecurityPrivacyScreen.tsx`      | **Update** | Background security/privacy sync to API                                                          |
| `/src/screens/profile/NotificationSettingsScreen.tsx` | **Update** | Load + sync prefs from/to API via context                                                        |
| `/src/screens/profile/HelpFAQScreen.tsx`              | **Update** | Load FAQs from API, send support messages                                                        |

---

## IMPORTANT RULES FOR THE CODING AGENT

1. **One step at a time.** Complete each numbered step fully and verify the app still compiles before moving on.

2. **Service functions must NOT contain try/catch.** Error handling belongs in the calling screen only, except for background sync helpers (security/notification toggles) which swallow errors silently.

3. **Optimistic updates for toggles.** Security and notification toggles must update the UI instantly. The API call is a background sync and must never block the toggle from changing visually.

4. **Avatar upload uses FormData, not JSON.** The `Content-Type` header for the avatar upload request must be `multipart/form-data`, not `application/json`. This must be set per-request, not on the global apiClient.

5. **Never remove static FAQ fallback data.** The `HelpFAQScreen` must always have static FAQ content as a fallback for when the API is unreachable. Do not delete the hardcoded FAQ array.

6. **PIN is stored locally first.** The `PINSuccessScreen` must update the local user context before attempting the API call. If the API call fails, the app still works with the local PIN.

7. **Logout must clear everything.** `logoutFromApi()` must clear tokens (via `clearTokens()`), reset `apiUser` to null, reset `isAuthenticated` to false, and reset all local context state. The navigator handles the redirect automatically.

8. **`notificationPrefs` context field is the single source of truth.** The `NotificationSettingsScreen` reads initial values from context and writes back through context. It never calls `notificationService` directly.

---

_Document prepared for: CampusKobo Mobile App — BOF OAU_
_Profile & Settings Integration Guide — Version 1.1 | May 2026_
_Backend: https://campus-kobo-backend-gmiq.vercel.app_
