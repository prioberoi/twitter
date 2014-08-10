//select patient
var currentUser = 0000000001;

//Width and height
var margin = {top: 20, right: 150, bottom: 30, left: 150},
	width = 960 - margin.left - margin.right,
	height = 200 - margin.top - margin.bottom;
	
//create scale functions
var x = d3.scale.linear() 
	.range([0, width]);
	
var y = d3.scale.linear()
	.range([height, 0]);

//axes
var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.tickFormat(function (d, i) {
		date = new Date(d.created_at),
		console.log(date),
		format = d3.time.format('%m-%d-%y'),
		formattedDate = format(date);
		return formattedDate
		console.log(formattedDate);
	});
	
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(5);

//create svg 
var svg = d3.select("body")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//data
d3.json("tweets.json", function(error, json) {
	if (error) return console.warn(error);
	data = json;
	dataset = data.statuses
	x.domain([d3.min(dataset, function(d) {return parseFloat(d.id);}), d3.max(dataset, function(d) {return parseFloat(d.id)}) ]);
	y.domain([d3.min(dataset, function(d) {return parseFloat(d.retweet_count);}), d3.max(dataset, function(d) {return parseFloat(d.retweet_count)}) ]);

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
		.text("retweets");
	
	//create circles
	svg.selectAll("circle")
	.data(dataset)
	.enter()
	.append("circle")
	.attr("cx", function (d) { 
		return x(d.id); 
	})
	.attr("cy", function (d) { 
		return y(d.retweet_count); 
	})
	.attr("r", 4)
	.attr("fill", "steelblue")
	//event listener for highlighting circles
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
			.attr("fill", "black")
			.text("tweet id: " + d.id + " retweets: " + d.retweet_count);
	})
	.on("mouseout", function(d) {
		d3.select(this)
			.transition()
			.duration(250)
			.attr("fill", "steelblue");
		//Remove the tooltip
		d3.select("#tooltip").remove();
	});

});
