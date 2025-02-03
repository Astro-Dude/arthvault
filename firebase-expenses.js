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

const db = getFirestore();

// Function to add a new expense with current date
async function addExpense(userId, expenseData) {
    try {
        const now = new Date();
        const expense = {
            amount: parseFloat(expenseData.amount),
            category: expenseData.category,
            description: expenseData.description,
            userId: userId,
            timestamp: Timestamp.fromDate(now),
            month: now.getMonth(),
            year: now.getFullYear()
        };

        const docRef = await addDoc(collection(db, "expenses"), expense);
        console.log("Expense added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding expense:", error);
        throw error;
    }
}

// New function to delete an expense
async function deleteExpense(expenseId) {
    try {
        const expenseRef = doc(db, "expenses", expenseId);
        await deleteDoc(expenseRef);
        console.log("Expense deleted successfully:", expenseId);
        return true;
    } catch (error) {
        console.error("Error deleting expense:", error);
        throw error;
    }
}

// Function to get expenses for a specific month and year
async function getMonthlyExpenses(userId, month, year) {
    try {
        const expensesRef = collection(db, "expenses");
        const q = query(
            expensesRef,
            where("userId", "==", userId),
            where("month", "==", month),
            where("year", "==", year)
        );

        const querySnapshot = await getDocs(q);
        const expenses = [];
        
        querySnapshot.forEach((doc) => {
            expenses.push({
                id: doc.id,
                ...doc.data(),
                amount: parseFloat(doc.data().amount)
            });
        });

        expenses.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

        return expenses;
    } catch (error) {
        console.error("Error getting monthly expenses:", error);
        throw error;
    }
}

// Function to get total expenses by category for a specific month
async function getMonthlyExpensesByCategory(userId, month, year) {
    try {
        const expenses = await getMonthlyExpenses(userId, month, year);
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

// Function to get total expenses for a specific month
async function getMonthlyTotal(userId, month, year) {
    try {
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