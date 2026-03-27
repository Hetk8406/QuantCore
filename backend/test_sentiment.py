import yfinance as yf
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

def test_query(query):
    print(f"Testing Query: '{query}'...")
    search = yf.Search(query)
    news = search.news
    print(f"Found {len(news)} articles.")
    for article in news[:3]:
        print(f" - {article.get('title')}")

if __name__ == "__main__":
    test_query("Reliance Industries Stock News")
    test_query("TCS Stock News")
    test_query("HDFCBANK.NS")
