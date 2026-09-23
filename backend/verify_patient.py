
import requests
import json
import random
import string

BASE_URL = "http://localhost:8000/api/v1/auth"

def generate_email():
    return f"patient_{''.join(random.choices(string.ascii_lowercase, k=5))}@example.com"

def test_signup(email):
    url = f"{BASE_URL}/register"
    payload = {
        "email": email,
        "password": "password123",
        "name": "Test Patient",
        "role": "patient",
        "gender": "male",
        "photo": "http://example.com/photo.jpg"
    }
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"Signup Status Code: {response.status_code}")
        print(f"Signup Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Signup Error: {e}")
        return False

def test_login(email):
    url = f"{BASE_URL}/login"
    payload = {
        "email": email,
        "password": "password123"
    }
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"Login Status Code: {response.status_code}")
        print(f"Login Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Login Error: {e}")
        return False

if __name__ == "__main__":
    email = generate_email()
    print(f"Testing with email: {email}")
    
    print("Testing Signup...")
    if test_signup(email):
        print("Signup Successful")
        print("Testing Login...")
        if test_login(email):
            print("Login Successful")
        else:
            print("Login Failed")
    else:
        print("Signup Failed")
