# CampusKobo — Learning Feature: Complete Implementation Guide

> This document covers everything you need to build, connect, and manage the Learning Hub feature end-to-end — from the Supabase backend to the React Native app to the admin web panel.

---

## OVERVIEW OF WHAT YOU ARE BUILDING

The Learning Feature has three parts:

1. **Supabase Backend** — your database (already partially set up with the SQL you have)
2. **React Native App (CampusKobo)** — where students read and watch content
3. **Admin Web App** — a simple website where BOF OAU editors can add/edit/delete content without touching any code

---

## PART A — BACKEND (SUPABASE)

### A1 — Create Your Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up for a free account
2. Click **New Project**
3. Fill in:
   - **Name:** campuskobo
   - **Database Password:** choose a strong password (save it somewhere safe)
   - **Region:** choose Europe West (closest to Nigeria for now)
4. Click **Create new project** and wait ~2 minutes for it to set up
5. Once ready, go to **Settings > API** and copy these two values — you will need them later:
   - `Project URL` (looks like `https://xxxx.supabase.co`)
   - `anon public` key (a long string starting with `eyJ...`)

---

### A2 — Run the Database Schema

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Paste the entire SQL from your `schema.sql` file (the one you already have with the learning tables)
4. Click **Run**
5. You should see "Success. No rows returned" — this means your tables and seed data are created

**What this creates:**
- `learning_categories` table — stores categories like Budgeting, Saving, Investing
- `learning_content` table — stores all articles, videos, podcasts, and Finance 101 episodes

---

### A3 — Add Three More Tables You Still Need

Run this SQL in a new SQL Editor query:

```sql
-- Glossary terms table
CREATE TABLE public.glossary_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term TEXT NOT NULL,
    part_of_speech TEXT DEFAULT 'noun',
    definition TEXT NOT NULL,
    example TEXT,
    related_terms JSONB DEFAULT '[]'::jsonb,
    is_term_of_day BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User progress tracking
CREATE TABLE public.user_content_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    content_id TEXT NOT NULL,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percent INTEGER DEFAULT 0,
    last_read_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, content_id)
);

-- Bookmarks
CREATE TABLE public.user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    content_id TEXT NOT NULL,
    bookmarked_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, content_id)
);
```

---

### A4 — Set Row Level Security (RLS) Policies

By default Supabase blocks all access. You need to allow the app to read content. Run this SQL:

```sql
-- Allow anyone to READ learning content (it's public content)
ALTER TABLE public.learning_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on learning_content" 
ON public.learning_content FOR SELECT USING (true);

CREATE POLICY "Allow public read on learning_categories" 
ON public.learning_categories FOR SELECT USING (true);

CREATE POLICY "Allow public read on glossary_terms" 
ON public.glossary_terms FOR SELECT USING (true);

-- User progress: users can only read/write their own data
ALTER TABLE public.user_content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own progress" 
ON public.user_content_progress 
FOR ALL USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users manage own bookmarks" 
ON public.user_bookmarks 
FOR ALL USING (user_id = current_setting('app.user_id', true));
```

> **Note:** For the prototype/MVP, you can also just use the `service_role` key in the admin web app to bypass RLS — this is fine since only you (the admin) will use that web app.

---

### A5 — Seed Glossary Terms

Run this in the SQL Editor to add the 25 glossary terms:

