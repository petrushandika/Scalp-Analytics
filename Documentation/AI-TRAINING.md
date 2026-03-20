# AI Model Training Guide

## Informasi Dokumen

| Field | Nilai |
|-------|-------|
| **Proyek** | Scalp Analytics |
| **Versi** | 1.0.0 |
| **Model** | Hair Density CNN |

---

## 1. Gambaran Umum

### 1.1 Tujuan Model
Model AI digunakan untuk menganalisis foto kulit kepala dan menghitung persentase kepadatan rambut. Model ini menggunakan Convolutional Neural Network (CNN) yang di-train pada dataset foto kulit kepala.

### 1.2 Arsitektur Model

```mermaid
flowchart LR
    subgraph "Input"
        A[Image 224x224x3]
    end
    
    subgraph "Preprocessing"
        B[Resize & Normalize]
        C[Noise Reduction]
        D[Contrast Enhancement]
    end
    
    subgraph "Feature Extraction"
        E[MobileNetV2 Base]
        F[Global Average Pooling]
    end
    
    subgraph "Classification Head"
        G[Dense 128 ReLU]
        H[Dropout 0.3]
        I[Dense 64 ReLU]
        J[Dense 1 Sigmoid]
    end
    
    subgraph "Output"
        K[Density 0-100%]
    end
    
    A --> B --> C --> D
    D --> E --> F
    F --> G --> H --> I --> J
    J --> K
```

---

## 2. Persiapan Dataset

### 2.1 Struktur Dataset

```
dataset/
├── train/
│   ├── frontal/
│   │   ├── high_density/
│   │   ├── medium_density/
│   │   └── low_density/
│   ├── top/
│   │   ├── high_density/
│   │   ├── medium_density/
│   │   └── low_density/
│   └── side/
│       ├── high_density/
│       ├── medium_density/
│       └── low_density/
├── validation/
│   └── [same structure as train]
└── test/
    └── [same structure as train]
```

### 2.2 Kriteria Dataset

| Kriteria | Persyaratan |
|----------|-------------|
| Jumlah Data | Minimum 1.000 gambar per sudut |
| Resolusi | Minimum 720p, direkomendasikan 1080p |
| Format | JPEG, PNG |
| Variasi Pencahayaan | Indoor, outdoor, flash |
| Variasi Kondisi | Berbagai tingkat kebotakan |
| Anotasi | Persentase kepadatan (ground truth) |

### 2.3 Ground Truth Annotation

```python
# Contoh format annotation CSV
# filename, angle, density_percentage, confidence

front_001.jpg,front,85.5,0.95
front_002.jpg,front,72.3,0.88
top_001.jpg,top,78.1,0.92
side_001.jpg,side,81.0,0.90
```

---

## 3. Preprocessing Pipeline

### 3.1 Langkah Preprocessing

```mermaid
flowchart TD
    A[Input Image] --> B[Resize to 224x224]
    B --> C[Convert to RGB]
    C --> D[Normalize 0-1]
    D --> E[Apply CLAHE]
    E --> F[Gaussian Blur]
    F --> G[Edge Detection Optional]
    G --> H[Ready for Model]
```

### 3.2 Implementasi Preprocessing

