// Function to simulate typing character by character in an input field
function simulateTyping(field, value) {
    let index = 0;
    field.value = ""
    // Function to type one character at a time
    function typeCharacter() {
        if (index < value.length) {
            field.value += value[index]; // Add one character
            field.dispatchEvent(new Event("input", { bubbles: true })); // Simulate user typing
            index++;
            setTimeout(typeCharacter, 100); // Type next character after a short delay
        } else {
            field.dispatchEvent(new Event("change", { bubbles: true })); // Ensure websites detect the change
        }
    }

    typeCharacter(); // Start the typing simulation
}

// Function to fill the fields with autofill data (character by character)
function fillFields() {
    console.log("fillFields function is running");

    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userData) {
        console.log("User data found:", userData);

        // Loop through all the input fields on the page
        document.querySelectorAll("input").forEach((field) => {
            let fieldName = field.getAttribute("name") || field.getAttribute("id") || "";

            if (fieldName) {
                console.log(`Detected field: ${fieldName}`);
            }

            // If there's a value for the field, fill it character by character
            let value = userData[fieldName];

            if (value) {
                console.log(`Filling ${fieldName} with value: ${value}`);
                simulateTyping(field, value); // Simulate typing character by character
            }
        });

        console.log("Total input fields:", document.querySelectorAll("input").length);
        console.log("Hidden input fields:", document.querySelectorAll("input[type='hidden']").length);
    } else {
        console.log("No user data found in localStorage.");
    }
}

// Function to simulate typing in the Google search bar
function simulateTypingAndSearch() {
    const searchInput = document.querySelector("textarea[name='q']"); // Google search bar
    console.log("Search input found:", searchInput);

    if (searchInput) {
        searchInput.focus(); // Focus on the input field
        searchInput.value = ""; // Clear the input field
        let text = "Princess Polly"; // The text to type
        let index = 0;

        function typeCharacter() {
            if (index < text.length) {
                searchInput.value += text[index]; // Add one character
                searchInput.dispatchEvent(new Event("input", { bubbles: true })); // Simulate user typing
                index++;
                setTimeout(typeCharacter, 100); // Type next character after delay
            } else {
                setTimeout(() => {
                    console.log("Simulating Enter key press");

                    const enterKeyEvent = new KeyboardEvent("keydown", {
                        bubbles: true,
                        cancelable: true,
                        key: "Enter",
                        code: "Enter",
                        keyCode: 13,
                        which: 13
                    });

                    searchInput.dispatchEvent(enterKeyEvent); // Simulate Enter key press
                }, 500); // Small delay before pressing Enter
            }
        }

        typeCharacter(); // Start typing simulation
    } else {
        console.log("Search input field not found!");
    }
}

// Function to click the search result by title
function clickResultByTitle(title) {
    const results = document.querySelectorAll("div[role='heading']"); // Get all search result titles
    console.log("Search result titles found:", results); // Log the results to see if you're selecting them correctly

    for (let result of results) {
        console.log("Checking result:", result.innerText); // Log the inner text of each result

        if (result.innerText.includes(title)) { // Match the title
            console.log(`Found matching title: ${title}`);
            
            // Scroll to the result before clicking
            result.scrollIntoView({ behavior: "smooth", block: "start" });  // Scroll smoothly to the result
            setTimeout(() => {
                console.log(`Clicking on search result: ${title}`);
                result.closest("a").click(); // Click the link containing the title
            }, 1000);  // Small delay before clicking after scrolling
            return;
        }
    }

    console.log(`No search result found with title: ${title}`);
}

// Function to start the autofill action
function startAutofillAction() {
    console.log("Starting Autofill Action...");
    fillFields();  // Call the function to autofill the fields
    setTimeout(() => {
        console.log("About to simulate typing and search...");
        simulateTypingAndSearch();
    }, 2000); // Simulate typing and search after a delay
}

// Fetch user data from chrome.storage.local and send it to the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getUserData") {
		console.log("fetching")
        localStorage.getItem("userData", JSON.stringify(userData));
        console.log("User data saved to localStorage:", userData);
    }
});


// Listen for the message from popup.js to start the autofill action
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startAutofillAction") {
        startAutofillAction();
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received in content script:', message);
  
    if (message.color) {
      document.body.style.backgroundColor = message.color;
    }
  
    if (message.message) {
      console.log(message.message);
    }
  
    // Send a response back to the background script
    sendResponse({ status: 'Success', receivedData: message });
  });

// Listen for the message from popup.js to save user data to localStorage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "saveUserData") {
        const { userData } = message;
        // Save the userData to localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
        console.log("User data saved to localStorage:", userData);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendMessageAndSearchPrompt") {
        const { msg, search_prompt } = message.data;

        console.log("Received reply and search prompt in content script:");
        console.log("Message:", msg);
        console.log("Search Prompt:", search_prompt);

        // Perform actions with the received data
        // For example, update the DOM or trigger a search
        document.body.style.backgroundColor = "orange"; // Example action
        console.log("Updated background color and logged search prompt.");

        // Send a response back to the background script (optional)
        sendResponse({ status: "success", message: "Appointment data received and processed." });
    }
});
