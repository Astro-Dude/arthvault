// Add this to your existing JavaScript or create a new script tag

document.addEventListener('DOMContentLoaded', function() {
    const aiButton = document.getElementById('aiAssistant');
    const popup = document.getElementById('aiPopup');
    const closeButton = document.querySelector('.close-popup');
    const sendButton = document.querySelector('.send-message');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');

    // Open popup
    aiButton.addEventListener('click', () => {
        popup.classList.add('active');
    });

    // Close popup
    closeButton.addEventListener('click', () => {
        popup.classList.remove('active');
    });

    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
        }
    });

    // Send message
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            
            // Clear input
            userInput.value = '';

            // Simulate AI response (replace this with actual Gemini API call)
            setTimeout(() => {
                addMessage("I'm your AI assistant. I'll help you analyze your expenses. This is a placeholder response - you'll need to implement the Gemini API integration here.", 'ai');
            }, 1000);
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

// Add this to your JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    const editIncomeBtn = document.getElementById('editIncomeBtn');
    const incomePopup = document.getElementById('incomePopup');
    const closeIncomePopup = document.getElementById('closeIncomePopup');
    const incomeForm = document.getElementById('incomeForm');
    const incomeAmount = document.getElementById('incomeAmount');
    const totalIncomeDisplay = document.getElementById('totalIncome');

    // Open income popup
    editIncomeBtn.addEventListener('click', () => {
        // Get current income without the currency symbol and commas
        const currentIncome = totalIncomeDisplay.textContent
            .replace('₹', '')
            .replace(/,/g, '');
        incomeAmount.value = currentIncome;
        incomePopup.classList.add('active');
    });

    // Close income popup
    closeIncomePopup.addEventListener('click', () => {
        incomePopup.classList.remove('active');
    });

    // Close on outside click
    incomePopup.addEventListener('click', (e) => {
        if (e.target === incomePopup) {
            incomePopup.classList.remove('active');
        }
    });

    // Handle income form submission
    incomeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newIncome = parseFloat(incomeAmount.value);
        if (newIncome && newIncome > 0) {
            // Format the number with commas and currency symbol
            totalIncomeDisplay.textContent = '₹' + newIncome.toLocaleString('en-IN');
            
            // Here you would typically save to Firebase
            // saveIncomeToFirebase(newIncome);
            
            // Close the popup
            incomePopup.classList.remove('active');
        }
    });

    // Optional: Format number as user types
    incomeAmount.addEventListener('input', (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        if (value) {
            const number = parseInt(value);
            e.target.value = number;
        }
    });
});

// Placeholder function for Firebase integration
function saveIncomeToFirebase(income) {
    // Implement Firebase saving logic here
    console.log('Saving income to Firebase:', income);
}