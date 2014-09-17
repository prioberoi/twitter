//Width and height
var margin = {top: 20, right: 150, bottom: 100, left: 150},
	width = 960 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;
	
//create scale functions
var x = d3.scale.linear() 
	.range([width, 0]); //reversed so it'll plot chronologically
	
var y = d3.scale.linear()
	.range([height, 0]);
	
var radius = d3.scale.linear()
	.range([4,10])

//create svg 
var svg = d3.select("body")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//data
d3.json("tweets2.json", function(error, json) {
	if (error) return console.warn(error);
	data = json;
	dataset = data.statuses

	//dates and scale for dates
	function getDate(d) {
		return new Date(d.created_at);
	}
	var minDate = getDate(dataset[0]),
		maxDate = getDate(dataset[dataset.length-1]);

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
		.text("retweets");
	
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
	.attr("r", function (d) { 
		return radius(d.retweet_count); 
	})
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
			.text("created: " + getDate(d) + "\n retweets: " + d.retweet_count);
	
		//HTML div Tooltip for tweet text
		var boxxPosition = (width/3);
		var boxyPosition = (height+60);
		
		d3.select("#tweetbox")
		  .style("left", boxxPosition + "px")
		  .style("top", boxyPosition + "px")
		  .select("#value")
		  .text(d.text);
		
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
		//d3.select("#tweetbox").classed("hidden", true);
	});

});

//TEST

//width and height
var w = width;
var h = height;
var barPadding = 1;

//create second svg
var svgHashtag = d3.select("body")
	.append("svg")
	.attr("width", w)
	.attr("height", h);
	
//data
var fakedata = [];
for (var i = 0; i < 21; i++){
	var newNumber = Math.round(Math.random() * 30);
	fakedata.push(newNumber)
}

//bars
svgHashtag.selectAll("rect")
	.data(fakedata)
	.enter()
	.append("rect")
	.attr("x", function (d, i){
		return i * (w / fakedata.length);
	})
	.attr("y", function(d){
		return h - (d * 4);
	})
	.attr("width", w / fakedata.length - barPadding)
	.attr("height", function (d){
		return d * 4;
	})
	.attr("fill", function(d){
		return "rgb(0,0, " + (d * 10) + ")";
	});

//text
svgHashtag.selectAll("text")
	.data(fakedata)
	.enter()
	.append("text")
	.text(function(d){
		return d;
	})
	.attr("x", function(d, i){
		return i * (w / fakedata.length) + (w / fakedata.length - barPadding) / 2; //x position is set to the left of each bar plus half the bar width 
	})
	.attr("y", function (d) {
		return h - (d * 4) + 15;
	})
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "white")
   .attr("text-anchor", "middle");
