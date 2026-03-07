# NyumbaLink Database

PostgreSQL schema and migrations.

## Setup

1. Create a database (e.g. `nyumbalink`).
2. Run the schema:

```bash
psql -U your_user -d nyumbalink -f schema.sql
```

Or with Docker:

```bash
docker exec -i nyumbalink-db psql -U nyumbalink -d nyumbalink < schema.sql
```

## Schema overview

- **users** – All roles: tenant, buyer, property_owner, real_estate_company, admin
- **properties** – Listings (house, land, apartment, commercial); status: pending → active after admin approval
- **purchases** – Buy requests and status
- **rental_applications** – Tenant applications for rent
- **rentals** – Active leases
- **payments** – Purchase and rent payments (placeholder/mobile_money/bank)

All IDs are UUIDs. `verified_ownership` on properties is set by admin after land registry verification.
