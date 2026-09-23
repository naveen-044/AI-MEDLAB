import pickle
import sklearn.ensemble
import sys

sys.modules['sklearn.ensemble.forest'] = sklearn.ensemble

with open(r'c:\Users\navee\OneDrive\Desktop\Major_project\AI-MedLab-main\AI-MedLab-main\backend\aimodels\diabetes.pkl', 'rb') as f:
    model = pickle.load(f)
    print(type(model))