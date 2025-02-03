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
    ``;
    profileMenu.classList.add("hidden");
    totalIncomeDisplay.textContent = "₹0";
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

// Monthly expenses integration

import {
  addExpense,
  getMonthlyExpenses,
  getMonthlyTotal,
  deleteExpense,
} from "./firebase-expenses.js";

document.addEventListener("DOMContentLoaded", function () {
  const expenseForm = document.querySelector(".expense-form");
  const totalExpenseDisplay = document.getElementById("totalExpense");
  const monthSelect = document.getElementById("monthSelect");
  const yearSelect = document.getElementById("yearSelect");

  // Initialize month dropdown
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  months.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = month;
    monthSelect.appendChild(option);
  });

  // Initialize year dropdown
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 5; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }

  // Set default month and year for filters
  const currentDate = new Date();
  monthSelect.value = currentDate.getMonth();
  yearSelect.value = currentDate.getFullYear();

  // Update expense display when filter changes
  monthSelect.addEventListener("change", updateExpenseDisplay);
  yearSelect.addEventListener("change", updateExpenseDisplay);

  async function updateExpenseDisplay() {
    const user = auth.currentUser;
    if (!user) return;

    const selectedMonth = parseInt(monthSelect.value);
    const selectedYear = parseInt(yearSelect.value);

    try {
      // Update total expenses for selected month
      const monthlyTotal = await getMonthlyTotal(
        user.uid,
        selectedMonth,
        selectedYear
      );
      totalExpenseDisplay.textContent =
        "₹" + monthlyTotal.toLocaleString("en-IN");

      // Get and display all expenses for selected month
      const expenses = await getMonthlyExpenses(
        user.uid,
        selectedMonth,
        selectedYear
      );
      displayExpenses(expenses);
    } catch (error) {
      console.error("Error updating expense display:", error);
    }
  }

  function displayExpenses(expenses) {
    const expenseList = document.getElementById("expenseList");
    if (!expenseList) return;

    expenseList.innerHTML = "";

    expenses.forEach((expense) => {
      const expenseElement = document.createElement("div");
      expenseElement.className = "expense-item";
      expenseElement.innerHTML = `
              <div class="expense-details">
                  <span class="expense-category">${expense.category}</span>
                  <span class="expense-description">${
                    expense.description
                  }</span>
                  <span class="expense-amount">₹${expense.amount.toLocaleString(
                    "en-IN"
                  )}</span>
              </div>
              <div class="expense-actions">
                <span class="expense-date">
                    ${expense.timestamp.toDate().toLocaleDateString()}
                </span>
                <button class="delete-expense" data-id="${expense.id}">
                    <span class="delete-icon">🗑️</span>
                </button>
            </div>
          `;
      // Add delete event listener
      const deleteBtn = expenseElement.querySelector(".delete-expense");
      deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this expense?")) {
          try {
            await deleteExpense(expense.id);
            await updateExpenseDisplay(); // Refresh the list
          } catch (error) {
            console.error("Error deleting expense:", error);
            alert("Error deleting expense. Please try again.");
          }
        }
      });
      expenseList.appendChild(expenseElement);
    });
  }

  // Handle form submission
  expenseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to add expenses");
      return;
    }

    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;

    if (!amount || !category) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const expenseData = {
        amount,
        category,
        description,
      };

      await addExpense(user.uid, expenseData);

      // Update the display for the currently selected month/year
      await updateExpenseDisplay();

      // Reset form
      expenseForm.reset();
      alert("Expense added successfully!");
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Error adding expense. Please try again.");
    }
  });

  // Update expenses when user logs in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      updateExpenseDisplay();
    } else {
      totalExpenseDisplay.textContent = "₹0";
      if (document.getElementById("expenseList")) {
        document.getElementById("expenseList").innerHTML = "";
      }
    }
  });
});
