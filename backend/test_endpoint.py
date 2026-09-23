import requests
import json

url = "http://localhost:8000/api/v1/kidney"
data = {
    "Age": "25", "BP": "80", "AL": "0", "SU": "0", "RBC": "normal", "PC": "normal", 
    "PCC": "notpresent", "BA": "notpresent", "BGR": "120", "BU": "20", "SC": "1.2", 
    "POT": "4.5", "WC": "8000", "HTN": "no", "DM": "no", "CAD": "no", "PE": "no", "ANE": "no"
}

# Values don't matter much for the dummy model, but they should be 18 attributes stringified or parsed correctly by predict.py
try:
    response = requests.post(url, json={"data": data})
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error:", e)
