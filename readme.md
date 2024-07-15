# Split SPA

## Overview

Split is a single-page application designed to help users plan trips, log expenses, split costs, and generate reports. The application is built with HTML, CSS, and JavaScript to provide a user-friendly and responsive interface.

## Features

1. **Trip Planning**
   - Manage participants by adding and removing them from the trip.
   - Plan activities and mark them as done.

2. **Expense Logging**
   - Add new expenses with details like amount, category, payer, and date.
   - Display a list of all logged expenses.

3. **Cost Splitting**
   - Calculate the total cost of the trip.
   - Determine each participant's share of the total cost based on the expenses they are part of.
   - Show real-time updates of who owes what.

4. **Reports**
   - Generate a summary of all expenses for the trip.
   - Show a breakdown of expenses for each participant.
   - Export data to a PDF file.

## Directory Structure

```plaintext
project/
├── index.html
├── styles.css
└── script.js


Setup and Usage
HTML Structure
The HTML structure includes sections for trip planning, expense logging, cost splitting, and reports. Each section contains forms and lists to manage and display data.

CSS Styling
The CSS uses Flexbox for layout management, ensuring a responsive design that adapts to both mobile and desktop views. The design follows a clean and modern travel-themed color scheme.

JavaScript Functionality
The JavaScript file (script.js) handles the following:

Form submissions for creating new trips and adding expenses.
Adding and removing participants.
Marking activities as done.
Calculating and displaying cost splitting information.
Generating and exporting reports.
Initial Setup
Trip Planning

Users can create a new trip by filling out the form with destination, start date, and end date.
Participants can be added to the trip, and their names will be displayed in a list. Clicking on a participant's name will remove them from the list.
Activities can be added to the trip. Clicking on an activity will mark it as done.
Expense Logging

Users can log expenses by filling out the form with amount, category, payer, and date.
The expenses are displayed in a list below the form.
Cost Splitting

The total cost of the trip is calculated based on the logged expenses.
Each participant's share of the total cost is determined and displayed in a list.
Reports

A summary of all expenses is generated and displayed when the "Generate Summary" button is clicked.
The summary can be exported to a PDF file using the "Export Data" button.
Example Usage
Create a new trip by filling out the "Create a New Trip" form.
Add participants and activities to the trip.
Log expenses by filling out the "Add New Expense" form.
View the cost splitting information in the "Cost Splitting" section.
Generate and export a summary of expenses in the "Reports" section.