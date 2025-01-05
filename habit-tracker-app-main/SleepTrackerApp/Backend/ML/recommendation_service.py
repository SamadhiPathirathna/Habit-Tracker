from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Load the trained recommendation model
with open("best_recommendation_model.pkl", "rb") as f:
    recommendation_model = pickle.load(f)

# Preprocess the user data to match the model’s expected input format
def preprocess_user_data(user_data):
    # Create a DataFrame from the incoming user data
    df = pd.DataFrame([user_data])

    # List of categorical columns that require one-hot encoding
    categorical_columns = ["Gender", "Lifestyle", "Habit 01", "Habit 02", "Habit 03", "Habit 04", "Habit 05", "Habit 06"]

    # Ensure these columns exist before one-hot encoding
    for col in categorical_columns:
        if col not in df.columns:
            df[col] = None  # Add missing columns with a default value (e.g., None or an empty string)

    # One-hot encode the categorical columns
    df = pd.get_dummies(df, columns=categorical_columns, dummy_na=True)

    # Align the DataFrame with the model's expected features
    for col in recommendation_model.feature_names_in_:
        if col not in df.columns:
            df[col] = 0  # Fill missing columns with zeros

    return df[recommendation_model.feature_names_in_].values[0]

# Define the recommendation route
@app.route('/recommendation', methods=['POST'])
def get_recommendation():
    data = request.get_json()
    print("Received data:", data)  # Debugging: display received data

    # Check for required fields in request data
    required_fields = ["age", "gender", "lifestyle", "habits"]
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"error": f"Missing required field(s): {', '.join(missing_fields)}"}), 400

    try:
        # Preprocess data to fit the model’s input format
        user_features = preprocess_user_data(data)

        # Generate probability predictions for each class
        probabilities = recommendation_model.predict_proba([user_features])[0]
        classes = recommendation_model.classes_

        # Select the top 3 habits with the highest probabilities
        top_n = 3
        top_indices = probabilities.argsort()[-top_n:][::-1]
        top_recommendations = [{"habit": classes[i], "probability": probabilities[i]} for i in top_indices]

        # Return JSON response with top recommendations
        return jsonify({"recommended_habits": top_recommendations})
    except Exception as e:
        # Log any errors that occur in the recommendation process
        print("Error in recommendation function:", e)
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5001)
