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
 * @todo      Consider adding support for Node.
 * @todo      Test.
 * @todo      Document in more detail.
 * @todo      Possibly add more features.
 * @todo      Possibly include more raw functionality.
 * @todo      General tidy up.
 * @copyright 2018 
 */
function MultiThread () {

  // Implement a singleton design pattern for efficiency.
  if (MultiThread.instance != null) {
    return MultiThread.instance;
  }



  /**
   * @ignore
   * @private
   * @desc This object will be used to contain scope to any private properties.
   */
  var privateproperties = {
    workers : {},

    counter: 0,


    /**
     * @private
     * @property
     * @function createURIObject
     * @param    {String||Function} code
     * @return   {DOMString}
     * @desc     The purpose of this method is to simply take a stirng
     *           or a function and turn it into a DOMString which contains
     *           a url representing the bject given in the parameter so that the
     *           webworker can execute it with ease.
     */
    createURIObject : function (code) {
      // Use the to string method in the event that
      // a function object has been passed in.
      if (typeof code != "string" && typeof code != "function") {
        throw new Error("You must provide a data type that is one of " +
                        "the following: \n [String, Function]");
      }

      // Create a blob object and convert it to a URL obejct, then
      // return that vlaue.
      var blob = new Blob([code.toString()], {type:"text/javascript"});
      var URIObject = window.URL.createObjectURL(blob);
      return URIObject;
    }
  };



  /**
   * @ignore
   * @public
   * @desc This object will be used to contain scope to any public properties.
   */
  var publicproperties = {
    /**
     * @public
     * @property
     * @function spawnThread
     * @param    {Object} options
     * @return   {Worker}
     * @desc     This method will simply create a web worker, and
     *           store it somehow.
     */
    spawnThread : function (options) {
      var domString, worker, name;
      options = options || {};
      name = options.name || privateproperties.counter;

      // Provide useful feedback as to what went wrong.
      if (options.code != null && options.URL == null) {
        domString = privateproperties.createURIObject(options.code);
      } else if (options.URL != null && options.code == null) {
        domString = options.URL;
      } else {
        throw new Error("You must provide one or the other, either a URL or " +
                        "a function(either as an object or string).");
      }

      worker = new Worker(domString);
      if (options.name == "string") {
        privateproperties.workers[name] = worker;
      } else {
        privateproperties.workers[name] = worker;
        name ++;
      }
      return worker;
    },


    /**
     * @public
     * @property
     * @function getActiveThreads
     * @param    {Null}
     * @return   {Object}
     * @desc     This method will simply return what named threads are
     *           currently being used.
     */
    getActiveThreads : function () {
      return privateproperties.workers;
    },



    /**
     * @public
     * @property
     * @function getThread
     * @param    {String}
     * @return   {Worker}
     * @desc     This method will allow you to simply get a specific
     *           named thread.
     */
    getThread : function (name) {
      return privateproperties.workers[name];
    },



    /**
     * @public
     * @property
     * @function closeThread
     * @param    {String}  name
     * @return   {Null}
     * @desc     This method will simply remove one of the named threads from
     *           memory.
     */
    closeThread : function (name) {
      if (privateproperties.workers[name] != null) {
        try {
          var chosenworker = privateproperties.workers[name];
          chosenworker.terminate(); // This is just easier to read.
        } catch (Exception) { /* Don't worry about it... */ }
        delete privateproperties.workers[name];
      }
    }
  };


  // Return the singleton object.
  MultiThread.instance = publicproperties;
  return MultiThread.instance;
}
