-- REMBERT catalog foundation.
-- Additive migration: existing catalog and order tables remain compatible.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

do $$ begin
  create type public."ImageProvenance" as enum (
    'UNKNOWN', 'SUPPLIER', 'MANUFACTURER', 'OWNER_PHOTO',
    'VERIFIED_WEB_SOURCE', 'GENERATED_REFERENCE', 'CATEGORY_REFERENCE'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public."ImageVerificationStatus" as enum (
    'PENDING', 'VERIFIED_REAL', 'GENERATED_REFERENCE', 'REJECTED'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public."InventoryMovementReason" as enum (
    'IMPORT', 'SALE', 'RESERVATION', 'RESERVATION_RELEASE',
    'RETURN', 'ADJUSTMENT', 'POS_SYNC'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public."StockReservationStatus" as enum (
    'ACTIVE', 'COMMITTED', 'RELEASED', 'EXPIRED'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public."CatalogImportStatus" as enum (
    'RECEIVED', 'VALIDATING', 'PROCESSING', 'COMPLETED',
    'COMPLETED_WITH_ERRORS', 'FAILED'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public."CatalogImportRowStatus" as enum (
    'PENDING', 'PROCESSED', 'REJECTED'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public."CatalogEventType" as enum (
    'PRODUCT_UPDATED', 'INVENTORY_CHANGED'
  );
exception when duplicate_object then null;
end $$;

alter table public."Product"
  add column if not exists "version" integer not null default 1,
  add column if not exists "search_document" tsvector generated always as (
    setweight(to_tsvector('simple', coalesce("name", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("sku", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("shortDesc", '')), 'B') ||
    setweight(to_tsvector('simple', coalesce("description", '')), 'C')
  ) stored;

alter table public."Variant"
  add column if not exists "version" integer not null default 1;

alter table public."ProductImage"
  add column if not exists "provenance" public."ImageProvenance" not null default 'UNKNOWN',
  add column if not exists "verificationStatus" public."ImageVerificationStatus" not null default 'PENDING',
  add column if not exists "sourceUrl" text,
  add column if not exists "sourceSha256" varchar(64),
  add column if not exists "verifiedAt" timestamptz;

create index if not exists "Product_search_document_idx"
  on public."Product" using gin ("search_document");
create index if not exists "Product_name_trgm_idx"
  on public."Product" using gin (lower("name") gin_trgm_ops);
create index if not exists "Product_sku_trgm_idx"
  on public."Product" using gin (lower(coalesce("sku", '')) gin_trgm_ops);
create index if not exists "Product_active_stock_cursor_idx"
  on public."Product" ("isActive", "inStock", "updatedAt" desc, "id" desc);
create index if not exists "Product_category_active_stock_cursor_idx"
  on public."Product" ("categoryId", "isActive", "inStock", "updatedAt" desc, "id" desc);
create index if not exists "Product_brand_active_stock_cursor_idx"
  on public."Product" ("brandId", "isActive", "inStock", "updatedAt" desc, "id" desc);
create index if not exists "Variant_product_sku_idx"
  on public."Variant" ("productId", "sku");

create table if not exists public."InventoryLocation" (
  "id" text primary key,
  "code" text not null unique,
  "name" text not null,
  "isActive" boolean not null default true,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

insert into public."InventoryLocation" ("id", "code", "name")
values ('main', 'PRINCIPAL', 'Bodega principal REMBERT')
on conflict ("code") do nothing;

create table if not exists public."InventoryItem" (
  "id" text primary key,
  "productId" text,
  "variantId" text,
  "locationId" text not null,
  "onHand" integer not null default 0,
  "reserved" integer not null default 0,
  "reorderPoint" integer not null default 0,
  "version" integer not null default 1,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  constraint "InventoryItem_productId_fkey"
    foreign key ("productId") references public."Product"("id") on delete cascade,
  constraint "InventoryItem_variantId_fkey"
    foreign key ("variantId") references public."Variant"("id") on delete cascade,
  constraint "InventoryItem_locationId_fkey"
    foreign key ("locationId") references public."InventoryLocation"("id") on delete restrict,
  constraint "InventoryItem_single_owner_check"
    check (("productId" is not null)::integer + ("variantId" is not null)::integer = 1),
  constraint "InventoryItem_non_negative_check"
    check ("onHand" >= 0 and "reserved" >= 0 and "reserved" <= "onHand"),
  constraint "InventoryItem_product_location_key" unique ("productId", "locationId"),
  constraint "InventoryItem_variant_location_key" unique ("variantId", "locationId")
);

create index if not exists "InventoryItem_location_availability_idx"
  on public."InventoryItem" ("locationId", "onHand", "reserved");
create index if not exists "InventoryItem_updated_cursor_idx"
  on public."InventoryItem" ("updatedAt" desc, "id" desc);

insert into public."InventoryItem" (
  "id", "productId", "locationId", "onHand", "reserved", "version"
)
select
  gen_random_uuid()::text,
  p."id",
  l."id",
  greatest(p."stock", 0),
  0,
  1
from public."Product" p
join public."InventoryLocation" l on l."code" = 'PRINCIPAL'
on conflict ("productId", "locationId") do nothing;

create table if not exists public."InventoryMovement" (
  "id" uuid primary key default gen_random_uuid(),
  "inventoryItemId" text not null,
  "quantityDelta" integer not null,
  "onHandBefore" integer not null,
  "onHandAfter" integer not null,
  "reason" public."InventoryMovementReason" not null,
  "reference" text,
  "source" text not null,
  "actorUserId" text,
  "metadata" jsonb,
  "createdAt" timestamptz not null default now(),
  constraint "InventoryMovement_inventoryItemId_fkey"
    foreign key ("inventoryItemId") references public."InventoryItem"("id") on delete restrict
);
create index if not exists "InventoryMovement_item_created_idx"
  on public."InventoryMovement" ("inventoryItemId", "createdAt" desc);
create index if not exists "InventoryMovement_reference_idx"
  on public."InventoryMovement" ("reference");

create table if not exists public."StockReservation" (
  "id" uuid primary key default gen_random_uuid(),
  "token" text not null unique,
  "inventoryItemId" text not null,
  "orderId" text,
  "quantity" integer not null check ("quantity" > 0),
  "status" public."StockReservationStatus" not null default 'ACTIVE',
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  constraint "StockReservation_inventoryItemId_fkey"
    foreign key ("inventoryItemId") references public."InventoryItem"("id") on delete restrict
);
create index if not exists "StockReservation_status_expiry_idx"
  on public."StockReservation" ("status", "expiresAt");
create index if not exists "StockReservation_order_idx"
  on public."StockReservation" ("orderId");

create table if not exists public."CatalogImportJob" (
  "id" uuid primary key default gen_random_uuid(),
  "idempotencyKey" text not null unique,
  "source" text not null,
  "status" public."CatalogImportStatus" not null default 'RECEIVED',
  "totalRows" integer not null check ("totalRows" between 1 and 5000),
  "processedRows" integer not null default 0,
  "acceptedRows" integer not null default 0,
  "rejectedRows" integer not null default 0,
  "requestedBy" text,
  "errorSummary" jsonb,
  "createdAt" timestamptz not null default now(),
  "startedAt" timestamptz,
  "completedAt" timestamptz,
  "updatedAt" timestamptz not null default now()
);
create index if not exists "CatalogImportJob_status_created_idx"
  on public."CatalogImportJob" ("status", "createdAt" desc);

create table if not exists public."CatalogImportRow" (
  "id" uuid primary key default gen_random_uuid(),
  "jobId" uuid not null,
  "rowNumber" integer not null,
  "sku" text,
  "status" public."CatalogImportRowStatus" not null default 'PENDING',
  "payload" jsonb not null,
  "error" jsonb,
  "productId" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  constraint "CatalogImportRow_jobId_fkey"
    foreign key ("jobId") references public."CatalogImportJob"("id") on delete cascade,
  constraint "CatalogImportRow_productId_fkey"
    foreign key ("productId") references public."Product"("id") on delete set null,
  constraint "CatalogImportRow_job_row_key" unique ("jobId", "rowNumber")
);
create index if not exists "CatalogImportRow_job_status_row_idx"
  on public."CatalogImportRow" ("jobId", "status", "rowNumber");
create index if not exists "CatalogImportRow_sku_idx"
  on public."CatalogImportRow" ("sku");

create table if not exists public."CatalogEvent" (
  "id" uuid primary key default gen_random_uuid(),
  "eventType" public."CatalogEventType" not null,
  "operation" text not null,
  "productId" text,
  "inventoryItemId" text,
  "payload" jsonb not null,
  "createdAt" timestamptz not null default now(),
  "publishedAt" timestamptz,
  constraint "CatalogEvent_productId_fkey"
    foreign key ("productId") references public."Product"("id") on delete set null,
  constraint "CatalogEvent_inventoryItemId_fkey"
    foreign key ("inventoryItemId") references public."InventoryItem"("id") on delete set null
);
create index if not exists "CatalogEvent_created_cursor_idx"
  on public."CatalogEvent" ("createdAt" desc, "id" desc);
create index if not exists "CatalogEvent_product_created_idx"
  on public."CatalogEvent" ("productId", "createdAt" desc);

create table if not exists public."AuditLog" (
  "id" uuid primary key default gen_random_uuid(),
  "actorUserId" text,
  "action" text not null,
  "entityType" text not null,
  "entityId" text not null,
  "before" jsonb,
  "after" jsonb,
  "requestId" text,
  "ipHash" text,
  "createdAt" timestamptz not null default now()
);
create index if not exists "AuditLog_entity_created_idx"
  on public."AuditLog" ("entityType", "entityId", "createdAt" desc);
create index if not exists "AuditLog_actor_created_idx"
  on public."AuditLog" ("actorUserId", "createdAt" desc);
create index if not exists "AuditLog_request_idx"
  on public."AuditLog" ("requestId");

create schema if not exists private;

create or replace function private.catalog_emit_product_event()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  row_data record;
  event_product_id text;
begin
  if tg_op = 'DELETE' then
    row_data := old;
    event_product_id := null;
  else
    row_data := new;
    event_product_id := row_data."id";
  end if;

  insert into public."CatalogEvent" (
    "eventType", "operation", "productId", "payload"
  ) values (
    'PRODUCT_UPDATED',
    tg_op,
    event_product_id,
    jsonb_build_object(
      'id', row_data."id",
      'slug', row_data."slug",
      'sku', row_data."sku",
      'version', row_data."version",
      'updatedAt', row_data."updatedAt"
    )
  );
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create or replace function private.catalog_emit_inventory_event()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  row_data record;
  resolved_product_id text;
begin
  if tg_op = 'DELETE' then row_data := old; else row_data := new; end if;
  resolved_product_id := row_data."productId";

  if resolved_product_id is null and row_data."variantId" is not null then
    select v."productId" into resolved_product_id
    from public."Variant" v
    where v."id" = row_data."variantId";
  end if;

  insert into public."CatalogEvent" (
    "eventType", "operation", "productId", "inventoryItemId", "payload"
  ) values (
    'INVENTORY_CHANGED',
    tg_op,
    resolved_product_id,
    case when tg_op = 'DELETE' then null else row_data."id" end,
    jsonb_build_object(
      'productId', resolved_product_id,
      'inventoryItemId', row_data."id",
      'available', greatest(row_data."onHand" - row_data."reserved", 0),
      'version', row_data."version",
      'updatedAt', row_data."updatedAt"
    )
  );
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists "Product_catalog_event_trigger" on public."Product";
create trigger "Product_catalog_event_trigger"
after insert or update or delete on public."Product"
for each row execute function private.catalog_emit_product_event();

drop trigger if exists "InventoryItem_catalog_event_trigger" on public."InventoryItem";
create trigger "InventoryItem_catalog_event_trigger"
after insert or update or delete on public."InventoryItem"
for each row execute function private.catalog_emit_inventory_event();

alter table public."InventoryLocation" enable row level security;
alter table public."InventoryItem" enable row level security;
alter table public."InventoryMovement" enable row level security;
alter table public."StockReservation" enable row level security;
alter table public."CatalogImportJob" enable row level security;
alter table public."CatalogImportRow" enable row level security;
alter table public."CatalogEvent" enable row level security;
alter table public."AuditLog" enable row level security;

revoke all on table public."InventoryLocation" from anon, authenticated;
revoke all on table public."InventoryItem" from anon, authenticated;
revoke all on table public."InventoryMovement" from anon, authenticated;
revoke all on table public."StockReservation" from anon, authenticated;
revoke all on table public."CatalogImportJob" from anon, authenticated;
revoke all on table public."CatalogImportRow" from anon, authenticated;
revoke all on table public."AuditLog" from anon, authenticated;
revoke all on table public."CatalogEvent" from anon, authenticated;
grant select on table public."CatalogEvent" to anon, authenticated;

create policy "Public catalog events are readable"
on public."CatalogEvent"
for select
to anon, authenticated
using (true);

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1
       from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'CatalogEvent'
     ) then
    alter publication supabase_realtime add table public."CatalogEvent";
  end if;
end $$;
