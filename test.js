'use strict';

var workshopsP = require('./index');

workshopsP.then(function (workshops) {
  console.log(workshops);

  /*
  workshops.forEach(function (workshop) {
    console.log('%s [%s] -- %s\n%s\n', workshop.when, workshop.where, workshop.who.name, workshop.url);
  });
  */
}).catch(function (err) {
  console.error(err);
});
