
let extensionId = 'bamjbfhfacpdkenilcibkmpdahkgfejh';  // -- real ID

if (window.location.href.includes("extension")) {
    extensionId = 'mpclodkiedkokmddfcooapahedfealjj'; // local
}

/*global chrome*/


let restartIdleTimer = null;

function setRestartIdleTimer(fn) {
    restartIdleTimer = fn
}

let findRecords = null;


function sendAdvise(message) {
    console.log('sendAdvise');
    console.log(message);
    if (message.id === 'find') { // legacy
        message.id = 'advise request';
    }
    if (message.id === 'not a payment page') { // legacy
        message.id = 'advise request';
    }
    if ((message.id === 'advise request') || (message.id === 'payment page')) {
        if (restartIdleTimer) {
            restartIdleTimer();
        }
    }
    chrome.runtime.sendMessage(extensionId, findRecords(message))
        .then(response => {
            if (!response) {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                } else {
                    console.log('no response');
                }
            } else {
                console.log('sendAdvise got response');
                console.log(response);
            }
        })
};

function sendCTS() {
    if ((typeof chrome != 'undefined') && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage(extensionId, { id: "clear to send" })
            .then(response => {
                console.log('cts response');
                console.log(response);
                sendAdvise(response)
            })
            .catch(err => {
                console.log('sendCTS catch');
                console.log(err);
            })
    }
}

function sendCredentials(s) {

    let url = s.url;
    if (url.search('://') == -1) {
        url = `https://${url}`;
    }
    s.url = url;

    if ((typeof chrome != 'undefined') && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage(extensionId, s)
            .then(response => {
                if (!response) {
                    if (chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError);
                    } else {
                        console.log('no response');
                    }

                    window.open(url, "_blank");
                } else {
                    console.log(response);
                }
            })
            .catch(err => {
                console.log(err)
                window.open(url, "_blank");
            });
    } else {
        window.open(url, "_blank");
    }
};

function openInExtension(item, url) {
    if (url.length > 0) {
        sendCredentials({
            id: 'loginRequest',
            username: item.cleartext[1],
            password: item.cleartext[2],
            url,
        });
    }
}

function listenToExtensionWakeup() {
    window.addEventListener("message", (event) => {
        if (("data" in event) && (typeof event.data.source === 'string') && (event.data.source.startsWith("react-devtools-"))) {
            console.log(`--got ${event.data.source}--`);
            return;
        }

        console.log('got message');
        console.log(event);

        if (event.origin !== window.location.origin) {
            if (wrongOrigin < 5) {
                // report warning to the server, however harmless in our case
                serverLog(`extension message orign ${event.origin}`)
                wrongOrigin++;
            }
            console.log(`extension message origin ${event.origin}`);
            return;
        }
        console.log('window');
        console.log(window);
        if (event.source === window) {
            console.log("proper source");
            sendCTS();
        } else {
            console.log("wrong source");
        }
    })
}

//------ legacy permanent connection code

let extensionPort = null;

let keepAliveTimer = null;

function logtime() {
    const today = new Date();
    return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + " ";
}

function keepAlive() {
    if (extensionPort && keepAliveTimer) {
        try {
            extensionPort.postMessage({ id: "keepAlive" });
            console.log(logtime() + ' keepAlive Sent');
            return;
        }
        catch (err) {
            console.log(logtime() + ' catch 51');

            if (keepAliveTimer) {
                clearInterval(keepAliveTimer);
                keepAliveTimer = null;
            }
        }
    }
    if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = null;
    }
}

function legacyConnect() {
    if (typeof chrome == 'undefined') {
        return;
    }

    try {
        if (extensionPort) {
            extensionPort.disconnect();
            extensionPort = null
        }

        extensionPort = chrome.runtime.connect(extensionId);
        console.log(logtime() + ' connected');


        keepAliveTimer = setInterval(keepAlive, 25000);

        //manifest V3: 

        //         setTimeout(connect, 4*60*1000, findCb);

        extensionPort.onDisconnect.addListener((p) => {
            // FF way:
            /*if (p.error) {
                console.log(`Disconnected due to an error: ${p.error.message}`);
            }*/
            extensionPort = null;

            console.log(logtime() + ' disConnected');
            // Chrome 
            if (chrome.runtime.lastError) {  // does not exist
                console.log('Connection rintime.error');
                console.log(chrome.runtime.lastError);
            } else {
                setTimeout(legacyConnect, 100, findCb);
            }

        });
        extensionPort.onMessage.addListener(function (message, sender) {
            console.log('received');
            console.log(message);
            sendAdvise(message)
                .catch(err => {
                    console.log('extensionport listener catch');
                    console.log(err);
                })

        });
    } catch (err) {
        console.log(err)
    }
};

//------ end legacy permanent connection code


function connect(findCb) {  // legacy interface, use cb only 
    findRecords = findCb;
}

if ((typeof chrome != 'undefined') && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage(extensionId, { id: "remember me" })
        .then(response => {
            if (!response) {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                } else {
                    console.log('no response');
                }
            } else {
                // extension found
                console.log(response);
                if (response.id == "Ok") {
                    listenToExtensionWakeup();
                } else { // try legacy permanent connection
                    legacyConnect();

                }
            }
        })
        .catch(err => {
            console.log('catch extensionInterface 252');
            console.log(err);
        })
}

export { connect, /*sendCredentials, sendAdvise,*/ openInExtension, setRestartIdleTimer }
