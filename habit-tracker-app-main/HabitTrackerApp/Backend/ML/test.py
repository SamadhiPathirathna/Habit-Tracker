import requests

# Define the URL of the prediction endpoint
url = 'http://127.0.0.1:5000/predict'

# Define the input data
input_data = {
    'Age': 50,
    'Gender': 'Female',
    'Lifestyle': 'Worker',
    'Habit 01': 'Inbox Zero',
    'Habit 02': 'Daily skincare',
    'Habit 03': 'Keep in touch with friends',
    'Habit 04': 'Cook Dinner',
    'Habit 05': 'Pray',
    'Habit 06': 'Be Grateful'
}

# Send a POST request to the prediction endpoint
response = requests.post(url, json=input_data)

# Check the status code of the response
if response.status_code == 200:
    # Get the prediction from the response
    prediction = response.json()
    print("Predicted Recommendation:", prediction['prediction'])
else:
    print("Error:", response.status_code)
    print(response.text)
