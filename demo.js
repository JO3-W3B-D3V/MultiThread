console.time("threads");
var $e = function (x) { return document.querySelector(x); };
var mt = new MultiThread();
var loop1 = $e("#loop1").textContent;
var loop2 = $e("#loop2").textContent;
var loop3 = $e("#loop3").textContent;
var loop4 = $e("#loop4").textContent;
var complete = { t1: false, t2: false, t3: false, t4: false };


// background thread # 1
var t1 = mt.spawnThread({ code: loop1, name: "First Loop" });
t1.postMessage(complete);
t1.onmessage = function (e) {
	complete.t1 = e.data;
	mt.closeThread("First Loop");
};


// background thread # 2
var t2 = mt.spawnThread({ code: loop2, name: "Second Loop" });
t2.postMessage(complete);
t2.onmessage = function (e) {
	complete.t2 = e.data
	mt.closeThread("Second Loop");
};


// background thread # 3
var t3 = mt.spawnThread({ code: loop3, name: "I Like Trains" });
t3.postMessage(complete);
t3.onmessage = function (e) {
	complete.t3 = e.data
	mt.closeThread("I Like Trains");
};


// background thread # 4
var t4 = mt.spawnThread({ code: loop4, name: "PIZZZZAAAAAAA!!!!!!!!" });
t4.postMessage(complete);
t4.onmessage = function (e) {
	complete.t4 = e.data
	mt.closeThread("PIZZZZAAAAAAA!!!!!!!!");
};


// this is just some code that runs on the main thread
// console.log(mt.getActiveThreads());


// now just to wait for the threads to finish...
var threadSafety = setInterval(function(){
	if (complete.t1 && complete.t2 && complete.t3 && complete.t4) {
		clearInterval(threadSafety);
		console.log("COMPLETE.");
		console.log(mt.getActiveThreads());
		console.timeEnd("threads");
	} else {
		console.log("Loading...");
	}
}, 0);