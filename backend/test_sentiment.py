from sentiment import get_stock_sentiment
import time

print("Starting sentiment test...")
start = time.time()
try:
    result = get_stock_sentiment("RELIANCE.NS")
    print("Sentiment Result:", result)
except Exception as e:
    print("Error:", e)
print(f"Finished in {time.time() - start:.2f} seconds")
