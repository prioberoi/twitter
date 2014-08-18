import tweepy

consumer_key = ''
consumer_secret = ''
access_token = ''
access_token_secret = ''

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

jsondata = []

for tweet in tweepy.Cursor(api.search, q='womenagainstfeminism', count=100).items():
    jsondata.append(tweet._json) ##try .extend later

print jsondata

