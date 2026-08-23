from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)

CORS(app)

# Load trained model
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "logistic_regression.pkl"
)

model = joblib.load(MODEL_PATH)

# Features used during model training
FEATURES = [
    "step",
    "amount",
    "oldbalanceOrg",
    "newbalanceOrig",
    "oldbalanceDest",
    "newbalanceDest",
    "isFlaggedFraud",
    "type_CASH_IN",
    "type_CASH_OUT",
    "type_DEBIT",
    "type_PAYMENT",
    "type_TRANSFER"
]


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "TrustPay Fraud Detection API is running"
    })


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    transaction = pd.DataFrame([data])

    # Make sure columns are in the same order as training
    transaction = transaction[FEATURES]

    prediction = model.predict(transaction)[0]

    probability = model.predict_proba(transaction)[0][1]

    if prediction == 1:
        result = "FRAUDULENT TRANSACTION"
    else:
        result = "NON-FRAUDULENT TRANSACTION"

    return jsonify({
        "prediction": int(prediction),
        "result": result,
        "fraud_probability": float(probability)
    })


if __name__ == "__main__":
    app.run(debug=True)