```sql
INSERT INTO public.glossary_terms (term, part_of_speech, definition, example, related_terms) VALUES
('Asset', 'noun', 'Anything you own that has value or can generate money for you.', 'A laptop you bought for ₦150,000 is an asset.', '["Liability", "Net Worth"]'),
('Budget', 'noun', 'A plan for how you will spend your money over a period of time.', 'My monthly budget is ₦40,000.', '["Expense", "Income"]'),
('Cash Flow', 'noun', 'The movement of money coming in and going out of your account.', 'My cash flow was negative because I spent more than my allowance.', '["Income", "Expense"]'),
('Compound Interest', 'noun', 'Interest that is calculated on both the initial amount and previously earned interest.', 'Saving ₦5,000 monthly at 10% compound interest grows significantly faster than simple interest.', '["Interest", "Savings"]'),
('Credit Score', 'noun', 'A number that represents how trustworthy you are with borrowed money.', 'A high credit score helps you get loans more easily.', '["Debt", "Loan"]'),
('Debt', 'noun', 'Money you owe to someone else.', 'I have a debt of ₦2,000 from borrowing transport money.', '["Loan", "Credit Score"]'),
('Depreciation', 'noun', 'The decrease in value of something over time.', 'The value of a used phone depreciates every year.', '["Asset", "Appreciation"]'),
('Dividend', 'noun', 'A share of profit paid to investors in a company.', 'My stock paid me a dividend of ₦500 this quarter.', '["Stock", "Investment"]'),
('Emergency Fund', 'noun', 'Savings set aside specifically for unexpected expenses.', 'My emergency fund covered my sudden medical bill of ₦15,000.', '["Savings", "Budget"]'),
('Equity', 'noun', 'The value you own in something after debts are subtracted.', 'I have equity in my business after paying off my startup loan.', '["Asset", "Debt"]'),
('Expense', 'noun', 'Money you spend on goods or services.', 'My food expense this week was ₦3,500.', '["Budget", "Income"]'),
('Income', 'noun', 'Money you earn or receive regularly.', 'My monthly income from my parents is ₦50,000.', '["Expense", "Cash Flow"]'),
('Inflation', 'noun', 'The general rise in prices over time that reduces what your money can buy.', 'Due to inflation, garri that cost ₦800 last year now costs ₦1,200.', '["Savings", "Investment"]'),
('Interest', 'noun', 'The extra cost you pay when borrowing money, or earn when saving.', 'I paid ₦200 in interest on my ₦2,000 loan.', '["Debt", "Savings"]'),
('Investment', 'noun', 'Putting your money into something with the expectation of getting more back later.', 'I invested ₦10,000 in a mutual fund.', '["Asset", "Stock"]'),
('Liability', 'noun', 'A debt or obligation you owe to someone else.', 'My phone loan is a liability I must pay back monthly.', '["Debt", "Asset"]'),
('Loan', 'noun', 'Money you borrow that must be paid back, usually with interest.', 'I took a ₦5,000 loan from my roommate to pay for registration.', '["Debt", "Interest"]'),
('Net Worth', 'noun', 'The total value of what you own (assets) minus what you owe (liabilities).', 'My net worth is ₦80,000: assets of ₦100,000 minus debts of ₦20,000.', '["Asset", "Liability"]'),
('Savings', 'noun', 'Money you keep aside from your income instead of spending it.', 'I put ₦5,000 into my savings this month.', '["Budget", "Emergency Fund"]'),
('Stock', 'noun', 'A share of ownership in a company. If the company grows, your stock value increases.', 'I bought stock in Dangote Cement for ₦500 per share.', '["Investment", "Dividend"]'),
('Tax', 'noun', 'Money collected by the government from your income or purchases.', 'VAT (Value Added Tax) is added to most goods you buy in Nigeria.', '["Income", "Expense"]'),
('Transaction', 'noun', 'Any exchange of money — either sending or receiving.', 'I made 5 transactions today: breakfast, transport, data, lunch, and snacks.', '["Income", "Expense"]'),
('Appreciation', 'noun', 'The increase in value of something over time.', 'Land in Ile-Ife has appreciated significantly over the last 10 years.', '["Asset", "Depreciation"]'),
('Allowance', 'noun', 'A fixed amount of money given regularly, usually by parents to a student.', 'My monthly allowance is ₦45,000.', '["Income", "Budget"]'),
('Balance', 'noun', 'The amount of money remaining in your account at any given time.', 'My account balance after spending on food is ₦12,500.', '["Cash Flow", "Expense"]');
```

---

### A6 — Get Your Supabase Credentials

Go to **Settings > API** in Supabase and note down:

```
SUPABASE_URL = https://your-project-id.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1Ni...  (only for admin web app)
```

> Keep the `service_role` key secret — it bypasses all security. Never put it in the mobile app.

---

## PART B — REACT NATIVE APP INTEGRATION

### B1 — Install Supabase in Your React Native Project

In your terminal, inside your `campuskobo` project folder, run:

```bash
npx expo install @supabase/supabase-js
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-url-polyfill
```

---

### B2 — Create the Supabase Client

Create the file `/src/lib/supabase.ts`:

