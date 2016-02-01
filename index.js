'use strict';

var getUJamWorkshops = require('./lib/workshops').getUJamWorkshops;

// This will return a Promise, not JSON.
module.exports = getUJamWorkshops();
