Find Your Buddy

Find Your Buddy is a community-driven web application that helps sports enthusiasts find nearby players for offline sports and games. Whether it’s football, badminton, table tennis, cricket, or tennis, users can drop their details and location to get matched with a buddy nearby in real time.

🚀 Table of Contents

Features

Tech Stack

Architecture

Database Schema

Getting Started

Prerequisites

Installation

Environment Variables

Running Locally

Usage

Roadmap

Contributing

License

Contact

🌟 Features

User Registration & Authentication via Supabase (Email & Magic Link)

Multi-step Join Form: Collects name, email, location, sports preferences, skill level, and availability

Real-time Buddy Matching based on location (pin code or geolocation), sport, skill level, and availability

Buddy Cards: Displays matched users with details and contact options

Filter & Refresh: Narrow down matches by sport, distance, or skill and refresh results on demand

Responsive UI: Mobile-first, modern interface built with React and Tailwind CSS

Admin Dashboard (Optional): View all users and match logs

🛠️ Tech Stack

Frontend: React.js, Tailwind CSS, Framer Motion, ShadCN UI / Headless UI

Backend: Supabase (PostgreSQL, Auth, Realtime, Edge Functions)

Mapping & Geo: PostGIS extension (Supabase), Haversine formula for distance

Deployment: Vercel or Netlify

🏗️ Architecture

Client: React single-page app (Next.js or Vite) for fast initial load and routing.

Auth & API: Supabase handles authentication, database queries, and real-time subscriptions.

Matching Logic: Implemented via Supabase Edge Function or in-app service using geospatial queries.

Storage: Supabase Postgres stores user profiles and match records.

Real-time Updates: Supabase Realtime broadcasts new user entries to subscribed clients.

📊 Database Schema

users Table

Column

Type

Description

id

UUID

Primary key

name

TEXT

Full name

email

TEXT

Registered email

pin_code

TEXT

City pin code

sports

TEXT[]

Array of selected sports

skill_level

TEXT

Beginner – Intermediate – Pro

availability

JSONB

Availability slots

created_at

TIMESTAMP

Timestamp of registration

matches Table (Optional)

Column

Type

Description

id

UUID

Primary key

user_id

UUID

Reference to users.id

buddy_id

UUID

Reference to matched user

sport

TEXT

Sport matched on

match_score

INTEGER

(Future AI scoring)

created_at

TIMESTAMP

Match timestamp

🔧 Getting Started

Prerequisites

Node.js (>= 16.x)

npm or yarn

Supabase account

Git

Installation

Clone the repository

git clone https://github.com/your-username/find-your-buddy.git
cd find-your-buddy

Install dependencies

npm install
# or
yarn install

Environment Variables

Create a .env.local file in the project root with the following variables:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key # for Edge Functions

Running Locally

npm run dev
# or
yarn dev

Open your browser at http://localhost:3000 to see the app.

▶️ Usage

Navigate to the Join page and complete the registration form.

After submission, you'll be redirected to the Matches page.

View and filter buddy cards. Click Connect Now to contact them.

(Optional) Edit your profile and availability on the Profile page.

📈 Roadmap



🤝 Contributing

Fork the repository

Create your feature branch: git checkout -b feature/YourFeature

Commit your changes: `git commit -m 'Add YourFeature'

Push to your branch: git push origin feature/YourFeature

Open a Pull Request

Please follow the Code of Conduct in CODE_OF_CONDUCT.md.

📝 License

This project is licensed under the MIT License.

📬 Contact

Vinayak Praful Dhemare – @vinayakdhemareProject Link: https://github.com/your-username/find-your-buddy
