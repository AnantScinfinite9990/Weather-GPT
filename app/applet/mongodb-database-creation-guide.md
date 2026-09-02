# MongoDB Database Creation, Structuring, and Management

Unlike traditional SQL databases, MongoDB is **"lazy"**—it creates databases and collections automatically the first time you insert data into them. However, you can still create them manually, run scripts to set up data, and use tools to view them. 

This guide explains how to handle the structure, initialization scripts, and viewing of your MongoDB database.

---

## 1. How to "Create" the Database

There are two ways to create a database in MongoDB Atlas:

### Method A: The Automatic Way (Code-Driven)
You don't actually need to click any "Create Database" buttons. 
If your connection string in your `.env` file ends with `mongodb.net/my_app_db`, MongoDB will automatically create the database named `my_app_db` the exact moment your Node.js backend saves the first user or chat message.

### Method B: The Manual Way (Atlas UI)
If you prefer to see it exist before running your code:
1. Log into **MongoDB Atlas**.
2. Go to your cluster and click the **Browse Collections** button.
3. Click the **+ Create Database** button.
4. Enter a **Database Name** (e.g., `weathergpt`).
5. Enter a **Collection Name** (e.g., `users`).
6. Click **Create**.

---

## 2. Where and How to Structure the Database

In a Node.js/TypeScript backend, you structure your database using **Mongoose**. Mongoose enforces a specific "Schema" (rules for your data) on top of MongoDB's flexible structure.

**Where to put it:**
Create a `models` folder inside your backend source code: `/backend/src/models/`.

**How to structure it (Example `backend/src/models/Profile.ts`):**
```typescript
import mongoose from 'mongoose';

// 1. Define the Structure (Schema)
const profileSchema = new mongoose.Schema({
  username: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  savedLocations: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// 2. Export the Model
// Note: Mongoose automatically pluralizes the model name. 
// 'Profile' becomes the 'profiles' collection in your database.
export const Profile = mongoose.model('Profile', profileSchema);
```

---

## 3. What Scripts to Run (Initialization & Seeding)

When you first set up your app, you might want a script to insert some dummy data or an initial admin user. This is called a "Seed Script".

### Step 1: Create the Seed Script
Create a file named `seed.ts` inside your `backend/` folder:

```typescript
// backend/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/User.js'; // Adjust path to your models

dotenv.config(); // Load the .env file

async function runSeed() {
  try {
    // 1. Connect to Atlas
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to DB');

    // 2. Clear existing data (optional)
    await User.deleteMany({});
    console.log('Cleared old users');

    // 3. Insert new data
    await User.create({
      email: 'admin@weathergpt.com',
      passwordHash: 'hashed_password_here' // Usually you would bcrypt this
    });
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    // 4. Disconnect so the script finishes
    await mongoose.disconnect();
  }
}

runSeed();
```

### Step 2: Run the Script
Open your terminal, navigate to the backend folder, and use a tool like `tsx` (TypeScript executor) to run it:

```bash
cd backend
npx tsx seed.ts
```

---

## 4. How to Open and View Your Database

Once your app (or seed script) is inserting data, you need a way to look at it, edit it, or delete it visually.

### Option 1: MongoDB Atlas Data Explorer (In Browser)
*Best for quick checks.*
1. Go to your cluster on the [MongoDB Atlas website](https://www.mongodb.com/cloud/atlas).
2. Click **Browse Collections**.
3. You will see your database on the left. Click on a collection (e.g., `users`) to view all the documents inside it. You can edit or delete them directly from the web interface.

### Option 2: MongoDB Compass (Desktop App)
*Best for daily development and complex querying.*
1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass) on your computer.
2. Open Compass.
3. In MongoDB Atlas, click **Connect** on your cluster, but this time select **Compass**.
4. Copy the connection string (it's the same one you put in your `.env` file).
5. Paste it into the connection bar in the Compass app and click **Connect**.
6. You now have a powerful desktop interface to explore your data, run complex queries, and analyze your database performance.
