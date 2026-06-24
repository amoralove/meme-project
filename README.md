# Wescue

**Find your perfect rescue dog. No breeders. No puppy mills. Ever.**

Wescue is an AI-powered adoption platform that matches people with verified shelter dogs based on their lifestyle — not just breed or looks.

## What's Here

| File | What It Is |
|------|-----------|
| `index.html` | Landing page with interactive AI chat demo |
| `style.css` | Hand-drawn green theme (Kalam + Patrick Hand fonts) |
| `app.js` | Chat flow, matching algorithm, dog carousel |
| `WESCUE_DESIGN.md` | Full design document (strategy, architecture, roadmap, risks) |

## Getting Started

### Week 1: Foundation

- [ ] **Read `WESCUE_DESIGN.md` fully** — it covers value prop, architecture, MVP roadmap, tech stack, competitive analysis, and risks
- [ ] **Check domain availability** — `wescue.com`, `wescue.org`, `getwescue.com`
- [ ] **Decide legal structure** — Nonprofit 501(c)(3), Public Benefit Corp, or LLC? (see notes below)
- [ ] **Create accounts:**
  - [ ] [GitHub](https://github.com) — version control (you have this)
  - [ ] [Vercel](https://vercel.com) — hosting (free tier)
  - [ ] [Supabase](https://supabase.com) — database + auth + storage (free tier)
  - [ ] [Anthropic](https://console.anthropic.com) — Claude API key for AI chat
  - [ ] [Resend](https://resend.com) — transactional email (free tier)
  - [ ] [RescueGroups.org](https://rescuegroups.org/services/request-an-api-key/) — dog listing data API (free)

### Week 2: Talk to Shelters

- [ ] **Identify 10 shelters in your metro area**
- [ ] **Call or visit 5 of them** — don't pitch, just ask:
  - "What's the hardest part of getting dogs adopted?"
  - "What does your current adoption process look like?"
  - "What tools do you use to manage listings?"
  - "What would make your life easier?"
- [ ] **Take notes** — their answers will reshape your priorities
- [ ] **Ask 2-3 if they'd let you list their dogs** on a new platform (with attribution)

### Week 3-4: Build the Real MVP

- [ ] **Initialize Next.js project** (see Tech Stack below)
- [ ] **Set up Supabase** — create tables for dogs, shelters, users, applications
- [ ] **Build the AI chat** — connect Claude API with the matching logic from `app.js`
- [ ] **Import real dog data** — RescueGroups API or manual entry from partner shelters
- [ ] **Deploy to Vercel** — get a live URL you can share

### Month 2: Validate

- [ ] **Put the AI chat in front of 10 real people** considering adoption
- [ ] **Watch them use it** — don't explain, just observe
- [ ] **Measure:** Do they complete the chat? Click on dogs? Start applications?
- [ ] **Talk to 10 more shelter workers** — show them the demo, get feedback

### Month 3: Launch

- [ ] **Launch in one metro area** with real shelter data
- [ ] **Onboard 5 shelters directly** with the shelter portal
- [ ] **Track:** Applications submitted, adoptions completed, return rates

## Tech Stack (Recommended)

For a solo founder. Prioritizes simplicity and cost.

```
Frontend + Backend:  Next.js 15 (App Router)
UI:                  Tailwind CSS + shadcn/ui
Database:            Supabase (PostgreSQL)
Auth:                Supabase Auth (email + Google OAuth)
File Storage:        Supabase Storage (dog photos)
AI:                  Claude API (Anthropic)
Email:               Resend
Hosting:             Vercel
Analytics:           PostHog (free tier)
Error Tracking:      Sentry (free tier)
```

**Estimated cost at MVP scale:** ~$30-50/month (mostly Claude API usage)

## Setting Up the Next.js Project

When you're ready to move beyond the static prototype:

```bash
# Create the project
npx create-next-app@latest wescue --typescript --tailwind --app --src-dir

# Install key dependencies
cd wescue
npm install @supabase/supabase-js @supabase/ssr
npm install @anthropic-ai/sdk
npm install resend

# shadcn/ui setup
npx shadcn@latest init

# Environment variables (.env.local)
# NEXT_PUBLIC_SUPABASE_URL=your-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
# SUPABASE_SERVICE_ROLE_KEY=your-key
# ANTHROPIC_API_KEY=your-key
# RESEND_API_KEY=your-key
# RESCUEGROUPS_API_KEY=your-key
```

## Database Schema (Supabase SQL)

Run this in the Supabase SQL editor to create your initial tables:

```sql
-- Shelters
create table shelters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  website text,
  description text,
  logo_url text,
  verified boolean default false,
  tax_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Dogs
create table dogs (
  id uuid primary key default gen_random_uuid(),
  shelter_id uuid references shelters(id) on delete cascade,
  name text not null,
  breed_primary text,
  breed_secondary text,
  age_years integer,
  age_months integer,
  size text check (size in ('small', 'medium', 'large', 'xlarge')),
  weight_lbs integer,
  sex text check (sex in ('male', 'female')),
  energy_level text check (energy_level in ('low', 'moderate', 'high')),
  good_with_kids boolean,
  good_with_dogs boolean,
  good_with_cats boolean,
  house_trained boolean,
  special_needs text,
  medical_notes text,
  personality text,
  adoption_fee_cents integer,
  status text default 'available' check (status in ('available', 'pending', 'adopted', 'on_hold')),
  photos text[] default '{}',
  source text default 'manual' check (source in ('manual', 'rescuegroups', 'shelterluv')),
  external_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Adopter Profiles (created from AI chat)
create table adopter_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  living_situation text,
  has_yard boolean,
  has_kids boolean,
  has_dogs boolean,
  has_cats boolean,
  activity_level text,
  size_preference text,
  age_preference text,
  experience_level text,
  deal_breakers text,
  zip text,
  max_adoption_fee_cents integer,
  raw_chat_transcript jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Applications
create table applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  dog_id uuid references dogs(id),
  shelter_id uuid references shelters(id),
  profile_id uuid references adopter_profiles(id),
  status text default 'submitted' check (status in ('submitted', 'reviewing', 'approved', 'more_info', 'declined', 'withdrawn')),
  match_score integer,
  shelter_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Favorites
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  dog_id uuid references dogs(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, dog_id)
);

-- Messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  sender_id uuid references auth.users(id),
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Indexes
create index idx_dogs_shelter on dogs(shelter_id);
create index idx_dogs_status on dogs(status);
create index idx_dogs_size on dogs(size);
create index idx_applications_user on applications(user_id);
create index idx_applications_shelter on applications(shelter_id);
create index idx_messages_application on messages(application_id);

-- Enable Row Level Security
alter table shelters enable row level security;
alter table dogs enable row level security;
alter table adopter_profiles enable row level security;
alter table applications enable row level security;
alter table favorites enable row level security;
alter table messages enable row level security;

-- Public read access for dogs and shelters
create policy "Dogs are viewable by everyone"
  on dogs for select using (status = 'available');

create policy "Shelters are viewable by everyone"
  on shelters for select using (verified = true);

-- Users can manage their own data
create policy "Users can view own profile"
  on adopter_profiles for select using (auth.uid() = user_id);

create policy "Users can create own profile"
  on adopter_profiles for insert with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on adopter_profiles for update using (auth.uid() = user_id);

create policy "Users can view own favorites"
  on favorites for select using (auth.uid() = user_id);

create policy "Users can manage own favorites"
  on favorites for all using (auth.uid() = user_id);

create policy "Users can view own applications"
  on applications for select using (auth.uid() = user_id);

create policy "Users can create applications"
  on applications for insert with check (auth.uid() = user_id);
```

## AI Chat System Prompt

Use this as the starting point for your Claude-powered matching chat:

```
You are Wescue, a friendly AI assistant that helps people find rescue dogs
that match their lifestyle. You work for a shelter-first adoption platform
— every dog on Wescue comes from a verified rescue organization.

Your job is to have a warm, natural conversation that collects lifestyle
information to match the adopter with compatible dogs. You are NOT a form.
You are a knowledgeable friend who happens to know a lot about dogs.

Collect the following (conversationally, not all at once):
- Living situation (house/apartment, yard)
- Household (kids, other pets)
- Activity level
- Size preference
- Age preference
- Experience with dogs
- Location (zip code)
- Budget for adoption fees
- Deal-breakers

Guidelines:
- Be warm, encouraging, and genuinely excited about helping them adopt
- React to their answers naturally ("A runner! Some dogs would love that")
- Skip questions when answers are implied by previous responses
- Never recommend a specific dog that hasn't been verified as available
- Be conservative in matching — a safe match is better than an exciting one
- If someone describes a situation that's clearly not right for a dog (e.g.,
  they travel 300 days a year), gently say so rather than forcing a match
- Never mention breeders positively or suggest buying from a breeder
- Keep the conversation to 5-7 questions maximum

After collecting information, output a structured JSON summary of their
preferences that can be used for database matching.
```

## Legal Structure Notes

| Structure | Pros | Cons |
|-----------|------|------|
| **Nonprofit 501(c)(3)** | Tax-exempt, eligible for grants, shelters trust nonprofits, can accept donations | Slower to set up, board required, can't take venture funding, limited founder compensation |
| **Public Benefit Corp (PBC)** | Can take investment AND have a social mission, flexible, growing credibility | Less trusted by shelters than nonprofits, no tax exemption |
| **LLC** | Fastest to set up, most flexible | Shelters may be skeptical of a for-profit adoption platform |

**Recommendation:** Start as an LLC for speed. If you find that shelter trust is a barrier, convert to a PBC. If you want to pursue grants and donations as primary funding, go nonprofit. You can always change later — don't let legal structure delay your launch.

## Key Resources

### Data Sources
- [RescueGroups.org API](https://rescuegroups.org/services/request-an-api-key/) — free rescue dog data
- [Shelterluv API](https://www.shelterluv.com/) — shelter management system with API
- [ASPCA Shelter Data](https://www.aspca.org/helping-people-pets) — research and statistics

### Shelter Networks (for partnerships)
- [Best Friends Animal Society](https://bestfriends.org/) — largest no-kill shelter network
- [ASPCA](https://www.aspca.org/) — grants + partnerships for shelter tech
- [Maddie's Fund](https://www.maddiesfund.org/) — grants for adoption innovation
- [Petco Love](https://petcolove.org/) — funding for shelter technology

### Competitive Research
- [Petfinder](https://www.petfinder.com/) — largest adoption directory (owned by Purina/Nestle)
- [Adopt-a-Pet](https://www.adoptapet.com/) — second largest
- [ASPCA adoption](https://www.aspca.org/adopt-pet) — direct ASPCA adoption portal

### Tech Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Claude API Docs](https://docs.anthropic.com/)
- [Vercel Deployment](https://vercel.com/docs)

## License

This project is proprietary. All rights reserved.
