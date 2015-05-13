sudoku.datasource = sudoku.datasource || {};
sudoku.datasource.save = function (puzzle, name) {
	localStorage.setItem(name, puzzle);
};
sudoku.datasource.get = function (name) {
	var v = localStorage.getItem(name);
	return v;
};