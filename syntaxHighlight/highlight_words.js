/*
 *  The purpose of this file is to define tokens or special words for the different languages/file types this application supports
 *   Each word should be surrounded with '~' to ensure that it can be located in the string
 *   Each word should also have a matching reference in a stylesheet named for the language
 */

// Keywords for java
var java_words = "~public~system~abstract~continue~for~while~new~switch~assert~default~goto~package~synchronized~boolean~do~if~private~this~break~double~implements~protected~throw~byte~else~import~public~throws~case~enum~instanceof~return~transient~catch~extends~int~short~try~char~final~interface~static~void~class~finally~long~strictfp~volatile~const~int~String~true~false~null~";

// Keywords for php
var php_words = "~and~or~xor~exception~array~as~break~case~class~const~continue~declare~default~die~do~echo~else~elseif~empty~eval~exit~extends~for~foreach~function~global~if~include~include_once~isset~new~print~require~require_once~return~static~switch~unset~use~var~while~final~interface~implements~instanceof~public~private~protected~abstract~clone~try~catch~throw~this~final~namespace~goto~";

// Default keywords.  These will be used if we don't recognize a file type
var default_words = "~for~while~do~if~else~boolean~bool~int~double~break~return~true~false~null~";