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
model_path = os.path.join(base_dir, "aimodels", "diabetes.pkl")

try:
    with open(model_path, 'rb') as model_fileL:
        model = pickle.load(model_fileL)
except Exception as e:
    print(f"Model loading failed: {e}")
    model = None

if model:
    try:
        data = list(json.loads(sys.argv[3]).values())
        data_array = np.array(data).reshape(1, -1)
        prediction = model.predict(data_array)
        print(json.dumps(prediction.tolist()))
    except Exception as e:
        print(f"Prediction failed: {e}")
        print(json.dumps([0]))
else:
    # Dummy prediction
    print(json.dumps([0]))
    # Dummy prediction
    print(json.dumps([0]))

# import sys
# import numpy as np
# import pickle
# import json

# def load_model(disease):
#     try:
#         model_path = f'./ai-models/{disease}.pkl'
#         with open(model_path, 'rb') as model_file:
#             model = pickle.load(model_file)
#         return model
#     except Exception as e:
#         print(f"Error loading model for {disease}: {e}")
#         return None

# def predict(disease, data):
#     model = load_model(disease)
#     if model:
#         try:
#             data_array = np.array(data).reshape(1, -1)
#             prediction = model.predict(data_array)
#             return prediction.tolist()
#         except Exception as e:
#             print(f"Error predicting {disease}: {e}")
#     return None

# if __name__ == "__main__":
#     if len(sys.argv) < 3:
#         print("Usage: python predict.py <disease> <input_data>")
#         sys.exit(1)

#     disease = sys.argv[1]
#     input_data = sys.argv[2]

#     prediction = predict(disease, json.loads(input_data))
#     if prediction:
#         print(json.dumps(prediction))
#     else:
#         print("Error occurred during prediction.")
