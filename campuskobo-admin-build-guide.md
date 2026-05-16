# CampusKobo Admin — Full Web App Build Instructions

> **Who this is for:** You, pasting this into your AI coding agent (Cursor, Claude, v0, etc.) to build the complete CampusKobo Admin Panel — a web app for BOF OAU editors to manage all learning content that appears in the CampusKobo student app.

---

## WHAT YOU ARE BUILDING

A sleek, modern admin dashboard web app built with **React + TypeScript + Vite + Tailwind CSS**, connected to **Supabase**. BOF OAU editors use this to add, edit, and delete articles, videos, podcasts, glossary terms, and categories — all of which instantly appear in the CampusKobo student mobile app.

---

## DESIGN DIRECTION

> Give this to your AI agent alongside every screen instruction so it maintains visual consistency.

**Brand:** CampusKobo by BOF OAU  
**Primary color:** `#1A9E3F` (dark green)  
**Accent:** `#22C55E` (light green)  
**Theme:** Dark sidebar + light main content area  
**Font:** Use `DM Sans` for body text and `DM Serif Display` for headings (import from Google Fonts)  
**Aesthetic:** Clean, editorial, data-dense but breathable. Think Notion meets Linear — confident whitespace, sharp typography, precise green accents. No gradients except subtle ones on stat cards. No rounded corners larger than `8px`. Tables are prominent and functional.

**Key UI rules:**

- Sidebar is always `#0F1923` (near-black) with white text
- Active nav item has a `#1A9E3F` left border + light green background highlight
- Buttons: primary = solid `#1A9E3F`, hover = `#16803A`, danger = `#DC2626`
- Badges: Article = blue, Video = purple, Podcast = orange, Featured = green
- All forms have floating labels or clearly spaced label-above-input patterns
- Success states are green toast notifications sliding in from the top right
- Delete confirmations are always modal dialogs — never browser `confirm()`

---

## PART 1 — PROJECT SETUP

### Step 1 — Bootstrap the Project

Paste into your agent:

> "Create a new React + TypeScript + Vite project called `campuskobo-admin`. After creating it, install the following dependencies:
>
> ```bash
> npm create vite@latest campuskobo-admin -- --template react-ts
> cd campuskobo-admin
> npm install
> npm install @supabase/supabase-js
> npm install react-router-dom
> npm install @tanstack/react-query
> npm install tailwindcss postcss autoprefixer
> npx tailwindcss init -p
> npm install lucide-react
> npm install react-hot-toast
> npm install date-fns
> npm install @radix-ui/react-dialog
> npm install @radix-ui/react-dropdown-menu
> npm install @radix-ui/react-select
> npm install @radix-ui/react-switch
> npm install @radix-ui/react-tooltip
> npm install clsx
> ```
>
> Configure `tailwind.config.js` to scan `./src/**/*.{ts,tsx}`.
>
> In `index.css`, import Google Fonts:
>
> ```css
> @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap");
> ```
>
> Set the default font in the Tailwind config's `theme.extend.fontFamily`:
>
> - `sans: ['DM Sans', 'sans-serif']`
> - `serif: ['DM Serif Display', 'serif']`"

---

### Step 2 — Folder Structure

Paste into your agent:

> "Create the following folder structure inside `/src`:
>
> - `/src/lib/` — for supabase client and utility helpers
> - `/src/types/` — for TypeScript interfaces
> - `/src/hooks/` — for custom React Query hooks
> - `/src/components/ui/` — for reusable base UI components (Button, Badge, Modal, Input, etc.)
> - `/src/components/layout/` — for Sidebar, TopBar, PageWrapper
> - `/src/pages/` — for all page components
> - `/src/pages/content/` — for content-specific pages
> - `/src/context/` — for AuthContext"

---

### Step 3 — TypeScript Types

Paste into your agent:

