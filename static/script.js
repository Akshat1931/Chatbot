document.getElementById("send-button").addEventListener("click", sendMessage);

document.getElementById("user-input").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const userMessage = document.getElementById("user-input").value;
    if (userMessage) {
        // Display the user's message
        displayUserMessage(userMessage);

        // Disable the input and button during bot response
        disableUserInput(true);

        // Simulate typing indicator (moving dot)
        simulateTypingIndicator();

        // Send AJAX request to Flask server
        const formData = new FormData();
        formData.append('user_message', userMessage);

        fetch('/get_response', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            // Display the chatbot's response
            displayChatbotMessage(data.response);
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            // Enable the input and button after bot response
            disableUserInput(false);

            // Clear typing indicator after bot response
            clearTypingIndicator();
        });

        // Clear the user input
        document.getElementById("user-input").value = "";
    }
}

function simulateTypingIndicator() {
    const chatBox = document.getElementById("chat-boxes");
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "chat chatbot typing";
    typingIndicator.innerHTML = `<div class="chat-avatar"></div><div class="chat-message chatbot-message"></div>`;
    chatBox.appendChild(typingIndicator);
}

function clearTypingIndicator() {
    const typingIndicator = document.querySelector(".chatbot.typing");
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function displayUserMessage(message) {
    const chatBox = document.getElementById("chat-boxes");
    const userChat = document.createElement("div");
    userChat.className = "chat user";
    userChat.innerHTML = `<div class="chat-message user-message">${message}</div>`;
    chatBox.appendChild(userChat);
}

function displayChatbotMessage(message) {
    const chatBox = document.getElementById("chat-boxes");
    const chatbotChat = document.createElement("div");
    chatbotChat.className = "chat chatbot";
    chatbotChat.innerHTML = `<div class="chat-avatar"></div><div class="chat-message chatbot-message">${message}</div>`;
    chatBox.appendChild(chatbotChat);
}

function disableUserInput(disabled) {
    document.getElementById("user-input").disabled = disabled;
    document.getElementById("send-button").disabled = disabled;
}