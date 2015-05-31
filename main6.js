//Width and height
var margin = {top: 60, right: 100, bottom: 40, left: 100},
	width = 960 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;
	
//create scale functions
var x = d3.scale.linear() 
	.range([width, 0]); //reversed so it will plot chronologically
	
var y = d3.scale.linear()
	.range([height, 0]);
	
var radius = d3.scale.linear()
	.range([6,15])

//create svg 
var svg = d3.select("body")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//data
d3.json("json-feminism.txt", function(error, json) {
	if (error) return console.warn(error);
	data = json;
	feminism = data.statuses
	console.log(feminism.length);
	
	//function to check if an array contains a specific string
	function contains(a, obj) {
		for (var i = 0; i < a.length; i++) {
			if (a[i] === obj) {
				return true;
			}
			else {
				return false;
			}
		}
	}
	//addings all tweets from one json to another
	d3.json("json-womenagainstfeminism.txt", function(error, json){
		if (error) return console.warn(error);
		womenagainstfeminism = json.statuses;
		for (i=0; i < womenagainstfeminism.length; i++){
			feminism.push(womenagainstfeminism[i]);
		}
		console.log(feminism.length);
	//addings all tweets from one json to another
	d3.json("json-womenempowerment.txt", function(error, json){
		if (error) return console.warn(error);
		womenempowerment = json.statuses;
		for (i=0; i < womenempowerment.length; i++){
			feminism.push(womenempowerment[i]);
		}
		console.log(feminism.length);
	//addings all tweets from one json to another
	d3.json("json-yesallwomen.txt", function(error, json){
		if (error) return console.warn(error);
		yesallwomen = json.statuses;
		for (i=0; i < yesallwomen.length; i++){
			feminism.push(yesallwomen[i]);
		}
		console.log(feminism.length);
	
	// adding ids from feminism dataset to the id array
	var ids = [];
	for (i=0; i < feminism.length; i++){
		if (contains(ids, feminism[i].id) == true){
			//do nothing
		} else {
			ids.push(feminism[i].id);
		}
	}
	
	console.log("Number of unique tweet IDs:")
	console.log(ids.length);

	var dataset = feminism;
	
	//log transform retweet_count
	for (i=0; i < dataset.length; i++){
		if (dataset[i].retweet_count != 0) {
			dataset[i].retweet_count = (Math.log(dataset[i].retweet_count)/Math.LN10);
		}
	}

	//end of getting all the data

	//dates and scale for dates
	function getDate(d) {
		return new Date(d.created_at);
	}

	var minDate = getDate(dataset[0]),
		maxDate = getDate(dataset[dataset.length-1]);
		//setting min and max date to lowest or highest date value
	for (i=0; i < dataset.length; i++){
		if (getDate(dataset[i]) < minDate) {
			minDate = getDate(dataset[i]);
		}
		else if (getDate(dataset[i]) > maxDate) {
			maxDate = getDate(dataset[i]);
		}
	}

	var timeScale = d3.time.scale()
		.domain([maxDate, minDate])
		.range([0, width]);

	//axes
	var xAxis = d3.svg.axis()
		.scale(timeScale)
		.orient("bottom")
		.ticks(8)
		.tickFormat(d3.time.format("%H:%M"));
		
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(5);

	x.domain([0,dataset.length-1]);
	y.domain([d3.min(dataset, function(d) {return parseFloat(d.retweet_count);}), d3.max(dataset, function(d) {return parseFloat(d.retweet_count)}) ]);
	radius.domain([d3.min(dataset, function(d) {return parseFloat(d.retweet_count);}), d3.max(dataset, function(d) {return parseFloat(d.retweet_count)}) ]);

	//generates axis last so it's on top
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (height) + ")")
		.call(xAxis);
		
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("log(retweets)");
	
	//create circles
	svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", function (d) { 
			return timeScale(getDate(d));
		})
		.attr("cy", function (d) { 
			return y(d.retweet_count);
		})
		.attr("fill", "steelblue")
		.attr("r", 0);
	
	//transition and circle radius
	svg.selectAll("circle")
		.transition()
		.delay(function (d, i) {
			return timeScale(getDate(d)) * 2;
		})
		.duration(function (d) {
			return y.invert(d.retweet_count); 
		})
		.ease("elastic")
		.attr("r", function (d) { 
			return radius(d.retweet_count); 
		});

	//event listener for highlighting circles
	svg.selectAll("circle")
		.on("mouseover", function(d){ //turn circle orange on hover
		d3.select(this)
			.attr("fill", "orange");
		//get circle's x/y values
		var xPosition = parseFloat(d3.select(this).attr("cx"));
		var yPosition = parseFloat(d3.select(this).attr("cy"));
		
		//create tooltip label
		svg.append("text")
			.attr("id", "tooltip")
			.attr("x", xPosition + 10)
			.attr("y", yPosition - 10)
			.attr("text-anchor", "middle")
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("font-weight", "bold")
			.attr("fill", "grey")
			.html(getDate(d) + "<br/>" + " \n retweets: " + Math.round(Math.pow(10, d.retweet_count)));
	
		//HTML div Tooltip for tweet text
		var boxxPosition = (width/3);
		var boxyPosition = (height+120);
		
		d3.select("#tweetbox")
		  .style("left", boxxPosition + "px")
		  .style("top", boxyPosition + "px")
		  .select("#value")
		  .html("User: " + d.user.name + " (@" + d.user.screen_name + ")" + "<br/>" + d.text);
		
		d3.select("#tweetbox").classed("hidden", false);
		
	})
	.on("mouseout", function(d) {
		d3.select(this)
			.transition()
			.duration(250)
			.attr("fill", "steelblue");
		//Remove the tooltip
		d3.select("#tooltip").remove();
		//Remove the tweetbox
		d3.select("#tweetbox").classed("hidden", true);
	});
	
	////////////derive dataset of hashes///////////////
	
	//create an array of hashtags from our dataset; console.log path: dataset[1].entities.hashtags[1]
	var hashtags = [];
	for (item in dataset){
		for (number in dataset[item].entities.hashtags) {
			hashtags.push(dataset[item].entities.hashtags[number].text)
		}
	}
	
	//function to check if an array contains a specific string
	function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
	}
	
	//make all hashtags lowercase then sort them
	for (var i = 0; i < hashtags.length; i++) {
		hashtags[i] = hashtags[i].toLowerCase();
	}
	hashtags.sort();
	
	var uniqueHashes = [];
	var countHashes = [];

	//loop through hashtags, create an array of unqiue hashtags and an array of count of each unique hashtag
	for (var i = 0; i < hashtags.length; i++) {
		if (contains(uniqueHashes, hashtags[i]) == true){
			var newCount = countHashes[countHashes.length-1] + 1
			countHashes.pop();
			countHashes.push(newCount);
			
		} else {
			uniqueHashes.push(hashtags[i]);
			countHashes.push(1);
		}
	}

	console.log("hashtags array");
	console.log(hashtags);
	console.log("uniqueHashes array");
	console.log(uniqueHashes);
	console.log("countHashes array");
	console.log(countHashes);
	
	//create an array for the feminist and antifeminist hashtags
	var feministHashtags = ["yesallwomen", "sexism", "whoneedsfeminism", "womenempowerment", "tropesvswomen", "standwithwomen", "rapeculture", "patriarchy", "dv"]
	var antifeministHashtags = ["womenagainstfeminism", "dontbethatfeminist", "feminismisawful", "feministsareugly", "illneedfeminismwhen", "fakecases", "femsplain", "justfeministthings"]
	var subjectiveHashtags = ["feminism", "feminists", "feminine", "gamergate"]
	
	//try to parse feminist vs non feminist hashtags in dataset
	var classifyHashes = [];
	for (var i = 0; i < uniqueHashes.length; i++){
		if (contains(feministHashtags, uniqueHashes[i]) == true){
			classifyHashes.push("feminist");
		} else if (contains(antifeministHashtags, uniqueHashes[i]) == true) {
			classifyHashes.push("antifeminist");
		} else if (contains(subjectiveHashtags, uniqueHashes[i]) == true) {
			classifyHashes.push("subjective");
		} else {
			classifyHashes.push("unsure");
		}
	}
	console.log("classifyHashes array");
	console.log(classifyHashes)
	
	//create a json with the unique hashes, count of each and the hash classification
	var json = [];	
	for (var i = 0; i < uniqueHashes.length; i++){
		json.push({hash: uniqueHashes[i], count: countHashes[i], classification: classifyHashes[i]});
	}
	
	console.log("json array of unique hashes, count aand classification");
	console.log (json);

	
//chart # 2//////////////////

	var sizeScale = d3.scale.linear()
		.range([5,60])
		.domain([d3.min(json, function(d) {return parseFloat(d.count);}), d3.max(json, function(d) {return parseFloat(d.count)}) ]);
	
	var chargeScale = d3.scale.linear() //scale to make larger circles have more charge (more spaced out)
		.range([-10,-500])
		.domain([d3.min(json, function(d) {return parseFloat(d.count);}), d3.max(json, function(d) {return parseFloat(d.count)}) ]);
	
//Width and height
	var w = width + margin.left + margin.right; //960
	var h = 600; 
	
//Initialize a default force layout, using the nodes and edges in dataset
	var force = d3.layout.force()
		.nodes(json)
		.size([w, h])
		.linkDistance([50])
		.charge(function(d) {
			return chargeScale(d.count);
		})
		.start();
		
	var colors = d3.scale.category10();

//Create SVG element
	var svg3 = d3.select("body")
		.append("svg")
		.attr("width", w)
		.attr("height", h);
		
//key
	svg3.selectAll("rect")
		.data(key = ["feminist", "antifeminist", "subjective", "other"])
		.enter()
		.append("rect")
		.attr("id", "key")
		.attr("x", (w / 7))
		.attr("y", function (d, i){
			return ((i * 40) + (h/10));
		})
		.attr("width", 20)
		.attr("height", 20)
		.attr("fill", function(d, i) {
			if (key[i] == "feminist"){return "#2ca02c"}
			else if (key[i] == "antifeminist"){return "#d62728"}
			else if (key[i] == "subjective"){return "#ff7f0e"}
			else {return "#7f7f7f"};
		}); 
		
//key text
	svg3.selectAll("text")
		.data(key = ["feminist", "antifeminist", "contextual", "other"])
		.enter()
		.append("text")
		.attr("id", "keytext")
		.attr("text-anchor", "left")
		.attr("x", (w / 7) + 25)
		.attr("y", function (d, i){
			return ((i * 40) + 15 + (h/10));
		})
		.attr("font-family", "sans-serif")
		.attr("font-size", "16px")
		.attr("fill", "grey")
		.attr("font-weight", "bold")
		.text(function(d, i) {
			return key[i];
		});

//Create nodes as circles
	var nodes = svg3.selectAll("circle")
		.data(json)
		.enter()
		.append("circle")
		.attr("r", function (d) {
			return sizeScale(d.count);
		})
		.style("fill", function(d, i) {
			if (d.classification == "feminist"){return "#2ca02c"}
			else if (d.classification == "antifeminist"){return "#d62728"}
			else if (d.classification == "subjective"){return "#ff7f0e"}
			else {return "#7f7f7f"};
		})
		.call(force.drag);
		//Every time the simulation "ticks", this will be called
		force.on("tick", function() {
			nodes.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; });
		});
		
//define hover activity
		svg3.selectAll("circle")
			//make circle bigger on hover
			.on("mouseover", function(d, i){ 
				d3.select(this)
					.transition()
					.duration(1000)
					.ease("elastic")
					.attr("r", function (d) {
						return sizeScale(d.count) + (0.1 * sizeScale(d.count));
					});

				//create tooltip label
				svg3.append("text")
					.attr("id", "tooltip")
					.attr("x", w / 2)
					.attr("y", (h / 8) - 20)
					.attr("text-anchor", "middle")
					.attr("font-family", "sans-serif")
					.attr("font-size", "20px")
					.attr("font-weight", "bold")
					.attr("fill", "grey")
					.text("#" + d.hash + " (" + d.count + ")");
					
			})
			//mouseout - return radius and remove tooltip
			.on("mouseout", function(d) {
				d3.select(this)
					.transition()
					.duration(1000)
					.ease("elastic")
					.attr("r", function (d) {
						return sizeScale(d.count);
					})
				//Remove the tooltip
				d3.select("#tooltip").remove();
			});

	})})});
});


