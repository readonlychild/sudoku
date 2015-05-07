var sudoku = sudoku || {};

sudoku.container = "#sudoku";
sudoku.messageContainer = "#sudo-message";
sudoku.currX = 0;
sudoku.currY = 0;
sudoku.hintsCount = 28;
sudoku.unsolvableFlag = true;

sudoku.initialize = function () {
	
	var instance = this;

	// CELL CLICKING
	$(this.container).on("click", ".cell", function () {
		var $this = $(this);
		var x = parseInt($this.data("col"));
		var y = parseInt($this.data("row"));
		instance.currX = x;
		instance.currY = y;
		$(instance.container + " .cell").removeClass("active")
		$this.addClass("active");
		instance.render();
	});

	// DOC KEYPRESS
	$(document).on("keyup", function (evt) {
		
		//up 38
		if (evt.keyCode == 38) {
			if (instance.currY == 0) return;
			instance.currY --;
			instance.render();
		}
		//dn 40
		if (evt.keyCode == 40) {
			if (instance.currY == 8) return;
			instance.currY ++;
			instance.render();
		}
		//left 37
		if (evt.keyCode == 37) {
			if (instance.currX == 0) return;
			instance.currX --;
			instance.render();
		}
		//right 39
		if (evt.keyCode == 39) {
			if (instance.currX == 8) return;
			instance.currX ++;
			instance.render();
		}

		if (instance.isCellLocked(instance.currY, instance.currX)) {
			return;
		}

		//console.log(evt.keyCode);
		if (evt.keyCode >= 49 && evt.keyCode <= 57) {
			instance.setValue(evt.keyCode - 48);
			return;
		}
		// cero blank cell - spacebar too
		if (evt.keyCode == 48 || evt.keyCode == 32) {
			instance.setValue(0);
		}
		
	});
	
	// BTN-DIGIT ACTION
	$(document).on("click", ".btn-digit", function () {
		if (instance.isCellLocked(instance.currY, instance.currX)) {
			return;
		}
		var d = parseInt($(this).data("digit"));
		instance.setValue(d);
	});

};

sudoku.render = function () {
	this._getBlockValidity();

	var allfilled = true;
	var allvalids = true;

	var htm = "<table class='sudo-grid'>";
	for (var i = 0; i < this.cells.length; i++) {
		var row = this.cells[i];
		htm += "<tr>";
		for (var j = 0; j < row.length; j++) {

			if (row[j] == 0) allfilled = false;

			htm += "<td class='cell";
			var vcss = "";
			if (this.currX == j) vcss = " crosshair";
			if (this.currY == i) vcss = " crosshair";
			if (this.currX == j && this.currY == i) vcss = " active";
			if (this._altcell(i, j)) { vcss += " alt"; }

			//vcss += " " + this._getblockcode(i, j);

			if (this._blockValidity[i][j] == 0) vcss += " block-ng";

			if (this.isCellLocked(i, j)) vcss += " locked";

			if (i == 3 || i == 6) vcss += " big-top";
			if (j == 3 || j == 6) vcss += " big-left";

			htm += vcss;
			htm += "' data-row='" + i + "' data-col='" + j + "'>" + (row[j] == 0 ? "&nbsp;" : row[j]) + "</td>";
		}
		var rowisvalid = this.isRowValid(i);
		if (!rowisvalid) allvalids = false;
		htm += "<td class='" + (rowisvalid ? "ok" : "ng") + "''>&nbsp;</td>";
		htm += "</tr>";
	}
	htm += "<tr>";
	for (var i = 0; i < this.cells.length; i++) {
		var colisvalid = this.isColValid(i);
		if (!colisvalid) allvalids = false;
		htm += "<td class='" + (colisvalid ? "ok" : "ng") + "''>&nbsp;</td>";
	}
	if (this.unsolvableFlag) {
		var stillsolvable = this.solver.isSolvable(this.cells);
		htm += "<td class='" + (stillsolvable ? "ok" : "ng") + "'>&nbsp;</td>";
	}
	htm += "</tr>";
	htm += "</table>";
	$(this.container).html(htm);
	if (allvalids && allfilled) {
		this.say("you are a winner!", "showing");
	} else {
		this.say("");
	}
};
sudoku._altcell = function (i, j) {
	if (i < 3 || i > 5) {
		if (j < 3) return true;
		if (j > 5) return true;
	} else {
		if (j > 2 && j < 6) return true;
	}
	return false;
}
sudoku.setValue = function (val, x, y) {
	x = x || this.currX;
	y = y || this.currY;
	this.cells[y][x] = val;
	this.render();
};

