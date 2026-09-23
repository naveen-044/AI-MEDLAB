import os
import pickle
import sys

# Shim for old sklearn
try:
    import sklearn.ensemble
    import sklearn.tree
    sys.modules['sklearn.ensemble.forest'] = sklearn.ensemble
    sys.modules['sklearn.tree.tree'] = sklearn.tree
except:
    pass

def check_pkl(path):
    try:
        with open(path, 'rb') as f:
            pickle.load(f)
        return "OK"
    except Exception as e:
        return f"FAILED: {e}"

def check_h5(path):
    try:
        # Suppress TF logs
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
        import tensorflow as tf
        tf.keras.models.load_model(path)
        return "OK"
    except Exception as e:
        return f"FAILED: {e}"

models_dir = "aimodels"
files = os.listdir(models_dir)

print(f"{'Model':<30} | {'Status'}")
print("-" * 60)

for f in files:
    path = os.path.join(models_dir, f)
    if f.endswith(".pkl"):
        status = check_pkl(path)
    elif f.endswith(".h5"):
        status = check_h5(path)
    else:
        status = "SKIPPED"
    
    # Truncate error if too long
    if len(status) > 100:
        status = status[:100] + "..."
    print(f"{f:<30} | {status}")
