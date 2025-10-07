# 🔧 Project Setup Guide (After New Code Pull)

✨📘🛠️ Follow these steps **after pulling the latest changes** from the repository to properly set up the project. ✨📘🛠️

---

## ✅ Step 1: Configure Environment Variables

📝🌱⚙️ Set all the required values in your `.env` file. Ensure each environment-specific variable is correctly filled based on your local or production setup. 📝🌱⚙️

---

## 🔐 Step 2: Generate RSA Keys and Convert to JWK

📂🔑📥 In the root directory terminal, run the following scripts sequentially: 📂🔑📥

```bash
node scripts/generateKeys.mjs
node scripts/convertPemToJwk.mjs
```

---

## 📋 Step 3: Format the JWK Output

🧾📤🔧 After running the above scripts, you will see an object in the terminal like: 🧾📤🔧

```json
{
    "kty": "RSA",
    "use": "sig",
    "n": "AJ0jRg4l...truncated",
    "e": "AQAB"
}
```

Convert this into the following format:

```json
{
    "keys": [
        {
            "kty": "RSA",
            "use": "sig",
            "n": "AJ0jRg4l...truncated",
            "e": "AQAB"
        }
    ]
}
```

🖋️📎📄 Copy this modified object for the next step. 🖋️📎📄

---

## 📁 Step 4: Create and Populate `jwks.json`

📁🏗️📌 Your final structure should look like: 📁🏗️📌

```
project-root/
├── public/
│   └── .well-known/
│       └── jwks.json
```

Example content of `jwks.json`:

```json
{
    "keys": [
        {
            "kty": "RSA",
            "use": "sig",
            "n": "AJ0jRg4l...truncated",
            "e": "AQAB"
        }
    ]
}
```

---

## 🧱 Step 5: Run Database Migrations

💻📦🚀 Execute the following command in the terminal to apply pending migrations: 💻📦🚀

```bash
npm run migration:run -- -d src/config/data-source.ts
```

---

✅🎉🟢 You’re all set! Your environment is now ready to run the project. ✅🎉🟢

---

## 📦 TypeORM Migration Guide

📘🧩🗂️ This project uses [TypeORM](https://typeorm.io/) for managing database migrations with PostgreSQL and TypeScript. 📘🧩🗂️

### 📁 Directory Structure

### 🧱 Create an Empty Migration

📄📜📌 Create a new empty migration file where you can manually define SQL: 📄📜📌

```bash
npm run migration:create -- src/migration/your_migration_name

npm run migration:generate -- src/migration/add_deletedAt_in_tenants_table -d src/config/data-source.ts

npm run migration:run -- -d src/config/data-source.ts

npm run migration:revert -- -d src/config/data-source.ts
```

db.log_entries.getIndexes()
db.log_entries.dropIndex("timestamp_1")
db.log_entries.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 60 })
mongosh -u root -p root --authenticationDatabase admin