import re

x = 1
output = open("tweepyjson.txt", "w")
with open('/home/pri/twitter/tweepytweets3.txt') as f:
	for x in range(1,4566):
		line = f.readline()
		line = re.sub(r'u\'', r'"',line) ##replace u' with " since that's an issue for json
		line = re.sub(r'\'', r'"',line) ##replace ' with " since that's an issue for json
		output.write((line).rstrip()+',') ##strip trailing space and write the line (with a comma) to the file
f.close()
