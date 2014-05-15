
function TuringMachine(output, stateTable){
	this.tape = output["tape"];
	this.position = output["position"];
	this.state = output["state"];
	this.stepNum = 0;
	this.stateTable = stateTable;
	this.offset = 200;
	this.runID = "";
}

TuringMachine.prototype = {
	constructor: TuringMachine,
	run: function() {
		f = this;
		if ( this.runID != "" ) return;
		if ( this.state != "Halt" ) {
			this.runID = setInterval( 'f.step()' , 45);
		};
	},
	pause: function() {
		clearInterval(this.runID);
		this.runID = "";
	},
	headValue: function(){
		return this.tape[ this.position ];
	},
	setHeadValue: function(o){
		this.tape[ this.position ] = o;
	},
	moveHead: function(direction){
		this.position += ( direction == "right" ? 1 : -1);
		//if new position is out of bounds, increase length and write default character 0.
		if ( this.position > this.tape.length-1 ) {
			this.tape.push(0);
		};

		//if new position index is negative, unshift and write 0. set index at 0.
		if ( this.position < 0 ) {
			this.tape.unshift(0);
			this.position = 0;
			this.offset -= 10;
		};
	},
	step: function() {
		this.stepNum += 1;
		
		read = this.headValue();
		state = this.state;
		
		this.setHeadValue( this.stateTable[ state ][ read ][0] );
		this.moveHead( this.stateTable[ state ][ read ][1] );
		this.state = this.stateTable[ state ][ read ][2];

		this.drawRow();

		updateHeadInfo(this.stepNum, state, this.headValue(), this.stateTable[state][this.headValue()][0]);
		updateStateTable(state, this.headValue());

	},
	drawRow: function(){
	
		out = "<div class=\"tapeRow\">";
		out += "<div class=\"state\"  style=\"margin-right:" + this.offset +"px;\">" + this.state + "</div>";
		for (var i = 0; i < this.tape.length; i++) {
			if ( this.position == i ) {
				out += "<div class=\"tapeItem\" style='color:red;'>" + this.tape[i] + "</div>";	
			} else {
				out += "<div class=\"tapeItem\">" + this.tape[i] + "</div>";
			};
		};
		out += "</div>";
		$("#outputTable").prepend( out );
	}
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







