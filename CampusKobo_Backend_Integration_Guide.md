# CampusKobo — Backend Integration Guide

### Connecting the React Native Frontend to the CampusKobo API

---

> **Who this document is for:** Your AI coding agent. This guide walks through every single step required to connect the already-built CampusKobo React Native (Expo) frontend to the live backend API at `https://campus-kobo-backend-gmiq.vercel.app`. Follow each step in order, one at a time. Do not skip steps or combine them.

> **Base API URL:** `https://campus-kobo-backend-gmiq.vercel.app/api/v1`
> **API Docs:** `https://campus-kobo-backend-gmiq.vercel.app/docs`
> **Active Endpoints:** Auth + Onboarding (confirmed live). All other endpoints exist but may require backend activation.

---

## BEFORE YOU START — Read This First

### What This Guide Does

The frontend was built as a fully **offline-first** app using AsyncStorage and a local AppContext. This guide transforms it into a **backend-connected** app that:

1. Authenticates users against the real API
2. Stores JWT tokens securely on the device
3. Syncs onboarding progress with the server
4. Falls back gracefully if the network is unavailable
5. Keeps the existing local storage as a cache layer

### What Will Change vs. What Stays the Same

**What changes:**

- Auth (register, login, logout, token refresh) → now hits the real API
- Onboarding (goal, budget, categories) → now hits the real API
- User profile data → loaded from the API, not just local storage

**What stays the same (for now — future phases):**

- Transactions, budgets, savings → still local (API endpoints exist but are secondary priority)
- Learning content → still local static data
- All UI components, navigation, and styling → completely unchanged

### Key Architecture Principle

> **Never break the existing offline experience.** Every API call must be wrapped so that if it fails (no internet, server error), the app falls back to local storage and continues working. The user should never see a crash — only a toast notification saying "Using offline data."

---

## PART 1 — SETUP: API CLIENT FOUNDATION

### Step 1 — Install Required Packages

Paste this instruction into your agent:

> "Install the following packages in the CampusKobo project:
>
> - `axios` — HTTP client for API calls (cleaner than raw fetch for interceptors and error handling)
> - `expo-secure-store` — for securely storing JWT tokens on the device (more secure than AsyncStorage for sensitive tokens)
> - `@react-native-community/netinfo` — for detecting whether the device is online or offline before making API calls
>
> Run: `npx expo install expo-secure-store @react-native-community/netinfo`
> Run: `npm install axios`
>
> After installing, verify no existing imports are broken by checking that the app still compiles and runs on Expo Go."

---

### Step 2 — Create the API Constants File

Paste this instruction into your agent:

