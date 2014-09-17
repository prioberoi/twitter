import re

x = 1
output = open("tweepyjson.txt", "w")
with open('/home/pri/twitter/tweepytweets3.txt') as f:
	for x in range(1,4566):
		line = f.readline()
		line = re.sub(r'"', r'',line)
		line = re.sub(r' None', r'"None"',line) ##replace the none's without quotes
		line = re.sub(r'False', r'false',line) #replace uppercase False with false
		line = re.sub(r'True', r'true',line) #replace uppercase False with false
		line = re.sub(r'u\'', r'"',line) ##replace u' with " since that's an issue for json
		line = re.sub(r'\'', r'"',line) ##replace ' with " since that's an issue for json
#		line = re.sub(r'splunkyface', r'\'',line)
		output.write((line).rstrip()+',') ##strip trailing space and write the line (with a comma) to the file
f.close()
