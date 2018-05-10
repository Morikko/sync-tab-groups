var LogManager = LogManager || {};
var Utils = Utils || {};

LogManager.LOG_NUMBER_LIMIT = 10000;
LogManager.NOTIFICATION_ID = "LOG_ERROR";
LogManager.BACK = "LOG_BACK";
LogManager.BACK = "LOG_FRONT";
LogManager.LOCATION = LogManager.BACK;

LogManager.EXTENSION_INSTALLED = "EXTENSION_INSTALLED"
LogManager.EXTENSION_UPDATED = "EXTENSION_UPDATED"
LogManager.EXTENSION_START = "EXTENSION_START"
LogManager.EXTENSION_INITIALIZED = "EXTENSION_INITIALIZED"
LogManager.EXTENSION_UPDATED = "EXTENSION_UPDATED"

LogManager.SWITCH_GROUP_WITH_LOST = "SWITCH_GROUP_WITH_LOST"

LogManager.logs = [];

const extensionPrefix = browser.extension.getURL('/');

LogManager.isEnable = function(){
    try {
        return OptionManager.options.log.enable;
    } catch(e) {
        return false;
    }
}

/**
 * Tell something about the extension
 */
LogManager.information = function(message, data=null, {
    print=Utils.DEBUG_MODE,
    logs=LogManager.logs,
    enable=LogManager.isEnable(),
}={}) {
    if(!enable) return;

    const informationLog = {
        type: 'Information',
        time: Date(),
        message,
        data: Utils.getCopy(data),
    };

    if (logs) LogManager.addLog(informationLog, {logs, print});
    if (print) {
        console.log(informationLog)
    }
    return informationLog;
}

/**
 * Something not normal happened but it is not critical
 * if logs is null, do not save it
 */
LogManager.warning = function(message, data=null, {
    print=Utils.DEBUG_MODE,
    logs=LogManager.logs,
    enable=LogManager.isEnable(),
}={}) {
    if(!enable) return;

    const warningLog = {
        type: 'Warning',
        time: Date(),
        message,
        trace: LogManager.getStack(Error().stack),
        data: Utils.getCopy(data),
    };

    if (logs) LogManager.addLog(warningLog, {logs, print});
    if (print) {
        console.warn(warningLog)
    }
    return warningLog;
}

/**
 * Something that shouldn't happened
 * From async trace enable in Firefox: javascript.options.asyncstack
 * @param {Error/String} error
 * @param {Object} data added to the log 
 */
LogManager.error = function(error, data = null, {
    print=Utils.DEBUG_MODE,
    logs=LogManager.logs,
    showNotification=true,
    enable=LogManager.isEnable(),
}={}) {
    if(!enable) return;

    let fullError = error;
    if(!(fullError instanceof Error)) {
        fullError = Error(error)
    }

    const errorLog = {
        type: 'Error',
        time: Date(),
        message: fullError.message,
        trace: LogManager.getStack(fullError.stack),
        data: Utils.getCopy(data),
    }

    if(!Utils.isChrome()) {
        Object.assign(errorLog, {
            fileName: fullError.fileName.replace(extensionPrefix, '/'),
            lineNumber: fullError.lineNumber,
            columnNumber: fullError.lineNumber,
        });
    }

    if (logs) LogManager.addLog(errorLog, {logs, print});
    if (print) {
        console.error(errorLog)
    }
    if (showNotification) {
        LogManager.showErrorNotification();
    }

    return errorLog;
};

// Parse the stack trace to be better readable
LogManager.getStack = function(stack) {
    if(!Utils.isChrome()) {
        return stack.split('@')
            .map(line => line.replace(extensionPrefix, '/'))
            .map(line => line.replace('\n', ' => '))
    } else {
        return stack.split('at ')
            .map(line => line.replace(extensionPrefix, '/'))
            .map(line => line.replace('\n', ''))
    }
}

// Add the log to the array
// Limit the log number to LogManager.LOG_NUMBER_LIMIT
LogManager.addLog = function(log, {
    logs=LogManager.logs,
    print=Utils.DEBUG_MODE,
}={}){
    if ( LogManager.LOCATION === LogManager.BACK ) {
        // Avoid duplication
        if(logs.length>0 && logs[logs.length-1].message === log.message) return;
        logs.push(log);
        if(print) console.log(`Next Message Index: ${logs.length-1}`);
        if (logs.length > LogManager.LOG_NUMBER_LIMIT) {
            logs.shift();
        }
    } else { // From remote window
        LogManager.sendLog(log);
    }
}

LogManager.sendLog = function(log) {
    Utils.sendMessage("LogManager:Add", {
        log,
    });
}


// Catch error not caught
LogManager.addWindowOnErrorListener = function() {
    window.onerror = function(...args) {
        const [message, file, line, col, error] = args;
        LogManager.error(error, "Caught by window.onerror")
    }
}

LogManager.downloadLog = async function downloadLog(logs=LogManager.logs) {
    try {
        let d = new Date();
        let url = URL.createObjectURL(new Blob([
            JSON.stringify({
                version: ["SyncTabGroups", browser.runtime.getManifest().version],
                logs,
                options: OptionManager.options,
            }, null, 2)
            ], {
            type: 'application/json'
        }));
        let filename = "SyncTabGroups" + "-" + "Log" + "-" + d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + "-" + ("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2) + ".json";

        let id = await browser.downloads.download({
            url: url,
            filename: filename,
            saveAs: true
        });

        await Utils.waitDownload(id);

        URL.revokeObjectURL(url);
        return true;

    } catch (e) {
        LogManager.error(e);
        return false;
    }
}

LogManager.showErrorNotification = function () {
    browser.notifications.create(LogManager.NOTIFICATION_ID, {
        type: 'basic',
        iconUrl: browser.extension.getURL("/share/icons/tabspace-active-64.png"),
        title: "Error caught in Sync Tab Groups",
        message: "An unexpected behavior happened in Sync Tab Groups. In order to improve the extension, could you send me the error back. Click on this notification to open the explanation on how to do it.",
    });
}

// Add event listener on click notification when error
// Add event listener on log received through extension service
LogManager.init = function() {
    const logManagerNotificationEvent = (notificationId)=>{
        if ( notificationId === LogManager.NOTIFICATION_ID ) {
            Background.onOpenSettings(true);
            Utils.openUrlOncePerWindow(
                "https://github.com/Morikko/sync-tab-groups/wiki/How-to-help-me-solve-bugs"
            );
        }
    }

    const logManagerMessenger = function(message) {
        switch (message.task) {
          case "LogManager:Add":
            LogManager.addLog(message.params.log);
            break;
        case "LogManager:Download":
            LogManager.downloadLog(LogManager.logs);
            break;
        }
    }

    LogManager.addWindowOnErrorListener();

    browser.notifications.onClicked.addListener(logManagerNotificationEvent);
    browser.runtime.onMessage.addListener(logManagerMessenger);
}