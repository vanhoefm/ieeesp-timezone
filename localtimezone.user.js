// ==UserScript==
// @name         IEEE S&P Local Timezone
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Update IEEE S&P times to your local timezone
// @author       Mathy Vanhoef
// @match        https://www.ieee-security.org/TC/SP2020/program-compact.html
// @match        https://www.ieee-security.org/TC/SP2020/program.html
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://momentjs.com/downloads/moment.min.js
// @require      https://momentjs.com/downloads/moment-timezone-with-data-10-year-range.min.js
// @grant        none
// ==/UserScript==

// You can override desired timezone by picking it from https://nodatime.org/TimeZones
const pagesTimezone     = "America/Los_Angeles";
const desiredTimezone   = moment.tz.guess();

waitForKeyElements (
    ".text-right", updateTime
);

function convertTime(timeStr) {
    var origTime = moment.tz(timeStr, "hh:mma", pagesTimezone);
    var localTime = origTime.tz(desiredTimezone).format("h:mmA");
    return localTime;
}

function updateTime(jNode) {
    // See https://stackoverflow.com/questions/48875313/userscript-to-convert-the-timezone-of-times-shown-on-a-web-page
    var times = jNode.text().trim().split(" - ");
    console.log(times);

    var start = convertTime(times[0]);
    var end = convertTime(times[1]);
    jNode.text(start + " - " + end);
}