> "Create `/src/types/index.ts` with these TypeScript interfaces:
>
> ````typescript
> export interface LearningCategory {
>   id: string;
>   name: string;
>   slug: string;
>   description: string | null;
>   icon_name: string | null;
>   created_at: string;
> }
>
> export interface LearningContent {
>   id: string;
>   category_id: string | null;
>   type: 'article' | 'video' | 'podcast';
>   title: string;
>   duration: string | null;
>   content: string | null;
>   cover_image_url: string | null;
>   media_url: string | null;
>   is_featured: boolean;
>   key_takeaways: string[];
>   related_content_ids: string[];
>   episode_number: number | null;
>   created_at: string;
>   learning_categories?: LearningCategory;
> }
>
> export interface GlossaryTerm {
>   id: string;
>   term: string;
>   part_of_speech: string;
>   definition: string;
>   example: string | null;
>   related_terms: string[];
>   is_term_of_day: boolean;
>   created_at: string;
> }
>
> export interface DashboardStats {
>   totalContent: number;
>   totalCategories: number;
>   totalGlossaryTerms: number;
>   finance101Count: number;
>   featuredCount: number;
>   recentContent: LearningContent[];
> }
> ```"
> ````

---

### Step 4 — Supabase Client

Paste into your agent:

> "Create `/src/lib/supabase.ts`:
>
> ```typescript
> import { createClient } from "@supabase/supabase-js";
>
> const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
> const SUPABASE_SERVICE_KEY = import.meta.env
>   .VITE_SUPABASE_SERVICE_KEY as string;
>
> export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
> ```
>
> Create a `.env` file at the project root:
>
> ```
> VITE_SUPABASE_URL=https://your-project-id.supabase.co
> VITE_SUPABASE_SERVICE_KEY=your-service-role-key-here
> ```
>
> Add `.env` to `.gitignore`."

---

### Step 5 — Utility Helpers

Paste into your agent:

> "Create `/src/lib/utils.ts`:
>
> ````typescript
> import { clsx, type ClassValue } from 'clsx';
>
> export function cn(...inputs: ClassValue[]) {
>   return clsx(inputs);
> }
>
> export function slugify(text: string): string {
>   return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
> }
>
> export function truncate(text: string, max: number): string {
>   return text.length > max ? text.slice(0, max) + '...' : text;
> }
>
> export function formatDate(dateString: string): string {
>   return new Date(dateString).toLocaleDateString('en-NG', {
>     day: 'numeric', month: 'short', year: 'numeric'
>   });
> }
> ```"
> ````

---

## PART 2 — REUSABLE UI COMPONENTS

### Step 6 — Base UI Components

Paste into your agent:

> "Create the following base UI components in `/src/components/ui/`. Use Tailwind CSS for all styling. Follow the design direction (DM Sans font, green accent color `#1A9E3F`, sharp corners max `rounded-lg`).
>
> ---
>
> **`Button.tsx`** — accepts `variant` ('primary' | 'secondary' | 'danger' | 'ghost'), `size` ('sm' | 'md' | 'lg'), `loading` (boolean shows spinner), `disabled`, `onClick`, `children`, `type`. Primary = `bg-[#1A9E3F] text-white hover:bg-[#16803A]`. Danger = `bg-red-600 text-white hover:bg-red-700`. Ghost = transparent with border. All buttons have `transition-all duration-150 font-medium`.
>
> ---
>
> **`Badge.tsx`** — accepts `variant` ('article' | 'video' | 'podcast' | 'featured' | 'default' | 'success' | 'warning' | 'danger'), `children`. Article = blue background. Video = purple. Podcast = orange. Featured = green. All badges are pill-shaped (`rounded-full`) with small padding and uppercase tiny text.
>
> ---
>
> **`Input.tsx`** — text input with `label`, `error`, `hint`, `placeholder`, `value`, `onChange`, `type`, `disabled`, `required`. Label floats above. Red border + red error text if `error` prop provided. Green focus ring. Full width by default.
>
> ---
>
> **`Textarea.tsx`** — same as Input but multiline. Accepts `rows` prop. Min height 120px. Resize vertical only.
>
> ---
>
> **`Select.tsx`** — custom select dropdown using Radix UI Select. Accepts `label`, `options` (array of `{value, label}`), `value`, `onChange`, `placeholder`, `error`. Styled to match Input component.
>
> ---
>
> **`Modal.tsx`** — using Radix UI Dialog. Props: `open`, `onClose`, `title`, `description`, `children`, `size` ('sm' | 'md' | 'lg'). Dark overlay, white modal, X close button top right, title in serif font.
>
> ---
>
> **`ConfirmModal.tsx`** — extends Modal. Props: `open`, `onClose`, `onConfirm`, `title`, `message`, `confirmLabel` (default 'Delete'), `isLoading`. Shows Cancel and Confirm buttons. Confirm button is red for destructive actions.
>
> ---
>
> **`Table.tsx`** — a wrapper that provides consistent table styling. `thead` has light gray background. `tbody tr:hover` has very subtle highlight. Bottom border on each row. `th` text is uppercase tiny gray. Accepts `children`.
>
> ---
>
> **`EmptyState.tsx`** — centered empty state. Props: `icon` (Lucide icon component), `title`, `subtitle`, `actionLabel`, `onAction`. Large icon in light green circle, serif title, gray subtitle, optional green button.
>
> ---
>
> **`Spinner.tsx`** — animated green spinning circle. Props: `size` ('sm' | 'md' | 'lg'). Used inside buttons and page loading states.
>
> ---
>
> **`SearchBar.tsx`** — full-width search input with magnifier icon on left. Props: `value`, `onChange`, `placeholder`. Clear button appears on right when value is non-empty."

---

## PART 3 — LAYOUT COMPONENTS

### Step 7 — Sidebar

Paste into your agent:

> "Create `/src/components/layout/Sidebar.tsx`.
>
> Style: Fixed left sidebar, full screen height, `w-64`, background `#0F1923`, white text. No box shadow — instead a subtle 1px right border in `#1E2D3D`.
>
> **Top section:**
>
> - Logo area: green circle with 'CK' initials, then 'CampusKobo' in white bold, 'Admin' in small green text below
> - Thin horizontal divider below logo
>
> **Navigation items** (use `NavLink` from react-router-dom for active state detection):
>
> Each nav item has:
>
> - Icon on left (Lucide icon, 18px)
> - Label text
> - Active state: `bg-[#1A9E3F]/10 border-l-2 border-[#1A9E3F] text-[#22C55E]`
> - Inactive state: `text-gray-400 hover:text-white hover:bg-white/5`
> - Transition on hover
>
> Nav items in order:
>
> 1. `LayoutDashboard` icon — Dashboard — links to `/`
> 2. `FileText` icon — Content — links to `/content`
> 3. `Tag` icon — Categories — links to `/categories`
> 4. `BookOpen` icon — Glossary — links to `/glossary`
>
> **Bottom section** (pinned to bottom):
>
> - Divider
> - Logged-in user email in small gray text
> - LogOut icon + 'Logout' button in gray, turns red on hover
> - 'v1.1.0' version text in very small gray
>
> The sidebar should NOT collapse on desktop. On mobile, it slides in as a drawer (controlled by a toggle state from the parent layout)."

---

### Step 8 — Top Bar

Paste into your agent:

