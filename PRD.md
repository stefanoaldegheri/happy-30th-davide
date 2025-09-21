Of course. Executing the prompt.

---

### **Technical Specification: Interactive Gift Application**

#### 1. Project Overview

This document outlines the complete technical specification for a personalized, interactive web application designed as a unique digital gift experience. The project seamlessly blends a physical object (a book) with a browser-based application, guiding a user through a series of puzzles to unlock a final, hidden webpage. The entire experience is self-contained, running exclusively on the client-side, and is architected for simplicity, privacy, and zero operational cost.

#### 2. Key Features

*   **QR Code Entry:** The experience is initiated by scanning a physical QR code inside a book.
*   **Client-Side Architecture:** The entire application runs in the user's browser with no backend or server communication required, ensuring privacy and performance.
*   **Static Hosting:** The solution is deployed across two separate static sites (e.g., GitHub Pages) for a clean separation of the puzzle app and the final gift.
*   **Interactive Chess Puzzle:** Users must solve a specific chess problem by making the correct sequence of moves on an interactive board.
*   **Camera-Based OCR:** The application uses the device's camera to perform Optical Character Recognition (OCR) on a block of text printed in the physical book.
*   **Overlay Reveal Mechanism:** A digital overlay of the final chessboard is superimposed on the recognized text, revealing a secret message when an opacity slider is used.
*   **Hyperlink Reward:** The successfully decoded message becomes a clickable hyperlink, redirecting the user to the final gift page.

#### 3. Technical Architecture

##### 3.1. Technology Stack

*   **Core:** HTML5, CSS3, JavaScript (ES6+)
*   **Chess Logic:** **`Chess.js`** - A powerful JavaScript library used to validate moves, manage game states, and handle all chess rules.
*   **Chess UI:** **`Chessboard.js`** - A JavaScript library for rendering a responsive, interactive, and themeable chessboard UI with drag-and-drop functionality.
*   **OCR Engine:** **`Tesseract.js`** - A JavaScript port of the Tesseract OCR engine that runs directly in the browser via WebAssembly, enabling client-side image-to-text conversion.
*   **Testing:** Jest for unit testing, Playwright with MCP server tool for end-to-end testing

##### 3.2. Client-Side-Only Rationale

A client-side architecture was chosen for several key reasons:
*   **Zero Cost:** Hosting static files on services like GitHub Pages is free. No server or database costs are incurred.
*   **Simplicity & Maintainability:** The lack of a backend eliminates the need for server management, API development, or database administration. The entire application is a self-contained package of static assets.
*   **Performance:** Once the initial assets are loaded, all interactions (game logic, OCR processing) are executed directly on the user's device, resulting in instant feedback without network latency.
*   **Privacy:** The camera image is processed locally and is never uploaded to a server, ensuring the user's privacy.

##### 3.3. Two-Repository Hosting Strategy

The project will be deployed across two independent GitHub repositories, each with GitHub Pages enabled:
1.  **`enigma-app` Repository:** Hosts the main puzzle application. Its URL will be embedded in the QR code.
2.  **`regalo-segreto` Repository:** Hosts the final gift webpage. This URL is kept hidden within the `enigma-app`'s code until the puzzle is solved.

This separation of concerns ensures that the complex puzzle logic is decoupled from the final gift content, making each part easier to manage and update independently.

#### 4. Component Breakdown

##### 4.1. Welcome Module
*   **Functionality:** A simple, static landing page that is displayed upon loading the app. It will contain a personalized welcome message and a "Begin" button to start the experience.

##### 4.2. Chess Puzzle Module
*   **Functionality:** This module presents the interactive chess challenge.
    *   The board is initialized to the specific starting position of the puzzle.
    *   The user can only control the White pieces.
    *   The application listens for piece drop events. `Chess.js` validates the move.
    *   If the move is correct according to the predefined solution sequence, the app automatically performs the corresponding Black counter-move.
    *   If the move is incorrect, the piece snaps back to its original square.
    *   Upon delivering the final checkmate, a success modal appears, and a "Continue" button is enabled.