```typescript
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://your-project-id.supabase.co'; // replace with yours
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // replace with yours

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

### B3 — Create the Learning Service

Create the file `/src/services/LearningService.ts`. Paste this instruction into your coding agent:

> "Create `/src/services/LearningService.ts`. This file handles all Supabase queries for the Learning feature. Import `supabase` from `/src/lib/supabase`.
>
> Create these async functions:
>
> **getAllCategories()** — fetches all rows from `learning_categories`, ordered by name. Returns array or empty array on error.
>
> **getAllContent(categorySlug?: string)** — fetches from `learning_content` joined with `learning_categories`. If categorySlug is provided, filter by that category. Exclude Finance 101 series (filter out category name 'Finance 101'). Order by created_at descending.
>
> **getFeaturedContent()** — fetches where `is_featured = true`, limit 1.
>
> **getFinance101Series()** — fetches all content from category 'Finance 101', ordered by episode_number ascending.
>
> **getContentById(id: string)** — fetches a single content item by its id.
>
> **getGlossaryTerms(searchQuery?: string)** — fetches all glossary terms. If searchQuery is provided, filter where term ILIKE `%searchQuery%`. Order by term ascending.
>
> **getTermOfDay()** — fetches where `is_term_of_day = true`, limit 1. If none, fetch first term alphabetically.
>
> **getUserProgress(userId: string)** — fetches all progress rows for this userId from `user_content_progress`.
>
> **updateUserProgress(userId: string, contentId: string, status: string, percent: number)** — upserts into `user_content_progress`. Use onConflict: 'user_id,content_id'.
>
> **getUserBookmarks(userId: string)** — fetches all bookmark rows for this userId.
>
> **toggleBookmark(userId: string, contentId: string, isBookmarked: boolean)** — if isBookmarked is true, delete the bookmark. If false, insert a new bookmark.
>
> All functions should use try/catch and return null or empty array on error. Log errors to console."

---

### B4 — Create the Learning Context

Create the file `/src/context/LearningContext.tsx`. Paste into your coding agent:

> "Create `/src/context/LearningContext.tsx`. This context manages all learning data in memory.
>
> State it should hold:
> - `categories` — array of learning categories
> - `allContent` — all non-Finance-101 content
> - `finance101Series` — the 8 Finance 101 episodes
> - `glossaryTerms` — all glossary terms
> - `userProgress` — map of contentId → progress object
> - `bookmarks` — array of bookmarked content ids
> - `isLoadingLearning` — boolean
> - `selectedCategory` — currently filtered category slug (null = All)
>
> Functions it exposes:
> - `loadLearningData()` — calls LearningService to populate all state above
> - `setSelectedCategory(slug)` — sets the filter
> - `getFilteredContent()` — returns allContent filtered by selectedCategory
> - `markContentProgress(contentId, status, percent)` — calls LearningService.updateUserProgress
> - `toggleBookmark(contentId)` — calls LearningService.toggleBookmark and updates local state
> - `isBookmarked(contentId)` — returns boolean
> - `getProgressForContent(contentId)` — returns the progress object or null
> - `searchGlossary(query)` — filters glossaryTerms by query in component state
>
> Call `loadLearningData()` on mount with `useEffect`.
> Add `LearningContextProvider` to `App.tsx` wrapping the app alongside `AppContextProvider`."

---

### B5 — Update LearningHubScreen to Use Real Data

Paste this instruction into your coding agent:

> "Update `/src/screens/learning/LearningHubScreen.tsx` to replace all hardcoded data with real data from `useLearningContext()`.
>
> Changes to make:
>
> 1. Import and use `useLearningContext`
> 2. Category filter chips — map over `context.categories` instead of hardcoded array
> 3. Featured content card — use `context.allContent.find(c => c.is_featured)` instead of hardcoded
> 4. Finance 101 section — map over `context.finance101Series` instead of hardcoded episodes
> 5. Latest content list — use `context.getFilteredContent()` instead of hardcoded list
> 6. Show `isLoadingLearning` spinner while data loads
> 7. When a category chip is tapped, call `context.setSelectedCategory(slug)` — passing null for 'All'
>
> Keep all navigation and UI logic the same — only replace the data sources."

---

### B6 — Update LearningContentDetailScreen

Paste into your coding agent:

> "Update `/src/screens/learning/LearningContentDetailScreen.tsx`:
>
> 1. The bookmark icon should call `context.toggleBookmark(content.id)` on press
> 2. The icon should be filled (bookmark) if `context.isBookmarked(content.id)` is true, outlined if false
> 3. When the user reaches the bottom of an article (ScrollView onScroll), call `context.markContentProgress(content.id, 'completed', 100)`
> 4. On mount, call `context.markContentProgress(content.id, 'in_progress', 10)` to start tracking
> 5. The reading progress bar value should update as the user scrolls (calculate scroll position / total content height)"

---

### B7 — Update Finance101SeriesScreen

Paste into your coding agent:

> "Update `/src/screens/learning/Finance101SeriesScreen.tsx`:
>
> 1. Load episodes from `context.finance101Series` instead of hardcoded data
> 2. For each episode, check `context.getProgressForContent(episode.id)` to determine the status icon:
>    - status === 'completed' → ✅
>    - status === 'in_progress' → ▶️
>    - null/not_started → ○
>    - Locked if previous episode is not completed → 🔒
> 3. Calculate overall completion: count how many episodes have status 'completed' out of 8
> 4. Show correct motivational message based on completion percentage
> 5. 'Continue where you left off' card should show the first in_progress episode, or the next locked episode after the last completed one"

---

### B8 — Update GlossaryScreen

Paste into your coding agent:

> "Update `/src/screens/learning/GlossaryScreen.tsx`:
>
> 1. Load all terms from `context.glossaryTerms` instead of hardcoded list
> 2. 'Term of the Day' — fetch from `LearningService.getTermOfDay()` on mount
> 3. Search bar — on change, call `context.searchGlossary(query)` and display filtered results
> 4. Alphabet filter — filter terms client-side from the full list
> 5. The 'Suggest a term' submit button — show alert 'Thank you! We will review your suggestion' (no backend needed yet)"

---

## PART C — ADMIN WEB APP

This is a separate mini-website (not part of the phone app) where BOF OAU editors can manage all learning content without touching code.

### C1 — Create the Admin Web App Project

In a **new separate folder** (outside the campuskobo app folder), open your terminal and run:

```bash
npx create-react-app campuskobo-admin --template typescript
cd campuskobo-admin
npm install @supabase/supabase-js
npm install react-router-dom
npm install @tailwindcss/forms tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### C2 — Set Up Supabase Admin Client