> "Create `/src/components/layout/TopBar.tsx`.
>
> Style: White background, bottom border `border-gray-200`, height `56px`, sticky at top of main content area.
>
> Content:
>
> - Left: Current page title (passed as prop) in bold DM Sans, 18px
> - Right: Row of items:
>   - 'Last synced: just now' in small gray text
>   - Refresh icon button (clicking shows a brief spinning state)
>   - Vertical divider
>   - User avatar circle (green circle with admin's initials, 32px)
>
> Props: `title` (string), `onRefresh` (function)"

---

### Step 9 — Page Layout Wrapper

Paste into your agent:

> "Create `/src/components/layout/AppLayout.tsx`.
>
> This is the root layout that wraps every authenticated page.
>
> Structure:
>
> ```
> <div class='flex h-screen bg-gray-50'>
>   <Sidebar />
>   <div class='flex-1 flex flex-col overflow-hidden'>
>     <TopBar title={pageTitle} />
>     <main class='flex-1 overflow-y-auto p-6'>
>       <Outlet />   // react-router outlet for child pages
>     </main>
>   </div>
> </div>
> ```
>
> Also create `/src/components/layout/PageHeader.tsx`:
>
> - Props: `title`, `subtitle`, `action` (optional ReactNode for a button)
> - Layout: title in serif font (24px), subtitle in gray below, action button floated right
> - Used at the top of every page body"

---

## PART 4 — AUTH

### Step 10 — Auth Context and Login Page

Paste into your agent:

> "Create `/src/context/AuthContext.tsx`.
>
> This context wraps the whole app and handles authentication via Supabase.
>
> State:
>
> - `user` — Supabase user object or null
> - `isLoading` — boolean
>
> On mount: call `supabase.auth.getSession()` to check if already logged in. Listen to `supabase.auth.onAuthStateChange()` for changes.
>
> Exposes:
>
> - `user`
> - `isLoading`
> - `logout()` — calls `supabase.auth.signOut()` then navigates to `/login`
>
> ---
>
> Create `/src/pages/LoginPage.tsx`.
>
> Full-screen layout — two columns on desktop, single column on mobile:
>
> **Left column (hidden on mobile):**
>
> - Background `#0F1923`
> - CampusKobo logo at top
> - Large serif quote in center: _'Empowering students to take control of their financial future.'_
> - Below quote: 'BOF OAU — Bureau of Finance, Obafemi Awolowo University'
> - Subtle green grid pattern overlay on the dark background using CSS (repeating-linear-gradient to make a faint grid)
>
> **Right column (form):**
>
> - White background
> - Centered form, max-width 380px
> - 'Admin Login' title in serif, 'Sign in to manage CampusKobo content' in gray subtitle
> - Email input
> - Password input with show/hide toggle
> - 'Sign in' primary button (full width, loading state while submitting)
> - Error message below button if login fails (red text with alert icon)
>
> On submit: call `supabase.auth.signInWithPassword({ email, password })`. On success: navigate to `/`. On error: show inline error message. Never use `alert()`.
>
> If user is already logged in (from AuthContext), redirect immediately to `/`."

---

### Step 11 — Route Protection

Paste into your agent:

> "Create `/src/components/ProtectedRoute.tsx`.
>
> This wraps all routes that require login.
>
> Logic:
>
> - If `isLoading` from AuthContext is true: show a full-screen centered green spinner
> - If `user` is null: redirect to `/login`
> - Otherwise: render `<Outlet />`
>
> Set up routing in `/src/main.tsx` or `/src/App.tsx`:
>
> ````
> /login         → LoginPage (no auth required)
> /              → ProtectedRoute → AppLayout → DashboardPage
> /content       → ProtectedRoute → AppLayout → ContentListPage
> /content/new   → ProtectedRoute → AppLayout → ContentFormPage (add mode)
> /content/:id/edit → ProtectedRoute → AppLayout → ContentFormPage (edit mode)
> /categories    → ProtectedRoute → AppLayout → CategoriesPage
> /glossary      → ProtectedRoute → AppLayout → GlossaryPage
> *              → redirect to /
> ```"
> ````

---

## PART 5 — DATA HOOKS

### Step 12 — React Query Hooks

Paste into your agent:

> "Create `/src/hooks/useContent.ts`, `/src/hooks/useCategories.ts`, and `/src/hooks/useGlossary.ts`. Use `@tanstack/react-query` for all data fetching. Wrap the app in `QueryClientProvider` in `main.tsx`.
>
> ---
>
> **`useContent.ts`** — export these hooks:
>
> `useAllContent()` — fetches all rows from `learning_content` with joined `learning_categories`. Query key: `['content']`.
>
> `useContentById(id: string)` — fetches single content item. Query key: `['content', id]`.
>
> `useAddContent()` — mutation that inserts a new row. On success: invalidate `['content']` query and show success toast 'Content added successfully'.
>
> `useUpdateContent()` — mutation that updates by id. On success: invalidate queries and show success toast.
>
> `useDeleteContent()` — mutation that deletes by id. On success: invalidate and show toast 'Content deleted'.
>
> ---
>
> **`useCategories.ts`** — export these hooks:
>
> `useAllCategories()` — fetches all rows from `learning_categories`. Query key: `['categories']`.
>
> `useAddCategory()` — insert mutation. Invalidate on success.
>
> `useUpdateCategory()` — update mutation.
>
> `useDeleteCategory()` — delete mutation.
>
> ---
>
> **`useGlossary.ts`** — export these hooks:
>
> `useAllGlossaryTerms()` — fetches all from `glossary_terms`. Query key: `['glossary']`.
>
> `useAddGlossaryTerm()` — insert mutation.
>
> `useUpdateGlossaryTerm()` — update mutation.
>
> `useDeleteGlossaryTerm()` — delete mutation.
>
> `useSetTermOfDay(id: string)` — mutation that: first sets ALL terms' `is_term_of_day = false`, then sets the selected term's `is_term_of_day = true`. Invalidate on success.
>
> ---
>
> **`useDashboard.ts`**:
>
> `useDashboardStats()` — fetches the following in parallel using `Promise.all`:
>
> - count of all learning_content
> - count of learning_categories
> - count of glossary_terms
> - count of Finance 101 content (category name = 'Finance 101')
> - count of featured content (is_featured = true)
> - 5 most recent content items (ordered by created_at desc, limit 5, with category join)
>
> Returns a single object with all stats. Query key: `['dashboard']`."

---

## PART 6 — DASHBOARD PAGE

### Step 13 — Dashboard Page

Paste into your agent:

> "Create `/src/pages/DashboardPage.tsx`.
>
> Use `useDashboardStats()` hook for all data. Show loading skeletons (gray animated pulsing rectangles using Tailwind `animate-pulse`) while loading.
>
> ---
>
> **Page header:**
>
> - `<PageHeader title='Dashboard' subtitle='Overview of your CampusKobo learning content' />`
>
> ---
>
> **Stat cards row — 5 cards in a grid (3 on first row, 2 on second, or all 5 on xl screens):**
>
> Each stat card:
>
> - White background, border, subtle shadow
> - Icon in a small colored circle (top left of card)
> - Large bold number (DM Serif Display font, 36px)
> - Label below number in gray
> - Subtle trend indicator (static, no calculation needed)
>
> Cards:
>
> 1. `FileText` icon (blue circle) — Total Content — `stats.totalContent`
> 2. `Tag` icon (green circle) — Categories — `stats.totalCategories`
> 3. `BookOpen` icon (purple circle) — Glossary Terms — `stats.totalGlossaryTerms`
> 4. `Star` icon (orange circle) — Featured — `stats.featuredCount`
> 5. `GraduationCap` icon (teal circle) — Finance 101 — `stats.finance101Count`
>
> ---
>
> **Two-column section below stats:**
>
> **Left column — 'Recent Content' table:**
>
> - Card with title 'Recently Added' + 'View all →' link to `/content`
> - Table showing last 5 content items: Title (truncated to 40 chars), Type badge, Category, Date Added
> - Each row is clickable and navigates to `/content/:id/edit`
>
> **Right column — 'Quick Actions' card:**
>
> - Title 'Quick Actions'
> - List of action items (each is a button that navigates):
>   - `+ Add Article` → `/content/new?type=article`
>   - `+ Add Video` → `/content/new?type=video`
>   - `+ Add Podcast` → `/content/new?type=podcast`
>   - `+ Add Glossary Term` → `/glossary` (with a `?addNew=true` param that auto-opens the modal)
>   - `+ Add Category` → `/categories?addNew=true`
> - Each action has a small colored icon on the left
>
> ---
>
> **Content Type Breakdown — simple visual summary:**
>
> - Below the two columns
> - Three horizontal bars (one for Article, Video, Podcast)
> - Each bar shows count and percentage of total
> - Articles = blue, Videos = purple, Podcasts = orange
> - Bar width is proportional to count (e.g. if 5 articles out of 10 total = 50% width)"

---

## PART 7 — CONTENT PAGES

### Step 14 — Content List Page

Paste into your agent:

> "Create `/src/pages/ContentListPage.tsx`.
>
> Use `useAllContent()` and `useAllCategories()` hooks.
>
> ---
>
> **Page header:**
> `<PageHeader title='Content' subtitle='Manage articles, videos, and podcasts' action={<Button onClick={() => navigate('/content/new')}>+ Add Content</Button>} />`
>
> ---
>
> **Filter and search bar row:**
>
> - `<SearchBar>` on the left (filters table by title in real-time, client-side)
> - Filter chips on the right: 'All Types' | 'Article' | 'Video' | 'Podcast' — clicking filters the table
> - Category filter dropdown: 'All Categories' + each category name as options
> - Total count text: '{n} items' in gray
>
> ---
>
> **Content table:**
>
> Use `<Table>` component. Columns:
>
> | Column     | Notes                                                 |
> | ---------- | ----------------------------------------------------- |
> | Title      | Bold, max 50 chars, clicking navigates to edit        |
> | Type       | `<Badge variant={type}>`                              |
> | Category   | Category name or '—' if none                          |
> | Duration   | e.g. '3 min read' or '—'                              |
> | Episode    | Episode number or '—' (only relevant for Finance 101) |
> | Featured   | Green dot ● if true, gray dot if false                |
> | Date Added | Formatted date                                        |
> | Actions    | Edit icon button + Delete icon button                 |
>
> - Table rows are clickable (navigates to edit page) — highlight on hover
> - Edit button: pencil icon, navigates to `/content/:id/edit`
> - Delete button: trash icon (red), opens `<ConfirmModal>` before deleting
> - Show `<EmptyState>` when no results match filters
> - Show loading skeletons while data loads (5 skeleton rows of same height as table rows)
>
> ---
>
> **Delete behavior:**
>
> - When trash icon is clicked: open `<ConfirmModal>` with title 'Delete Content?', message 'This will permanently remove '{title}' from the app. This cannot be undone.'
> - On confirm: call `useDeleteContent()` mutation
> - Show success toast on completion"

---

### Step 15 — Add/Edit Content Form Page

Paste into your agent:

> "Create `/src/pages/ContentFormPage.tsx`. This handles both adding new content and editing existing content.
>
> **Mode detection:**
>
> - If URL is `/content/new` → Add mode
> - If URL is `/content/:id/edit` → Edit mode. Fetch content by id using `useContentById(id)` and pre-fill the form on load.
> - If URL has `?type=article` query param → pre-select Article type tab
>
> ---
>
> **Page header:**
>
> - Add mode: `<PageHeader title='Add New Content' subtitle='Create a new article, video, or podcast' />`
> - Edit mode: `<PageHeader title='Edit Content' subtitle='Update this content item' />`
>
> ---
>
> **Form layout — two column layout on desktop:**
>
> **Left column (wider, ~65%):**
>
> Content type selector at the top — three tab-style buttons: 'Article' | 'Video' | 'Podcast'. Selected tab has green underline and bold text. Clicking changes the selected type. Disabled in edit mode.
>
> Then these form fields:
>
> 1. **Content ID** — `<Input label='Content ID' hint='e.g. art-003 or vid-002 — must be unique' required />` — disabled in edit mode. Show a warning below: 'This ID is permanent and cannot be changed after creation.'
> 2. **Title** — `<Input label='Title' placeholder='e.g. How to Stop Overspending as a Student' required />`
> 3. **Duration** — `<Input label='Duration' placeholder='e.g. 3 min read OR 5 min OR 12 min' hint='For articles write "X min read". For video/podcast write "X min".' />`
> 4. **Content Body** — `<Textarea label='Content Body' rows={10} placeholder='Write the full article content here. Separate paragraphs with a blank line.' />`
> 5. **Key Takeaways** — Dynamic list section:
>    - Label 'Key Takeaways' with hint 'Add 3–5 short bullet points'
>    - Each takeaway is a text input with a red trash icon on the right
>    - '+ Add Takeaway' link at the bottom that appends a new empty input
>    - On load in edit mode, pre-fill from the `key_takeaways` array
>    - Saves as a JSON string array to Supabase
> 6. **Related Content IDs** — `<Input label='Related Content IDs' placeholder='art-001, vid-002' hint='Comma-separated IDs of related content shown at the bottom of the detail screen' />`
>
> ---
>
> **Right column (narrower, ~35%):**
>
> This is a sticky sidebar-like panel.
>
> **Media Assets card:**
>
> - **Cover Image** — File upload field with image preview. Uploads to Supabase Storage `learning-assets` bucket and saves the URL to `cover_image_url`. Required for all content types.
> - **Media File** — File upload field for Video or Podcast files. Only shown if type is 'video' or 'podcast'. Uploads to `learning-assets` and saves the URL to `media_url`.
>
> **Publish Settings card:**
>
> - 'Category' — `<Select>` populated from `useAllCategories()`. If Finance 101 category is selected, show the Episode Number field below.
> - 'Episode Number' (conditional) — `<Input type='number' label='Episode Number' hint='For Finance 101 series only' />`
> - 'Featured' — `<Switch>` toggle with label 'Mark as Featured'. Only one item can be featured — if this is toggled on, show a warning: 'This will replace the current featured item.'
>
> **Danger Zone card (edit mode only):**
>
> - Red-bordered card
> - 'Delete this content' label in red
> - Small description: 'This permanently removes this content from the student app.'
> - 'Delete Content' danger button — opens ConfirmModal
>
> ---
>
> **Bottom action buttons (fixed to bottom of page or below the form):**
>
> - 'Cancel' ghost button — navigates back to `/content`
> - 'Save Changes' (edit mode) or 'Publish Content' (add mode) — primary green button with loading state
>
> ---
>
> **Validation before submitting:**
>
> - Content ID is required and must match pattern `/^[a-z0-9-]+$/` — show error if not
> - Title is required
> - Category must be selected
> - Show all validation errors inline (not via alert)
>
> ---
>
> **On successful submit:**
>
> - Show success toast: 'Content published!' or 'Changes saved!'
> - Navigate to `/content`"

---

**Note on File Uploads:**

Use `supabase.storage.from('learning-assets').upload()` to handle file uploads. Make sure the `learning-assets` bucket exists in your Supabase project and is set to **Public**. Generate a unique filename for each upload (e.g., `Date.now() + '-' + file.name`). Use the `getPublicUrl()` method to retrieve the URL to save into the database.

---

## PART 8 — CATEGORIES PAGE

### Step 16 — Categories Page

Paste into your agent:

> "Create `/src/pages/CategoriesPage.tsx`.
>
> Use `useAllCategories()` hook.
>
> ---
>
> **Page header:**
> `<PageHeader title='Categories' subtitle='Manage learning content categories' action={<Button onClick={openAddModal}>+ Add Category</Button>} />`
>
> If URL has `?addNew=true`, auto-open the add modal on page load.
>
> ---
>
> **Categories table:**
>
> Columns: Name (bold), Slug (gray monospace text), Description (truncated to 60 chars), Icon Name (gray code text), Date Added, Actions.
>
> Actions per row: Edit icon button + Delete icon button.
>
> Show empty state if no categories.
>
> ---
>
> **Add/Edit Category Modal** (uses `<Modal>` component):
>
> Title: 'Add Category' or 'Edit Category'
>
> Form fields inside modal:
>
> 1. **Name** — text input, required, full width
> 2. **Slug** — text input, auto-populated from name (show live preview as user types the name: 'budgeting' from 'Budgeting'), editable. Gray monospace font inside the input.
> 3. **Description** — textarea, optional, 3 rows
> 4. **Icon Name** — text input, hint: 'Use Ionicons icon names e.g. wallet-outline, book-outline'
>
> Buttons inside modal: 'Cancel' + 'Save Category' (loading state)
>
> On save:
>
> - Add mode: call `useAddCategory()` mutation
> - Edit mode: call `useUpdateCategory()` mutation
> - Show toast on success, close modal
>
> Delete behavior:
>
> - Open `<ConfirmModal>` with message: 'Deleting this category will remove it from all content that uses it. Are you sure?'
> - On confirm: call `useDeleteCategory()`"

---

## PART 9 — GLOSSARY PAGE

### Step 17 — Glossary Page

Paste into your agent:

> "Create `/src/pages/GlossaryPage.tsx`.
>
> Use `useAllGlossaryTerms()` hook.
>
> If URL has `?addNew=true`, auto-open the add modal.
>
> ---
>
> **Page header:**
> `<PageHeader title='Glossary' subtitle='Manage financial terms shown in the student app' action={<Button onClick={openAddModal}>+ Add Term</Button>} />`
>
> ---
>
> **Search and filter bar:**
>
> - `<SearchBar>` filters the term list client-side by term name
> - Alphabet filter row: A–Z letter buttons (small, pill-shaped). Clicking a letter filters to show only terms starting with that letter. 'All' chip resets.
> - Total count: '{n} terms' in gray
>
> ---
>
> **Terms table:**
>
> Columns:
>
> | Column         | Notes                                                                                                                                   |
> | -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
> | Term           | Bold, sorted A-Z                                                                                                                        |
> | Part of Speech | Gray italic (noun, verb, etc.)                                                                                                          |
> | Definition     | Truncated to 80 characters                                                                                                              |
> | Term of Day    | Sun ☀️ icon if `is_term_of_day = true`, dash if not. Clicking the icon on any row calls `useSetTermOfDay()` to make it the term of day. |
> | Related Terms  | Shown as small gray comma-separated tags                                                                                                |
> | Date Added     | Formatted date                                                                                                                          |
> | Actions        | Edit + Delete icon buttons                                                                                                              |
>
> Show `<EmptyState>` when no results.
>
> ---
>
> **Add/Edit Term Modal:**
>
> Title: 'Add Term' or 'Edit Term'
>
> Fields:
>
> 1. **Term** — text input, required
> 2. **Part of Speech** — `<Select>` with options: noun, verb, adjective, phrase
> 3. **Definition** — textarea (3 rows), required, hint: 'Write in plain English. Avoid jargon.'
> 4. **Example** — textarea (2 rows), optional, hint: 'Use a real Nigerian student example with ₦ amounts'
> 5. **Related Terms** — text input, placeholder 'Budget, Income, Savings', hint: 'Comma-separated terms that are related'
> 6. **Term of the Day** — `<Switch>` toggle. If turned on: show warning 'This will replace the current Term of the Day.'
>
> Buttons: 'Cancel' + 'Save Term'
>
> On save:
>
> - If 'Term of Day' was toggled on: call `useSetTermOfDay()` after saving
> - Otherwise call regular add/update mutation
>
> Delete behavior:
>
> - `<ConfirmModal>` with message: 'Are you sure you want to delete the term '{term}'? It will be removed from the app immediately.'
> - On confirm: call `useDeleteGlossaryTerm()`"

---

## PART 10 — NOTIFICATIONS AND FINISHING TOUCHES

### Step 18 — Toast Notifications

Paste into your agent:

> "Set up `react-hot-toast` in the app.
>
> In `main.tsx` or `App.tsx`, add `<Toaster>` with this configuration:
>
> ```typescript
> <Toaster
>   position='top-right'
>   toastOptions={{
>     duration: 3000,
>     style: {
>       background: '#fff',
>       color: '#0F1923',
>       borderRadius: '6px',
>       border: '1px solid #E5E7EB',
>       boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
>       fontFamily: 'DM Sans, sans-serif',
>       fontSize: '14px',
>     },
>     success: {
>       iconTheme: { primary: '#1A9E3F', secondary: '#fff' },
>     },
>     error: {
>       iconTheme: { primary: '#DC2626', secondary: '#fff' },
>     },
>   }}
> />
> ```
>
> All React Query mutation `onSuccess` and `onError` callbacks should use:
>
> - `toast.success('...')` for success
> - `toast.error('...')` for errors"

---

### Step 19 — 404 Page

Paste into your agent:

> "Create `/src/pages/NotFoundPage.tsx`.
>
> Centered layout, full screen height.
>
> Content:
>
> - Large '404' in DM Serif Display font, `#1A9E3F` color, very large (120px)
> - 'Page not found' in bold below
> - Gray subtitle: 'The page you are looking for does not exist.'
> - 'Go to Dashboard' primary button that navigates to `/`"

---

### Step 20 — Final App.tsx Wiring

Paste into your agent:

> "Update `/src/App.tsx` to wire everything together:
>
> ````typescript
> import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
> import { BrowserRouter, Routes, Route } from 'react-router-dom';
> import { Toaster } from 'react-hot-toast';
> import { AuthProvider } from './context/AuthContext';
> import ProtectedRoute from './components/ProtectedRoute';
> import AppLayout from './components/layout/AppLayout';
> import LoginPage from './pages/LoginPage';
> import DashboardPage from './pages/DashboardPage';
> import ContentListPage from './pages/ContentListPage';
> import ContentFormPage from './pages/ContentFormPage';
> import CategoriesPage from './pages/CategoriesPage';
> import GlossaryPage from './pages/GlossaryPage';
> import NotFoundPage from './pages/NotFoundPage';
>
> const queryClient = new QueryClient();
>
> export default function App() {
>   return (
>     <QueryClientProvider client={queryClient}>
>       <AuthProvider>
>         <BrowserRouter>
>           <Routes>
>             <Route path='/login' element={<LoginPage />} />
>             <Route element={<ProtectedRoute />}>
>               <Route element={<AppLayout />}>
>                 <Route path='/' element={<DashboardPage />} />
>                 <Route path='/content' element={<ContentListPage />} />
>                 <Route path='/content/new' element={<ContentFormPage />} />
>                 <Route path='/content/:id/edit' element={<ContentFormPage />} />
>                 <Route path='/categories' element={<CategoriesPage />} />
>                 <Route path='/glossary' element={<GlossaryPage />} />
>               </Route>
>             </Route>
>             <Route path='*' element={<NotFoundPage />} />
>           </Routes>
>         </BrowserRouter>
>         <Toaster position='top-right' />
>       </AuthProvider>
>     </QueryClientProvider>
>   );
> }
> ```"
> ````

---

## PART 11 — SETUP AND RUNNING

### Step 21 — Package.json Scripts

Paste into your agent:

> "Ensure `package.json` has these scripts:
>
> ```json
> {
>   \"scripts\": {
>     \"dev\": \"vite\",
>     \"build\": \"tsc && vite build\",
>     \"preview\": \"vite preview\"
>   }
> }
> ```
>
> Create a `README.md` with setup instructions:
>
> ## CampusKobo Admin Panel
>
> ### Setup
>
> 1. Clone the repository
> 2. Run `npm install`
> 3. Create `.env` file:
>    ```
>    VITE_SUPABASE_URL=https://your-project-id.supabase.co
>    VITE_SUPABASE_SERVICE_KEY=your-service-role-key
>    ```
> 4. Run `npm run dev`
> 5. Open `http://localhost:5173`
> 6. Log in with your Supabase admin credentials
>
> ### Available Pages
>
> - `/` — Dashboard with content stats
> - `/content` — Manage all articles, videos, podcasts
> - `/content/new` — Add new content
> - `/categories` — Manage categories
> - `/glossary` — Manage glossary terms"

