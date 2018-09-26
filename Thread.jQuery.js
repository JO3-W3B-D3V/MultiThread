/**
 * @author    Joseph Evans <joeevs196@gmail.com>
 * @version   1.0.0
 * @since     02/09/2018
 * @desc      The purpose of this file is to implement a multi threading
 *            wrapper for jQuery. The reason as to why it's wrapped in a
 *            self invoked function is to proevent any naming issues, in
 *            addition to the fact that jQuery may or may not have been
 *            declared already, in which case, this code will throw an error.
 * @copyright Joseph Evans (c) 2018
 * @todo      Test how well the code below works with jQuery.
 */
!function () {
  $ = jQuery || $ || {};

  if ($ == null) {
    throw new Error("jQuery is not defined.");
  } else if ($.fn == null) {
    throw new Error("The prototype property isn't available.");
  }

 $.fn = $.fn || {};


  $.fn.Thread = function () {
    /**
     * @private
     * @desc   These variables which are simply initialised below
     *         are simply the private properties that we want a thread
     *         object to have access to.
     */
    var name, execute, update, oncomplete, data, thread;

    /**
     * @public
     * @desc   This object is essentially a wrapper for all of the
     *         public methods.
     */
    var publicObject = {

      /**
       * @function name
       * @param    {String} n
       * @return   {String||Object}
       * @desc     This will simply return the name assigned to the
       *           current thread. Or if a string is provided to this
       *           method then it will assign the name and then return
       *           the thread object.
       */
      name: function (n) {
        if (n == null) {
          return name;
        } else {
          name = n;
          return publicObject;
        }
      },

      /**
       * @function execute
       * @param    {Function} code
       * @return   {Function||Object}
       * @desc     The purpose of this code is to return the code that
       *           has been allocated to the current thread object. Or to set
       *           the code that will be executed by this thread object, in
       *           which case, it will return an object.
       */
      execute : function (code) {
        if (code == null) {
          return execute;
        } else {
          var exec = code.toString();
          exec = exec.substr(0, exec.lastIndexOf("}"));
          exec += 'self.postMessage(arguments[0].data); \n};';
          execute = exec;
          return publicObject;
        }
      },

      /**
       * @function onComplete
       * @param    {Function} complete
       * @return   {Function||Object}
       * @desc     The purpose of this method is to return the code that
       *           should be fired when the thread has finished it's main bulk
       *           of the code. Or to set the code that will be fired within
       *           this thread.
       */
      onComplete : function (complete) {
        if (complete == null) {
          return oncomplete;
        } else {
          oncomplete = complete;
          return publicObject;
        }
      },

      /**
       * @function data
       * @param    {*} d
       * @return   {*}
       * @desc     The purpose of this method is to simply return any data that
       *           handed into this thread object. Or this method can be used to
       *           set the data that has been assigned to this thread object,
       *           in which case it will return an object.
       */
      data : function (d) {
        if (d == null) {
          return data;
        } else {
          data = d;
          return publicObject;
        }
      },

      /**
       * @function getThread
       * @return   {Worker}
       * @desc     The purpose of this method is to simply return the worker that
       *           is wrapped up inside this thread object.
       */
      getThread : function () {
        return thread;
      },

      /**
       * @function start
       * @return   {Object}
       * @desc     The prupose of this method is to initiate executing the code
       *           that has been assigned to the current thread object.
       */
      start : function () {
        var stringToExecute = 'self.onmessage = ' + execute.toString();
        var blob = new Blob([stringToExecute], {type:"text/javascript"});
        var URIObject = window.URL.createObjectURL(blob);

        thread = new Worker(URIObject);
        if (typeof oncomplete == 'function') { thread.onmessage = oncomplete; }
        thread.postMessage(data);
        return publicObject;
      },

      /**
       * @function kill
       * @return   {Object}
       * @desc     The purpose of this method is to help clear up some memory,
       *           this will terminate the thread, best idea to run this code
       *           once the thread has finished, just to be sure.
       */
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

    /**
     * @ignore
     * @desc  Here the wrapper containing all of the above methods is returned.
     */
    return publicObject;
  };
}();
