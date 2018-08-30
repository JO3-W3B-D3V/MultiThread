/**
 * @author    Joseph Evans <joeevs196@gmail.com>
 * @version   1.0.0
 * @since     21/08/2018
 * @desc      The purpose of this code is to encapsulate any form of complexity
 *            that one may encounter when working with web workers to allow us to
 *            quite literally implement multi threading features. It is a fact that
 *            a web worker will run in a 'background thread', as opposed to taking
 *            up any form of time from the main execution thread that's running.
 *            You may notice that this code is a little messy well that's simply
 *            because of the fact that it's very much a quick draft at the moment.
 *
 *            One large purpose behind this code is to implement an alternative
 *            solution to writing your JavaScript code so that you can make use
 *            of multi threading. Personally I prefer this approach because you
 *            you're not required to use HTML script tags.
 * @todo      Consider adding support for Node.
 * @todo      Test.
 * @todo      Document in more detail.
 * @todo      Possibly add more features.
 * @todo      Possibly include more raw functionality.
 * @todo      General tidy up.
 * @copyright 2018
 */

function Thread () {
  var name, execute, update, oncomplete, data, thread;
  var publicObject = {
    getName: function () {
      return name;
    },

    getCode : function () {
      return execute;
    },

    getOnComplete : function () {
      return oncomplete;
    },

    getData : function () {
      return data;
    },

    getThread : function () {
      return thread;
    },

    setName : function (n) {
      name = n;
      return publicObject;
    },

    setCode : function (code) {
      var exec = code.toString();
      exec = exec.substr(0, exec.lastIndexOf("}"));
      exec += 'self.postMessage(arguments[0].data); \n};';
      execute = exec;
      return publicObject;
    },

    setOnComplete : function (complete) {
      oncomplete = complete;
      return publicObject;
    }, 
    
    onComplete : function (complete) {
      return publicObject.setOnComplete(complete);
    },

    setData : function (d) {
      data = d;
      return publicObject;
    },

    start : function () {
      var stringToExecute = 'self.onmessage = ' + execute.toString();
      var blob = new Blob([stringToExecute], {type:"text/javascript"});
      var URIObject = window.URL.createObjectURL(blob);

      thread = new Worker(URIObject);
      if (typeof oncomplete == 'function') { thread.onmessage = oncomplete; }
      thread.postMessage(data);
      return publicObject;
    },

    kill : function () {
      try {
        thread.terminate;
        thread = null;
      } catch (Exception) {
        /* no need to worry about it */
      }
      return publicObject;
    }
  };
  return publicObject;
}
