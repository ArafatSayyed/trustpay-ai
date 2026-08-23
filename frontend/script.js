const form = document.getElementById("predictionForm");
const loading = document.getElementById("loading");
const resultBox = document.getElementById("result");
const resultTitle = document.getElementById("resultTitle");
const probabilityText = document.getElementById("probability");
form.addEventListener("submit", async function (event)
{
    event.preventDefault();
    loading.classList.remove("hidden");
    resultBox.classList.add("hidden");
    const transactionType =
        document.getElementById("transactionType").value;
    const data =
    {
        step: Number(document.getElementById("step").value),
        amount: Number(document.getElementById("amount").value),
        oldbalanceOrg:
            Number(document.getElementById("oldbalanceOrg").value),
        newbalanceOrig:
            Number(document.getElementById("newbalanceOrig").value),
        oldbalanceDest:
            Number(document.getElementById("oldbalanceDest").value),
        newbalanceDest:
            Number(document.getElementById("newbalanceDest").value),
        isFlaggedFraud:
            Number(document.getElementById("isFlaggedFraud").value),
        type_CASH_IN: transactionType === "CASH_IN" ? 1 : 0,
        type_CASH_OUT: transactionType === "CASH_OUT" ? 1 : 0,
        type_DEBIT: transactionType === "DEBIT" ? 1 : 0,
        type_PAYMENT: transactionType === "PAYMENT" ? 1 : 0,
        type_TRANSFER: transactionType === "TRANSFER" ? 1 : 0
    };

    try
    {
        const response = await fetch(
            "http://127.0.0.1:5000/predict",
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );
        if (!response.ok)
        {
            throw new Error("Prediction request failed");
        }
        const result = await response.json();
        resultTitle.textContent = result.result;
        const percentage =
            (result.fraud_probability * 100).toFixed(4);
        probabilityText.textContent =
            `Fraud Probability: ${percentage}%`;
        resultBox.classList.remove("hidden");
    }
    catch (error)
    {
        resultTitle.textContent =
            "Unable to connect to TrustPay API";
        probabilityText.textContent =
            "Please make sure the Flask backend is running.";
        resultBox.classList.remove("hidden");
        console.error(error);
    }
    finally
    {

        loading.classList.add("hidden");
    }
});
