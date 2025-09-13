// =================
// Constants
// =================


// =================
// Utility Functions
// =================

// -----------
// Random Helpers
// -----------


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

// =================
// Objects / Constructors / Classes
// =================


// =================
// Data / State
// =================



// =================
// Domain-Specific Functions
// =================


// =================
// DOM Manipulation Functions
// =================



// =================
// Main Execution Block / Script Body
// =================
alert("Hello World");
