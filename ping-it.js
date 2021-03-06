const ping = require('ping');
const config = require('./config/default.json')
const timeStamp = require('./time-stamp')
const sendNotification = require('./send-notification')

const pingInterval = config['ping-interval-in-milliseconds']
const pingTargets = config.targets['ping']
const emailNotificationIntervalInMilliseconds = (config['email-notification-interval-in-seconds'] * 1000)


var deadhostDictionary = {};
var addDeadhostToDictionary = function (myKey, myValue) {
    deadhostDictionary[myKey] = myValue;
};
var getDeadhostValueFromDictionary = function (myKey) {
    return deadhostDictionary[myKey];
};
var removeDeadhostFromDictionary = function (myKey) {
    delete deadhostDictionary[myKey]
}

function keepAlive(i) {
    setTimeout(() => {
        // console.log('Infinite Loop Test n:', i);
        pingTargets.forEach(function(host){
            
            ping.sys.probe(host, function(isAlive){
                const ts = timeStamp()
                const deadhost = getDeadhostValueFromDictionary(host)
                if (!isAlive) {
                    
                    if (deadhost == undefined) {
                        // Add the deadhost to the dictionary
                        addDeadhostToDictionary(host, { "status": "dead", "stamp": ts.timestampInMs, "timeOfDeath": {"formatted": `${ts.formattedDatetime}`} })
                        sendNotification(host)
                    } else if ((Date.now()) >= (deadhost.stamp + emailNotificationIntervalInMilliseconds)) {
                        deadhost.stamp = Date.now()
                        sendNotification(host)
                    }
                } else {
                    // check to see if this host has and entry in deadhostDictionary.  If yes, remove it.
                    if (deadhost != undefined) {
                        removeDeadhostFromDictionary(host)
                    }
                }
                var msg = isAlive ? `[ALIVE] -- ${host} @ ${ts.formattedDatetime} -- ${i}` : `[DEAD] -- ${host} @ ${ts.formattedDatetime} -- ${i}`;
                console.log(msg);
            });   
        });
        keepAlive(++i);
    }, pingInterval)
}

keepAlive(0);

