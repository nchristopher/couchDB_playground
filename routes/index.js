/*
 * GET home page.
 */
var request = require("request");

var jsonString = {
    "Approved To Publish": "false",
    "Article Body": "<img alt=\"User-added image\" src=\"http://dl.dropbox.com/u/44240971/Salesforce%20Images/December%20&#39;12%20-%20January%20&#39;13/20130121-Carbon_Trust_Standard_logo.jpg\"></img><br><br><strong>NI has retained the Carbon Trust Standard for energy and carbon management.</strong><br><br>Following a demanding audit process that took place in December 2012, NI was awarded recertification for the Carbon Trust Standard.<br><br>This certificate is a mark of excellence in recognition of how well we measure, manage and reduce our carbon emissions.<br><br>It is widely considered as the world-leading standard for carbon footprint certification and reduction, and provides tangible proof to company employees, shareholders, customers and suppliers that a company is committed to making future reductions. <br><br>Delighted NI Operations MD David Dinsmore said: “This is a fantastic achievement for NI. It demonstrates our firm commitment to reducing our environmental impact despite the challenging conditions that we face as a business.<br><br>“Continuing to maintain the Carbon Trust Standard provides a solid platform on which we can develop our environmental programme and build on our efforts over the coming year.”<br><br>NI initially achieved the Carbon Trust Standard in 2010 after demonstrating that our carbon footprint had fallen for three consecutive years.  Each certification period lasts for two years and to maintain certification, NI needed to demonstrate that we have continued to reduce our carbon footprint year-on-year since being originally certified.<br><br>However, the recertification process is made more challenging as the scope of the assessment is widened to include other emissions – most significantly transport from staff travel and company vehicles.<br><br>Achieving recertification is testament to the ongoing efforts of staff from across the business to reduce the company’s environmental footprint.  Through a combination of behavioural change among colleagues and investment in energy-efficient manufacturing equipment at our Newsprinters sites, we reduced our electricity consumption by approximately 13,475,000kWh between 2010 and 2012.<br><br>This is the equivalent of powering 2,450 three-bed homes for a year or keeping the Wembley Stadium arch lit for 16,818 days.<br><br>When considering all of NI’s emissions from electricity, gas and other sources, the audit showed that we have reduced our total carbon footprint by 10.4 per cent since 2010.  This has saved almost 10,500 tonnes of CO2 emissions. <br><br>To put that achievement in perspective, NI’s CO2 savings over the last two years equal 3,400 return flights for one person from London to Sydney.<br><br>As we seek to grow our business, the challenge will be to continue identifying and delivering initiatives that will further reduce our carbon footprint and environmental impact.<br><br>Reducing carbon emissions goes hand-in-hand with improving the efficiency of our business and reducing operational costs.  <br><br>If you have any questions regarding certification or want to get involved in our action on climate change, e-mail NI energy and environment manager Lugano Kapembwa on lugano.kapembwa@newsint.co.uk<br>",
    "Article Type": "Article",
    "Created By ID": "005b0000000Yn6vAAC",
    "Created Date": "01/21/2013T16:58:27.000Z",
    "Deleted": "false",
    "Draft Article": "a06b0000004SWdSAAW",
    "Expiry Date": "01/21/2018T16:57:56.000Z",
    "Featured Article": "false",
    "Headline": "Delight as NI retains Carbon Trust Standard",
    "Intro": "NI has retained the Carbon Trust Standard for energy and carbon management.",
    "Last Modified By ID": "005b0000000Yn6vAAC",
    "Last Modified Date": "01/31/2013T07:46:02.000Z",
    "News Article Name": "NA-0113",
    "Owner ID": "005b0000000Yn6vAAC",
    "Owner Manager": "",
    "Published By": "005b0000000Yn6vAAC",
    "Published Date": "01/21/2013T16:57:00.000Z",
    "Rating": 5,
    "Record ID": "a06b0000004SWbdAAG",
    "Record Type ID": "012b0000000TYE3AAO",
    "System Modstamp": "01/31/2013T07:46:02.000Z"
};
exports.index = function (req, res) {
    res.render('index', {
        title: 'Express',
        siteName: 'Search Site'
    });
};

exports.couchResponse = function (req, res) {
    request({
        uri: "https://nimil.iriscouch.com/",
        method: "GET",
        timeout: 1000,
        followRedirect: true,
        maxRedirects: 10
    }, function (error, response, body) {
        console.log('Nimil : ' + body);
        res.send(body);
    });
};

exports.couchPost = function (req, res) {
    request({
        uri: "http://nimil.iriscouch.com/couch_db_first",
        method: "POST",
        timeout: 1000,
        followRedirect: true,
        maxRedirects: 10,
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(jsonString)
    }, function (error, response, body) {
        console.log('Nimil : ' + body);
        res.send(body);
    });
};

exports.uploadArticles = function (req, res) {
    res.render('uploadForm', {
        title: 'Express',
        siteName: 'Search Site'
    })
};

exports.searchPage = function (req, res) {
    res.render('searchForm', {
        title: 'Express',
        siteName: 'Search Site'
    })
};

exports.upload = function (req, res) {
    console.log(req);
    request({
        uri: "http://nimil.iriscouch.com/couch_db_first/_bulk_docs",
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: req.body.jsonValue
    }, function (error, response, body) {
        console.log('Nimil : ' + response);
        res.send(response);
    });
};
exports.search = function (req, res) {
    console.log(req);
    console.log('Map Function : ' + JSON.stringify({"map": "function (doc) {if (doc.Headline.search(/" + req.body.jsonValue + "/i) !== -1 ) {emit(doc.Headline, doc);}}"}));
    request({
        uri: "http://christopher:christopher@nimil.iriscouch.com/couch_db_first/_temp_view",
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "map": "function (doc) {if (doc.Headline.search(/" + req.body.jsonValue + "/i) !== -1 ) {emit(doc.Headline, doc);}}"
        })
    }, function (error, response, body) {
        jsonObject = JSON.parse(response.body);
        console.log('Nimil : ' + response.body);
        res.render('searchResults', {
            title: 'Express',
            siteName: 'Search Site',
            body: jsonObject
        })
    });
};