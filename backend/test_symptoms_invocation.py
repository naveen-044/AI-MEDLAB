import subprocess
import sys
import json
import os

def test_invocation():
    # Mimic: python symptoms.py --loads aimodels/svc.pkl '{"data": "itching, skin_rash"}'
    
    script_path = "symptoms.py"
    model_path = "aimodels/svc.pkl"
    payload = json.dumps({"data": "itching, skin_rash"})
    
    print(f"Invoking {script_path} with payload: {payload}")
    
    # Use subprocess run with list args to bypass shell escaping issues
    result = subprocess.run(
        [sys.executable, script_path, "--loads", model_path, payload],
        capture_output=True,
        text=True
    )
    
    print("Return Code:", result.returncode)
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)

if __name__ == "__main__":
    test_invocation()