> "Create the file `/src/constants/api.ts`. This file holds all API-related constants.
>
> Define and export the following:
>
> ````typescript
> export const API_BASE_URL = 'https://campus-kobo-backend-gmiq.vercel.app/api/v1';
>
> export const API_ENDPOINTS = {
>   // Auth
>   REGISTER: '/auth/register',
>   LOGIN: '/auth/login',
>   GOOGLE_AUTH: '/auth/google',
>   REFRESH_TOKEN: '/auth/refresh',
>   VERIFY_EMAIL: '/auth/verify-email',
>   RESEND_VERIFICATION: '/auth/resend-verification',
>   CHANGE_PASSWORD: '/auth/change-password',
>   CHANGE_EMAIL: '/auth/change-email',
>   CREATE_PIN: '/auth/create-pin',
>   LOGOUT: '/auth/logout',
>
>   // Onboarding
>   ONBOARDING_PROGRESS: '/onboarding/progress',
>   ONBOARDING_GOAL: '/onboarding/goal',
>   ONBOARDING_BUDGET: '/onboarding/budget',
>   ONBOARDING_CATEGORIES: '/onboarding/categories',
>
>   // Users
>   GET_ME: '/users/me',
>   UPDATE_PROFILE: '/users/profile',
>   UPLOAD_AVATAR: '/users/avatar',
>   UPDATE_BIOMETRICS: '/users/security/biometrics',
>   UPDATE_PRIVACY: '/users/privacy',
>   LIST_SESSIONS: '/users/sessions',
>   REVOKE_SESSION: (sessionId: string) => `/users/sessions/${sessionId}`,
>
>   // Dashboard
>   DASHBOARD: '/dashboard',
>   DASHBOARD_SUMMARY: '/dashboard/summary',
>
>   // Income
>   INCOME: '/income',
>   INCOME_BY_ID: (id: string) => `/income/${id}`,
>
>   // Expenses
>   EXPENSES: '/expenses',
>   EXPENSE_BY_ID: (id: string) => `/expenses/${id}`,
>
>   // Budgets
>   BUDGETS: '/budgets',
>   BUDGET_BY_ID: (id: string) => `/budgets/${id}`,
>
>   // Savings
>   SAVINGS: '/savings',
>   SAVINGS_GOALS: '/savings/goals',
>   SAVINGS_GOAL_BY_ID: (id: string) => `/savings/${id}`,
>   SAVINGS_CONTRIBUTIONS: (goalId: string) => `/savings/goals/${goalId}/contributions`,
>
>   // Notifications
>   NOTIFICATION_PREFERENCES: '/notifications/preferences',
>
>   // Support
>   FAQS: '/support/faqs',
>   SUPPORT_MESSAGES: '/support/messages',
>
>   // Health
>   HEALTH: '/health',
> };
>
> export const TOKEN_KEYS = {
>   ACCESS_TOKEN: 'campuskobo_access_token',
>   REFRESH_TOKEN: 'campuskobo_refresh_token',
>   TOKEN_EXPIRY: 'campuskobo_token_expiry',
> };
>
> export const API_TIMEOUT = 15000; // 15 seconds
> ```"
> ````

---

### Step 3 — Create the Token Storage Service

Paste this instruction into your agent:

> "Create the file `/src/storage/TokenStorage.ts`. This handles securely reading and writing JWT tokens using expo-secure-store.
>
> Import `* as SecureStore` from `expo-secure-store` and `TOKEN_KEYS` from `../constants/api`.
>
> Create and export the following async functions:
>
> **saveTokens(accessToken: string, refreshToken: string): Promise\<void\>**
>
> - Calls `SecureStore.setItemAsync` to save both tokens using their respective keys from TOKEN_KEYS
> - Wrap in try/catch — if SecureStore fails (some Android emulators), fall back to AsyncStorage with the same keys
> - Log a console warning if fallback is used
>
> **getAccessToken(): Promise\<string | null\>**
>
> - Retrieves the access token from SecureStore
> - Returns null if not found or on error
>
> **getRefreshToken(): Promise\<string | null\>**
>
> - Retrieves the refresh token from SecureStore
> - Returns null if not found or on error
>
> **clearTokens(): Promise\<void\>**
>
> - Deletes both token keys from SecureStore
> - Also clears from AsyncStorage in case fallback was used
>
> **hasValidTokens(): Promise\<boolean\>**
>
> - Calls getAccessToken()
> - Returns true if a non-null, non-empty string is found
> - Returns false otherwise
> - Does NOT validate the token against the server — just checks if one exists locally"

---

### Step 4 — Create the Axios API Client

Paste this instruction into your agent:

> "Create the file `/src/services/apiClient.ts`. This is the core HTTP client that all API calls go through.
>
> Import axios and create a default axios instance with:
>
> - `baseURL`: API_BASE_URL from constants/api
> - `timeout`: API_TIMEOUT from constants/api
> - `headers`: `{ 'Content-Type': 'application/json', 'Accept': 'application/json' }`
>
> **Request Interceptor:**
> Add a request interceptor that runs before every outgoing request:
>
> 1. Calls `getAccessToken()` from TokenStorage
> 2. If a token exists, adds it to the request headers as `Authorization: Bearer {token}`
> 3. If no token exists, the request goes out without an auth header (for public endpoints like login/register)
> 4. Log `[API Request] METHOD /path` to console in development
>
> **Response Interceptor:**
> Add a response interceptor with two handlers:
>
> SUCCESS handler (status 2xx):
>
> - Simply return `response.data` — this unwraps the axios response so callers get the data directly
>
> ERROR handler:
>
> - Check if `error.response?.status === 401`
>   - If yes: attempt token refresh (see below)
>   - If the refresh also fails: call `clearTokens()` and emit an event `'AUTH_EXPIRED'` using a simple EventEmitter (see Step 5)
> - Check if `error.response?.status === 422`
>   - Extract `error.response.data.detail` and format it as a readable error string
>   - These are FastAPI validation errors — they come as an array of objects with `loc` and `msg` fields
>   - Join them as: `field: message` pairs separated by newlines
> - For all other errors: extract `error.response?.data?.detail || error.message || 'Something went wrong'`
> - Throw a new Error with the extracted message so callers can catch it
>
> **Token Refresh Logic (inside the error interceptor):**
> Create a private async function `handleTokenRefresh(failedRequest)`:
>
> 1. Get the refresh token from TokenStorage
> 2. If no refresh token exists, reject immediately
> 3. Make a direct axios POST (not through the intercepted client) to `API_BASE_URL + '/auth/refresh'` with body `{ refresh_token: refreshToken }`
> 4. If successful: save the new tokens via `saveTokens()`, update the failed request's Authorization header, and retry the original request
> 5. If it fails: clear tokens and reject
>
> Export the axios instance as `apiClient` (default export)."

---

### Step 5 — Create an Auth Event Emitter

Paste this instruction into your agent:

> "Create the file `/src/utils/authEvents.ts`. This is a lightweight event emitter used to communicate auth state changes (like token expiry) from the API client layer to the UI layer without creating circular dependencies.
>
> ```typescript
> import { EventEmitter } from "events";
>
> class AuthEventEmitter extends EventEmitter {}
>
> export const authEvents = new AuthEventEmitter();
>
> export const AUTH_EVENTS = {
>   TOKEN_EXPIRED: "AUTH_EXPIRED",
>   LOGGED_OUT: "LOGGED_OUT",
>   LOGGED_IN: "LOGGED_IN",
> };
> ```
>
> This will be imported in:
>
> - `apiClient.ts` — to emit `AUTH_EXPIRED` when refresh fails
> - `AppContext.tsx` — to listen for `AUTH_EXPIRED` and automatically log the user out and redirect to login screen
>
> After creating this file, update `apiClient.ts` to import `authEvents` and `AUTH_EVENTS` from this file and call `authEvents.emit(AUTH_EVENTS.TOKEN_EXPIRED)` when a refresh fails."

---

### Step 6 — Create the Network Status Utility

Paste this instruction into your agent:

> "Create the file `/src/utils/networkStatus.ts`. This utility checks whether the device is connected to the internet before making API calls.
>
> Import `NetInfo` from `@react-native-community/netinfo`.
>
> Create and export:
>
> **isOnline(): Promise\<boolean\>**
>
> - Calls `NetInfo.fetch()`
> - Returns `state.isConnected && state.isInternetReachable` (both must be true)
> - Returns false on any error
>
> **useNetworkStatus(): { isOnline: boolean }** (a React hook)
>
> - Uses `useState(true)` for isOnline
> - Uses `useEffect` to subscribe to `NetInfo.addEventListener`
> - Updates state whenever connection changes
> - Unsubscribes on cleanup
> - Returns `{ isOnline }`
>
> This hook will be used in screens to show an 'Offline mode' banner when the device has no internet."

---

## PART 2 — AUTH SERVICE LAYER

### Step 7 — Create the Auth Service

Paste this instruction into your agent:

> "Create the file `/src/services/authService.ts`. This file contains all functions that interact with the auth API endpoints. Import `apiClient` from `./apiClient`, `saveTokens`, `clearTokens` from `../storage/TokenStorage`, and `API_ENDPOINTS` from `../constants/api`.
>
> Define TypeScript interfaces at the top of this file:
>
> ```typescript
> export interface RegisterRequest {
>   full_name: string;
>   email: string;
>   password: string;
> }
>
> export interface LoginRequest {
>   email: string;
>   password: string;
> }
>
> export interface TokenResponse {
>   access_token: string;
>   refresh_token: string;
>   token_type: string;
>   user?: AuthUserResponse;
> }
>
> export interface AuthUserResponse {
>   id: string;
>   email: string;
>   full_name: string;
>   is_verified: boolean;
>   created_at: string;
> }
>
> export interface VerifyEmailRequest {
>   email: string;
>   code: string;
> }
>
> export interface GoogleAuthRequest {
>   id_token: string;
> }
> ```
>
> Create and export the following async functions:
>
> **register(data: RegisterRequest): Promise\<AuthUserResponse\>**
>
> - POST to API_ENDPOINTS.REGISTER with data
> - Do NOT save tokens here — registration does not return tokens, just the user
> - Return the response
>
> **login(data: LoginRequest): Promise\<TokenResponse\>**
>
> - POST to API_ENDPOINTS.LOGIN with data
> - On success: call `saveTokens(response.access_token, response.refresh_token)`
> - Return the full token response
>
> **googleAuth(data: GoogleAuthRequest): Promise\<TokenResponse\>**
>
> - POST to API_ENDPOINTS.GOOGLE_AUTH with data
> - On success: save tokens
> - Return response
>
> **verifyEmail(data: VerifyEmailRequest): Promise\<any\>**
>
> - POST to API_ENDPOINTS.VERIFY_EMAIL with data
> - Return response
>
> **resendVerification(email: string): Promise\<any\>**
>
> - POST to API_ENDPOINTS.RESEND_VERIFICATION with `{ email }`
> - Return response
>
> **refreshToken(refreshToken: string): Promise\<TokenResponse\>**
>
> - POST to API_ENDPOINTS.REFRESH_TOKEN with `{ refresh_token: refreshToken }`
> - On success: save the new tokens
> - Return response
>
> **changePassword(data: { old_password: string; new_password: string }): Promise\<any\>**
>
> - POST to API_ENDPOINTS.CHANGE_PASSWORD with data
> - Return response
>
> **changeEmail(data: { new_email: string; password: string }): Promise\<any\>**
>
> - POST to API_ENDPOINTS.CHANGE_EMAIL with data
> - Return response
>
> **createPin(data: { pin: string }): Promise\<any\>**
>
> - POST to API_ENDPOINTS.CREATE_PIN with data
> - Return response
>
> **logout(): Promise\<void\>**
>
> - POST to API_ENDPOINTS.LOGOUT (fire and forget — don't crash if it fails)
> - Regardless of response: call `clearTokens()`
> - Wrap the API call in its own try/catch so token clearing always happens even if the server call fails"

---

### Step 8 — Create the User Service

Paste this instruction into your agent:

> "Create the file `/src/services/userService.ts`. This handles all `/users/` API calls.
>
> Import `apiClient` from `./apiClient` and `API_ENDPOINTS` from `../constants/api`.
>
> Define TypeScript interfaces:
>
> ```typescript
> export interface UserProfileResponse {
>   id: string;
>   email: string;
>   full_name: string;
>   avatar_url?: string;
>   is_verified: boolean;
>   created_at: string;
>   // Add other fields as the API returns them
> }
>
> export interface UserProfileUpdateRequest {
>   full_name?: string;
>   // Other updatable fields
> }
> ```
>
> Create and export:
>
> **getMe(): Promise\<UserProfileResponse\>**
>
> - GET to API_ENDPOINTS.GET_ME
> - Returns the current logged-in user's profile
>
> **updateProfile(data: UserProfileUpdateRequest): Promise\<UserProfileResponse\>**
>
> - PUT to API_ENDPOINTS.UPDATE_PROFILE with data
> - Returns updated profile
>
> **uploadAvatar(imageUri: string): Promise\<{ avatar_url: string }\>**
>
> - POST to API_ENDPOINTS.UPLOAD_AVATAR
> - Must use FormData — NOT JSON
> - Create a FormData object, append the image as a file field named 'file'
> - Set the Content-Type header to 'multipart/form-data' for this specific request
> - Return the response containing the new avatar URL
>
> **listSessions(): Promise\<any[]\>**
>
> - GET to API_ENDPOINTS.LIST_SESSIONS
>
> **revokeSession(sessionId: string): Promise\<any\>**
>
> - DELETE to API_ENDPOINTS.REVOKE_SESSION(sessionId)"

---

### Step 9 — Create the Onboarding Service

Paste this instruction into your agent:

> "Create the file `/src/services/onboardingService.ts`. This handles all `/onboarding/` API calls.
>
> Import `apiClient` from `./apiClient` and `API_ENDPOINTS` from `../constants/api`.
>
> Define TypeScript interfaces:
>
> ```typescript
> export interface OnboardingProgressResponse {
>   completed: boolean;
>   current_step: string | null;
>   goal_selected: boolean;
>   budget_setup: boolean;
>   categories_setup: boolean;
> }
>
> export interface GoalSelectionRequest {
>   goal: string; // e.g. 'track_spending' | 'control_budget' | 'save_goals'
> }
>
> export interface BudgetSetupRequest {
>   monthly_income: number;
>   currency: string; // 'NGN' | 'USD'
> }
>
> export interface CategorySetupRequest {
>   category_ids: string[];
> }
> ```
>
> Create and export:
>
> **getProgress(): Promise\<OnboardingProgressResponse\>**
>
> - GET to API_ENDPOINTS.ONBOARDING_PROGRESS
> - Returns the user's current onboarding state
>
> **selectGoal(data: GoalSelectionRequest): Promise\<any\>**
>
> - POST to API_ENDPOINTS.ONBOARDING_GOAL with data
> - Return response
>
> **setupBudget(data: BudgetSetupRequest): Promise\<any\>**
>
> - POST to API_ENDPOINTS.ONBOARDING_BUDGET with data
> - Return response
>
> **setupCategories(data: CategorySetupRequest): Promise\<any\>**
>
> - POST to API_ENDPOINTS.ONBOARDING_CATEGORIES with data
> - Return response"

---

## PART 3 — UPDATE THE APP CONTEXT

### Step 10 — Add API Auth State to AppContext

Paste this instruction into your agent:

> "Update `/src/context/AppContext.tsx` to add API-connected auth state alongside the existing local state.
>
> Add the following new state variables to the context:
>
> ```typescript
> const [apiUser, setApiUser] = useState<UserProfileResponse | null>(null);
> const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
> const [authLoading, setAuthLoading] = useState<boolean>(true); // true on app start while checking tokens
> const [networkError, setNetworkError] = useState<boolean>(false);
> ```
>
> Add a new function **checkAuthStatus()** that runs on app launch:
>
> 1. Set `authLoading = true`
> 2. Call `hasValidTokens()` from TokenStorage
> 3. If tokens exist:
>    - Try to call `userService.getMe()` to get the current user from the API
>    - If successful: set `apiUser` and `isAuthenticated = true`, merge with local user data
>    - If it fails (network error): set `isAuthenticated = true` anyway (we have tokens, assume valid), set `networkError = true`
>    - If it fails with 401: clear tokens, set `isAuthenticated = false`
> 4. If no tokens: set `isAuthenticated = false`
> 5. Always set `authLoading = false` at the end (in a finally block)
>
> Add a new function **loginWithApi(email, password)**:
>
> 1. Call `authService.login({ email, password })`
> 2. On success: set `isAuthenticated = true`, then call `getMe()` and set `apiUser`
> 3. Also call `loadAllData()` to load any local data
> 4. Emit `AUTH_EVENTS.LOGGED_IN` via authEvents
> 5. Throw errors so callers can display them
>
> Add a new function **registerWithApi(full_name, email, password)**:
>
> 1. Call `authService.register({ full_name, email, password })`
> 2. Return the result — do NOT set isAuthenticated (user must verify email first)
>
> Add a new function **logoutFromApi()**:
>
> 1. Call `authService.logout()`
> 2. Set `isAuthenticated = false`, `apiUser = null`
> 3. Call `loadAllData()` to reset local state
> 4. Emit `AUTH_EVENTS.LOGGED_OUT`
>
> Listen for `AUTH_EVENTS.TOKEN_EXPIRED` via authEvents in a `useEffect`:
>
> - When fired: call `logoutFromApi()` and show a toast: 'Your session has expired. Please log in again.'
>
> Call `checkAuthStatus()` in the existing `useEffect` that calls `loadAllData()` on app start — run both in parallel.
>
> Add all new state and functions to the context value so all screens can access them."

---

### Step 11 — Update AppNavigator to Use API Auth State

Paste this instruction into your agent:

> "Update `/src/navigation/AppNavigator.tsx` to use the new `isAuthenticated` and `authLoading` state from AppContext instead of the local `hasCompletedOnboarding` check.
>
> Import `useContext` and `AppContext` at the top.
>
> The new navigation decision logic should be:
>
> ```
> if authLoading is true:
>   → Show a full-screen white loading screen with the CampusKobo logo centered and an ActivityIndicator (PRIMARY_GREEN)
>
> if authLoading is false AND isAuthenticated is false:
>   → Show OnboardingStack (which includes Login/Register screens)
>
> if authLoading is false AND isAuthenticated is true:
>   → Check user.hasCompletedOnboarding from local context
>   → If false: navigate to GoalSelectionScreen (skip the auth screens)
>   → If true: show MainBottomTabNavigator
> ```
>
> This means the app will:
>
> - Show a loading screen briefly on startup
> - Auto-navigate to dashboard if tokens are valid
> - Show onboarding/login if not authenticated
>
> Keep all existing navigator definitions (OnboardingStack, MainBottomTabNavigator, etc.) exactly as they are — only the root-level conditional rendering logic changes."

---

## PART 4 — UPDATE AUTH SCREENS

### Step 12 — Update the Sign Up Screen

Paste this instruction into your agent:

> "Update `/src/screens/onboarding/SignUpScreen.tsx` to use the real API instead of creating a local user directly.
>
> Add the following new state variables:
>
> ```typescript
> const [isLoading, setIsLoading] = useState(false);
> const [apiError, setApiError] = useState<string | null>(null);
> ```
>
> Replace the existing `handleSignUp` function with this new version:
>
> 1. Clear any previous `apiError`
> 2. Run all existing local validations (email format, password length) — do NOT change these
> 3. If validations pass, set `isLoading = true`
> 4. Call `registerWithApi(fullName, email, password)` from AppContext
> 5. On SUCCESS:
>    - Also create the local User object and call `setUser()` from context (keep existing behavior)
>    - Navigate to a new screen: **EmailVerificationScreen** (we will create this in Step 13), passing `{ email }` as params
> 6. On FAILURE:
>    - Set `apiError` to the error message from the thrown Error
>    - Show the error in a red card below the form (not inline — it's a general API error, not a field error)
> 7. Always set `isLoading = false` in a finally block
>
> Update the 'Create Account' button:
>
> - When `isLoading` is true: show an `ActivityIndicator` (white, size 'small') instead of the button text
> - Disable the button while loading
>
> Add an error display section below the form fields (above the button) that shows `apiError` in a red-background card with a white error icon if it's not null."

---

### Step 13 — Create the Email Verification Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/onboarding/EmailVerificationScreen.tsx`.
>
> This screen is shown after successful registration, asking the user to verify their email with a code.
>
> Receives `route.params.email` (string).
>
> **Header:**
>
> - Back arrow left (goes back to SignUpScreen)
> - Title: 'Verify Your Email'
>
> **Content:**
>
> - Large envelope icon centered at top (use Ionicons 'mail-outline' in PRIMARY_GREEN, size 72)
> - Title: 'Check your inbox' (large, bold)
> - Subtitle: 'We sent a verification code to {email}. Enter it below to activate your account.' (gray, with the email highlighted in PRIMARY_GREEN bold)
>
> **6-digit OTP input:**
>
> - 6 separate TextInput boxes side by side (not one big field)
> - Each box: 48x56px, rounded border, centered numeric text, large font (24px)
> - Border turns PRIMARY_GREEN when focused
> - Border turns SUCCESS_GREEN when filled
> - Auto-focuses next box when a digit is entered
> - On backspace in an empty box: focus moves to the previous box
> - Numeric keyboard type
> - Use `useRef` to hold refs for all 6 inputs
>
> **Timer section:**
>
> - 'Didn't receive it? Resend in {seconds}s' — countdown from 60 seconds
> - Use `useEffect` with `setInterval` to count down
> - When timer reaches 0: text changes to 'Resend verification email' as a tappable PRIMARY_GREEN link
> - Tapping calls `authService.resendVerification(email)` and resets the timer to 60
>
> **Verify button:**
>
> - 'Verify Email' — PRIMARY_GREEN full width
> - Disabled until all 6 boxes have digits
> - Shows ActivityIndicator while loading
>
> **Logic on submit:**
>
> 1. Set loading true
> 2. Combine the 6 inputs into one code string
> 3. Call `authService.verifyEmail({ email, code })`
> 4. On SUCCESS: navigate to GoalSelectionScreen (onboarding continues)
> 5. On FAILURE: show error text below the input boxes in red, clear all 6 boxes, focus first box
> 6. Always set loading false in finally block
>
> **Add EmailVerificationScreen to OnboardingStack** in AppNavigator.tsx — it should come after SignUpScreen and before GoalSelectionScreen."

