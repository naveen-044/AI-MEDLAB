import numpy as np
import pandas as pd
import pickle
import os
from sklearn.ensemble import RandomForestClassifier

def train_dummy_kidney():
    print("Training Dummy Kidney Model with 18 features...")
    
    # Generate dummy data for 18 features
    features = ['Age', 'BP', 'AL', 'SU', 'RBC', 'PC', 'PCC', 'BA', 'BGR', 'BU', 'SC', 'POT', 'WC', 'HTN', 'DM', 'CAD', 'PE', 'ANE']
    
    X_dummy = np.random.rand(100, 18)
    y_dummy = np.random.randint(0, 2, 100) # 0 or 1 classification
    
    df = pd.DataFrame(X_dummy, columns=features)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(df, y_dummy)
    
    if not os.path.exists("aimodels"):
        os.makedirs("aimodels")
        
    with open("aimodels/kidney.pkl", "wb") as f:
        pickle.dump(model, f)
        
    print(f"Kidney Dummy Model Saved. Expected features: {model.n_features_in_}")

if __name__ == "__main__":
    train_dummy_kidney()