sudoku.isCellLocked = function (i, j) {
	return this.gridlock[i][j] > 0;
};
sudoku.isRowValid = function (idx) {
	//check total limit
	var s = 0;
	for (var i = 0; i < this.cells.length; i++) {
		var val = this.cells[idx][i];
		s += val;
	}
	if (s > 45) return false;
	// check no repeated digits
	var dig = [];
	for (var i = 0; i < this.cells.length; i++) {
		dig[i] = 0;
	}
	for (var i = 0; i < this.cells.length; i++) {
		var val = this.cells[idx][i] - 1;
		dig[val] += 1;
	}
	for (var i = 0; i < this.cells.length; i++) {
		if (dig[i] > 1) return false;
	}
	return true;
};
sudoku.isColValid = function (idx) {
	//check total limit
	var s = 0;
	for (var i = 0; i < this.cells.length; i++) {
		var val = this.cells[i][idx];
		s += val;
	}
	if (s > 45) return false;
	// check no repeated digits
	var dig = [];
	for (var i = 0; i < this.cells.length; i++) {
		dig[i] = 0;
	}
	for (var i = 0; i < this.cells.length; i++) {
		var val = this.cells[i][idx] - 1;
		dig[val] += 1;
	}
	for (var i = 0; i < this.cells.length; i++) {
		if (dig[i] > 1) return false;
	}
	return true;	
};
sudoku.isBlockValid = function (x, y, isCellCoords) {
	if (isCellCoords) {
		x = parseInt(x/3);
		y = parseInt(y/3);
	}
	// check repeated digits
	var dig = [];
	var s = 0;
	for (var i = 0; i < 9; i++) {
		dig[i] = 0;
	}
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			var val = this.cells[y*3+j][x*3+i] - 1;
			dig[val] += 1;
			s += val + 1;
			//console.log('dig',y*3+j, x*3+i, val + 1);
		}
	}
	for (var i = 0; i < 9; i++) {
		if (dig[i] > 1) return false;
	}
	if (s > 45) return false;
	return true;
};
sudoku._getBlockValidity = function () {
	var rowsx = [];
	for (var i = 0; i < 9; i++) {
		rowsx.push([1,1,1,1,1,1,1,1,1]);
		for (var j = 0; j < 9; j++) {
			var x = parseInt(j/3);
			var y = parseInt(i/3);
			//rowsx[i,j] = this.isBlockValid(i, j, true) ? 1 : 0;
			rowsx[i][j] = this.isBlockValid(x, y) ? 1 : 0;
			//console.log(x + "," + y, i + "," + j, rowsx[i][j]);
		}
	}
	this._blockValidity = rowsx;
	//return rows;
};

sudoku.startGame = function (hintCount) {
	hintCount = hintCount || this.hintsCount;

	var grid = this.solver.generatePuzzle(hintCount);

	// build gridlock
	var gridl = [];
	gridl.push([0,0,0,0,0,0,0,0,0]);
	gridl.push([0,0,0,0,0,0,0,0,0]);
	gridl.push([0,0,0,0,0,0,0,0,0]);
	gridl.push([0,0,0,0,0,0,0,0,0]);
	gridl.push([0,0,0,0,0,0,0,0,0]);
	gridl.push([0,0,0,0,0,0,0,0,0]);
	gridl.push([0,0,0,0,0,0,0,0,0]);
	gridl.push([0,0,0,0,0,0,0,0,0]);
	gridl.push([0,0,0,0,0,0,0,0,0]);

	for (var i = 0; i < gridl.length; i++) {
		for (var j = 0; j < gridl.length; j++) {
			if (grid[i][j] > 0) gridl[i][j] = 1;
		}
	}
	this.gridlock = gridl;
	this.cells = grid;
	this._getBlockValidity();
	return grid;
};

sudoku.say = function (msg, cssClass) {
	cssClass = cssClass || "";
	$(this.messageContainer).removeClass("showing");
	$(this.messageContainer).html(msg).addClass(cssClass);
};
sudoku.serialize = function (blanks) {
	blanks = blanks || ".";
	var s = "";
	for (var i = 0; i < this.cells.length; i++) {
		for (var j = 0; j < this.cells[i].length; j++) {
			var d = this.cells[i][j].toString();
			if (d == "0") d = blanks;
			s += d;
		}
	}
	return s;
}