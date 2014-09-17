//data
d3.json("json-feminism.txt", function(error, json) {
	if (error) return console.warn(error);
	data = json;
	dataset = data.statuses
	console.log(dataset);
	
	var ids = [];
	
	//function to check if an array contains a specific string
	function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
	}

	for (i=0; i < dataset.length; i++){
		if (contains(ids, dataset[i].id) == true){
			console.log("already existed");
		} else {
			ids.push(dataset[i].id);
			console.log("added to array");
		}
	}
	
d3.json("json-whoneedsfeminism.txt", function(error, json){
	if (error) return console.warn(error);
	data = json.statuses
	for (i = 0; i < data.length; i++){
		if (contains(ids, data[i].id) == true){
			console.log("already existed");
		} else {
			ids.push(data[i].id);
			console.log("added to array");
			dataset.push(data[i]);//THIS ISN'T ADDING THE NEW TWEET OBJECT TO THE DATASET
			console.log(dataset);
		}
	}
});

});
