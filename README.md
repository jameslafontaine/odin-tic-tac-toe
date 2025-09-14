# Odin Tic Tac Toe

A modular JavaScript Tic Tac Toe game built as part of [The Odin Project](https://www.theodinproject.com/) curriculum.
This project focuses on **modules** and **factory functions** for encapsulating game logic, managing state,
and creating a maintainable, interactive user interface.

## Project Description

This project implements the classic Tic Tac Toe game with a modern, modular JavaScript architecture. It emphasizes
**encapsulation**, **separation of concerns**, and **interactive UI updates**. The game logic is fully abstracted into
modules, while player objects and the cells are managed using factory functions.

---

## Features

### Game Logic

-   Modular design with separate modules for the **game controller**, **game board**, and **players**.
-   Uses **factory functions** for creating player objects with private state (name, mark, score).
-   Implements **encapsulated counters** for rows, columns, and diagonals to efficiently detect wins.
-   Supports **draw detection** based on turn count.

### UI / UX Enhancements

-   Interactive **clickable grid** for placing marks.
-   Turn-based feedback showing which player’s turn it is.
-   Ability to **change player names** mid-game.
-   Clear visual indicators for wins, draws, and invalid moves.
-   Dynamic messages and status updates for better user guidance.

### Encapsulation & Code Organization

-   **Game board module** handles cell management and mark placement.
-   **Game controller module** orchestrates turns, win/draw detection, and player actions.
-   **Player factory functions** manage private data, exposing only controlled methods.
-   Click handlers and DOM updates are **decoupled** from game logic, maintaining separation of concerns.

### Buttons and Controls

-   **New Game button** to reset the board while keeping or resetting player names.
-   Modular button creation and grid updates for maintainability.

---

## Learning Objectives

This project demonstrates:

-   **Modules & Factory Functions**: Encapsulating game state and logic while exposing only necessary interfaces.
-   **Closures & Private State**: Protecting player data and internal counters from external manipulation.
-   **DOM Manipulation**: Dynamically updating the game grid and status messages.
-   **Event Handling**: Efficiently managing clicks, turns, and UI updates.
-   **Separation of Concerns**: Keeping UI rendering, game logic, and state management distinct.
-   **Code Scalability**: Writing modular code that can be extended with new features or larger board sizes.

---

## Live Demo

[Odin Tic Tac Toe Live Demo](https://jameslafontaine.github.io/odin-tic-tac-toe/)

---

## Future Improvements

-   **Persistent game state** using `localStorage` to resume games across sessions.
-   **Customizable board size** and win conditions for more flexibility.
-   Enhanced **visual feedback** for winning lines or last move highlights.
-   Improved UI design.
-   **Accessibility improvements**: ARIA labels, keyboard navigation, and color contrast adjustments.
-   Refactor grid and buttons into reusable components for potential AI opponents or multiplayer.
-   Implement an AI opponent that can be enabled / disabled.

---

## License

This project is for educational purposes and follows The Odin Project curriculum guidelines.