---

### Step 14 — Update the Login Screen

Paste this instruction into your agent:

> "Update `/src/screens/onboarding/LoginScreen.tsx` to use the real API.
>
> Add state variables:
>
> ```typescript
> const [isLoading, setIsLoading] = useState(false);
> const [apiError, setApiError] = useState<string | null>(null);
> ```
>
> Replace the existing `handleLogin` function with:
>
> 1. Clear any previous `apiError`
> 2. Basic validation: check email and password are non-empty (keep existing)
> 3. Set `isLoading = true`
> 4. Call `loginWithApi(email, password)` from AppContext
> 5. On SUCCESS:
>    - AppContext will set `isAuthenticated = true` automatically
>    - AppNavigator will detect the auth change and redirect automatically
>    - DO NOT manually call `navigation.navigate()` — the navigator handles it
> 6. On FAILURE:
>    - Check the error message:
>      - If it contains 'not verified' or 'verify': navigate to EmailVerificationScreen with `{ email }`
>      - Otherwise: set `apiError` to the error message
> 7. Always set `isLoading = false` in finally block
>
> Update the 'Log In' button:
>
> - Show ActivityIndicator while loading, disable button
>
> Add the same red error card below the form as in SignUpScreen.
>
> Remove the old prototype logic that called `getUser()` from StorageService directly — this is now handled by the context."

