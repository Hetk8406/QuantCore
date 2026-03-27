from yahooquery import search
import json

def test_search(query):
    print(f"Searching for: {query}")
    results = search(query)
    # The return is usually a dict with 'quotes' key
    quotes = results.get('quotes', [])
    print(f"Found {len(quotes)} results.")
    for q in quotes[:3]:
        print(f"Symbol: {q.get('symbol')} | Name: {q.get('shortname')} | Exchange: {q.get('exchange')}")

if __name__ == "__main__":
    test_search("Reliance")
    test_search("Apple")
    test_search("NVDA")