Create `/src/lib/supabase.ts` in the admin app:

```typescript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://your-project-id.supabase.co';
// Use SERVICE ROLE key here — this is safe because only you access this admin site
const SUPABASE_SERVICE_KEY = 'your-service-role-key-here';

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
```

> This admin app should never be publicly deployed. Run it locally on your laptop only.

---

### C3 — Build the Admin App Pages

Paste this instruction into your coding agent (this is for the admin web app, not the phone app):

> "Build a simple React admin web app with these pages. Use Tailwind CSS for styling. All pages connect to Supabase using the supabase client.
>
> **Page 1 — Login (/login)**
> Simple email + password form. Only pre-approved emails can log in. On submit, use `supabase.auth.signInWithPassword()`. On success redirect to /dashboard.
>
> **Page 2 — Dashboard (/dashboard)**
> Shows 4 stat cards at the top:
> - Total Content pieces (count from learning_content)
> - Total Categories (count from learning_categories)
> - Total Glossary Terms (count from glossary_terms)
> - Finance 101 Episodes (count where category = Finance 101)
>
> Below stats: two columns showing the 5 most recently added content items and a quick-add button linking to /content/new.
>
> **Page 3 — Content List (/content)**
> A table showing all content from learning_content table with columns: ID, Title, Type (badge: Article/Video/Podcast), Category, Duration, Featured (yes/no badge), Date Added. Each row has Edit and Delete buttons. Delete shows a confirm dialog before deleting. Search bar at top filters rows by title. 'Add New Content' green button links to /content/new.
>
> **Page 4 — Add/Edit Content (/content/new and /content/:id/edit)**
> A form with these fields:
> - ID (text input, required, e.g. art-003. Disabled in edit mode.)
> - Title (text input, required)
> - Type (select: article / video / podcast)
> - Category (dropdown populated from learning_categories table)
> - Duration (text input, e.g. '3 min read' or '5 min')
> - Episode Number (number input, only shown if category is Finance 101)
> - Is Featured (checkbox toggle)
> - Content Body (large textarea, the article/podcast description text)
> - Key Takeaways (dynamic list: text inputs with Add and Remove buttons. Saves as JSON array.)
> - Related Content IDs (text input, comma-separated, converts to JSON array on save)
>
> On submit: if new, use `supabase.from('learning_content').insert()`. If editing, use `.update()`. On success show green success banner and redirect to /content.
>
> **Page 5 — Categories (/categories)**
> Table showing all categories. Each row has Edit and Delete buttons. 'Add Category' button opens a modal form with: Name, Slug (auto-generated from name), Description, Icon Name fields.
>
> **Page 6 — Glossary (/glossary)**
> Table showing all glossary terms with columns: Term, Part of Speech, Definition (truncated), Actions. 'Add Term' button opens a modal form with: Term, Part of Speech (select: noun/verb/adjective), Definition (textarea), Example, Related Terms (comma-separated), Is Term of Day (checkbox — only one can be active at a time).
>
> **Sidebar navigation:**
> Fixed left sidebar with links to: Dashboard, Content, Categories, Glossary, and Logout button at the bottom."

