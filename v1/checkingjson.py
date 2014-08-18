import json
from pprint import pprint

#with open('/home/pri/twitter/v1/tweepyjson.txt') as f:
#	for x in range(1,5):
#		print type(f.readline())
#f.close()

json_data = open('/home/pri/twitter/tweepytweets.txt')
data = json.load(json_data)
json_data.close()

pprint(data)
