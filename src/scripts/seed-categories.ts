import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const defaultCategories = [
  {
    name: "Citrus",
    description: "Fresh, zesty scents with bright, uplifting notes",
    color: "bg-yellow-500",
    icon: "sun",
    isActive: true,
  },
  {
    name: "Floral",
    description: "Delicate, romantic scents with flower-based notes",
    color: "bg-pink-500",
    icon: "flower",
    isActive: true,
  },
  {
    name: "Sweet",
    description: "Warm, comforting scents with sugary, dessert-like notes",
    color: "bg-purple-500",
    icon: "heart",
    isActive: true,
  },
  {
    name: "Fresh",
    description: "Clean, crisp scents with cool, invigorating notes",
    color: "bg-blue-500",
    icon: "droplet",
    isActive: true,
  },
  {
    name: "Fruity",
    description: "Juicy, vibrant scents with tropical and berry notes",
    color: "bg-orange-500",
    icon: "star",
    isActive: true,
  },
  {
    name: "Woody",
    description: "Rich, earthy scents with warm, grounding notes",
    color: "bg-amber-600",
    icon: "leaf",
    isActive: true,
  },
  {
    name: "Spicy",
    description: "Warm, exotic scents with aromatic, stimulating notes",
    color: "bg-red-500",
    icon: "fire",
    isActive: true,
  },
  {
    name: "Oceanic",
    description: "Fresh, marine scents with cool, breezy notes",
    color: "bg-cyan-500",
    icon: "droplet",
    isActive: true,
  }
];

async function seedCategories() {
  try {
    console.log("🌱 Starting category seeding...");
    
    for (const category of defaultCategories) {
      try {
        const docRef = await addDoc(collection(db, "categories"), {
          ...category,
          productCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        console.log(`✅ Added category: ${category.name} (ID: ${docRef.id})`);
      } catch (error) {
        console.error(`❌ Failed to add category ${category.name}:`, error);
      }
    }
    
    console.log("🎉 Category seeding completed!");
    console.log(`📊 Total categories seeded: ${defaultCategories.length}`);
    
  } catch (error) {
    console.error("❌ Error during category seeding:", error);
  }
}

// Run the seeding
seedCategories();
