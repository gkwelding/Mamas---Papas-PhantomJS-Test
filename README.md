Mamas & Papas PhantomJS Test
======================
Usage
-----

casperjs MP_Important_Links.js --url="http://www.mamasandpapas.com"

About
-----

Some basic testing of the Mamas & Papas wesbite, currently does:
* Open the url passed, usually www.mamasandpapas.com
* Check the main nav contains links
* Opens each main nav links and ensures it loads
* Opens each sub nav links and ensures it loads
* If any sub nav link is a range page then check that page contains products

Copyright
----------

Work here is relesed under Phil Sturgeons DBAD license. http://philsturgeon.co.uk/code/dbad-license. Just give me some goddam credit if you use it and don't be a dick.