// script.js

document.addEventListener('DOMContentLoaded', function () {
    // Trip Planning Section
    const tripForm = document.getElementById('new-trip-form');
    const participantsList = document.getElementById('participants-list');
    const addParticipantButton = document.getElementById('add-participant');
    const participantNameInput = document.getElementById('participant-name');
    const activitiesList = document.getElementById('activities-list');
    const addActivityButton = document.getElementById('add-activity');
    const activityNameInput = document.getElementById('activity-name');

    const participants = [];
    const activities = [];

    tripForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const destination = document.getElementById('trip-destination').value;
        const startDate = document.getElementById('trip-start-date').value;
        const endDate = document.getElementById('trip-end-date').value;

        alert(`Trip to ${destination} from ${startDate} to ${endDate} created!`);
        tripForm.reset();
    });

    addParticipantButton.addEventListener('click', function () {
        const name = participantNameInput.value;
        if (name && !participants.includes(name)) {
            participants.push(name);
            const li = document.createElement('li');
            li.textContent = name;
            participantsList.appendChild(li);
            participantNameInput.value = '';
        }
    });

    addActivityButton.addEventListener('click', function () {
        const activity = activityNameInput.value;
        if (activity) {
            activities.push(activity);
            const li = document.createElement('li');
            li.textContent = activity;
            activitiesList.appendChild(li);
            activityNameInput.value = '';
        }
    });

    // Expense Logging Section
    const expenseForm = document.getElementById('new-expense-form');
    const expensesList = document.getElementById('expenses');

    const expenses = [];

    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const payer = document.getElementById('expense-payer').value;
        const date = document.getElementById('expense-date').value;

        const expense = { amount, category, payer, date };
        expenses.push(expense);

        const li = document.createElement('li');
        li.textContent = `${category}: $${amount} paid by ${payer} on ${date}`;
        expensesList.appendChild(li);

        expenseForm.reset();
        updateCostSplitting();
    });

    // Cost Splitting Section
    const tripCostElement = document.getElementById('trip-cost');
    const sharesList = document.getElementById('shares-list');

    function updateCostSplitting() {
        const totalCost = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        tripCostElement.textContent = `$${totalCost.toFixed(2)}`;

        const shares = {};

        expenses.forEach(expense => {
            if (!shares[expense.payer]) {
                shares[expense.payer] = 0;
            }
            shares[expense.payer] += expense.amount;
        });

        sharesList.innerHTML = '';

        participants.forEach(participant => {
            const share = shares[participant] || 0;
            const li = document.createElement('li');
            li.textContent = `${participant} owes $${share.toFixed(2)}`;
            sharesList.appendChild(li);
        });
    }

    // Reports Section
    const generateSummaryButton = document.getElementById('generate-summary');
    const summaryContent = document.getElementById('summary-content');
    const exportDataButton = document.getElementById('export-data');

    generateSummaryButton.addEventListener('click', function () {
        let summary = 'Trip Summary:\n\n';
        summary += `Total Cost: $${tripCostElement.textContent}\n\n`;
        summary += 'Expenses:\n';

        expenses.forEach(expense => {
            summary += `${expense.category}: $${expense.amount} paid by ${expense.payer} on ${expense.date}\n`;
        });

        summary += '\nParticipant Shares:\n';

        participants.forEach(participant => {
            const share = expenses
                .filter(expense => expense.payer === participant)
                .reduce((acc, expense) => acc + expense.amount, 0);
            summary += `${participant} owes $${share.toFixed(2)}\n`;
        });

        summaryContent.textContent = summary;
    });

    exportDataButton.addEventListener('click', function () {
        const jsPDF = window.jspdf.jsPDF;
        const doc = new jsPDF();

        doc.text(summaryContent.textContent, 10, 10);
        doc.save('trip-summary.pdf');
    });

    // Initial setup
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.style.display = 'none');
    document.querySelector('#trip-planning').style.display = 'block';

    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            sections.forEach(section => section.style.display = 'none');
            document.getElementById(targetId).style.display = 'block';
        });
    });
});