---

## PART 5 — UPDATE ONBOARDING STEPS

### Step 15 — Update Goal Selection Screen to Use API

Paste this instruction into your agent:

> "Update `/src/screens/onboarding/GoalSelectionScreen.tsx` to call the real onboarding API.
>
> Import `onboardingService` from `../services/onboardingService`.
>
> Add state:
>
> ```typescript
> const [isLoading, setIsLoading] = useState(false);
> const [apiError, setApiError] = useState<string | null>(null);
> ```
>
> The goal options in the UI currently use labels like 'Track my spending', 'Control my budget', 'Save towards goals'. Map these to API-compatible goal values. Create a mapping object at the top of the file:
>
> ```typescript
> const GOAL_API_VALUES: Record<string, string> = {
>   "Track my spending": "track_spending",
>   "Control my budget": "control_budget",
>   "Save towards goals": "save_goals",
> };
> ```
>
> Update the `handleContinue` function:
>
> 1. Keep all existing local state updates (saving goals to user context)
> 2. ALSO call the API:
>    - Set `isLoading = true`
>    - For each selected goal, call `onboardingService.selectGoal({ goal: GOAL_API_VALUES[goalLabel] })`
>    - NOTE: If the API only accepts one goal, send the first selected goal. If multiple calls are needed, use `Promise.allSettled()` so one failure does not block the others.
> 3. Whether the API call succeeds or fails:
>    - Navigate to SetMonthlyBudgetScreen regardless (local onboarding must not be blocked by API failures)
>    - If it failed, log the error silently — do not show an error to the user for this step
> 4. Set `isLoading = false` in finally
>
> Update the Continue button to show ActivityIndicator while loading."