```python
# ai/preprocessing/image_processor.py
import cv2
import numpy as np
from PIL import Image
from typing import Tuple

class ImagePreprocessor:
    """
    Preprocessor untuk foto kulit kepala sebelum input ke model.
    """
    
    def __init__(self, target_size: Tuple[int, int] = (224, 224)):
        self.target_size = target_size
    
    def preprocess(self, image_path: str) -> np.ndarray:
        """
        Preprocess gambar untuk input model.
        
        Args:
            image_path: Path ke file gambar
            
        Returns:
            Numpy array siap untuk model (1, 224, 224, 3)
        """
        image = self._load_image(image_path)
        image = self._resize(image)
        image = self._apply_clahe(image)
        image = self._normalize(image)
        image = self._add_batch_dimension(image)
        return image
    
    def _load_image(self, path: str) -> np.ndarray:
        """Load gambar dan konversi ke RGB."""
        image = cv2.imread(path)
        if image is None:
            raise ValueError(f"Tidak dapat load gambar: {path}")
        return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    def _resize(self, image: np.ndarray) -> np.ndarray:
        """Resize gambar ke target size."""
        return cv2.resize(image, self.target_size, interpolation=cv2.INTER_LINEAR)
    
    def _apply_clahe(self, image: np.ndarray) -> np.ndarray:
        """Apply CLAHE untuk enhancement kontras."""
        lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        lab = cv2.merge([l, a, b])
        return cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    
    def _normalize(self, image: np.ndarray) -> np.ndarray:
        """Normalize pixel values ke [0, 1]."""
        return image.astype(np.float32) / 255.0
    
    def _add_batch_dimension(self, image: np.ndarray) -> np.ndarray:
        """Add batch dimension untuk model input."""
        return np.expand_dims(image, axis=0)
    
    def detect_hair_regions(self, image: np.ndarray) -> np.ndarray:
        """
        Deteksi region rambut menggunakan edge detection.
        
        Returns:
            Mask dari region rambut terdeteksi
        """
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        edges = cv2.Canny(blurred, 50, 150)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        mask = np.zeros_like(gray)
        cv2.drawContours(mask, contours, -1, (255), thickness=cv2.FILLED)
        return mask
```

---

## 4. Model Architecture

### 4.1 Architecture Definition

```python
# ai/models/hair_density_model.py
import tensorflow as tf
from tensorflow.keras import layers, models
from typing import Tuple

class HairDensityModel:
    """
    CNN Model untuk prediksi kepadatan rambut.
    Menggunakan transfer learning dengan MobileNetV2 backbone.
    """
    
    def __init__(self, input_shape: Tuple[int, int, int] = (224, 224, 3)):
        self.input_shape = input_shape
        self.model = self._build_model()
    
    def _build_model(self) -> tf.keras.Model:
        """
        Build model architecture.
        
        Returns:
            Compiled Keras model
        """
        # Base model dengan pre-trained weights
        base_model = tf.keras.applications.MobileNetV2(
            input_shape=self.input_shape,
            include_top=False,
            weights='imagenet'
        )
        
        # Freeze base model layers
        base_model.trainable = False
        
        # Build custom head
        model = models.Sequential([
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.Dense(128, activation='relu'),
            layers.Dropout(0.3),
            layers.Dense(64, activation='relu'),
            layers.Dense(1, activation='sigmoid')  # Output: 0-1-> 0-100%
        ])
        
        # Compile model
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='mean_squared_error',
            metrics=['mae', 'mse']
        )
        
        return model
    
    def train(
        self,
        train_data: tf.data.Dataset,
        val_data: tf.data.Dataset,
        epochs: int = 50,
        callbacks: list = None
    ) -> tf.keras.callbacks.History:
        """
        Train model dengan data.
        
        Args:
            train_data: Training dataset
            val_data: Validation dataset
            epochs: Number of training epochs
            callbacks: List of callbacks
            
        Returns:
            Training history
        """
        return self.model.fit(
            train_data,
            validation_data=val_data,
            epochs=epochs,
            callbacks=callbacks or []
        )
    
    def predict(self, image: np.ndarray) -> float:
        """
        Prediksi kepadatan rambut dari gambar.
        
        Args:
            image: Preprocessed image array
            
        Returns:
            Density percentage (0-100)
        """
        prediction = self.model.predict(image)
        return float(prediction[0][0] * 100)
    
    def save(self, path: str):
        """Save model ke file."""
        self.model.save(path)
    
    def load(self, path: str):
        """Load model dari file."""
        self.model = tf.keras.models.load_model(path)
```

### 4.2 Model Summary

