import tweepy

consumer_key = ''
consumer_secret = ''
access_token = ''
access_token_secret = ''

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

jsondata = []

for tweet in tweepy.Cursor(api.search, q='womenagainstfeminism').items(50):
    jsondata.append(tweet) 

print jsondata

