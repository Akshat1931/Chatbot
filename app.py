from flask import Flask, render_template, request, jsonify
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
import random

app = Flask(__name__, static_folder='static')

# Your existing chatbot setup
chatbot = ChatBot('MyBot')
list_trainer = ListTrainer(chatbot)

# Add your existing custom responses and train the list trainer here
custom_responses = {
    "fine": "That's good to hear!",
    "what do you mean": "I mean, have you felt good today?",
    "Do you hate me?": "I don't hate. I'm here to assist.",
    "nice": "That's great!",
    "who are you": "I'm a friendly chatbot designed to assist you.",
    "tell me a joke": "Sure, here's one: Why did the computer keep freezing? Because it left its Windows open!",
    "how are you": "I'm just a computer program, but I'm here to help!",
    "what's your favorite color": "I don't have a favorite color. How about you?",
    "what's the meaning of life": "The meaning of life is a philosophical question with many different interpretations. What's your take on it?",
    "where do you live": "I exist in the digital world, so you can find me wherever you have an internet connection.",
    "tell me a fun fact": "Sure! Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    "what's the weather like today": "I'm sorry, I can't provide real-time weather information. You can check a weather website or app for the latest updates.",
    "can you sing a song": "I can't sing, but I can provide song lyrics or discuss music. What's your favorite song?",
    "what's your favorite food": "I don't eat, so I don't have a favorite food. But I can help you find recipes or answer food-related questions.",
    # Add more user inputs and their corresponding responses here
}

for user_input, response in custom_responses.items():
    list_trainer.train([user_input, response])

# Existing custom responses
empty_responses = ["Hello there!", "How can I assist you?", "Feel free to ask anything!"]
for response in empty_responses:
    list_trainer.train([response])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    user_message = request.form.get('user_message')

    if not user_message:
        # Handle empty input with a friendly response
        response = random.choice(empty_responses)
    else:
        # Get a response from the chatbot
        response = str(chatbot.get_response(user_message))

        # Update and learn from user input
        if isinstance(response, str):
            list_trainer.train([user_message, response])

    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
