var axios = require("axios");
var cheerio = require("cheerio");

var scrape = function() {
  // this function scrapes oregonlive.com
  return axios.get("http://www.oregonlive.com").then(function(res) {
    var $ = cheerio.load(res.data);
   
    console.log("Starting New Scrape");
    //Array for articles
    var articles = [];

    $(".article__details").each(function(i, element) {
      // Find each article tag, and find the headline text, reference URL and summary of each
      console.log("Scraping Now")
      var headline = $(this)
        .find(".article__details--headline a")
        .text()
        .trim();

        var link = $(this)
        .find("a")
        .attr("href");

      var summary = $(this)
        .find(".article__details--summary")
        .text()
        .trim();
      console.log("Article:",headline, link, summary)
        // create cases to check if articles have headlines, summaries and URLs
      if (headline && summary && link) {
        // Clean up the headline and text.
        console.log("Picked up headline, link and summary")
               // Initialize an object we will push to the articles array
        var newArticles = {
          headline: headline,
          summary: summary,
          url: link
        };

        // Push new article into articles array
        articles.push(newArticles);
      } else if (headline && link) {
        console.log("Picked up Headline and Link")

        var newArticles = {
          headline: headline,
          url: link
        };

        // Push new article into articles array
        articles.push(newArticles);
      }
    });
    console.log("Articles added:",articles)
    return articles;
  });
};

// Export the function, so other files in our backend can use it
module.exports = scrape;