```
Model: "sequential"
┌─────────────────────────────────────────────────────────────────┐
│ Layer (type)                   │ Output Shape       │ Param #   │
├─────────────────────────────────────────────────────────────────┤
│ mobilenetv2_1.00_224 (Functio)│ (None, 7, 7, 1280)  │ 2,257,984  │
│ nal)│                        │             │
├─────────────────────────────────────────────────────────────────┤
│ global_average_pooling2d (Glob│ (None, 1280)       │ 0          │
│ alAveragePooling2D)             │                    │            │
├─────────────────────────────────────────────────────────────────┤
│ dense (Dense)                   │ (None, 128)       │ 163,968    │
├─────────────────────────────────────────────────────────────────┤
│ dropout (Dropout)              │ (None, 128)       │ 0          │
├─────────────────────────────────────────────────────────────────┤
│ dense_1 (Dense)                 │ (None, 64)        │ 8,256      │
├─────────────────────────────────────────────────────────────────┤
│ dense_2 (Dense)                 │ (None, 1)         │ 65         │
└─────────────────────────────────────────────────────────────────┘

Total params: 2,430,273 (9.27 MB)
Trainable params: 172,289 (657.32 KB)
Non-trainable params: 2,257,984 (8.62 MB)
```

---

## 5. Training Pipeline

### 5.1 Training Flow

```mermaid
flowchart TD
    A[Load Dataset] --> B[Split Train/Val/Test]
    B --> C[Preprocessing]
    C --> D[Data Augmentation]
    D --> E[Create tf.data.Dataset]
    E --> F[Build Model]
    F --> G[Train]
    G --> H{Validation Loss OK?}
    H -->|Tidak| I[Adjust Hyperparams]
    I --> G
    H -->|Ya| J[Evaluate on Test Set]
    J --> K{Test Accuracy OK?}
    K -->|Tidak| L[Increase Data/Improve Model]
    L --> G
    K -->|Ya| M[Save Model]
    M --> N[Deploy]
```

### 5.2 Training Script

```python
# ai/training/train.py
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import os

class ModelTrainer:
    """
    Trainer untuk hair density model.
    """
    
    def __init__(self, data_dir: str, model_dir: str):
        self.data_dir = data_dir
        self.model_dir = model_dir
        self.img_size = (224, 224)
        self.batch_size = 32
    
    def create_data_generators(self):
        """
        Create data generators dengan augmentation.
        """
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True,
            fill_mode='nearest'
        )
        
        val_datagen = ImageDataGenerator(rescale=1./255)
        
        train_generator = train_datagen.flow_from_directory(
            os.path.join(self.data_dir, 'train'),
            target_size=self.img_size,
            batch_size=self.batch_size,
            class_mode='input',  # Regression
            shuffle=True
        )
        
        val_generator = val_datagen.flow_from_directory(
            os.path.join(self.data_dir, 'validation'),
            target_size=self.img_size,
            batch_size=self.batch_size,
            class_mode='input',
            shuffle=False
        )
        
        return train_generator, val_generator
    
    def get_callbacks(self):
        """
        Define training callbacks.
        """
        return [
            ModelCheckpoint(
                filepath=os.path.join(self.model_dir, 'best_model.h5'),
                monitor='val_loss',
                save_best_only=True,
                verbose=1
            ),
            EarlyStopping(
                monitor='val_loss',
                patience=10,
                verbose=1,
                restore_best_weights=True
            ),
            ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                verbose=1
            )
        ]
    
    def train(self, epochs: int = 50):
        """
        Run training pipeline.
        """
        # Create model
        model = HairDensityModel().model
        
        # Create data generators
        train_gen, val_gen = self.create_data_generators()
        
        # Train
        history = model.fit(
            train_gen,
            validation_data=val_gen,
            epochs=epochs,
            callbacks=self.get_callbacks()
        )
        
        return history
    
    def evaluate(self, model_path: str, test_dir: str):
        """
        Evaluate model on test set.
        """
        model = tf.keras.models.load_model(model_path)
        
        test_datagen = ImageDataGenerator(rescale=1./255)
        test_generator = test_datagen.flow_from_directory(
            test_dir,
            target_size=self.img_size,
            batch_size=self.batch_size,
            class_mode='input',
            shuffle=False
        )
        
        results = model.evaluate(test_generator)
        print(f"Test Loss: {results[0]}")
        print(f"Test MAE: {results[1]}")
        
        return results
```

