var cheerio = require('cheerio');
var fetch = require('node-fetch');
var P = require('bluebird');

var WORKSHOP_URL = 'http://www.ujamsource.com/workshops/index-mobile.php';

exports.WORKSHOP_URL = WORKSHOP_URL;
exports.getUJamWorkshops = getUJamWorkshops;


/**
 * Grabs the UJam workshop schedule, and returns JSON array containing date, location, instructor name/email, and URL for each workshop.
 * @param  {String} [url] URL of the workshop listing page to scrape.
 * @return {Array} An array of workshop objects.
 */
function getUJamWorkshops(url) {
  return scrapeUrl({
    url: url || WORKSHOP_URL
  }).then(function (data) {
    var $ = data.$html;
    var workshops = $('div.class_item').map(function () {
      var url = $(this).find('.btnselect').attr('href');
      var details = $(this).text().trim().split('•');
      var workshopDate = details[0];
      var workshopLocation = details[1].replace(/Registration Fee.*$/i, '');

      return scrapeUrl({
        url: url,
        when: workshopDate.trim(),
        where: workshopLocation.trim()
      });
    }).get();

    return P.all(workshops).then(getInstructorData);
  });
}


function getInstructorData(workshops) {
  return workshops.map(function (workshop) {
    var $workshop = workshop.$html;
    var instructor = $workshop('#cc-block7').text().replace(/U-JAM Trainer/i, '').trim();
    var instructorMeta = instructor.match(/^(.*)\s+(.*?)$/);
    var instructorName = instructorMeta[1].replace(/-$/, '');
    var instructorEmail = instructorMeta[2];

    workshop.who = {
      name: instructorName.trim(),
      email: instructorEmail.trim()
    };

    delete  workshop.$html;

    return workshop;
  });
}


/**
 * Scrapes a specified URL and returns a Promise containing any data passed to the
 * function, as well as an `$html` property containing the contents of the scraped
 * URL.
 * @param  {Object} data An object containing a `url` property, which specifies
 * the URL to parse.
 * @return {Object} The contents of the specified `data` parameter, as well as an
 * `$html` property containing the HTML contents of the specified URL.
 */
function scrapeUrl(workshop) {
  return fetch(workshop.url)
    .then(function(res) {
      return res.text();
    }).then(function(html) {
      workshop.$html = cheerio.load(html.trim(), {
        decodeEntities: true,
        normalizeWhitespace: true,
        xmlMode: false
      });
      return workshop;
    });
}
