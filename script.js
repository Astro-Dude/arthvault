import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import {
  initializeUserData,
  getUserIncome,
  updateUserBalance,
} from "./firebase-db.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7387Q_zE7CVLYN6F6eHqvO4T0jPiCZME",
  authDomain: "arthvault-17746.firebaseapp.com",
  projectId: "arthvault-17746",
  storageBucket: "arthvault-17746.firebasestorage.app",
  messagingSenderId: "13472561590",
  appId: "1:13472561590:web:5cf043776cd06afbad6917",
  measurementId: "G-2KW4GCE2N0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();

const totalIncomeDisplay = document.getElementById("totalIncome");
const incomeAmount = document.getElementById("incomeAmount");

const login = document.getElementById("loginBtn");
const register = document.getElementById("signupBtn");
const authbtn = document.querySelector(".auth-buttons");

const profileMenu = document.getElementById("profileMenu");
const profilePic = document.getElementById("profilePic");
const profileDropdown = document.getElementById("profileDropdown");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

const userSignIn = async () => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      await initializeUserData(user);
      console.log(user);
      authbtn.classList.add("hidden");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is signed in:", user);
    authbtn.classList.add("hidden");
    profileMenu.classList.remove("hidden");
    profilePic.src = user.photoURL || "images/default-avatar.png";
    userEmail.textContent = user.email;

    const income = await getUserIncome(user.uid);
    console.log("User income:", income);
    totalIncomeDisplay.textContent = "₹" + income.toLocaleString("en-IN");
  } else {
    console.log("User is signed out");
    authbtn.classList.remove("hidden");
    profileMenu.classList.add("hidden");
    incomeAmount.textContent = "";
  }
});

profileMenu.addEventListener("click", () => {
  profileDropdown.classList.toggle("hidden");
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  console.log("User logged out");
  profileDropdown.classList.add("hidden"); 
});

const incomeForm = document.getElementById("incomeForm");
const incomePopup = document.getElementById("incomePopup");
const saveIncomeBtn = incomeForm.querySelector(".btn-primary");

saveIncomeBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const newIncome = parseFloat(incomeAmount.value);
  const user = auth.currentUser;

  if (user && newIncome && newIncome > 0) {
    await updateUserBalance(user.uid, newIncome);
    console.log("Income updated in Firebase:", newIncome);

    totalIncomeDisplay.textContent = "₹" + newIncome.toLocaleString("en-IN");

    incomePopup.classList.remove("active");
  } else {
    console.error("Invalid income value or no user signed in");
  }
});

login.addEventListener("click", userSignIn);
register.addEventListener("click", userSignIn);





// ArthGPT API integration

document.addEventListener("DOMContentLoaded", function () {
  const aiButton = document.getElementById("aiAssistant");
  const popup = document.getElementById("aiPopup");
  const closeButton = document.querySelector(".close-popup");
  const sendButton = document.querySelector(".send-message");
  const userInput = document.getElementById("userInput");
  const chatMessages = document.getElementById("chatMessages");

  aiButton.addEventListener("click", () => {
    popup.classList.add("active");
  });

  closeButton.addEventListener("click", () => {
    popup.classList.remove("active");
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.remove("active");
    }
  });

  sendButton.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
      addMessage(message, "user");

      userInput.value = "";

      setTimeout(() => {
        addMessage(
          "I'm your AI assistant. I'll help you analyze your expenses. This is a placeholder response - you'll need to implement the Gemini API integration here.",
          "ai"
        );
      }, 1000);
    }
  }

  function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${sender}-message`);
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

// Income popup integration

document.addEventListener("DOMContentLoaded", function () {
  const editIncomeBtn = document.getElementById("editIncomeBtn");
  const incomePopup = document.getElementById("incomePopup");
  const closeIncomePopup = document.getElementById("closeIncomePopup");
  const incomeForm = document.getElementById("incomeForm");
  const incomeAmount = document.getElementById("incomeAmount");
  const totalIncomeDisplay = document.getElementById("totalIncome");

  editIncomeBtn.addEventListener("click", () => {
    const currentIncome = totalIncomeDisplay.textContent
      .replace("₹", "")
      .replace(/,/g, "");
    incomeAmount.value = currentIncome;
    incomePopup.classList.add("active");
  });

  closeIncomePopup.addEventListener("click", () => {
    incomePopup.classList.remove("active");
  });

  incomePopup.addEventListener("click", (e) => {
    if (e.target === incomePopup) {
      incomePopup.classList.remove("active");
    }
  });

  incomeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newIncome = parseFloat(incomeAmount.value);
    if (newIncome && newIncome > 0) {
      totalIncomeDisplay.textContent = "₹" + newIncome.toLocaleString("en-IN");
      incomePopup.classList.remove("active");
    }
  });

  incomeAmount.addEventListener("input", (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    if (value) {
      const number = parseInt(value);
      e.target.value = number;
    }
  });
});

function saveIncomeToFirebase(income) {
  console.log("Saving income to Firebase:", income);
}
