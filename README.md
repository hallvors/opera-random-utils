opera-random-utils
==================

Random bits and pieces

This is just a dump of some selected scripts and utils written while working for Opera, that some might find useful. Many of them are half-finished or require customization to whatever task one is working on. Many are also really puny ad-hoc things. Most will only work with versions <= 12 (or "until User JS is properly implemented again"??)


evalMessageData.js : simplifies Facebook apps/games debugging across frames of different origin - just do postMessage('eval:alert(foo)')

urlplayer-DOMDumper.js : logs simplified serialized DOM to some backend, intended to track changes to web sites without being (overly) confused by content changing, for example comparing two user-agent results

log*.js : should be pretty self-evident what these do

test-coverage-detailed.js : this reads (and stores in opera.scriptStorage) the data-tested-assertations annotations from the XHR test suite, and annotates the spec with coverage and test result information

captureassistant.js : makes the browser more predictable if you want to capture snapshots of sites that use Math.random() and such in URLs

urlplayer-basic.js : maybe the simplest URL player possible? (Some logic is on the backend though)

DOM-stress.js: trying to mess up a DOM implementation in fuzzyish ways, but would be even more fuzzy if I was better at writing fuzzers

no-*-events.js : also obvious..

whereisGlobalVariabledefined.js : throws when page tries to define some global variable (customize with var name..)

XHR-responseText-breakpoint.js : breaks execution when xhr.responseText is read

sitesnapper : an attempt at taking site snapshots from user JS

testing/autologin.js : trying to improve URL player test runs by automatically logging in to sites (handled at least some 800 sites pretty well with the existing heuristics)

