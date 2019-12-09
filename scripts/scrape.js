var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
    request("http://www.cleveland.com", function(err, res, body){

    var $ = cheerio.load(body);

    var articles = [];

    $(".article__details").each(function(i, element){

        var headline = $(this).children("article_details--headline").text().trim();
        var summary = $(this).children(".article_details--summary").text().trim();

        if(headline && summary){
            var headNeat = headline.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
            var sumNeat = summary.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        var articlesToAdd = {
            headline: headNeat,
            summary: sumNeat
        };
        
    })

    var headline = $(this).ch
    })
}