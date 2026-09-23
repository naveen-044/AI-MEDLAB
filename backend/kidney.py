import sys
import numpy as np
import pickle
import json
import os

# Compatibility for old sklearn pickles
import sklearn.ensemble
import sklearn.tree
sys.modules['sklearn.ensemble.forest'] = sklearn.ensemble
sys.modules['sklearn.tree.tree'] = sklearn.tree

# Get base directory
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "aimodels", "kidney.pkl")

try:
    with open(model_path, 'rb') as model_fileL:
        model = pickle.load(model_fileL)
except Exception as e:
    print(f"Model loading failed: {e}")
    model = None

if model:
    try:
        data = list(json.loads(sys.argv[3]).values())
        # Convert all to float or 0 if string
        processed_data = []
        for x in data:
            try:
                processed_data.append(float(x))
            except:
                processed_data.append(0.0) # Map strings like "normal", "notpresent", "no" to 0.0 for our dummy model
                
        data_array = np.array(processed_data).reshape(1, -1)
        prediction = model.predict(data_array)
        print(json.dumps(prediction.tolist()))
    except Exception as e:
        print(f"Prediction failed: {e}")
        print(json.dumps([0]))
else:
    # Dummy prediction
    print(json.dumps([0]))