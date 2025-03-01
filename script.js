document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const tripForm = document.getElementById('new-trip-form');
    const participantsList = document.getElementById('participants-list');
    const addParticipantButton = document.getElementById('add-participant');
    const participantNameInput = document.getElementById('participant-name');
    const activitiesList = document.getElementById('activities-list');
    const addActivityButton = document.getElementById('add-activity');
    const activityNameInput = document.getElementById('activity-name');
    const expenseForm = document.getElementById('new-expense-form');
    const expensesList = document.getElementById('expenses');
    const tripCostElement = document.getElementById('trip-cost');
    const sharesList = document.getElementById('shares-list');
    const generateSummaryButton = document.getElementById('generate-summary');
    const summaryContent = document.getElementById('summary-content');
    const exportDataButton = document.getElementById('export-data');
    const payerSelect = document.getElementById('expense-payer');
    const customAlertModal = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const closeButton = document.querySelector('.close-button');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const cancelButton = document.getElementById('cancel-button');
    const continueButton = document.getElementById('continue-button');

    let participants = JSON.parse(localStorage.getItem('participants')) || [];
    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let participantToRemove = null;

    // Initialize
    function initialize() {
        participants.forEach(addParticipantToDOM);
        activities.forEach(addActivityToDOM);
        expenses.forEach(addExpenseToDOM);
        updateCostSplitting();
        updatePayerDropdown();
    }

    // Custom alert functions
    closeButton.addEventListener('click', function () {
        customAlertModal.style.display = 'none';
    });

    window.onclick = function (event) {
        if (event.target == customAlertModal) {
            customAlertModal.style.display = 'none';
        }
        if (event.target == confirmModal) {
            confirmModal.style.display = 'none';
        }
    };

    function showAlert(message) {
        alertMessage.textContent = message;
        customAlertModal.style.display = 'block';
    }

    function showConfirm(message, continueCallback) {
        confirmMessage.textContent = message;
        confirmModal.style.display = 'block';
        continueButton.onclick = () => {
            continueCallback();
        };
        cancelButton.onclick = closeModal;
    }

    function closeModal() {
        confirmModal.style.display = 'none';
    }

    // Participant Functions
    addParticipantButton.addEventListener('click', function () {
        const name = participantNameInput.value;
        if (name && !participants.includes(name)) {
            participants.push(name);
            localStorage.setItem('participants', JSON.stringify(participants));
            addParticipantToDOM(name);
            participantNameInput.value = '';
            updatePayerDropdown();
        }
    });

    function addParticipantToDOM(name) {
        const li = document.createElement('li');
        li.textContent = name;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.style.marginLeft = '10px';
        removeButton.addEventListener('click', function () {
            participantToRemove = name;
            const userExpenses = expenses.filter(expense => expense.payer === name);
            const amountOwed = calculateAmountOwed(name);

            if (userExpenses.length > 0) {
                showConfirm(
                    `Are you sure? Removing ${name} will also remove all expense loggings related to them.`,
                    function () {
                        confirmModal.style.display = 'none';
                        showConfirm(
                            `Are you sure you want to remove ${name}? ${name} ${amountOwed > 0 ? 'is owed' : 'owes'} ₦${Math.abs(amountOwed).toFixed(2)}`,
                            function () {
                                confirmModal.style.display = 'none';
                                removeParticipant(name);
                            }
                        );
                    }
                );
            } else {
                showConfirm(
                    `Are you sure you want to remove ${name}? ${name} ${amountOwed > 0 ? 'is owed' : 'owes'} ₦${Math.abs(amountOwed).toFixed(2)}`,
                    function () {
                        confirmModal.style.display = 'none';
                        removeParticipant(name);
                    }
                );
            }
        });

        li.appendChild(removeButton);
        participantsList.appendChild(li);

        checkScroll(participantsList);
    }

    function updatePayerDropdown() {
        payerSelect.innerHTML = ''; // Clear current options
        participants.forEach(participant => {
            const option = document.createElement('option');
            option.value = participant;
            option.textContent = participant;
            payerSelect.appendChild(option);
        });
    }

    function calculateAmountOwed(participantName) {
        const totalCost = expenses.reduce((acc, expense) => acc + expense.amount, 0);
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
        return shares[participantName] - perPersonShare;
    }

    function removeParticipant(participantName) {
        participants = participants.filter(participant => participant !== participantName);
        localStorage.setItem('participants', JSON.stringify(participants));
        removeParticipantExpenses(participantName);
        updateCostSplitting();
        updatePayerDropdown();
        renderParticipants();
    }

    function removeParticipantExpenses(participantName) {
        expenses = expenses.filter(expense => expense.payer !== participantName);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    }

    function renderParticipants() {
        participantsList.innerHTML = '';
        participants.forEach(addParticipantToDOM);
    }

    function renderExpenses() {
        expensesList.innerHTML = '';
        expenses.forEach(addExpenseToDOM);
    }

    // Activity Functions
    addActivityButton.addEventListener('click', function () {
        const activity = activityNameInput.value;
        if (activity) {
            activities.push(activity);
            localStorage.setItem('activities', JSON.stringify(activities));
            addActivityToDOM(activity);
            activityNameInput.value = '';
        }
    });

    function addActivityToDOM(activity) {
        const li = document.createElement('li');
        li.textContent = activity;
        li.style.cursor = 'pointer';

        li.addEventListener('click', function () {
            if (li.style.textDecoration === 'line-through') {
                li.style.textDecoration = 'none';
            } else {
                li.style.textDecoration = 'line-through';
            }
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.style.marginLeft = '10px';
        removeButton.addEventListener('click', function () {
            showConfirm('Are you sure you want to remove this activity?', function () {
                activitiesList.removeChild(li);
                activities = activities.filter(act => act !== activity);
                localStorage.setItem('activities', JSON.stringify(activities));
                closeModal();
            });
        });

        li.appendChild(removeButton);
        activitiesList.appendChild(li);

        checkScroll(activitiesList);
    }

    // Expense Functions
    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const payer = payerSelect.value;
        const now = new Date();
        const date = `${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`;  // Automatically adding date and time

        if (!participants.includes(payer)) {
            showAlert('The payer must be a participant.');
            return;
        }

        const expense = { amount, category, payer, date };
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));

        addExpenseToDOM(expense);
        expenseForm.reset();
        updateCostSplitting();
    });

    function addExpenseToDOM(expense) {
        const li = document.createElement('li');
        li.textContent = `${expense.category}: ₦${expense.amount.toFixed(2).replace(/\.00$/, '')} paid by ${expense.payer} at ${expense.date}`;  // Remove .00 from amount

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.style.marginLeft = '10px';
        removeButton.addEventListener('click', function () {
            showConfirm('Are you sure you want to remove this expense?', function () {
                expensesList.removeChild(li);
                expenses = expenses.filter(exp => exp !== expense);
                localStorage.setItem('expenses', JSON.stringify(expenses));
                updateCostSplitting();
                closeModal();
            });
        });

        li.appendChild(removeButton);
        expensesList.appendChild(li);

        checkScroll(expensesList);
    }

    // Cost Splitting Functions
    function updateCostSplitting() {
        const totalCost = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        tripCostElement.textContent = `₦${totalCost.toFixed(2)}`;

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

        sharesList.innerHTML = '';

        participants.forEach(participant => {
            const share = shares[participant] - perPersonShare;
            const li = document.createElement('li');
            if (share > 0) {
                li.textContent = `${participant} is owed ₦${share.toFixed(2).replace(/\.00$/, '')}`;
            } else {
                li.textContent = `${participant} owes ₦${Math.abs(share).toFixed(2).replace(/\.00$/, '')}`;
            }
            sharesList.appendChild(li);
        });

        checkScroll(sharesList);
    }

    // Reports Functions
    generateSummaryButton.addEventListener('click', function () {
        let summary = 'Trip Summary:\n\n';
        const totalCost = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        summary += `Total Cost: ₦${totalCost.toFixed(2).replace(/\.00$/, '')}\n\n`;
        summary += 'Expenses:\n';

        expenses.forEach(expense => {
            summary += `${expense.category}: ₦${expense.amount.toFixed(2).replace(/\.00$/, '')} paid by ${expense.payer} at ${expense.date}\n`;
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
                summary += `${participant} is owed ₦${share.toFixed(2).replace(/\.00$/, '')}\n`;
            } else {
                summary += `${participant} owes ₦${Math.abs(share).toFixed(2).replace(/\.00$/, '')}\n`;
            }
        });

        summaryContent.textContent = summary.replace(/\n/g, '\n\n');
    });

    exportDataButton.addEventListener('click', function () {
        const jsPDF = window.jspdf.jsPDF;
        const doc = new jsPDF();

        doc.text(summaryContent.textContent, 10, 10);
        doc.save('trip-summary.pdf');
    });

    // Navigation
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

    // Initialize the app
    initialize();

    function checkScroll(element) {
        const maxItems = 4;
        if (element.children.length > maxItems) {
            element.classList.add('scrollable');
            element.classList.remove('unscrollable');
        } else {
            element.classList.add('unscrollable');
            element.classList.remove('scrollable');
        }
    }
    
});
