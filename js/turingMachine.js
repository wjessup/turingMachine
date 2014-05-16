
function TuringMachine(stateTable){
	
	this.position = 0;
	this.state = "A";
	this.lastState = this.state;
	this.stepNum = 0;
	this.stateTable = stateTable;
	this.offset = 200;
	this.runID = "";

	this.setupTape();
	$("#result").hide();
}

TuringMachine.prototype = {
	constructor: TuringMachine,
	run: function() {
		f = this;
		if ( this.runID != "" ) return;
		if ( this.state != "Halt" ) {
			this.runID = setInterval( 'f.step()' , 15);
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
		this.lastState = this.state;
		this.state = this.stateTable[ state ][ read ][2];

		this.drawRow();

		updateHeadInfo(this.stepNum, state, this.headValue(), this.stateTable[state][this.headValue()][0]);
		updateStateTable(state, this.headValue());

		if (this.state == "Halt") {
			this.pause();
			$("#result").html("Result = " + getResult(this.tape) ).show();
		};

	},
	drawRow: function(){
	
		out = "";
		if (transitionStates[this.state] != undefined && this.lastState != this.state ) {
			//out = "<div class=\"tapeRow\">" + transitionStates[this.state] + "</div>";
		}

		out += "<div class=\"tapeRow\">";
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
	},
	setupTape: function(){
		a = $("#a").val();
		b = $("#b").val();

		output = [];
		//load A value from input
		output.push(1);
		while(a > 0) {
			output.push(1);
			a--;
		};
		output.push(0);

		//load B value from input
		output.push(1);
		while(b > 0) {
			output.push(1);
			b--;
		};
		this.tape = output;
		this.drawRow();
	}
}


function getResult(tape){
	s = tape.reverse().join("");

	console.info(s);
	a = s.split("0");
	r = a[0].split("").length;
	console.info(r);
	return r-1;
}

function updateHeadInfo(stepNum, state, value, write){
	$("#currentState").html( 
		"Step: " + stepNum + 
		" Current State: " + state + 
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







