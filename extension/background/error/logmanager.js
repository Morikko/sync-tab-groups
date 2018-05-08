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

/**
 * Tell something about the extension
 */
LogManager.information = function(message, data=null, {
    print=Utils.DEBUG_MODE,
    logs=LogManager.logs,
}={}) {
    const informationLog = {
        type: 'Information',
        time: Date(),
        message,
        data,
    };

    LogManager.addLog(informationLog, {logs});
    if (print) {
        console.log(informationLog)
    }
    return informationLog;
}

/**
 * Something not normal happened but it is not critical
 */
LogManager.warning = function(message, data=null, {
    print=Utils.DEBUG_MODE,
    logs=LogManager.logs,
}={}) {
    const warningLog = {
        type: 'Warning',
        time: Date(),
        message,
        trace: LogManager.getStack(Error().stack),
        data,
    };

    LogManager.addLog(warningLog, {logs});
    if (print) {
        console.warn(warningLog)
    }
    return warningLog;
}

/**
 * Something that shouldn't happened
 * @param {Error/String} error
 * @param {Object} data added to the log 
 */
LogManager.error = function(error, data = null, {
    print=Utils.DEBUG_MODE,
    logs=LogManager.logs,
    showNotification=true,
}={}) {
    let fullError = error;
    if(!(fullError instanceof Error)) {
        fullError = Error(error)
    }

    const fullTrace = LogManager.getStack(Error().stack);
    fullTrace.shift();

    const errorLog = {
        type: 'Error',
        time: Date(),
        message: fullError.message,
        fileName: fullError.fileName.replace(extensionPrefix, '/'),
        lineNumber: fullError.lineNumber,
        columnNumber: fullError.lineNumber,
        trace: LogManager.getStack(fullError.stack),
        fullTrace,
        data: Utils.getCopy(data),
    }

    LogManager.addLog(errorLog, {logs});
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
    return stack.split('@')
        .map(line => line.replace(extensionPrefix, '/'))
        .map(line => line.replace('\n', ' => '))
}

// Add the log to the array
// Limit the log number to LogManager.LOG_NUMBER_LIMIT
LogManager.addLog = function(log, {
    logs=LogManager.logs,
}={}){
    if ( LogManager.LOCATION === LogManager.BACK ) {
        logs.push(log);
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
                version: ["SyncTabGroups", 1],
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