### 5.3 Menjalankan Training

```bash
# Setup environment
cd ai/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Prepare dataset
python scripts/prepare_dataset.py --input raw_data/ --output dataset/

# Run training
python training/train.py --data-dir dataset/ --model-dir models/ --epochs 50

# Evaluate model
python training/evaluate.py --model-path models/best_model.h5 --test-dir dataset/test/

# Export for production
python scripts/export_model.py --model-path models/best_model.h5 --output models/production/
```

---

## 6. Evaluation Metrics

### 6.1 Metrics yang Digunakan

| Metric | Deskripsi | Target |
|--------|-----------|--------|
| MAE (Mean Absolute Error) | Rata-rata error absolut | < 5% |
| MSE (Mean Squared Error) | Rata-rata error kuadrat | < 25 |
| R² Score | Koefisien determinasi | > 0.85 |
| Confidence Score | Model confidence | > 0.80 |

### 6.2 Evaluation Script

```python
# ai/evaluation/metrics.py
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

class ModelEvaluator:
    """
    Evaluator untuk model metrics.
    """
    
    def __init__(self, model, test_data):
        self.model = model
        self.test_data = test_data
        self.predictions = None
        self.ground_truth = None
    
    def evaluate(self):
        """
        Hitung semua metrics.
        """
        # Get predictions
        self.predictions = self.model.predict(self.test_data)
        self.ground_truth = self._get_ground_truth()
        
        # Calculate metrics
        mae = mean_absolute_error(self.ground_truth, self.predictions)
        mse = mean_squared_error(self.ground_truth, self.predictions)
        r2 = r2_score(self.ground_truth, self.predictions)
        
        return {
            'mae': mae,
            'mse': mse,
            'rmse': np.sqrt(mse),
            'r2': r2
        }
    
    def generate_confusion_by_threshold(self, threshold: float = 5.0):
        """
        Generate confusion matrix berdasarkan threshold error.
        """
        errors = np.abs(self.predictions - self.ground_truth)
        correct = (errors < threshold).sum()
        incorrect = (errors >= threshold).sum()
        
        return {
            'correct': correct,
            'incorrect': incorrect,
            'accuracy': correct / (correct + incorrect)
        }
```

---

## 7. Model Deployment

### 7.1 Model Serving

```mermaid
flowchart LR
    A[Client Request] --> B[API Gateway]
    B --> C[Image Validation]
    C --> D[Preprocessing]
    D --> E[Model Inference]
    E --> F[Post-processing]
    F --> G[Response]
    
    subgraph "Model Service"
        E
    end
```

### 7.2 FastAPI Integration

```python
# backend/app/infrastructure/ai/hair_density_service.py
from fastapi import UploadFile
import numpy as np
from PIL import Image
import io
from ai.models.hair_density_model import HairDensityModel
from ai.preprocessing.image_processor import ImagePreprocessor

class HairDensityService:
    """
    Service untuk analisis kepadatan rambut.
    """
    
    def __init__(self, model_path: str):
        self.model = HairDensityModel()
        self.model.load(model_path)
        self.preprocessor = ImagePreprocessor()
    
    async def analyze(self, file: UploadFile) -> dict:
        """
        Analisis foto dan kembalikan hasil.
        
        Args:
            file: Uploaded image file
            
        Returns:
            Analysis result dictionary
        """
        # Load image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        image_array = np.array(image)
        
        # Preprocess
        preprocessed = self.preprocessor.preprocess(image_array)
        
        # Predict
        density = self.model.predict(preprocessed)
        
        # Calculate confidence
        confidence = self._calculate_confidence(preprocessed)
        
        return {
            'density_percentage': round(density, 2),
            'confidence_score': round(confidence, 2),
            'detected_regions': self._count_regions(image_array)
        }
    
    def _calculate_confidence(self, preprocessed: np.ndarray) -> float:
        """
        Hitung confidence score berdasarkan variasi prediksi.
        """
        # Multiple predictions with augmentation
        predictions = []
        for _ in range(5):
            pred = self.model.predict(preprocessed)
            predictions.append(pred)
        
        # Lower variance = higher confidence
        variance = np.var(predictions)
        confidence = 1.0 - (variance / 100.0)  # Normalize
        return max(0.0, min(1.0, confidence))
    
    def _count_regions(self, image: np.ndarray) -> int:
        """
        Hitung region rambut terdeteksi.
        """
        mask = self.preprocessor.detect_hair_regions(image)
        contours, _ = cv2.findContours(
            mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )
        return len(contours)
```

