/**
 * @jest-environment jsdom
 */
// tests for showAlert, addParticipant, addActivity, addExpense, generateSummary
// __tests__/tripPlanner.test.js


document.body.innerHTML = `
    <form id="new-trip-form">
        <input id="participant-name" />
        <button id="add-participant">Add Participant</button>
        <ul id="participants-list"></ul>
        <select id="expense-payer"></select>
    </form>
    <form id="new-expense-form">
        <input id="expense-amount" />
        <input id="expense-category" />
        <select id="expense-payer">
            <option value="Alice">Alice</option>
        </select>
        <input id="expense-date" />
        <button type="submit">Add Expense</button>
    </form>
    <ul id="expenses"></ul>
    <input id="activity-name" />
    <button id="add-activity">Add Activity</button>
    <ul id="activities-list"></ul>
    <button id="generate-summary">Generate Summary</button>
    <div id="summary-content"></div>
    <div id="custom-alert" style="display:none;">
        <span id="alert-message"></span>
        <button class="close-button">Close</button>
    </div>
`;

const addParticipantButton = document.getElementById('add-participant');
const participantNameInput = document.getElementById('participant-name');
const participantsList = document.getElementById('participants-list');
const payerSelect = document.getElementById('expense-payer');
const expenseForm = document.getElementById('new-expense-form');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategoryInput = document.getElementById('expense-category');
const expenseDateInput = document.getElementById('expense-date');
const expensesList = document.getElementById('expenses');
const addActivityButton = document.getElementById('add-activity');
const activityNameInput = document.getElementById('activity-name');
const activitiesList = document.getElementById('activities-list');
const generateSummaryButton = document.getElementById('generate-summary');
const summaryContent = document.getElementById('summary-content');

let participants = [];
let activities = [];
let expenses = [];

// Helper function to format date to dd-mm-yyyy
const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
};

// Function to add a participant to the DOM
const addParticipantToDOM = (name) => {
    const li = document.createElement('li');
    li.textContent = name;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.style.marginLeft = '10px';
    li.appendChild(removeButton);

    participantsList.appendChild(li);
};

// Function to update the payer dropdown
const updatePayerDropdown = () => {
    payerSelect.innerHTML = ''; // Clear current options
    participants.forEach(participant => {
        const option = document.createElement('option');
        option.value = participant;
        option.textContent = participant;
        payerSelect.appendChild(option);
    });
};

// Function to add an activity to the DOM
const addActivityToDOM = (activity) => {
    const li = document.createElement('li');
    li.textContent = activity;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.style.marginLeft = '10px';
    li.appendChild(removeButton);

    activitiesList.appendChild(li);
};

// Function to add an expense to the DOM
const addExpenseToDOM = (expense) => {
    const li = document.createElement('li');
    li.textContent = `${expense.category}: ₦${expense.amount.toFixed(2)} paid by ${expense.payer} on ${expense.date}`;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.style.marginLeft = '10px';
    li.appendChild(removeButton);

    expensesList.appendChild(li);
};

// Function to show alert
const showAlert = (message) => {
    const alertMessage = document.getElementById('alert-message');
    const customAlertModal = document.getElementById('custom-alert');
    alertMessage.textContent = message;
    customAlertModal.style.display = 'block';
};

// Function to generate summary
const generateSummary = () => {
    let summary = 'Trip Summary:\n\n';
    const totalCost = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    summary += `Total Cost: ₦${totalCost.toFixed(2)}\n\n`;
    summary += 'Expenses:\n';

    expenses.forEach(expense => {
        summary += `${expense.category}: ₦${expense.amount.toFixed(2)} paid by ${expense.payer} on ${expense.date}\n`;
    });

    summary += '\nParticipant Shares:\n';

    const shares = {};

    participants.forEach(participant => {
        shares[participant] = 0;
    });

    expenses.forEach(expense => {
        if (participants.includes(expense.payer)) {
            shares[expense.payer] += expense.amount;
        }
    });

    const perPersonShare = totalCost / participants.length;

    participants.forEach(participant => {
        const share = shares[participant] - perPersonShare;
        if (share > 0) {
            summary += `${participant} is owed ₦${share.toFixed(2)}\n`;
        } else {
            summary += `${participant} owes ₦${Math.abs(share).toFixed(2)}\n`;
        }
    });

    summaryContent.textContent = summary.replace(/\n/g, '\n\n');
};

