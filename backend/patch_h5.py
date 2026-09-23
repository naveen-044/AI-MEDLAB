import h5py
import json
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from tensorflow.keras.models import load_model

def patch_model(filepath):
    print(f"Patching {filepath}")
    is_patched = False
    with h5py.File(filepath, "r+") as f:
        model_config_raw = f.attrs.get("model_config")
        if model_config_raw is not None:
            if isinstance(model_config_raw, bytes):
                model_config_str = model_config_raw.decode('utf-8')
            else:
                model_config_str = model_config_raw
                
            config = json.loads(model_config_str)
            if "build_input_shape" in config:
                print(f"  Removing build_input_shape from {filepath}")
                del config["build_input_shape"]
                f.attrs["model_config"] = json.dumps(config).encode('utf-8')
                is_patched = True
            else:
                print(f"  build_input_shape not found in {filepath}")
    
    if is_patched:
        print(f"Successfully patched {filepath}")
    return is_patched

for model_name in ["pneumonia.h5", "malaria.h5"]:
    path = os.path.join("aimodels", model_name)
    patch_model(path)
    
    # Test loading
    try:
        model = load_model(path, compile=False)
        print(f"Successfully loaded {model_name}. Input shape: {model.input_shape}")
    except Exception as e:
        print(f"Failed to load {model_name}: {e}")
