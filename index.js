var getUJamWorkshops = require('./lib/workshops').getUJamWorkshops;

getUJamWorkshops().then(function (workshops) {
  workshops.forEach(function (workshop) {
    console.log('%s [%s] -- %s\n%s\n', workshop.when, workshop.where, workshop.who.name, workshop.url);
  });
}).catch(function (err) {
  console.error(err);
});
