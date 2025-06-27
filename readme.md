First Step :- npm run migration:generate -- src/migration/migration -d src/config/data-source.ts
Second Step :- npm run migration:run -- -d src/config/data-source.ts

## 📦 TypeORM Migration Guide

This project uses [TypeORM](https://typeorm.io/) for managing database migrations with PostgreSQL and TypeScript.

### 📁 Directory Structure

### 🧱 Create an Empty Migration

Create a new empty migration file where you can manually define SQL:

```bash
npm run migration:create -- src/migration/your_migration_name

npm run migration:generate -- src/migration/your_migration_name

npm run migration:run

npm run migration:revert
```