addParticipantButton.addEventListener('click', function () {
    const name = participantNameInput.value;
    if (name && !participants.includes(name)) {
        participants.push(name);
        addParticipantToDOM(name);
        participantNameInput.value = '';
        updatePayerDropdown();
    }
});

addActivityButton.addEventListener('click', function () {
    const activity = activityNameInput.value;
    if (activity) {
        activities.push(activity);
        addActivityToDOM(activity);
        activityNameInput.value = '';
    }
});

expenseForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategoryInput.value;
    const payer = payerSelect.value;
    const date = formatDate(expenseDateInput.value);

    const expense = { amount, category, payer, date };
    expenses.push(expense);
    addExpenseToDOM(expense);
    expenseForm.reset();
});

generateSummaryButton.addEventListener('click', generateSummary);

// Test for showAlert function
test('showAlert displays the alert modal with the correct message', () => {
    const message = 'Test alert message';
    showAlert(message);

    const alertMessage = document.getElementById('alert-message');
    const customAlertModal = document.getElementById('custom-alert');

    expect(alertMessage.textContent).toBe(message);
    expect(customAlertModal.style.display).toBe('block');
});

// Test for addParticipant function
test('addParticipant adds a participant to the list and updates the dropdown', () => {
    participantNameInput.value = 'Alice';
    addParticipantButton.click();

    expect(participants).toContain('Alice');
    expect(participantsList.children.length).toBe(1);
    expect(participantsList.children[0].textContent).toContain('Alice');
    expect(payerSelect.children.length).toBe(1);
    expect(payerSelect.children[0].value).toBe('Alice');
});

// Test for addActivity function
test('addActivity adds an activity to the list', () => {
    activityNameInput.value = 'Hiking';
    addActivityButton.click();

    expect(activities).toContain('Hiking');
    expect(activitiesList.children.length).toBe(1);
    expect(activitiesList.children[0].textContent).toContain('Hiking');
});

// Test for addExpense function
test('addExpense adds an expense to the list', () => {
    expenseAmountInput.value = '100';
    expenseCategoryInput.value = 'Food';
    payerSelect.value = 'Alice';
    expenseDateInput.value = '2024-07-16';

    expenseForm.querySelector('button[type="submit"]').click();

    expect(expenses.length).toBe(1);
    expect(expenses[0].amount).toBe(100);
    expect(expenses[0].category).toBe('Food');
    expect(expenses[0].payer).toBe('Alice');
    expect(expenses[0].date).toBe('16-07-2024');
    expect(expensesList.children.length).toBe(1);
    expect(expensesList.children[0].textContent).toContain('Food: ₦100.00 paid by Alice on 16-07-2024');
});

// Test for generateSummary function
test('generateSummary generates the correct summary', () => {
    participants = ['Alice', 'Bob'];
    expenses = [
        { amount: 100, category: 'Food', payer: 'Alice', date: '16-07-2024' },
        { amount: 50, category: 'Transport', payer: 'Bob', date: '17-07-2024' }
    ];
    generateSummary();

    expect(summaryContent.textContent).toContain('Trip Summary:');
    expect(summaryContent.textContent).toContain('Total Cost: ₦150.00');
    expect(summaryContent.textContent).toContain('Food: ₦100.00 paid by Alice on 16-07-2024');
    expect(summaryContent.textContent).toContain('Transport: ₦50.00 paid by Bob on 17-07-2024');
    expect(summaryContent.textContent).toContain('Alice is owed ₦25.00');
    expect(summaryContent.textContent).toContain('Bob owes ₦25.00');
});
