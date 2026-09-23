import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tf_keras
import traceback

def load(path):
    try:
        model = tf_keras.models.load_model(path, compile=False)
        print(f"Success for {path}: shape {model.input_shape}")
    except Exception as e:
        print(f"Error for {path}:")
        traceback.print_exc()

load("aimodels/pneumonia.h5")
load("aimodels/malaria.h5")
