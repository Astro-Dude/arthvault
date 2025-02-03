import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/**
 * Firebase configuration object containing essential project settings
 * These credentials are used to initialize and connect to the Firebase project
 * 
 * @important This configuration should match your Firebase project settings
 * @important In production, these values should be stored in environment variables
 */
const firebaseConfig = {
  apiKey: "AIzaSyD7387Q_zE7CVLYN6F6eHqvO4T0jPiCZME",
  authDomain: "arthvault-17746.firebaseapp.com",
  projectId: "arthvault-17746",
  storageBucket: "arthvault-17746.firebasestorage.app",
  messagingSenderId: "13472561590",
  appId: "1:13472561590:web:5cf043776cd06afbad6917",
  measurementId: "G-2KW4GCE2N0",
};

// Initialize Firebase application with the configuration
const app = initializeApp(firebaseConfig);

// Initialize Firestore database instance
const db = getFirestore(app);

/**
 * Initializes a new user's data in Firestore or verifies existing user data
 * Creates a new user document if one doesn't exist, with default values
 * 
 * @param {Object} user - The user object from Firebase Authentication
 * @param {string} user.uid - The unique identifier for the user
 * @param {string} user.email - The user's email address
 * @returns {Promise<void>}
 * @throws {Error} If there's an error accessing or writing to Firestore
 */
async function initializeUserData(user) {
  try {
    // Get reference to the user's document in Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user document with default values if it doesn't exist
      await setDoc(userRef, {
        email: user.email,
        income: 0,  // Set default income to 0
      });
      console.log("New user profile created with income: 50000");
    } else {
      // Log existing user data
      console.log("User already exists:", userDoc.data());
    }
  } catch (error) {
    console.error("Error initializing user data:", error);
  }
}

/**
 * Retrieves the income value for a specific user from Firestore
 * 
 * @param {string} userId - The unique identifier of the user
 * @returns {Promise<number>} The user's income value, or 0 if not found
 * @throws {Error} If there's an error accessing Firestore
 */
const getUserIncome = async (userId) => {
    // Get reference to the user's document
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      // Return the income value if document exists
      return docSnap.data().income;
    } else {
      console.log("No such document!");
      return 0;  // Return default value if document doesn't exist
    }
  };

/**
 * Updates a user's income balance in Firestore
 * 
 * @param {string} userId - The unique identifier of the user
 * @param {number} newIncome - The new income value to set
 * @returns {Promise<void>}
 * @throws {Error} If there's an error updating the document in Firestore
 */
async function updateUserBalance(userId, newIncome) {
  try {
    // Get reference to the user's document and update the income field
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      income: newIncome,
    });
    console.log("Balance updated successfully:", newIncome);
  } catch (error) {
    console.error("Error updating balance:", error);
  }
}

export { initializeUserData, getUserIncome, updateUserBalance };