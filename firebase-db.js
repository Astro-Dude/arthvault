import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7387Q_zE7CVLYN6F6eHqvO4T0jPiCZME",
  authDomain: "arthvault-17746.firebaseapp.com",
  projectId: "arthvault-17746",
  storageBucket: "arthvault-17746.firebasestorage.app",
  messagingSenderId: "13472561590",
  appId: "1:13472561590:web:5cf043776cd06afbad6917",
  measurementId: "G-2KW4GCE2N0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeUserData(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email: user.email,
        income: 50000,
      });
      console.log("New user profile created with income: 50000");
    } else {
      console.log("User already exists:", userDoc.data());
    }
  } catch (error) {
    console.error("Error initializing user data:", error);
  }
}

const getUserIncome = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      return docSnap.data().income;
    } else {
      console.log("No such document!");
      return 0;
    }
  };

async function updateUserBalance(userId, newIncome) {
  try {
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
