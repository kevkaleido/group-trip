// Importing the necessary modules
import { JSDOM } from 'jsdom';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

// Setting up a new DOM environment for each test
let dom, container;

beforeEach(() => {
    dom = new JSDOM(`
        <body>
            <ul id="participants-list"></ul>
            <ul id="activities-list"></ul>
            <ul id="expenses"></ul>
            <ul id="shares-list"></ul>
            <span id="trip-cost"></span>
            <select id="expense-payer"></select>
        </body>
    `, { runScripts: "dangerously" });
    container = dom.window.document.body;
});

// Mock data
let participants = ['Alice', 'Bob'];
const activities = ['Hiking', 'Swimming'];
let expenses = [
    { amount: 100, category: 'Food', payer: 'Alice', date: '01-01-2023' },
    { amount: 50, category: 'Transport', payer: 'Bob', date: '02-01-2023' }
];

// Functions to be tested (without localStorage dependency)
function initialize() {
    participants.forEach(addParticipantToDOM);
    activities.forEach(addActivityToDOM);
    expenses.forEach(addExpenseToDOM);
    updateCostSplitting();
    updatePayerDropdown();
}

function addParticipantToDOM(name) {
    const li = document.createElement('li');
    li.textContent = name;
    container.querySelector('#participants-list').appendChild(li);
}

function addActivityToDOM(activity) {
    const li = document.createElement('li');
    li.textContent = activity;
    container.querySelector('#activities-list').appendChild(li);
}

function addExpenseToDOM(expense) {
    const li = document.createElement('li');
    li.textContent = `${expense.category}: ₦${expense.amount.toFixed(2)} paid by ${expense.payer} on ${expense.date}`;
    container.querySelector('#expenses').appendChild(li);
}

function updateCostSplitting() {
    const totalCost = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    container.querySelector('#trip-cost').textContent = `₦${totalCost.toFixed(2)}`;

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
    const sharesList = container.querySelector('#shares-list');
    sharesList.innerHTML = '';

    participants.forEach(participant => {
        const share = shares[participant] - perPersonShare;
        const li = document.createElement('li');
        li.textContent = share > 0 ? `${participant} is owed ₦${share.toFixed(2)}` : `${participant} owes ₦${Math.abs(share).toFixed(2)}`;
        sharesList.appendChild(li);
    });
}

function updatePayerDropdown() {
    const payerSelect = container.querySelector('#expense-payer');
    payerSelect.innerHTML = '';
    participants.forEach(participant => {
        const option = document.createElement('option');
        option.value = participant;
        option.textContent = participant;
        payerSelect.appendChild(option);
    });
}

function removeParticipant(participantName) {
    participants = participants.filter(participant => participant !== participantName);
    removeParticipantExpenses(participantName);
    updateCostSplitting();
    updatePayerDropdown();
    renderParticipants();
}

function removeParticipantExpenses(participantName) {
    expenses = expenses.filter(expense => expense.payer !== participantName);
    renderExpenses();
}

function renderParticipants() {
    const participantsList = container.querySelector('#participants-list');
    participantsList.innerHTML = '';
    participants.forEach(addParticipantToDOM);
}

function renderExpenses() {
    const expensesList = container.querySelector('#expenses');
    expensesList.innerHTML = '';
    expenses.forEach(addExpenseToDOM);
}

function exportData() {
    const jsPDF = require('jspdf');
    const doc = new jsPDF();
    doc.text('Trip Summary', 10, 10);
    doc.save('trip-summary.pdf');
}

// Tests
test('initialize function populates the DOM with participants, activities, and expenses', () => {
    initialize();
    expect(container.querySelectorAll('#participants-list li').length).toBe(participants.length);
    expect(container.querySelectorAll('#activities-list li').length).toBe(activities.length);
    expect(container.querySelectorAll('#expenses li').length).toBe(expenses.length);
    expect(container.querySelector('#trip-cost').textContent).toBe(`₦${expenses.reduce((acc, exp) => acc + exp.amount, 0).toFixed(2)}`);
});

test('removeParticipant removes a participant and their expenses', () => {
    initialize();
    const participantToRemove = 'Alice';
    removeParticipant(participantToRemove);
    expect(container.querySelectorAll('#participants-list li').length).toBe(participants.length - 1);
    expect(container.querySelectorAll('#expenses li').length).toBe(expenses.filter(exp => exp.payer !== participantToRemove).length);
});

test('updateCostSplitting calculates and displays the correct cost sharing', () => {
    initialize();
    const totalCost = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const perPersonShare = totalCost / participants.length;
    const shares = {};

    participants.forEach(participant => {
        shares[participant] = 0;
    });

    expenses.forEach(expense => {
        if (participants.includes(expense.payer)) {
            shares[expense.payer] += expense.amount;
        }
    });

    const expectedShares = participants.map(participant => {
        const share = shares[participant] - perPersonShare;
        return share > 0 ? `${participant} is owed ₦${share.toFixed(2)}` : `${participant} owes ₦${Math.abs(share).toFixed(2)}`;
    });

    const shareElements = Array.from(container.querySelectorAll('#shares-list li')).map(el => el.textContent);
    expect(shareElements).toEqual(expectedShares);
});

test('exportData exports the trip summary as a PDF', () => {
    const mockSave = jest.fn();
    jest.mock('jspdf', () => {
        return jest.fn().mockImplementation(() => {
            return { text: jest.fn(), save: mockSave };
        });
    });

    exportData();
    expect(mockSave).toHaveBeenCalledWith('trip-summary.pdf');
});
