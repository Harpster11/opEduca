var scrape = require("../scripts/scrape");
var headlinesControl = require("../controllers/headlines");
var commentsControl = require("../controllers/comments");

module.exports = function(router) {

    router.get("/", function(req, res) {
        res.render("index");
    });

    router.get("/saved", function(req, res) {
        res.render("saved")
    });

    router.get("api/fetch", function(req, res){
        headlinesControl.fetch(function(err,docs){
            if(!docs ||docs.insertedCount === 0) {
                res.json({ 
                    message: "No new articles."
                });
            }
            else{
                res.json({
                    message: "Loaded " + docs.insertedCount + " new articles."
                })
            }
        })
    });
    router.get("api/headlines", function(req, res){
        var query = {};
        if (req.query.saved) {
            query=req.query;
        }

        headlinesControl.get(query, function(data){
            res.json(data);
        })

    });
    router.delete("api/headlines/:id", function(req, res){
        var query = {};
        query._id = req.params.id;
        headlinesControl.delete(query, function(err, data){
            res.json(data);
        });
    });
    router.patch("api/headlines/", function(req, res){
        headlinesControl.update(req.body, function(err, data){
            res.json(data);
        });
});
router.get("api/comments/:headline_id?", function(req, res){
    var query = {};
    if (req.params.headline_id) {
        query._id = req.params.headline_id;
    }

    commentsControl.get(query, function(err, data){
        res.json(data);
    })
});
};

router.delete("api/comments/:id", function(req, res){
    var query = {};
    query._id = req.params.id;
    commentsControl.delete(query, function(err, data){
        res.json(data);
    });
});

router.post("api/comments", function(req, res){
    commentsControl.save(req.body, function(data){
        res.json(data);
    })
})