define('partials/Each', [
    "famous/core/Surface",
    "famous/core/Modifier",
    "famous/core/Transform",
    "famous/core/View",
    "famous/surfaces/ContainerSurface",
    'partials/Surface2',
    'famous/modifiers/StateModifier'
    ], function (require, exports, module) {
    //https://github.com/meteor/meteor/blob/devel/packages/ui/each.js
    //https://github.com/gadicc/meteor-famous-components/blob/master/lib/famousEach.js
    function Each(options) {
        var self = this;
        View.apply(self, arguments);
        ObserveSequence.observe(function(){
            return self.options.data
        },{
            addedAt: function (id, item, i, beforeId){
                console.log(id, item, i, beforeId, 'added');
                self.addDocument(item);
            },
            changedAt: function (newDocument, oldDocument, atIndex){
                console.log(newDocument, oldDocument, atIndex, 'changed');
            },
            removedAt: function (oldDocument, atIndex) {
                console.log(oldDocument, atIndex, 'removed');
            },
            movedTo: function (document, fromIndex, toIndex, before) {
                console.log(document, fromIndex, toIndex, before, 'movedTo');
            }
        });
    }
    var View            = require("famous/core/View");
    var Modifier        = require("famous/core/Modifier");
    var Surface         = require("famous/core/Surface");
    var Surface2        = require("partials/Surface2");
    var StateModifier   = require('famous/modifiers/StateModifier');
    var Transform       = require('famous/core/Transform');

    Each.prototype = Object.create(View.prototype);
    Each.prototype.constructor = Each;
    Each.DEFAULT_OPTIONS = {};
    Each.prototype.addDocument = function(document){
        var self = this;
        self._addNewNode(document);
    };
    var yOffset = 200;
    Each.prototype._addNewNode = function(document){
        var self = this;
        yOffset += 55;
        var n;
        if(this.options.node)
            n = this.options.node(document);
        else
            n = new Surface2({
                content: document.name
            });
        self.add(new Modifier({
            transform: Transform.translate( 0, yOffset, 0)
        })).add(n);
        if(self.options.added)
            self.options.added(n);
    };
    Each.prototype._removeSurface = function(documentId){

    };
    module.exports = Each;
});

//Projects.insert({name: 'sao3'})
//Projects.remove({name: 'sao3'})