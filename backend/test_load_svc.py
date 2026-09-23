import pickle
import sys
import os

# Shim for old sklearn
try:
    import sklearn.ensemble
    import sklearn.tree
    sys.modules['sklearn.ensemble.forest'] = sklearn.ensemble
    sys.modules['sklearn.tree.tree'] = sklearn.tree
except ImportError:
    pass

model_path = os.path.join("aimodels", "svc.pkl")
try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully")
    print(type(model))
except Exception as e:
    print(f"Failed to load model: {e}")