---

## COMPLETE BUILD CHECKLIST

Work through these in order:

### Phase 1 — Setup

- [ ] Create Vite React TS project
- [ ] Install all dependencies
- [ ] Configure Tailwind CSS with Google Fonts
- [ ] Create `.env` file with Supabase credentials
- [ ] Set up folder structure

### Phase 2 — Core Infrastructure

- [ ] Create TypeScript types (`/src/types/index.ts`)
- [ ] Create Supabase client (`/src/lib/supabase.ts`)
- [ ] Create utility helpers (`/src/lib/utils.ts`)
- [ ] Create AuthContext + logout
- [ ] Create ProtectedRoute component
- [ ] Wire up routing in App.tsx

### Phase 3 — UI Components

- [ ] Button component (all variants + loading state)
- [ ] Badge component (all type variants)
- [ ] Input component (with label + error)
- [ ] Textarea component
- [ ] Select component (Radix UI)
- [ ] Modal component (Radix UI Dialog)
- [ ] ConfirmModal component
- [ ] Table component
- [ ] EmptyState component
- [ ] Spinner component
- [ ] SearchBar component

### Phase 4 — Layout

- [ ] Sidebar (with active nav state)
- [ ] TopBar (with page title)
- [ ] AppLayout (Sidebar + TopBar + Outlet)
- [ ] PageHeader component

