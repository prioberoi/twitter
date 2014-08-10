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
		var ms = d * 1000,
				date = new Date(ms),
				format = d3.time.format('%m-%d'),
				formattedDate = format(date);
		return formattedDate;
	});
	
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(5);
	
//line
var line = d3.svg.line()
	.interpolate("cardinal")
	.x(function(d) { 
		return x(d.timestamp);
	})
	.y(function(d) {
		return y(d.bpm);
	});

//create svg 
var svg = d3.select("body")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//data
d3.json("day_level_data_v2.json", function(error, json) {
	if (error) return console.warn(error);
	data = json;
	dataset = data.filter(function(d) {return d.userId == currentUser}); //filter for specific patient
	
	//define baseline bpm for patient
	var userData = data.filter(function(d) {
		return d != null ? d.userId == currentUser : false;
	});
	var baseline = d3.mean(userData, function(d) {
		return +d.bpm;
	});
	
	//define the area function for shading
	var area = d3.svg.area()
		.x(function(d) { 
			return x(d.timestamp);
		})
		.y0(baseline)
		.y1(function(d) {
			return y(d.bpm);
		});
	
	x.domain([d3.min(data, function(d) {return d.timestamp;}), d3.max(data, function(d) {return d.timestamp}) ]);
	y.domain([d3.min(data, function(d) {return parseFloat(d.bpm);}), d3.max(data, function(d) {return parseFloat(d.bpm)}) ]);

	//color area to baseline
	svg.append("path")
		.datum(dataset) 
		.attr("class", "area")
		.attr("d", area);
	
	//color boxes
	svg.append("rect")
		.attr("width", margin.left)
		.attr("height", height)
		.attr("fill", "steelblue")
		.attr("transform", "translate(" + -margin.left + "," + "0)");
		
	svg.append("rect")
		.attr("width", margin.right)
		.attr("height", height)
		.attr("fill", "steelblue")
		.attr("transform", "translate(" + width + "," + "0)");
	
	//x-axis grid lines
	svg.selectAll("line.x")
		.data(x.ticks(10))
		.enter().append("line")
		.attr("class", "x")
		.attr("x1", x)
		.attr("x2", x)
		.attr("y1", 0)
		.attr("y2", height)
		.style("stroke", "#ccc");
		
	//y-axis grid lines
	svg.selectAll("line.y")
		.data(y.ticks(10))
		.enter().append("line")
		.attr("class", "y")
		.attr("x1", 0)
		.attr("x2", width)
		.attr("y1", y)
		.attr("y2", y)
		.style("stroke", "#ccc");
	
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
		.text("BPM");
		
	//generate line
	svg.append("path")
		.datum(dataset)
		.attr("class", "line")
		.attr("d", line);
		
	//create circles
	svg.selectAll("circle")
	.data(dataset)
	.enter()
	.append("circle")
	.attr("cx", function (d) { 
		return x(d.timestamp); 
	})
	.attr("cy", function (d) { 
		return y(d.bpm); 
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
			.text("Heart Rate: " + d.bpm + " Timestamp: " + d.timestamp);
	})
	.on("mouseout", function(d) {
		d3.select(this)
			.transition()
			.duration(250)
			.attr("fill", "steelblue");
		//Remove the tooltip
		d3.select("#tooltip").remove();
	});

	//generate box text on the left
	svg.append("g")
		.datum(dataset)
		.attr("class", "boxText")
		.append("text")
		.attr("x", 0 - (margin.left - 5))
		.attr("y", 0 + (height/2))
		.datum(dataset)
		.text(data[0].bpm); // picks the first value for bpm in this dataset filtered in the line above
	
	//generate box text on the right
	svg.append("g")
		.datum(dataset)
		.attr("class", "boxText")
		.append("text")
		.attr("x", 0 + width + 10)
		.attr("y", 0 + (height/2) )
		.datum(dataset)
		.text(data[data.length-1].bpm); // picks the last value for bpm in this dataset filtered in the line above
	
});
