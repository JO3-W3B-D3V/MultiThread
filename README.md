# MultiThread
The purpose of this project is simple, include a lightweight wrapper on top of web workers to allow for multi threading. Even if you decide not to use the wrapper that I've personally provided, you can always use it just to see how _you_ can implement multi threading techniques into your JavaScript. 

## Why use it? 
It may sound silly, but it just helps you cut corners, more so if you're not looking to include a silly number of external JavaScript files. With this implantation it will allow you to execute scripts which can be found within the HTML file inside of some script tag, you can refer to the demo if you'd like to see how that works.

## How to use it? - Thread.js
This implementation works in a very similar way, it's pretty much just an alternative approach, this way does not rely on any mark up language like MultiThread.js does, also each thread is managed by itself, you can ```terminate``` each thread as you like rather than like the demo with the alternative version.

So let's start, all you really need to do is the following: 
```javascript
// create some dummy data object
var data = {name : "Joe"};

// create a thread
var t = new Thread()

  // give it a name if you like, it makes no difference to how it operates
  .setName("test")

  // set the data that it will handle
  .setData(data)

  // what exactly should this thread do?
  .setCode(function (e) {
    e.data.lastName = "Evans";
  })

  // what would you like to do once the thread has finished?
  .setOnComplete(function(e) {
    data = e.data;
    console.log(data);
    console.log(t.getThread());
    t.kill();
    console.log(t.getThread());
    console.log("COMPLETE!");
  })

  // start the thread
  .start();
```


## How to use it? - MultiThread.js
So, as I stated, you can store some of your JavaScript into a script tag, like so: 
```html
<!-- thread  #1 -->
<script id="loop1" type="javascript/worker">
  self.onmessage = function(e) {
    for (var i = 0; i < 100; i ++) { console.log(i); }
    e.data.t1 = true;
    self.postMessage(e.data.t1);
  };
</script>
```

You'll then want to get the contents of that script tag and pass it into the wrapper object, like so: 
```javascript
var complete = { t1: false };
var mt = new MultiThread();
var loop1 = document.querySelector("#loop1").textContent;


// create and run the thread 
var t1 = mt.spawnThread({ code: loop1, name: "First Loop" });
t1.postMessage(complete);
t1.onmessage = function (e) { complete.t1 = e.data; };
console.log(mt.getActiveThreads());


// now to wait for the thread to finish
var threadSafety = setInterval(function() {
  if (complete.t1) {
    console.log("COMPLETE.");
    clearInterval(threadSafety);
    mt.closeThread("First Loop");
  } else {
    console.log("Loading...");
  }
});
```