---

### Step 16 — Update Set Monthly Budget Screen to Use API

Paste this instruction into your agent:

> "Update `/src/screens/onboarding/SetMonthlyBudgetScreen.tsx` to call the real onboarding API.
>
> Import `onboardingService` from `../services/onboardingService`.
>
> Add state:
>
> ```typescript
> const [isLoading, setIsLoading] = useState(false);
> ```
>
> Update the `handleContinue` function:
>
> 1. Keep all existing local state updates (saving budget to user context)
> 2. ALSO call the API:
>    - `onboardingService.setupBudget({ monthly_income: budgetAmount, currency: 'NGN' })`
>    - Use try/catch — navigate forward regardless of success or failure
>    - Log errors silently
> 3. Navigate to QuickCategorySetupScreen
> 4. Set loading false in finally
>
> Update the Continue button to show ActivityIndicator while loading."

---

### Step 17 — Update Quick Category Setup Screen to Use API

Paste this instruction into your agent:

> "Update `/src/screens/onboarding/QuickCategorySetupScreen.tsx` to call the real onboarding API.
>
> Import `onboardingService` from `../services/onboardingService`.
>
> The categories in the UI currently use display names like 'Food', 'Transport', etc. Create a mapping to API-compatible IDs at the top of the file:
>
> ```typescript
> const CATEGORY_API_IDS: Record<string, string> = {
>   Food: "food",
>   Transport: "transport",
>   "Data/Internet": "data_internet",
>   Entertainment: "entertainment",
>   Shopping: "shopping",
>   Health: "health",
> };
> ```
>
> Update the `handleFinish` function:
>
> 1. Keep all existing local state updates
> 2. ALSO call the API:
>    - Map selected category display names to API IDs using the mapping above
>    - Call `onboardingService.setupCategories({ category_ids: mappedIds })`
>    - Use try/catch — navigate forward regardless
> 3. Navigate to FirstExpenseScreen
> 4. Set loading false in finally
>
> Update the Finish Setup button to show ActivityIndicator while loading."

---

### Step 18 — Update Onboarding Success Screen

Paste this instruction into your agent:

> "Update `/src/screens/onboarding/OnboardingSuccessScreen.tsx`.
>
> The existing logic already sets `hasCompletedOnboarding = true` in local storage. Add one additional step:
>
> When the screen mounts (in the existing `useEffect`):
>
> 1. Try to call `onboardingService.getProgress()` to verify onboarding is recorded on the server
> 2. Log the result but do not block or crash based on t he result
> 3. Keep all existing behavior exactly as-is (confetti, timer, etc.)
>
> No visual changes needed — this is a silent sync step only."

---

## PART 6 — PROFILE & SETTINGS INTEGRATION

### Step 19 — Update Profile Screen to Show Real User Data

Paste this instruction into your agent:

> "Update `/src/screens/profile/ProfileSettingsScreen.tsx` to display data from the API user instead of only local storage.
>
> Import `apiUser` from AppContext.
>
> Update the profile card at the top:
>
> - Display name: `apiUser?.full_name || user?.name || 'User'` (API takes priority, falls back to local)
> - Display email: `apiUser?.email || user?.email || ''`
> - Avatar: if `apiUser?.avatar_url` exists, show it as an `Image` component; otherwise show the existing initials circle
>
> Update the 'Edit Profile' bottom sheet's save button:
>
> 1. When the user saves the edit form, call `updateProfile({ full_name: newName })` from userService
> 2. On success: update `apiUser` via `setApiUser()` in context AND update local `user` via `updateUser()` in context
> 3. On failure: show a toast error
> 4. Show ActivityIndicator in the save button while loading
>
> Update the 'Log Out' confirmation handler:
>
> - Replace the old logout logic (which just cleared local state) with a call to `logoutFromApi()` from AppContext
> - AppNavigator will automatically redirect to the login screen when `isAuthenticated` becomes false
>
> No other changes to this screen."

---

### Step 20 — Update Security & Privacy Screen

Paste this instruction into your agent:

> "Update `/src/screens/profile/SecurityPrivacyScreen.tsx` to wire up the Change Password and Change Email flows to the real API.
>
> **Change Password row:**
>
> - Instead of showing 'Coming soon' alert, navigate to a new **ChangePasswordScreen** (create below)
>
> **Change Email row:**
>
> - Instead of showing 'Coming soon' alert, navigate to a new **ChangeEmailScreen** (create below)
>
> Create the file `/src/screens/profile/ChangePasswordScreen.tsx`:
>
> Header: Back arrow, Title 'Change Password'
>
> Form:
>
> 1. Current Password — secure input
> 2. New Password — secure input with eye toggle + strength indicator (same as SignUpScreen)
> 3. Confirm New Password — secure input
>
> Validation:
>
> - New password must be at least 6 characters
> - Confirm password must match new password
> - Show inline red errors below each field if invalid
>
> Save button:
>
> - 'Update Password' — PRIMARY_GREEN, full width
> - Disabled until all 3 fields are filled
> - Shows ActivityIndicator while loading
>
> Logic on submit:
>
> 1. Validate locally first
> 2. Call `authService.changePassword({ old_password, new_password })`
> 3. On success: show SuccessScreen component with title 'Password Updated!', then navigate back
> 4. On failure: show apiError card with the error message
>
> ---
>
> Create the file `/src/screens/profile/ChangeEmailScreen.tsx`:
>
> Header: Back arrow, Title 'Change Email'
>
> Form:
>
> 1. New Email Address — email input
> 2. Current Password (for security verification) — secure input
>
> Save button: 'Update Email' — PRIMARY_GREEN
>
> Logic on submit:
>
> 1. Call `authService.changeEmail({ new_email, password })`
> 2. On success: show a success message: 'Verification email sent to {newEmail}. Please verify it to complete the change.'
> 3. On failure: show apiError
>
> Add both new screens to the HomeStack in AppNavigator.tsx."

---

### Step 21 — Wire Up the Create PIN Screen to the API

Paste this instruction into your agent:

> "Update `/src/screens/profile/PINSuccessScreen.tsx`.
>
> In the existing `handleDone` function (which saves PIN to local user context and navigates back):
>
> After saving locally, ALSO call the API:
>
> 1. Call `authService.createPin({ pin })` — the PIN should have been passed through navigation params from ConfirmPINScreen to PINSuccessScreen
> 2. Use try/catch — if it fails, log silently. The PIN is still saved locally so the app PIN lock still works.
> 3. No visual changes — this is a background sync."

---

## PART 7 — OFFLINE / ONLINE INDICATOR

### Step 22 — Add Network Status Banner to Main Screens

Paste this instruction into your agent:

> "Create the file `/src/components/OfflineBanner.tsx`.
>
> This is a thin banner that appears at the very top of the screen (below the status bar, above the header) when the device is offline.
>
> Props: none — it reads from the `useNetworkStatus()` hook internally.
>
> When `isOnline` is false:
>
> - Show a yellow (#F59E0B) banner with a wifi-off icon and text 'You are offline. Showing saved data.'
> - Animate it sliding down from height 0 to height 36px using Animated
>
> When `isOnline` is true:
>
> - Animate it sliding back up (height 0) and hide it
>
> Import and add this component to the following screens, placing it immediately inside the outermost View, above the Header component:
>
> - DashboardScreen
> - ExpensesListScreen
> - BudgetScreen
> - SavingsScreen
> - ProfileSettingsScreen"

---

## PART 8 — ERROR HANDLING AUDIT

### Step 23 — Audit All API Calls for Consistent Error Handling

Paste this instruction into your agent:

> "Go through every function in `authService.ts`, `userService.ts`, and `onboardingService.ts`. Verify that each one:
>
> 1. **Does NOT have an internal try/catch** — errors should bubble up to the calling screen, which will handle them. The service files should be clean async functions that either return data or throw.
> 2. **Calling screens DO have try/catch** — verify that every screen function that calls a service is wrapped in try/catch with:
>    - A `setIsLoading(false)` in the `finally` block
>    - A `setApiError(error.message)` in the `catch` block
>    - A red error card in the JSX that shows `apiError` if it's non-null
> 3. **FastAPI validation errors are readable** — the API returns 422 errors as:
>    ```json
>    {
>      "detail": [
>        {
>          "loc": ["body", "email"],
>          "msg": "value is not a valid email",
>          "type": "..."
>        }
>      ]
>    }
>    ```
>    Verify that the apiClient response interceptor (from Step 4) correctly formats these as: 'email: value is not a valid email' and that the error reaches the screen as a plain string.
> 4. **Network errors have a friendly message** — if axios throws a network error (no internet), the error message should be 'No internet connection. Please check your network.' — add this as a special case in the apiClient error interceptor: if `error.code === 'ECONNABORTED'` or `!error.response`, throw `new Error('No internet connection. Please check your network.')`.
>
> Fix any issues found during this audit."

---

## PART 9 — FUTURE PHASES (NOTES FOR THE AGENT)

### Step 24 — Notes on Wiring Remaining Endpoints

Paste this instruction into your agent:

> "The following API endpoints exist on the backend but are NOT being connected in this integration phase. Add comments in the relevant screen files to mark where these connections should be added in a future phase. Do not implement them now — just add the comment markers.
>
> **In DashboardScreen.tsx** — add comment above the helper functions section:
>
> ```typescript
> // TODO Phase 2: Replace local calculation with GET /api/v1/dashboard and GET /api/v1/dashboard/summary
> // The API returns pre-calculated totals, which will replace getTotalIncome(), getTotalExpenses(), etc.
> ```
>
> **In ExpensesListScreen.tsx** — add comment above the transaction list:
>
> ```typescript
> // TODO Phase 2: Replace local transactions state with GET /api/v1/expenses (list) and GET /api/v1/income (list)
> // All CRUD (create, edit, delete) should also use the corresponding API endpoints
> ```
>
> **In BudgetScreen.tsx** — add comment:
>
> ```typescript
> // TODO Phase 2: Replace local budgets with GET /api/v1/budgets
> // CreateBudgetScreen should POST to /api/v1/budgets, edit should PUT, delete should DELETE
> ```
>
> **In SavingsScreen.tsx** — add comment:
>
> ```typescript
> // TODO Phase 2: Replace local savings goals with GET /api/v1/savings/goals
> // CreateSavingsGoalScreen should POST to /api/v1/savings/goals
> // AddFundsBottomSheet should POST to /api/v1/savings/goals/{goalId}/contributions
> ```
>
> **In HelpFAQScreen.tsx** — add comment:
>
> ```typescript
> // TODO Phase 2: Replace static FAQ list with GET /api/v1/support/faqs
> // CreateSupportMessage should POST to /api/v1/support/messages
> ```
>
> **In NotificationSettingsScreen.tsx** — add comment:
>
> ````typescript
> // TODO Phase 2: Replace local toggle state with GET /api/v1/notifications/preferences (on mount)
> // And PUT /api/v1/notifications/preferences when a toggle changes
> ```"
> ````

---

## PART 10 — TESTING THE INTEGRATION

### Step 25 — Test the Full Auth Flow End to End

Paste this instruction into your agent:

> "After completing all previous steps, perform the following manual test sequence on Expo Go. Fix any issues found before proceeding.
>
> **Test 1: Registration**
>
> 1. Open the app fresh (clear app data or uninstall/reinstall)
> 2. Navigate to Sign Up screen
> 3. Fill in a real email address, full name, and password
> 4. Tap 'Create Account'
> 5. Expected: Navigates to EmailVerificationScreen with the email shown
> 6. Check the email inbox for a verification code
> 7. Enter the code
> 8. Expected: Navigates to GoalSelectionScreen
>
> **Test 2: Onboarding Steps**
>
> 1. On GoalSelectionScreen: select one or more goals, tap Continue
> 2. Expected: Navigates to SetMonthlyBudgetScreen without error
> 3. Enter a budget amount (e.g. 50000), tap Continue
> 4. Expected: Navigates to QuickCategorySetupScreen without error
> 5. Confirm/deselect categories, tap Finish Setup
> 6. Expected: Navigates to FirstExpenseScreen
> 7. Either log an expense or tap Skip
> 8. Expected: OnboardingSuccessScreen with confetti
> 9. Tap 'Go to Dashboard'
> 10. Expected: MainBottomTabNavigator shows, Dashboard screen is visible
>
> **Test 3: Login and Token Persistence**
>
> 1. Close the app completely (swipe away from multitasking)
> 2. Reopen the app
> 3. Expected: Brief loading screen, then automatic navigation to Dashboard (no login prompt)
>
> **Test 4: Login Screen**
>
> 1. Clear app data or log out
> 2. Go to Login screen
> 3. Enter wrong password
> 4. Expected: Red error card with message from API
> 5. Enter correct credentials
> 6. Expected: Auto-navigation to Dashboard
>
> **Test 5: Logout**
>
> 1. Navigate to Profile & Settings
> 2. Tap Log Out → confirm
> 3. Expected: Returns to WelcomeScreen1 / Login screen
> 4. Reopen the app
> 5. Expected: Login screen shown (no auto-login)
>
> **Test 6: Offline Behavior**
>
> 1. Login successfully
> 2. Turn off Wi-Fi and mobile data
> 3. Navigate to Dashboard
> 4. Expected: Yellow offline banner shown at top
> 5. Expected: Dashboard still shows last-known data from local storage (no crash)
> 6. Re-enable internet
> 7. Expected: Offline banner disappears
>
> Document and fix any failures from these tests."

---

### Step 26 — Add Loading Screen for App Startup

Paste this instruction into your agent:

> "Create the file `/src/screens/AppLoadingScreen.tsx`.
>
> This screen is shown while `authLoading` is true in AppContext (i.e., while the app is checking if the user has valid tokens on startup).
>
> Layout:
>
> - White background, full screen
> - CampusKobo logo centered (same as SplashScreen but without the auto-timer — it stays until authLoading becomes false)
> - App name 'CampusKobo' in large PRIMARY_GREEN bold text
> - 'by BOF OAU' in smaller gray text below
> - Small `ActivityIndicator` in PRIMARY_GREEN at the bottom center of the screen, about 40px above the safe area bottom
>
> Update AppNavigator.tsx:
>
> - Import `authLoading` from AppContext
> - At the very top of the navigation render: if `authLoading === true`, return `<AppLoadingScreen />` instead of any navigator
> - This prevents any flash of the wrong screen while auth is being determined"

---

## PART 11 — CLEANUP AND FINAL WIRING

### Step 27 — Update AppContext to Export All New Values

Paste this instruction into your agent:

> "Do a final audit of `/src/context/AppContext.tsx`. Ensure the context value object exported to consumers includes ALL of these fields (in addition to all the original fields that were already there):
>
> ```typescript
> // New fields added in this integration guide
> apiUser,
> isAuthenticated,
> authLoading,
> networkError,
> loginWithApi,
> registerWithApi,
> logoutFromApi,
> checkAuthStatus,
> setApiUser,
> ```
>
> Also update `/src/types/index.ts` to add a new `AppContextType` interface that documents all context values and their types. This makes it easier for the AI agent and any future developers to know exactly what is available in the context.
>
> Export this type and add it as the type parameter to `React.createContext<AppContextType | null>(null)` so TypeScript can catch incorrect context usage at compile time."

---

### Step 28 — Final Folder and Import Audit

Paste this instruction into your agent:

> "Do a final check across the project to ensure:
>
> 1. **No unused imports** — remove any old imports that were replaced by API-connected versions (e.g., direct calls to `StorageService.getUser()` in auth screens that are now handled by AppContext)
> 2. **Consistent token usage** — search the entire codebase for any string 'localStorage' or direct AsyncStorage usage in screens (not StorageService). All sensitive tokens must go through TokenStorage, not direct AsyncStorage.
> 3. **No hardcoded user objects** — search for `{ id:`, `{ email:` patterns in screen files. All user data should come from context, not be created inline in screens (except for the initial registration flow).
> 4. **All new screens are in the navigator** — confirm that `EmailVerificationScreen`, `ChangePasswordScreen`, and `ChangeEmailScreen` are registered in the correct stacks in AppNavigator.tsx.
> 5. **apiClient is the only HTTP client** — there should be no `fetch()` calls or direct `axios` calls in screen files or service files. All network calls must go through the `apiClient` instance.
> 6. **Environment safety** — confirm that `API_BASE_URL` in `constants/api.ts` is the only place the backend URL appears. Do a search for 'vercel.app' across the codebase — it should appear exactly once."

---

## QUICK REFERENCE — File Changes Summary

| File                                                   | Action     | Purpose                          |
| ------------------------------------------------------ | ---------- | -------------------------------- |
| `/src/constants/api.ts`                                | **Create** | All API URLs and token keys      |
| `/src/storage/TokenStorage.ts`                         | **Create** | Secure JWT storage               |
| `/src/services/apiClient.ts`                           | **Create** | Axios instance with interceptors |
| `/src/utils/authEvents.ts`                             | **Create** | Auth state event emitter         |
| `/src/utils/networkStatus.ts`                          | **Create** | Online/offline detection         |
| `/src/services/authService.ts`                         | **Create** | All /auth/ API calls             |
| `/src/services/userService.ts`                         | **Create** | All /users/ API calls            |
| `/src/services/onboardingService.ts`                   | **Create** | All /onboarding/ API calls       |
| `/src/context/AppContext.tsx`                          | **Update** | Add API auth state + functions   |
| `/src/navigation/AppNavigator.tsx`                     | **Update** | Auth-aware root navigation       |
| `/src/screens/onboarding/SignUpScreen.tsx`             | **Update** | Real API registration            |
| `/src/screens/onboarding/EmailVerificationScreen.tsx`  | **Create** | OTP email verification           |
| `/src/screens/onboarding/LoginScreen.tsx`              | **Update** | Real API login                   |
| `/src/screens/onboarding/GoalSelectionScreen.tsx`      | **Update** | API onboarding step 1            |
| `/src/screens/onboarding/SetMonthlyBudgetScreen.tsx`   | **Update** | API onboarding step 2            |
| `/src/screens/onboarding/QuickCategorySetupScreen.tsx` | **Update** | API onboarding step 3            |
| `/src/screens/onboarding/OnboardingSuccessScreen.tsx`  | **Update** | Silent API sync                  |
| `/src/screens/profile/ProfileSettingsScreen.tsx`       | **Update** | Show real user data              |
| `/src/screens/profile/SecurityPrivacyScreen.tsx`       | **Update** | Wire change password/email       |
| `/src/screens/profile/ChangePasswordScreen.tsx`        | **Create** | Change password flow             |
| `/src/screens/profile/ChangeEmailScreen.tsx`           | **Create** | Change email flow                |
| `/src/screens/profile/PINSuccessScreen.tsx`            | **Update** | Background PIN API sync          |
| `/src/components/OfflineBanner.tsx`                    | **Create** | Offline indicator banner         |
| `/src/screens/AppLoadingScreen.tsx`                    | **Create** | Startup auth loading screen      |

---

## IMPORTANT RULES FOR THE CODING AGENT

1. **Paste and complete one step at a time.** Test that the app still runs after each step before moving to the next.

2. **Never remove existing local storage logic.** Only ADD the API calls alongside local storage. The app must remain functional offline.

3. **FastAPI errors use `detail`, not `message`.** When catching API errors, always check `error.response?.data?.detail` — not `error.message` from the API body. The axios client should handle this in the interceptor.

4. **JWT tokens expire.** The app must handle 401 responses by trying to refresh the token first. The apiClient interceptor does this automatically — do not add manual 401 handling in individual screens.

5. **All API calls are async.** Never call a service function without `await`. Always pair with a loading state (`setIsLoading(true/false)`) and error state (`setApiError`).

6. **The app must not crash offline.** Every single API call in a screen must be inside a try/catch. If the call fails, show a toast or error card — never let an unhandled promise rejection bubble up.

7. **Money is in Naira.** When calling `onboardingService.setupBudget()`, always pass `currency: 'NGN'` unless the user has changed their currency setting to USD.

8. **Onboarding is resilient.** Steps 15–17 (goal, budget, categories) must navigate forward whether the API call succeeds or not. The backend is secondary — local onboarding flow is primary.

---

_Document prepared for: CampusKobo Mobile App — BOF OAU_
_Integration Guide Version: 1.0 | May 2026_
_Backend: https://campus-kobo-backend-gmiq.vercel.app_
