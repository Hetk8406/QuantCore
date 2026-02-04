import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime, timedelta
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM

def fetch_data(symbol: str, period="5y"):
    """Fetches historical data from Yahoo Finance."""
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period)
        if df.empty:
            return None
        return df
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return None

def train_predict_linear(df, symbol):
    # Feature Engineering
    df['MA10'] = df['Close'].rolling(window=10).mean()
    df['MA50'] = df['Close'].rolling(window=50).mean()
    
    # Drop NaN values created by rolling windows
    df = df.dropna()

    # Create Target: Next Day's Close
    df['Target'] = df['Close'].shift(-1)
    
    # Features for training
    features = ['Open', 'High', 'Low', 'Close', 'Volume', 'MA10', 'MA50']
    
    # We drop the last row for training because it has no Target (yet)
    data = df.dropna()
    
    X = data[features]
    y = data['Target']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    # Train
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Evaluate
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    # Predict for Tomorrow
    last_row = df.iloc[[-1]][features]
    next_price = model.predict(last_row)[0]
    
    return next_price, mae, r2

import os

MODELS_DIR = "models"
if not os.path.exists(MODELS_DIR):
    os.makedirs(MODELS_DIR)

def train_predict_lstm(df, symbol):
    # Preprocessing
    data = df.filter(['Close'])
    dataset = data.values
    
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(dataset)
    
    # Check for saved model
    model_path = os.path.join(MODELS_DIR, f"{symbol}_lstm.keras")
    today_str = datetime.now().strftime('%Y-%m-%d')
    model = None
    
    # If model exists and was modified today, load it
    if os.path.exists(model_path):
        modified_time = datetime.fromtimestamp(os.path.getmtime(model_path)).strftime('%Y-%m-%d')
        if modified_time == today_str:
            try:
                print(f"Loading model for {symbol} from disk...")
                model = tf.keras.models.load_model(model_path)
            except Exception as e:
                print(f"Error loading model: {e}")
                model = None

    prediction_days = 60
    training_data_len = int(len(dataset) * 0.8)

    if model is None:
        print(f"Training new model for {symbol}...")
        # Create sequences
        x_train, y_train = [], []
        
        # Use 80% of data for training
        train_data = scaled_data[0:training_data_len, :]
        
        for i in range(prediction_days, len(train_data)):
            x_train.append(train_data[i-prediction_days:i, 0])
            y_train.append(train_data[i, 0])
            
        x_train, y_train = np.array(x_train), np.array(y_train)
        x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
        
        # Build LSTM Model
        model = Sequential()
        model.add(LSTM(units=50, return_sequences=False, input_shape=(x_train.shape[1], 1)))
        model.add(Dense(units=1))
        
        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(x_train, y_train, batch_size=32, epochs=5, verbose=0)
        
        # Save model
        try:
            model.save(model_path)
            print(f"Saved model for {symbol} to {model_path}")
        except Exception as e:
            print(f"Error saving model: {e}")

    # Evaluate on test set (re-create test data even if model loaded, for metrics)
    test_data = scaled_data[training_data_len - prediction_days:, :]
    x_test = []
    y_test = dataset[training_data_len:, :]
    
    for i in range(prediction_days, len(test_data)):
        x_test.append(test_data[i-prediction_days:i, 0])
        
    x_test = np.array(x_test)
    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))
    
    predictions = model.predict(x_test)
    predictions = scaler.inverse_transform(predictions)
    
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    # Predict Next Day
    last_60_days = scaled_data[-prediction_days:]
    X_input = []
    X_input.append(last_60_days)
    X_input = np.array(X_input)
    X_input = np.reshape(X_input, (X_input.shape[0], X_input.shape[1], 1))
    
    next_price_scaled = model.predict(X_input)
    next_price = scaler.inverse_transform(next_price_scaled)[0][0]
    
    return next_price, mae, r2, predictions

def calculate_rsi(data, window=14):
    delta = data.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def calculate_macd(data, slow=26, fast=12, signal=9):
    exp1 = data.ewm(span=fast, adjust=False).mean()
    exp2 = data.ewm(span=slow, adjust=False).mean()
    macd = exp1 - exp2
    signal_line = macd.ewm(span=signal, adjust=False).mean()
    return macd, signal_line

def train_predict(symbol: str, model_type="linear"):
    """
    Dispatcher for model training and prediction.
    """
    df = fetch_data(symbol)
    if df is None:
        return {"error": "Could not fetch data"}

    # Date Logic
    last_date = df.index[-1]
    last_date_str = last_date.strftime('%Y-%m-%d')
    
    # Next trading day logic (Simple approximation: +1 day, skip weekends)
    next_date = last_date + timedelta(days=1)
    if next_date.weekday() == 5: # Saturday -> Monday
        next_date += timedelta(days=2)
    elif next_date.weekday() == 6: # Sunday -> Monday
        next_date += timedelta(days=1)
    
    prediction_date_str = next_date.strftime('%Y-%m-%d')

    if model_type == "lstm":
        # LSTM needs more data to be stable, ensure we have enough
        if len(df) < 200:
             return {"error": "Not enough data for LSTM"}
        next_price, mae, r2, _ = train_predict_lstm(df, symbol)
    else:
        next_price, mae, r2 = train_predict_linear(df, symbol)
    
    # Feature Engineering for Chart
    df['MA10'] = df['Close'].rolling(window=10).mean()
    df['MA50'] = df['Close'].rolling(window=50).mean()
    df['RSI'] = calculate_rsi(df['Close'])
    df['MACD'], df['Signal'] = calculate_macd(df['Close'])
    
    # Replace NaN with None for JSON serialization
    # Note: Pandas where(pd.notnull(df), None) can sometimes be tricky with types. 
    # Better to convert to dict first then clean it.
    
    recent_df = df.tail(60).reset_index() # Show last 60 days to see indicators better
    recent_df['Date'] = recent_df['Date'].dt.strftime('%Y-%m-%d')
    
    # Convert to dict
    chart_data = recent_df[['Date', 'Close', 'MA10', 'MA50', 'RSI', 'MACD', 'Signal']].to_dict(orient='records')
    
    # Clean NaN values from list of dicts
    clean_chart_data = []
    for record in chart_data:
        clean_record = {}
        for k, v in record.items():
            if pd.isna(v):
                clean_record[k] = None
            else:
                clean_record[k] = v
        clean_chart_data.append(clean_record)

    return {
        "symbol": symbol,
        "current_price": round(df.iloc[-1]['Close'], 2),
        "current_date": last_date_str,
        "predicted_price": round(float(next_price), 2),
        "prediction_date": prediction_date_str,
        "mae": round(float(mae), 2),
        "r2_score": round(float(r2), 4),
        "chart_data": clean_chart_data,
        "model_type": model_type.upper()
    }
