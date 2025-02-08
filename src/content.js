// chrome.storage.sync.get(["autofillData"], (result) => {
//     if (result.autofillData) {

//         // Function to fill the fields with autofill data
//         function fillFields() {
//             console.log("fillFields function is running");

//             document.querySelectorAll("input").forEach((field) => {
//                 let fieldName = field.getAttribute("name") || field.getAttribute("id") || "";

//                 if (fieldName) {
//                     console.log(`Detected field: ${fieldName}`);
//                 }

//                 let value = result.autofillData[fieldName];

//                 if (value) {
//                     console.log(`Filling ${fieldName} with value: ${value}`);
//                     field.value = value;

//                     // Dispatch necessary events to ensure websites detect changes
//                     field.dispatchEvent(new Event("input", { bubbles: true }));
//                     field.dispatchEvent(new Event("change", { bubbles: true }));
//                 }
//             });

//             console.log("Total input fields:", document.querySelectorAll("input").length);
//             console.log("Hidden input fields:", document.querySelectorAll("input[type='hidden']").length);
//         }

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
			// fillFields();
			setTimeout(() => {
				console.log("About to simulate typing and search...");
				simulateTypingAndSearch();
			}, 2000); // Simulate typing and search after a delay
			// setTimeout(() => {
			// 	console.log("Now attempting to click search result...");
			// 	const title = "Latest Princess Polly Arrivals - Outfit"; // The title of the result you want to click
			// 	clickResultByTitle(title);
			// }, 2000); // Click the title after the page loads (wait a bit more for the search results)
		}
		

        // Listen for the message from popup.js to start the autofill action
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === "startAutofillAction") {
                startAutofillAction();
            }
        });

//     } else {
//         console.log("No autofill data found in storage.");
//     }
// });