---

### C4 — Run the Admin App Locally

1. In the `campuskobo-admin` folder, run: `npm start`
2. It opens in your browser at `http://localhost:3000`
3. Log in with your Supabase admin email/password
4. You can now add, edit, and delete content — and it instantly updates in the phone app

---

### C5 — Create an Admin User in Supabase

1. Go to your Supabase project
2. Click **Authentication** in the left sidebar
3. Click **Add user**
4. Enter your email and a strong password
5. Click **Create user**
6. This is the login you will use in the admin web app

---

## PART D — CONNECTING EVERYTHING (Final Wiring)

### D1 — Environment Variables

In your phone app (`campuskobo`), create a `.env` file at the root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Update `/src/lib/supabase.ts` to use:

```typescript
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
```

Add `.env` to your `.gitignore` file so you never accidentally push your keys to GitHub.

---

### D2 — Add `.gitignore` entries

Open `.gitignore` in the campuskobo root and make sure these lines exist:

```
.env
.env.local
node_modules/
```

---

### D3 — Handle Offline / No Internet

Since CampusKobo is offline-first for financial data, but the Learning Hub requires internet, wrap all LearningService calls with a network check. Paste into your coding agent:

> "In `LearningContext.tsx`, before calling `loadLearningData()`, check if the device has internet using `NetInfo` from `@react-native-community/netinfo`. Install it with `npx expo install @react-native-community/netinfo`.
>
> If no internet:
> - Set a state variable `isOffline = true`
> - Do not make Supabase calls (they will fail)
> - Show a banner at the top of LearningHubScreen saying 'You are offline. Connect to the internet to access Learning Hub.'
>
> If internet is available:
> - Proceed with loading data normally
> - Set `isOffline = false`"

---

### D4 — Cache Learning Content Locally

To avoid loading spinners every time, cache learning content in AsyncStorage. Paste into your coding agent:

> "In `LearningContext.tsx`, after successfully loading data from Supabase, save it to AsyncStorage with key `campuskobo_learning_cache` as a JSON string. Include a `cachedAt` timestamp.
>
> On next app open, before calling Supabase:
> 1. Check AsyncStorage for `campuskobo_learning_cache`
> 2. If found and `cachedAt` was less than 24 hours ago, use the cached data immediately to populate state (no spinner shown)
> 3. Then still call Supabase in the background to refresh the cache silently
> 4. If no cache or cache is stale, show loading spinner and fetch fresh data"

---

## PART E — COMPLETE STEP-BY-STEP CHECKLIST

Work through these in order. Check each one off before moving to the next.

### Phase 1 — Supabase Setup
- [ ] Create Supabase project
- [ ] Copy Project URL and anon key
- [ ] Run the learning schema SQL (tables + seed data)
- [ ] Run the additional tables SQL (glossary, progress, bookmarks)
- [ ] Run the RLS policies SQL
- [ ] Run the glossary seed data SQL
- [ ] Create admin user in Supabase Authentication
- [ ] Verify all tables show data in Supabase Table Editor

