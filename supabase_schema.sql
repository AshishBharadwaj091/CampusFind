-- ========================================================
-- CampusFind Supabase Database Setup & Schema (Idempotent)
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Items Table (Lost & Found Listings)
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Lost', 'Found')),
  category TEXT NOT NULL,
  custom_category TEXT,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  reported DATE NOT NULL DEFAULT CURRENT_DATE,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Reports Table (Staff Moderation & Dashboard)
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY DEFAULT ('CF-' || floor(random() * 9000 + 1000)::text),
  item_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Lost', 'Found')),
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  date_reported DATE NOT NULL DEFAULT CURRENT_DATE,
  review_status TEXT NOT NULL DEFAULT 'Pending review' CHECK (review_status IN ('Pending review', 'Approved', 'Dismissed')),
  description TEXT NOT NULL,
  dismiss_reason TEXT,
  dismissed_at TIMESTAMPTZ,
  warning_issued BOOLEAN NOT NULL DEFAULT false,
  warning_reason TEXT,
  warned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to prevent "already exists" errors
DROP POLICY IF EXISTS "Public items read access" ON public.items;
DROP POLICY IF EXISTS "Public items insert access" ON public.items;
DROP POLICY IF EXISTS "Authenticated items update access" ON public.items;
DROP POLICY IF EXISTS "Authenticated items delete access" ON public.items;
DROP POLICY IF EXISTS "Public reports insert access" ON public.reports;
DROP POLICY IF EXISTS "Staff reports read access" ON public.reports;
DROP POLICY IF EXISTS "Staff reports update access" ON public.reports;

-- 6. Create RLS Policies
CREATE POLICY "Public items read access" ON public.items FOR SELECT USING (true);
CREATE POLICY "Public items insert access" ON public.items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public reports insert access" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff reports read access" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Staff reports update access" ON public.reports FOR UPDATE USING (true) WITH CHECK (true);

-- 7. Insert Initial Demo Items
INSERT INTO public.items (name, status, category, description, location, reported)
VALUES
  ('Wireless Headphones', 'Found', 'Electronics', 'Over-ear wireless headphones in a dark case.', 'Learning commons', '2026-10-16'),
  ('Key Set', 'Lost', 'Keys', 'A set of two silver keys with a plain dark key fob.', 'Cafeteria vicinity', '2026-10-15'),
  ('Grey Backpack', 'Found', 'Bags & Personal Items', 'A grey backpack with several compartments.', 'Near the student centre', '2026-10-14'),
  ('Grid Paper Notebook', 'Lost', 'Books & Stationery', 'A medium-sized notebook with a dark green cover.', 'Academic block study area', '2026-10-13'),
  ('Blue Water Bottle', 'Found', 'Other', 'A reusable blue bottle with a screw-top lid.', 'Sports complex entrance', '2026-10-12')
ON CONFLICT DO NOTHING;

-- 8. Insert Initial Demo Staff Reports
INSERT INTO public.reports (id, item_name, type, category, location, date_reported, review_status, description)
VALUES
  ('CF-2041', 'Silver wireless earbuds case', 'Found', 'Electronics', 'Library courtyard', '2026-10-16', 'Pending review', 'A small silver earbuds charging case was found near a seating area.'),
  ('CF-2040', 'Navy canvas tote bag', 'Lost', 'Bags & Personal Items', 'Academic block walkway', '2026-10-15', 'Pending review', 'A navy canvas tote bag was last seen on campus.'),
  ('CF-2039', 'Green grid notebook', 'Lost', 'Books & Stationery', 'Learning commons', '2026-10-15', 'Approved', 'A medium-sized notebook with a green cover and graph paper.'),
  ('CF-2038', 'Single brass key', 'Found', 'Keys', 'Sports complex entrance', '2026-10-14', 'Pending review', 'One brass-colored key was found near a campus entrance.')
ON CONFLICT (id) DO NOTHING;

-- 9. Storage Bucket setup for photo uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-photos', 'item-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'item-photos');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'item-photos');
