import { 
    getFirestore, 
    collection,
    addDoc,
    query,
    where,
    getDocs,
    deleteDoc,
    doc,
    Timestamp 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Initialize Firestore database instance
const db = getFirestore();

/**
 * Adds a new expense record to Firestore with the current timestamp
 * 
 * @param {string} userId - The unique identifier of the user
 * @param {Object} expenseData - The expense information
 * @param {number} expenseData.amount - The expense amount
 * @param {string} expenseData.category - The category of the expense
 * @param {string} expenseData.description - A description of the expense
 * @returns {Promise<string>} The ID of the newly created expense document
 * @throws {Error} If there's an error adding the expense to Firestore
 */
async function addExpense(userId, expenseData) {
    try {
        // Create current timestamp for the expense
        const now = new Date();
        
        // Construct the expense object with all required fields
        const expense = {
            amount: parseFloat(expenseData.amount),  // Ensure amount is stored as a number
            category: expenseData.category,
            description: expenseData.description,
            userId: userId,
            timestamp: Timestamp.fromDate(now),      // Firebase timestamp
            month: now.getMonth(),                   // Store month for easier querying
            year: now.getFullYear()                  // Store year for easier querying
        };

        // Add the expense to Firestore and get the document reference
        const docRef = await addDoc(collection(db, "expenses"), expense);
        console.log("Expense added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding expense:", error);
        throw error;
    }
}

/**
 * Deletes an expense record from Firestore
 * 
 * @param {string} expenseId - The ID of the expense document to delete
 * @returns {Promise<boolean>} True if deletion was successful
 * @throws {Error} If there's an error deleting the expense
 */
async function deleteExpense(expenseId) {
    try {
        // Get reference to the expense document and delete it
        const expenseRef = doc(db, "expenses", expenseId);
        await deleteDoc(expenseRef);
        console.log("Expense deleted successfully:", expenseId);
        return true;
    } catch (error) {
        console.error("Error deleting expense:", error);
        throw error;
    }
}

/**
 * Retrieves all expenses for a specific user within a given month and year
 * 
 * @param {string} userId - The unique identifier of the user
 * @param {number} month - The month number (0-11)
 * @param {number} year - The year
 * @returns {Promise<Array>} Array of expense objects, sorted by timestamp (newest first)
 * @throws {Error} If there's an error retrieving the expenses
 */
async function getMonthlyExpenses(userId, month, year) {
    try {
        // Create a query to filter expenses by user, month, and year
        const expensesRef = collection(db, "expenses");
        const q = query(
            expensesRef,
            where("userId", "==", userId),
            where("month", "==", month),
            where("year", "==", year)
        );

        // Execute the query and process results
        const querySnapshot = await getDocs(q);
        const expenses = [];
        
        // Convert each document to an expense object with ID
        querySnapshot.forEach((doc) => {
            expenses.push({
                id: doc.id,
                ...doc.data(),
                amount: parseFloat(doc.data().amount)  // Ensure amount is a number
            });
        });

        // Sort expenses by timestamp, newest first
        expenses.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

        return expenses;
    } catch (error) {
        console.error("Error getting monthly expenses:", error);
        throw error;
    }
}

/**
 * Calculates total expenses by category for a specific month and year
 * 
 * @param {string} userId - The unique identifier of the user
 * @param {number} month - The month number (0-11)
 * @param {number} year - The year
 * @returns {Promise<Object>} Object with categories as keys and total amounts as values
 * @throws {Error} If there's an error calculating the totals
 */
async function getMonthlyExpensesByCategory(userId, month, year) {
    try {
        // Get all expenses for the specified month
        const expenses = await getMonthlyExpenses(userId, month, year);
        
        // Reduce expenses array into category totals
        return expenses.reduce((acc, expense) => {
            const category = expense.category;
            acc[category] = (acc[category] || 0) + expense.amount;
            return acc;
        }, {});
    } catch (error) {
        console.error("Error getting expenses by category:", error);
        throw error;
    }
}

/**
 * Calculates the total amount spent in a specific month and year
 * 
 * @param {string} userId - The unique identifier of the user
 * @param {number} month - The month number (0-11)
 * @param {number} year - The year
 * @returns {Promise<number>} The total amount of all expenses
 * @throws {Error} If there's an error calculating the total
 */
async function getMonthlyTotal(userId, month, year) {
    try {
        // Get all expenses and sum their amounts
        const expenses = await getMonthlyExpenses(userId, month, year);
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    } catch (error) {
        console.error("Error getting monthly total:", error);
        throw error;
    }
}

export {
    addExpense,
    deleteExpense,
    getMonthlyExpenses,
    getMonthlyExpensesByCategory,
    getMonthlyTotal
};