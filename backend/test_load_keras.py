import os
import sys

# Suppress TF logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf

def check_h5(path):
    try:
        model = tf.keras.models.load_model(path)
        print(f"Loaded {path} SUCCESS")
        return True
    except Exception as e:
        print(f"Failed to load {path}: {e}")
        return False

check_h5("aimodels/malaria.h5")
check_h5("aimodels/pneumonia.h5")