##### 4.3. OCR & Validation Module
*   **Functionality:** Handles the text recognition part of the puzzle.
    *   Uses the `navigator.mediaDevices.getUserMedia` API to request camera access.
    *   Displays a real-time video feed.
    *   A "Scan" button captures a frame from the video stream.
    *   The captured image is passed to `Tesseract.js` for processing.
    *   The recognized text is cleaned (e.g., removing extra spaces/line breaks) and compared against a hardcoded string of the correct text to validate it.
    *   Upon successful validation, the app transitions to the next module.

##### 4.4. Reveal Module
*   **Functionality:** The core reveal mechanism.
    *   The validated text (with original spacing) is rendered inside an HTML element styled as an 8x16 grid.
    *   An HTML/CSS overlay, representing the final chessboard layout, is positioned absolutely on top of the text grid.
    *   An `<input type="range">` slider is displayed.
    *   The slider's value is linked via JavaScript to the `opacity` of the overlay's empty squares. At 0%, the text is fully visible. At 100%, the empty squares are fully opaque, leaving only the letters under the chess pieces visible.
    *   The revealed letters, read top-to-bottom, left-to-right, spell `davidesthirty`.

##### 4.5. Final Link Module
*   **Functionality:** Presents the final reward.
    *   An HTML hyperlink (`<a>`) element containing the text `davidesthirty` is initially hidden with CSS (`display: none`).
    *   Its `href` attribute is hardcoded to the URL of the `regalo-segreto` GitHub Page.
    *   Once the reveal module is successfully completed, JavaScript removes the hiding class, making the hyperlink visible and clickable.

#### 5. Detailed User Flow

1.  The user receives a book and finds a QR code inside.
2.  They scan the QR code with their mobile device, which opens the web application URL in their browser.
3.  The Welcome screen appears. The user taps "Begin".
4.  The Chess Puzzle screen loads, showing the board. The user must figure out and execute the correct sequence of moves for White. The app responds with Black's moves automatically.
5.  After delivering checkmate, a "Congratulations!" message appears. The user taps "Continue".
6.  The OCR screen appears, activating the camera. The user points their camera at the specific block of text printed in the book and taps "Scan".
7.  The app validates the text. Upon success, it displays the text formatted as a grid.
8.  The chessboard overlay and an opacity slider appear. The user moves the slider, which gradually hides the extraneous letters, revealing the secret message `davidesthirty`.
9.  Once the message is clear, the app displays `davidesthirty` as a stylized, clickable hyperlink.
10. The user clicks the hyperlink and is redirected to the second GitHub Page, which contains the final personalized gift (e.g., a letter, photos, etc.), successfully completing the experience.

#### 6. Asset & Content List

*   **QR Code URL:** `https://<your-github-username>.github.io/enigma-app/`

*   **Block of Text (to be written in the book):**
    ```
    A NEW DECADE AWAITS AHEAD BE BOLD AND READY
    YOUR FUTURE IS CODE TO WRITE AND NEVER DEBUG
    LIFE IS A NEW CHALLENGE NOW ACCEPT THE QUEST
    SO DIVE INTO THE NEXT VERSION OF YOUR STORY
    AND DEBUG EVERY SINGLE ERROR ON YOUR JOURNEY
    STARTING THIS NEW CHAPTER IS HIGHLY EXCITING
    ERRORS ARE JUST A GREAT START TO A NEW SCRIPT
    YOU ARE THE MASTER OF YOUR WAY SO JUST ENJOY
    ```

*   **Final Gift Page Content:** Hosted on the `regalo-segreto` repository. Content to be defined by the creator (e.g., personal message, photo gallery, embedded video).

*   **Chess Puzzle Data:**
    *   **Initial Position (FEN):** `7r/8/4R3/3P1kP1/5p1p/q6P/1p2P1PP/4BNK1 w - - 0 1`
    *   **Solution Sequence (White moves are user-input, Black moves are automated):**
        1.  `e4+` (White) `fxe3` (Black)
        2.  `g4+` (White) `hxg3` (Black)
        3.  `Nxg3+` (White) `Kf4` (Black)
        4.  `Ne2+` (White) `Kf3` (Black)
        5.  `Nd4+` (White) `Kf4` (Black)
        6.  `Bg3#` (White Checkmate)
    *   **Final Position (FEN):** `7r/8/4R3/3P2p1/3k4/q5B1/1p2N2P/6K1 b - - 1 6`