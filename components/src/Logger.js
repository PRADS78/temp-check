class Logger {
  constructor() {
    this._LPageLoadStartTime = null;
    this._LTracker = null;
  }

  extend = (copyTo, copyFrom) => {
    for (var prop in copyFrom) {
      copyTo[prop] = copyFrom[prop];
    }
    return copyTo;
  };
  extendIf = (copyTo, copyFrom) => {
    for (var prop in copyFrom) {
      if (copyTo[prop] !== undefined) {
        continue;
      }
      copyTo[prop] = copyFrom[prop];
    }
    return copyTo;
  };

  initializeLogger = (module, defaultInfo) => {
    defaultInfo = defaultInfo || {};
    // if (!module) {
    //     throw 'Module is required for logging';
    // }
    /* var navigator = {
              'userAgent': window.navigator.userAgent,
              'appCodeName': window.navigator.appCodeName,
              'appName': window.navigator.appName,
              'appVersion': window.navigator.appVersion,
              'cookieEnabled': window.navigator.cookieEnabled,
              'getUserMedia': !!window.navigator.getUserMedia,
              'platform': window.navigator.platform,
              'vendor': window.navigator.vendor
          };*/
    //set some default settings
    this.defaultInfo = {
      host: window.location.hostname,
    };
    this.extend(this.defaultInfo, defaultInfo);
    try {
      this._LTracker = window._LTracker;
    } catch (e1) {
      if (e1.name == "ReferenceError") {
        try {
          this._LTracker = window.parent._LTracker;
        } catch (e2) {
          if (e2.name == "ReferenceError") {
            try {
              this._LTracker = window.top._LTracker;
            } catch (e3) {
              console.error("failed to get referrence of loggly..", [
                e1,
                e2,
                e3,
              ]);
            }
          }
        }
      }
    }
    this._LTracker = this._LTracker || [];
    this._LTracker.push({
      logglyKey: "f5fa4456-744d-487f-a919-b6f8d3f7332a",
      tag: "disprz_analytics_report",
    });
  };

  //prototype methods
  _log = function (jsonLog) {
    try {
      jsonLog = jsonLog || {};
      this.extendIf(jsonLog, this.defaultInfo);
      var now = new Date();
      jsonLog["timestampUTC"] = now.toUTCString();
      jsonLog["timestampLocal"] = now.toString();
      this._LTracker.push(jsonLog);
      //UnioLogger.logMessage(jsonLog);
    } catch (e) {
      console.error("error posting logs", [jsonLog, e]);
    }
  };

  //public methods
  logInfo = function (jsonLog) {
    jsonLog = jsonLog || {};
    jsonLog["level"] = "INFO";
    this._log(jsonLog);
  };
  logWarning = function (jsonLog) {
    jsonLog = jsonLog || {};
    jsonLog["level"] = "WARNING";
    this._log(jsonLog);
  };
  logError = function (jsonLog) {
    jsonLog = jsonLog || {};
    jsonLog["level"] = "ERROR";
    this._log(jsonLog);
  };
  updateDefaultInfo = function (defaultInfo) {
    defaultInfo = defaultInfo || {};
    this.extend(this.defaultInfo, defaultInfo);
  };
  logLoadComplete = function (jsonLog) {
    try {
      jsonLog = jsonLog || {};
      var perf = window.performance;
      var endTime = new Date().getTime();
      var startTime = 0;

      try {
        startTime = window._LPageLoadStartTime;
      } catch (e) {
        console.warn("Reference of page load start time variable is undefined");
      }

      if (!!perf && !!perf.timing && !!perf.timing.navigationStart) {
        startTime = perf.timing.navigationStart;
        endTime = Math.max(perf.timing.loadEventStart, endTime);
      }
      var pageLoadTime = endTime - startTime;
      this.extend(jsonLog, {
        event: "loadComplete",
        timetaken: pageLoadTime,
      });
      this.logInfo(jsonLog);
    } catch (e) {
      console.error("error logging load complete", e);
    }
  };
}
export default new Logger();
