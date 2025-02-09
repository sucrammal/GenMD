const userData = JSON.parse(localStorage.getItem("userData"));
const enter_flag = JSON.parse(localStorage.getItem("entered"));
if (userData) {
	console.log("User data found:", userData);
} else {
	console.log("not found")
}
if (enter_flag) {
	console.log("Enter_flag found:", enter_flag);
	if (enter_flag == 1) {
		console.log("search link")
		clickResultByTitle();
	}
} else {
	fillFields()
}
chrome.storage.local.set({ userData: userData }, function () {
	console.log("userData saved in chrome.storage");
  });
  
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
function simulateTypingAndSearch(field) {
    const searchInput = document.querySelector("textarea[name='q']"); // Google search bar
    console.log("Search input found:", searchInput);
	localStorage.setItem("entered", JSON.stringify(1));
	console.log("saved entered")

    if (searchInput) {
        searchInput.focus(); // Focus on the input field
        searchInput.value = ""; // Clear the input field
        let text = field; // The text to type
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
function clickResultByTitle() {
    const results = Array.from(document.querySelectorAll("div[role='heading']")); // Convert NodeList to Array
    console.log("Search result titles found:", results.length); // Log the number of results

    if (results.length === 0) {
        console.log("No search results found.");
        return;
    }

    // Filter results that contain "Circle Medical"
    const filteredResults = results.filter(result => result.innerText.includes("Circle Medical"));

    if (filteredResults.length === 0) {
        console.log('No results found with "Circle Medical". Selecting a random result instead.');
    }

    // Choose randomly from filtered results if available, otherwise from all results
    const randomIndex = Math.floor(Math.random() * 2);
    const selectedResult = (filteredResults.length > 0 ? filteredResults : results)[randomIndex]; // Prioritize filtered results

    localStorage.setItem("entered", JSON.stringify(2));
    console.log("Saved 'entered' in localStorage");

    console.log("Random index:", randomIndex);
    console.log("Selected result:", selectedResult.innerText);

    // Scroll to the result before clicking
    selectedResult.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
        console.log(`Clicking on search result: ${selectedResult.innerText}`);
        selectedResult.closest("a")?.click(); // Click the link if found
    }, 1000); // Small delay before clicking after scrolling
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
        const { msg, search_prompt, } = message.data;
		console.log("msg" + msg)

        // Ensure page is loaded before performing action
		simulateTypingAndSearch(search_prompt);
		// clickResultByTitle("Same-Day");
        // sendResponse({ status: "success", message: "Appointment data received and processed." });
    };
       
        // Return true to keep the message channel open for async response
        return true;
});

