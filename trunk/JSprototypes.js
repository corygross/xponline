// The purpose of this file is to have a place to store javascript prototype functions that can be used throughout the project.

// This function removes all spaces at the beginning and end of a string
String.prototype.trim = function() {
	a = this.replace(/^\s+/, '');
	return a.replace(/\s+$/, '');
};

// This function removes all spaces at the beginning of a string
String.prototype.trimLeft = function() {
	return this.replace(/^\s+/, '');	
};