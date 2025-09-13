// =================
// Constants
// =================
// Fixed values used throughout the code
// e.g., defaultLibraryData, maxBooks
const MAX_BOOKS = 100;
const DEFAULT_PAGE_SIZE = 50;

// =================
// Utility Functions
// =================
// Generic functions that can be reused anywhere
// e.g., createElement, clearChildren, addClass
// #region
// -----------
// Random Helpers
// -----------
function generateUUID() {
    // Placeholder for UUID generation
    return crypto.randomUUID();
}

function formatTitle(title) {
    return title.trim();
}

// -----------
// DOM Helpers
// -----------
function createElement(tag, classNames = [], textContent = "") {
    const el = document.createElement(tag);
    classNames.forEach(cls => el.classList.add(cls));
    el.textContent = textContent;
    return el;
}

function createButton(classNames = [], textContent = "", onClick) {
    const btn = createElement("button", classNames, textContent)
    btn.addEventListener("click", onClick);
    return btn;
}


// #endregion

// =================
// Objects / Constructors / Classes
// =================
// e.g., Book constructor or class
// #region
class Book {
    constructor(id, title, author, pages, read) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read ? "already been read" : "not read yet";
    }

    info() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
    }
}

// #endregion

// =================
// Data / State
// =================
// Your mutable application state
// e.g., myLibrary = []
// #region
const myLibrary = [];
// #endregion

// =================
// Domain-Specific Functions
// =================
// e.g., addBookToLibrary, removeBookFromLibrary, toggleReadStatus
// #region

// #endregion

// =================
// DOM Functions
// =================
// Functions that handle rendering data to the DOM
// e.g., addTableRow, addTableHeader, insertColgroup
// #region
// -----------
// Table Header
// -----------
function addTableHeader(obj, thead) {
    const newRow = createElement("tr", ["library-head-row"]);

    // Add table header cells
    Object.keys(obj).forEach(key => {
        const newCell = createElement("th", ["library-head-cell"]);
        newCell.setAttribute("scope", "col");
        newCell.textContent = key;
        newRow.appendChild(newCell);
    });

    thead.appendChild(newRow);
}

// -----------
// Table Rows
// -----------
function addTableRow(obj, tbody) {
    const newRow = createElement("tr", ["library-record"]);

    Object.entries(obj).forEach(([key, value]) => {
        const newCell = createElement("td", ["library-cell"]);
        newCell.textContent = value;
        newRow.appendChild(newCell);
    });

    tbody.appendChild(newRow);
}
// #endregion

// =================
// Main Execution Block / Script Body
// =================
// Calls to initialize data, render tables, attach event listeners
// #region
function main() {
    // Add books
    myLibrary.push(new Book(generateUUID(), "The Hobbit", "J.R.R. Tolkien", 295, false));
    myLibrary.push(new Book(generateUUID(), "To Kill a Mockingbird", "Harper Lee", 320, true));

    // Example table rendering
    const table = document.getElementById("libraryTable");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    addTableHeader(myLibrary[0], thead);

    myLibrary.forEach(book => addTableRow(book, tbody));
}

// Run main
main();

// #endregion