---

## 8. Monitoring & Maintenance

### 8.1 Model Performance Monitoring

| Metric | Frekuensi Monitoring | Alert Threshold |
|--------|---------------------|-----------------|
| Prediction Latency | Real-time | > 5 seconds |
| Error Rate | Real-time | > 5% |
| MAE on New Data | Weekly | > 7% |
| Model Drift | Monthly | >10% deviation |

### 8.2 Model Retraining

```mermaid
flowchart TD
    A[Collect New Data] --> B[Data Validation]
    B --> C[Label Consistency Check]
    C --> D{Enough New Data?}
    D -->|Tidak| E[Continue Collecting]
    D -->|Ya| F[Incremental Training]
    F --> G[Evaluate New Model]
    G --> H{Better Performance?}
    H -->|Ya| I[Deploy New Model]
    H -->|Tidak| J[Investigate Issues]
    I --> K[Monitor Performance]
    J --> A
```

### 8.3 Retraining Trigger

- Kumpulan data baru melebihi 500 sampel
- MAE pada data baru > threshold
- Detected concept drift
- Scheduled quarterly retraining

---

## 9. Best Practices

### 9.1 Data Quality
- Pastikan variasi pencahayaan yang cukup
- Include berbagai tingkat kebotakan
- Anotasi konsisten oleh multiple annotators
- Validasi ground truth dengan expert dermatologist

### 9.2 Model Training
- Gunakan early stopping untuk prevent overfitting
- Implement cross-validation untuk robust evaluation
- Track eksperimen dengan MLflow atau similar
- Save checkpoints secara regular

### 9.3 Production Deployment
- Load model saat startup, bukan per request
- Implement caching untuk predictions yang sama
- Monitor latency dan error rate
- Implement fallback untuk edge cases

---

## 10. Troubleshooting

### 10.1 Common Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Low Accuracy | Data kurang variatif | Augmentasi data, koleksi lebih banyak |
| Overfitting | Model terlalu kompleks | Tambah dropout, simplify architecture |
| Low Confidence | Image quality buruk | Improve preprocessing, reject low quality |
| Slow Inference | Model terlalu besar | Quantization, use lighter model |

### 10.2 Performance Optimization

```python
# Quantization untuk inference lebih cepat
import tensorflow as tf

def quantize_model(model_path: str, output_path: str):
    """
    Quantize model untuk inference lebih cepat.
    """
    model = tf.keras.models.load_model(model_path)
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    tflite_model = converter.convert()
    
    with open(output_path, 'wb') as f:
        f.write(tflite_model)
```

---

## 11. Resources

### 11.1 Referensi
- [TensorFlow Documentation](https://www.tensorflow.org/api_docs)
- [MobileNetV2 Paper](https://arxiv.org/abs/1801.04381)
- [Transfer Learning Guide](https://www.tensorflow.org/tutorials/images/transfer_learning)

### 11.2 Tools
- TensorFlow 2.x
- OpenCV 4.8+
- NumPy
- Scikit-learn (untuk metrics)
- MLflow (untuk experiment tracking)