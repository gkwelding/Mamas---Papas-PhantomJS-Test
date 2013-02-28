/**
* test.js
* 
* Some basic testing of the Mamas & Papas wesbite, currently does:
* 1. Open the url passed, usually www.mamasandpapas.com
* 2. Check the main nav contains links
* 3. Opens each main nav links and ensures it loads
* 4. Opens each sub nav links and ensures it loads
* 5. If any sub nav link is a range page then check that page contains products
* 
* author: Garry Welding
* company: Mamas & Papas
*/

var casper = require('casper').create({
    logLevel: "debug"
});

// set up array for the main nav links
var mainNavLinks = [];

// set up array for links in the hover box under each main link
var subNavLinks = [];

// get url passed from command line
// eg: casperjs test.js --url="http://www.mamasandpapas.com"
var url = casper.cli.get('url');

var productCount = 0;

// set up regex to test to see if we are on a range page
// if we are then parse the text present on the page and
// check that the number of products returned is > 0
var re = /^\/range\/(.*)/i;

// hook any url requests made and check the status of them
// assert false on 404 and 500. assert true on 200, 302 and 301.
casper.on('http.status.404', function(resource) {
    this.test/fail('404 error: ' + resource.url);
});

casper.on('http.status.500', function(resource) {
    this.test.fail('500 error: ' + resource.url);
});

casper.on('http.status.200', function(resource) {
    this.test.pass(resource.url);
});

casper.on('http.status.301', function(resource) {
    this.test.pass(resource.url);
});

casper.on('http.status.302', function(resource) {
    this.test.pass(resource.url);
});

// load main page - also checks for http status as per hook above
casper.start(url);

// from the main page above count the number of main nav items
// assert true if > 0
casper.then(function(){
    var mainNavCount = this.evaluate(function(){
        return jQuery('div#mainNav').find('li:visible').length
    });
    this.test.assertTruthy(mainNavCount>0,'We have '+mainNavCount+' links in the main navigation.');
});

// lets scrape the main nav links and the sub nav links
// and hold them in the arrays defined previously for now
casper.then(function(){
    // get main nav links
    mainNavLinks = this.evaluate(function(){
        var links = [];
        jQuery('div#mainNav').find('li:visible').each(function(){
            links.push(jQuery(this).find('a:first').attr('href'));
        });
        return links;
    });

    // get sub nav links
    subNavLinks = this.evaluate(function(){
        var links = [];
        var $mainNav = jQuery('div#mainNav');
        jQuery('div.dropdownContainer', $mainNav).find('a').each(function(){
            links.push(jQuery(this).attr('href'));
        });
        return links;
    });
});

// open each main nav link - as per the http status hooks defined above
// this will do a test based on the http status code returned
casper.then(function(){
    this.each(mainNavLinks, function(casper, link, i){
        this.thenOpen(url+link);
    });
});

// open each sub nav link - as per the http status hooks defined above
// this will do a test based on the http status code returned
// also if the regex from above matches, and hence this is a range page,
// then check we are actually displaying products on it
casper.then(function(){
    this.each(subNavLinks, function(casper, link, i){
        this.thenOpen(url+link);
        this.then(function(){
            if(link.match(re)) {
                var pCnt = this.evaluate(function(){
                    var $rW = jQuery('div#RangeWrapper');
                    // some awfully hacky string parsing to get total 
                    // products for a page
                    var pCntStr = jQuery.trim(jQuery('em:first', $rW).text());
                    var pCntA = pCntStr.split(" ");
                    return parseInt(pCntA[0]);
                });

                // if we have > 0 products assert true
                this.test.assertTruthy(pCnt>0,link + ' has ' + pCnt + ' products.');
            }
        });
    });
});

casper.run();