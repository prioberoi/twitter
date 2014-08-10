import json
from pprint import pprint
json_data = open('/home/pri/twitter/tweets.txt')
data = json.load(json_data)
json_data.close()

pprint(data)

##to print everything under statuses
for element in data['statuses']:
	print element
	
##to print the text for the first tweet
print data['statuses'][0]['text']

##print hastags referenced in first tweet
for element in data['statuses'][0]['entities']['hashtags']:
    print element['text']

#type(data)
#Out[56]: dict
#
#type(data['statuses'])
#Out[57]: list
#
#type(data['statuses'][0])
#Out[58]: dict
#
#type(data['statuses'][0]['entities'])
#Out[59]: dict
#
#print len(data['statuses'])
#15

##print hastags referenced for every tweet in data
for i in range(len(data['statuses'])):
    for element in data['statuses'][i]['entities']['hashtags']:
        print element['text']
