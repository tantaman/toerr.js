// chrome:
// window.onerror = function(msg, url, line, col, err)
// err has the stack.

// FF & Safari:
// window.onerror = function(msg, url, line)
// no column!!! That is 0 help.

// IE:
// window.onerror = function(msg, url, line, col)