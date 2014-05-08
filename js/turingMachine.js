//turing machine
// (currentState, value, write, move, nextState)

var stepNum = 0;

function run() {
	if ( output[ output.length - 1 ]["state"] != "Halt") {
		setInterval( step, 45);
	};
}


function step() {
	//setup next step & copy previous tape prior to writing changes
	stepNum += 1;
	output[stepNum] = clone( output[stepNum - 1] );

	state = output[stepNum]["state"];
	tape = output[stepNum]["tape"];
	position = output[stepNum]["position"];
	value = tape[position];

	//get actions for this state / value
	actions = stateTable[state][value];

	//write tape value at position
	tape[position] = actions[0];

	//move position	
	/*
		don't need to use HTML element table, which makes display more complex. shoudl do w/ Div's and CSS. 
		should create a tape object made of tapeRows. tapeRows handle display automatically. 
	*/
	if (actions[1] == "right") {
		position += 1;
		//if new position is out of bounds, increase length and write default character 0.
		if (position > output[stepNum].length ) {
			tape.push(0);
		};
	} else if (actions[1] == "left") {
		position -= 1;
		//if new position index is negative, unshift and write 0. set index at 0.
		if (position < 0 ) {
			for (var i = 0; i < output.length; i++) {
				output[i]["tape"].unshift(0);
				output[i]["position"] += 1;
				$("#outputTable table tr:eq(" + i + ") td:eq(1)").after("<td>0</td>");
			}

			output[stepNum]["position"] = 0;
		};
	};

	//update outputTable
	$("#outputTable table").prepend( drawRow(i) );
	updateHeadInfo(stepNum, actions[2], tape[position], actions[0]);

	//update stateTable(state,value)
	updateStateTable(actions[2], tape[position]);
}

function drawRow(i) {
	out = "";
  
	i = stepNum;
	out += "<tr><td>" + i + "</td><td>" + output[i]["state"] + "</td>";
	for (var j = 0; j < output[i]["tape"].length; j++) {
		if ( output[i]["position"] == j ) {
			out += "<td style='color:red;'>" + output[i]["tape"][j] + "</td>";	
		} else {
			out += "<td>" + output[i]["tape"][j] + "</td>";
		};
	};
	out += '</tr>\n';
	return out;
}

function updateHeadInfo(stepNum, state, value, write){
	$("#stepNum").html( "Step: " + stepNum );
	$("#currentState").html( 
		"Current State: " + state + 
		" Read: " + value + 
		" Write: " + write
	);
}

function drawStateTable(){
	o = "<table><tr><td>state</td><td>read</td><td>write</td><td>move</td><td>next state</td></tr>";

	for (var i in stateTable) {
		//console.debug("i-" + i);
		
		for (var j in stateTable[i]) {
			//console.debug("j-" + j);
			o += "<tr style='border: 1px solid red'><td class=\"state\">" + i + "</td>";
			o += "<td class=\"read\">" + j + "</td>"
			for (var k in stateTable[i][j]) {
				//console.debug("k-" + stateTable[i][j][k]);
				o += "<td>" + stateTable[i][j][k] + "</td>"
		 	};
		 	o += "</tr>";
		};
	};
	  
	o += "</table>"
	$("#stateTable").html(o);

}

var row = {};
function updateStateTable(state, value){
	//reset colors
	$(row).css("border", "1px solid black");

	//color current selected state row
	row = $("#stateTable td.state:contains(" + state + ")").next(":contains(" + value + ")").parent().children();
	$(row).css("border", "1px solid red");
}


function clone(obj) {
  var copy = {};
  if (null == obj || "object" != typeof obj) return obj;

	// Handle Array
  if (obj instanceof Array) {
    var copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    var copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }
  return copy;
}

$(document).ready(function(){ 
	$("#outputTable table").prepend( drawRow(0) );
	$("#step").click(function(){
		step();
	});
	$("#run").click(function(){
		run();
	});
	drawStateTable();
});



