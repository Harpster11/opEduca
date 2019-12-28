var router = require("express").Router();
var fetchRoutes = require("./fetch");
var commentRoutes = require("./comments");
var headlineRoutes = require("./headlines");
var clearRoutes = require("./clear");

router.use("/fetch", fetchRoutes);
router.use("/comments", commentRoutes);
router.use("/headlines", headlineRoutes);
router.use("/clear", clearRoutes);

module.exports = router;