### Phase 5 — Data Hooks

- [ ] useDashboard hook
- [ ] useContent hooks (all CRUD)
- [ ] useCategories hooks (all CRUD)
- [ ] useGlossary hooks (all CRUD + setTermOfDay)
- [ ] Set up QueryClientProvider in App.tsx
- [ ] Set up react-hot-toast in App.tsx

### Phase 6 — Pages

- [ ] LoginPage (two-column layout)
- [ ] DashboardPage (stat cards + recent content + quick actions)
- [ ] ContentListPage (table + filters + search + delete)
- [ ] ContentFormPage (add + edit + validation)
- [ ] CategoriesPage (table + add/edit modal)
- [ ] GlossaryPage (table + alphabet filter + add/edit modal)
- [ ] NotFoundPage

### Phase 7 — Test Everything

- [ ] Login with Supabase credentials works
- [ ] Dashboard stats load from Supabase
- [ ] Adding a new article saves to Supabase and appears in list
- [ ] Editing an article pre-fills form and saves changes
- [ ] Deleting content shows confirm modal and removes from list
- [ ] Adding a category works and appears in content form dropdown
- [ ] Editing a glossary term pre-fills modal
- [ ] Setting Term of Day replaces previous one
- [ ] Logout clears session and redirects to login
- [ ] New content added here appears immediately in CampusKobo phone app

---

## QUICK REFERENCE — Technology Decisions

| Decision      | Choice                     | Reason                             |
| ------------- | -------------------------- | ---------------------------------- |
| Framework     | React + Vite + TypeScript  | Fast, modern, great DX             |
| Styling       | Tailwind CSS               | Consistent design tokens           |
| Routing       | React Router v6            | Standard, well-supported           |
| Data fetching | TanStack React Query       | Caching, loading states, mutations |
| Database      | Supabase                   | Already used in the project        |
| Icons         | Lucide React               | Clean, consistent icons            |
| Modals        | Radix UI Dialog            | Accessible, unstyled base          |
| Toasts        | react-hot-toast            | Simple, clean notifications        |
| Fonts         | DM Sans + DM Serif Display | Editorial, modern character        |

---

_CampusKobo Admin Build Guide — BOF OAU_  
_Version 1.1 | May 2026_
