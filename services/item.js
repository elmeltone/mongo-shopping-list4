var Item = require('../models/item');

exports.save = function(name, callback, errback) {
    Item.create({ name: name }, function(err, item) {
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    });
};

exports.list = function(callback, errback) {
    Item.find(function(err, items) {
        if (err) {
            errback(err);
            return;
        }
        callback(items);
    });
};

exports.delete = function(id, errback, callback) {
    Item.findByIdAndRemove(id, function(err, item) {
        if (err) {
            errback(err);
            return;
        } else if (err==null && item==null){
            errback(err)
            return;
        }
        callback(item);
    });
};

exports.update = function(id, newName, callback, errback) {
    Item.findOneAndUpdate({_id: id}, {$set:{name: newName}}, {new:true}, function(err, item) {
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    });
};
