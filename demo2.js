console.time("MainThread");
console.time("BackgroundNinjaThread");
var xml = document.getElementById("ninjatemplate").innerHTML;
var target = document.getElementById("demo");
var data = {name: "Josep Evans", age: 21  };

/**
 * this is basically the rendering code from the ninja repo, the
 * difference is next to none
 */
var compiler = function (html, data) {
	var templates = /<%([^%>]+)?%>/g;
	var operations = /(^( )?(if|for|else|switch|case|break|var|try|catch|finally|console|self|{|}))(.*)?/g,
		code = 'var r=[];\n', cursor = 0, match;

		var add = function(line, js) {
			js  ? (code += line.match(operations)
					? line + '\n' : 'r.push(' + line + ');\n') :
					(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
			return add;
		}

		while (match = templates.exec(html)) {
			add(html.slice(cursor, match.index))(match[1], true);
			cursor = match.index + match[0].length;
		}

		add(html.substr(cursor, html.length - cursor));
		code += 'return r.join("");';
		var complete = new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
		compiled = true;
		return complete;
};

var thread = new Thread()
	.setData({rawdata: data, ninja:compiler.toString(), xml: xml})
	.setCode(function(e) {
		var xml = e.data.xml;
		var data = e.data.rawdata;
		var compile = eval("compile = " + e.data.ninja);
		e.data.compiled = compile(xml, data);
	}).setOnComplete(function(e){
		target.innerHTML = e.data.compiled.toString();
		thread.kill();
		console.timeEnd("BackgroundNinjaThread");
	}).start();
console.timeEnd("MainThread");