### Phase 2 — Phone App Backend Connection
- [ ] Install `@supabase/supabase-js` in Expo project
- [ ] Install `react-native-url-polyfill`
- [ ] Create `/src/lib/supabase.ts` with your credentials
- [ ] Create `.env` file with credentials
- [ ] Add `.env` to `.gitignore`
- [ ] Create `/src/services/LearningService.ts` with all query functions
- [ ] Test each LearningService function individually (console.log results)

### Phase 3 — Phone App Context and Screens
- [ ] Create `/src/context/LearningContext.tsx`
- [ ] Add `LearningContextProvider` to `App.tsx`
- [ ] Update `LearningHubScreen` to use real data
- [ ] Update `LearningContentDetailScreen` with bookmarks and progress
- [ ] Update `Finance101SeriesScreen` with real episodes and progress tracking
- [ ] Update `GlossaryScreen` with real terms and search
- [ ] Update `PodcastNewsletterScreen` with real podcast content
- [ ] Add offline detection and offline banner
- [ ] Add local caching of learning content

### Phase 4 — Admin Web App
- [ ] Create `campuskobo-admin` React project
- [ ] Install dependencies (supabase-js, react-router-dom, tailwindcss)
- [ ] Create Supabase admin client with service role key
- [ ] Build Login page
- [ ] Build Dashboard page with stats
- [ ] Build Content List page (table + search)
- [ ] Build Add/Edit Content form
- [ ] Build Categories page
- [ ] Build Glossary management page
- [ ] Build Sidebar navigation
- [ ] Test adding a new article and verify it appears in the phone app

### Phase 5 — Polish and Test
- [ ] Test loading state (spinner shows while fetching)
- [ ] Test offline state (banner shows without internet)
- [ ] Test caching (content loads instantly on second open)
- [ ] Test bookmarking content and verifying it persists
- [ ] Test Finance 101 progress (complete episodes unlock next ones)
- [ ] Test category filter in Learning Hub
- [ ] Test glossary search
- [ ] Test 'Apply What You Learned' CTAs (navigate to Budget/Savings screens)

---

## PART F — QUICK REFERENCE

### Supabase Table Summary

| Table | Purpose |
|---|---|
| `learning_categories` | Categories like Budgeting, Saving, Investing |
| `learning_content` | All articles, videos, podcasts, Finance 101 episodes |
| `glossary_terms` | The 25+ financial glossary definitions |
| `user_content_progress` | Tracks which content each user has read/completed |
| `user_bookmarks` | Stores bookmarked content per user |

### Key File Locations

| File | Purpose |
|---|---|
| `/src/lib/supabase.ts` | Supabase client (phone app) |
| `/src/services/LearningService.ts` | All Supabase queries |
| `/src/context/LearningContext.tsx` | Global learning state |
| `/src/constants/learningData.ts` | (Can be deleted once Supabase is connected) |
| `campuskobo-admin/src/lib/supabase.ts` | Admin Supabase client (service role) |

### Flow: How Content Gets to the Student

```
BOF OAU Editor
     ↓ adds article on Admin Web App
Admin Web App
     ↓ inserts row into Supabase
Supabase Database
     ↓ student opens Learning Hub
CampusKobo Phone App
     ↓ LearningService.getAllContent() fetches it
LearningContext
     ↓ state updates
LearningHubScreen renders new article
```

---

## NOTES AND TIPS

**On the admin web app security:**
The admin web app only runs locally on your laptop. Never deploy it to a public URL unless you add proper authentication and hide the service role key in backend environment variables.

**On user IDs:**
Since CampusKobo uses local auth (no Supabase auth), use the user's `id` from your local `User` object in context as the `user_id` for progress and bookmark tracking. Make sure every new user gets a UUID assigned on signup.

**On the Finance 101 lock system:**
The sequential unlock is handled entirely on the phone app side — you just check if the previous episode has `status === 'completed'` in the user's progress data before allowing navigation.

**On content formatting:**
When you write article content in the admin app, you can use plain paragraphs separated by line breaks. The phone app will render them as separate `<Text>` blocks. Keep paragraphs short (3-5 sentences) for mobile readability.

---

_CampusKobo Learning Feature Guide — BOF OAU_
_Version 1.0 | May 2026_
