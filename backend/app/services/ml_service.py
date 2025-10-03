"""
Machine Learning service for exoplanet detection
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import logging
from typing import Dict, List, Tuple, Any, Optional
from pathlib import Path
import json
import time
import uuid

from app.core.config import settings
from app.core.exceptions import ModelError, ValidationError
from app.schemas.exoplanet import PredictionInput, PredictionResult, Classification

logger = logging.getLogger(__name__)


class ExoplanetMLModel:
    """Machine Learning model for exoplanet detection"""
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = [
            'orbital_period',
            'transit_duration', 
            'planetary_radius',
            'transit_depth',
            'stellar_magnitude',
            'equilibrium_temperature'
        ]
        self.classes = ['Confirmed', 'Candidate', 'False Positive']
        self.model_version = "2.1.0"
        self.is_trained = False
        
        # Model paths
        self.model_dir = Path(settings.MODEL_PATH)
        self.model_dir.mkdir(exist_ok=True)
        self.model_path = self.model_dir / "exoplanet_model.joblib"
        self.scaler_path = self.model_dir / "scaler.joblib"
        self.metadata_path = self.model_dir / "model_metadata.json"
        
        # Load existing model if available
        self._load_model()
    
    def _load_model(self) -> bool:
        """Load trained model from disk"""
        try:
            if self.model_path.exists() and self.scaler_path.exists():
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                
                if self.metadata_path.exists():
                    with open(self.metadata_path, 'r') as f:
                        metadata = json.load(f)
                        self.model_version = metadata.get('version', self.model_version)
                
                self.is_trained = True
                logger.info(f"Model loaded successfully (version: {self.model_version})")
                return True
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
        
        # Initialize with default model if loading fails
        self._initialize_default_model()
        return False
    
    def _initialize_default_model(self):
        """Initialize a default trained model for demonstration"""
        logger.info("Initializing default model...")
        
        # Generate synthetic training data
        np.random.seed(42)
        n_samples = 5000
        
        # Generate features with realistic distributions
        data = {
            'orbital_period': np.random.lognormal(2, 1.5, n_samples),
            'transit_duration': np.random.gamma(2, 2, n_samples),
            'planetary_radius': np.random.gamma(1.5, 1, n_samples),
            'transit_depth': np.random.gamma(1, 0.01, n_samples),
            'stellar_magnitude': np.random.normal(12, 3, n_samples),
            'equilibrium_temperature': np.random.gamma(2, 300, n_samples)
        }
        
        # Clip values to realistic ranges
        data['orbital_period'] = np.clip(data['orbital_period'], 0.1, 5000)
        data['transit_duration'] = np.clip(data['transit_duration'], 0.1, 20)
        data['planetary_radius'] = np.clip(data['planetary_radius'], 0.1, 20)
        data['transit_depth'] = np.clip(data['transit_depth'], 0.001, 5)
        data['stellar_magnitude'] = np.clip(data['stellar_magnitude'], -2, 18)
        data['equilibrium_temperature'] = np.clip(data['equilibrium_temperature'], 50, 2500)
        
        # Generate labels based on realistic criteria
        labels = []
        for i in range(n_samples):
            # Simple heuristic for classification
            score = 0
            
            # Favor confirmed for Earth-like characteristics
            if 0.5 < data['planetary_radius'][i] < 2.0:
                score += 0.3
            if 10 < data['orbital_period'][i] < 1000:
                score += 0.2
            if data['transit_depth'][i] > 0.005:
                score += 0.2
            if 1 < data['transit_duration'][i] < 10:
                score += 0.1
            if 200 < data['equilibrium_temperature'][i] < 400:
                score += 0.2
            
            # Add some randomness
            score += np.random.normal(0, 0.2)
            
            if score > 0.7:
                labels.append('Confirmed')
            elif score > 0.3:
                labels.append('Candidate')
            else:
                labels.append('False Positive')
        
        # Create DataFrame
        df = pd.DataFrame(data)
        df['label'] = labels
        
        # Train model
        self.train(df)
    
    def train(self, data: pd.DataFrame) -> Dict[str, Any]:
        """Train the model with provided data"""
        try:
            logger.info("Training exoplanet detection model...")
            
            # Prepare features and labels
            X = data[self.feature_names].values
            y = data['label'].values
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Scale features
            self.scaler = StandardScaler()
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train model
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                class_weight='balanced'
            )
            
            start_time = time.time()
            self.model.fit(X_train_scaled, y_train)
            training_time = time.time() - start_time
            
            # Evaluate model
            y_pred = self.model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            
            # Get detailed metrics
            report = classification_report(y_test, y_pred, output_dict=True)
            cm = confusion_matrix(y_test, y_pred, labels=self.classes)
            
            self.is_trained = True
            
            # Save model
            self._save_model()
            
            # Prepare metrics
            metrics = {
                'accuracy': accuracy,
                'training_time': training_time,
                'training_samples': len(X_train),
                'test_samples': len(X_test),
                'classification_report': report,
                'confusion_matrix': cm.tolist(),
                'model_version': self.model_version
            }
            
            logger.info(f"Model trained successfully. Accuracy: {accuracy:.3f}")
            return metrics
            
        except Exception as e:
            logger.error(f"Model training failed: {e}")
            raise ModelError(f"Failed to train model: {str(e)}")
    
    def _save_model(self):
        """Save trained model to disk"""
        try:
            joblib.dump(self.model, self.model_path)
            joblib.dump(self.scaler, self.scaler_path)
            
            metadata = {
                'version': self.model_version,
                'feature_names': self.feature_names,
                'classes': self.classes,
                'created_at': time.time()
            }
            
            with open(self.metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            logger.info("Model saved successfully")
            
        except Exception as e:
            logger.error(f"Failed to save model: {e}")
    
    def predict(self, input_data: PredictionInput) -> PredictionResult:
        """Make a single prediction"""
        if not self.is_trained:
            raise ModelError("Model is not trained")
        
        try:
            start_time = time.time()
            
            # Prepare input features
            features = np.array([[
                input_data.orbital_period,
                input_data.transit_duration,
                input_data.planetary_radius,
                input_data.transit_depth,
                input_data.stellar_magnitude,
                input_data.equilibrium_temperature
            ]])
            
            # Scale features
            features_scaled = self.scaler.transform(features)
            
            # Make prediction
            prediction = self.model.predict(features_scaled)[0]
            probabilities = self.model.predict_proba(features_scaled)[0]
            
            # Calculate confidence (max probability * 100)
            confidence = float(np.max(probabilities) * 100)
            
            # Map probabilities to classes
            prob_dict = dict(zip(self.model.classes_, probabilities))
            
            # Calculate additional metrics
            metrics = self._calculate_metrics(features_scaled[0], probabilities)
            
            processing_time = time.time() - start_time
            
            # Create result
            result = PredictionResult(
                id=str(uuid.uuid4()),
                classification=Classification(prediction),
                confidence=confidence,
                probability={
                    'confirmed': float(prob_dict.get('Confirmed', 0)),
                    'candidate': float(prob_dict.get('Candidate', 0)),
                    'false_positive': float(prob_dict.get('False Positive', 0))
                },
                metrics={
                    'signal_to_noise': metrics['signal_to_noise'],
                    'transit_score': metrics['transit_score'],
                    'periodicity': metrics['periodicity']
                },
                processing_time=processing_time,
                model_version=self.model_version,
                timestamp=pd.Timestamp.now()
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            raise ModelError(f"Prediction failed: {str(e)}")
    
    def predict_batch(self, input_data: List[PredictionInput]) -> List[PredictionResult]:
        """Make batch predictions"""
        if len(input_data) > settings.MAX_PREDICTION_BATCH_SIZE:
            raise ValidationError(
                f"Batch size exceeds maximum limit of {settings.MAX_PREDICTION_BATCH_SIZE}"
            )
        
        results = []
        for data in input_data:
            result = self.predict(data)
            results.append(result)
        
        return results
    
    def _calculate_metrics(self, features: np.ndarray, probabilities: np.ndarray) -> Dict[str, float]:
        """Calculate additional prediction metrics"""
        # Simulate realistic metrics based on input features
        
        # Signal to noise ratio (based on transit depth and stellar magnitude)
        transit_depth = features[3]  # transit_depth is 4th feature
        stellar_mag = features[4]    # stellar_magnitude is 5th feature
        
        # Higher transit depth and brighter stars give better SNR
        snr = (transit_depth * 1000) / (stellar_mag / 10 + 1)
        snr = np.clip(snr, 1.0, 20.0)
        
        # Transit score (based on duration and period consistency)
        transit_duration = features[1]
        orbital_period = features[0]
        
        # Realistic transit duration should be small fraction of orbital period
        expected_duration = np.sqrt(orbital_period) * 0.1
        duration_ratio = min(transit_duration / expected_duration, 2.0)
        transit_score = 1.0 / (1.0 + abs(duration_ratio - 1.0))
        
        # Periodicity (based on confidence in classification)
        periodicity = float(np.max(probabilities))
        
        return {
            'signal_to_noise': float(snr),
            'transit_score': float(transit_score),
            'periodicity': float(periodicity)
        }
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get model information and performance metrics"""
        if not self.is_trained:
            return {
                'model_version': self.model_version,
                'is_trained': False,
                'message': 'Model not trained'
            }
        
        # Get feature importance if available
        feature_importance = None
        if hasattr(self.model, 'feature_importances_'):
            feature_importance = dict(zip(
                self.feature_names,
                self.model.feature_importances_.tolist()
            ))
        
        return {
            'model_version': self.model_version,
            'is_trained': self.is_trained,
            'feature_names': self.feature_names,
            'classes': self.classes,
            'feature_importance': feature_importance,
            'model_type': type(self.model).__name__
        }


# Global model instance
ml_model = ExoplanetMLModel()