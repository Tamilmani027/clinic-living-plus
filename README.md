# Clinic Living Plus 

**Clinic Living Plus** is a modern outpatient desk and appointment management web application designed for clinics and healthcare practitioners. It streamlines patient scheduling, physician assignments, appointment tracking, and automated clinical summaries.

---

## Technologies Used

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom medical-grade design tokens
- **Icons**: [FontAwesome](https://fontawesome.com/) (`@fortawesome/react-fontawesome`, `@fortawesome/free-solid-svg-icons`)
- **Database & Backend**: [Supabase](https://supabase.com/) (PostgreSQL) with client-side dual-layer caching (`localStorage`)
- **AI Clinical Summaries**: [Groq API](https://groq.com/) for fast AI-generated symptom & visit notes

---

## Key Features

- **Quick Appointment Booking**: Input validation, doctor selection, time slot picking, and Indian phone number formatting (`+91 XXXXX-XXXXX`).
- **Data Persistence**: Dual-layer architecture syncing to Supabase with browser `localStorage` caching so records and active drafts never disappear on page refresh.
- **Appointment Roster & Filters**: Real-time status filtering (All, Upcoming, Completed, Canceled), one-click status updates, and record removal.
- **Doctor Directory**: Consultant profiles, specialties, patient ratings, and next-available consultation slots.
- **Responsive Layout**: Designed for mobile and desktop screens with a slide-out hamburger navigation menu.

---

##  Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18.18 or higher recommended)
- `npm`, `pnpm`, or `yarn`

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Tamilmani027/clinic-living-plus.git
cd clinic-living-plus
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Clinical Summary Generation (Optional)
GROQ_API_KEY=your_groq_api_key
```

> **Note**: Database table schema SQL is available in `supabase/schema.sql`.

### 4. Running the Development Server

Start the local dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Build for Production

To create an optimized production build:

```bash
npm run build
npm start
```
