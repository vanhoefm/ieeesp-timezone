// ==UserScript==
// @name         IEEE S&P Local Timezone
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Update IEEE S&P times to your local timezone
// @author       Mathy Vanhoef
// @match        https://www.ieee-security.org/TC/SP2020/program-compact.html
// @match        https://www.ieee-security.org/TC/SP2020/program.html
// @match        http://spw20.langsec.org/workshop-program.html
// @match        https://gateway.on24.com/wcc/*
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://momentjs.com/downloads/moment.min.js
// @require      https://momentjs.com/downloads/moment-timezone-with-data-10-year-range.min.js
// @grant        none
// ==/UserScript==


// You can override desired timezone by picking it from https://nodatime.org/TimeZones
const pagesTimezone     = "America/Los_Angeles";
const desiredTimezone   = moment.tz.guess();

waitForKeyElements (
    "h2.link", updateTimeOn24
);
waitForKeyElements (
    ".time label", updateTimeOn24Event
);
waitForKeyElements (
    "b", updateTimeOn24Event
);
waitForKeyElements (
    ".text-right", updateTime
);

function convertTime(timeStr) {
    var ts1 = "";
    var ts2 = timeStr;
    if (timeStr.includes("2020")) {
        var ts = timeStr.split("2020", 2);
        ts1 = ts[0];
        ts2 = ts[1];
    }

    var origTime = moment.tz(ts2, "hh:mma", pagesTimezone);
    var localTime = origTime.tz(desiredTimezone).format("h:mmA");
    return ts1 + localTime;
}

function updateTime(jNode) {
    // See https://stackoverflow.com/questions/48875313/userscript-to-convert-the-timezone-of-times-shown-on-a-web-page
    var times = jNode.text().trim().split(" - ");
    console.log(times);

    var start = convertTime(times[0]);
    var end = convertTime(times[1]);
    jNode.text(start + " - " + end);
}

function convertTimeOn24(timeStr) {
    if(timeStr.length < 5) {
        timeStr = timeStr.replace("am", "00am").replace("pm", "00pm");
    }
    var origTime = moment.tz(timeStr, "hmma", pagesTimezone);
    var localTime = origTime.tz(desiredTimezone).format("h:mmA");
    return localTime;
}

function updateTimeOn24(jNode) {
    // See https://stackoverflow.com/questions/48875313/userscript-to-convert-the-timezone-of-times-shown-on-a-web-page
    var times = jNode.text().trim().split(" - ");
    if(times.length > 1 && times[0].indexOf("(") != -1) {
        console.log(times);

        var start = convertTimeOn24(times[0].split("(")[1]);
        var end = convertTimeOn24(times[1].split(" ")[0]);
        jNode.text(times[0].split("(")[0] + "(" + start + " - " + end + ")");
    }
}

function updateTimeOn24Event(jNode) {
    var t1 = jNode.text();
    if (t1.includes("PDT")) {
        console.log(t1);
        var t2 = convertTime(t1);
        jNode.text(t2);
    } else if (t1.includes("-")) {
        var times = t1.trim().split("-");
        if (times.length == 2 && times[0].indexOf(" ") == -1) {
            console.log(times);
            if (times[0].indexOf("m") == -1) {
                times[0] = times[0] + (times[1].slice(-2));
            }
            var start = convertTimeOn24(times[0].replace(":", ""));
            var end = convertTimeOn24(times[1].replace(":", ""));
            jNode.text(start + "-" + end);
        }
    }
}
