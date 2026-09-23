import sys
import numpy as np
import pickle
import json
import os
import traceback

import sklearn.ensemble
import sklearn.tree
sys.modules['sklearn.ensemble.forest'] = sklearn.ensemble
sys.modules['sklearn.tree.tree'] = sklearn.tree

base_dir = os.path.dirname(os.path.abspath(__file__))
model_name = "kidney.pkl"
model_path = os.path.join(base_dir, "aimodels", model_name)

with open("test_sklearn_out.txt", "w") as out:
    out.write(f"\n--- Testing {model_name} ---\n")
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
            out.write(f"[{model_name}] Loaded successfully. Type: {type(model)}\n")
    except Exception as e:
        out.write(f"[{model_name}] Error loading:\n")
        traceback.print_exc(file=out)
