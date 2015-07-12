var engage = require('../services/engage');

/*


*/

//this function will be called when data from mix panel needed JUST FOR TESTING, called from outside.
exports.getDataFromMixP = function(req, res) {
    var udid = req;
    engage.queryEngageApi({
        where: "properties[\"UDID\"] == \"" + udid + "\"" || ""
    }, function(queryDone) {
        res.json(queryDone);
        var jsondata = JSON.parse(queryDone);
    });
};


//this function will be called when data from mix panel needed, called when asked for block status.
exports.getDataFromMixPB = function(req, callback) {
    var udid = req;
    console.log("udid:" + udid);
    engage.queryEngageApi({
        where: "properties[\"UDID\"] == \"" + udid + "\"" || ""
    }, function(queryDone) {
        var jsondata = JSON.parse(queryDone);
        callback(jsondata);
    });
};
