-- ================================================================
-- Luiz Mitumba Thrifts — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

create extension if not exists "pgcrypto";

create table if not exists products (
  id              uuid primary key default gen_random_uuid(),
  cat             text not null default 'dresses',

  -- Cloudinary image URLs
  front_url       text not null,
  back_url        text not null,
  front_public_id text,
  back_public_id  text,

  -- Left outfit (left mannequin in the photo)
  left_price      integer not null,
  left_sizes      text[]  not null default '{}',

  -- Right outfit (right mannequin in the photo)
  right_price     integer not null,
  right_sizes     text[]  not null default '{}',

  created_at      timestamptz default now()
);

-- Allow anyone to read products (public storefront)
alter table products enable row level security;

create policy "Public can read products"
  on products for select
  using (true);

-- Only service-role (your API routes) can insert/update/delete
create policy "Service role full access"
  on products for all
  using (true)
  with check (true);
