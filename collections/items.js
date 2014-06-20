Items = new Meteor.Collection('items',{
    transform: function(doc) {return new ItemDocument(doc);}
});
//Items.deny({
    //insert: function() {return true;},
    //update: function() {return true;},
    //remove: function() {return true;}
//});
ItemDocument = function(doc){
    var self = this;
    _.extend(self, doc);
};
_.extend(ItemDocument.prototype, {
    constructor: ItemDocument,
    // EJSON
    clone: function(){
        return new ItemDocument(this.toJSONValue());
    },
    equals: function(other){
        if (!(other instanceof ItemDocument))
            return false;
        return EJSON.stringify(this) == EJSON.stringify(other);
    },
    typeName: function(){
        return "ItemDocument";
    },
    toString: function(){
        return "title: "        +this.title +            
            ", updated: "       +this.updated;
    },
    toJSONValue: function(){
        var doc = {
            title       : this.title,
            updated     : this.updated
        };
        return doc;
    }
});

// Tell EJSON about our new custom type
EJSON.addType("ItemDocument", function fromJSONValue(value) {
    return new ItemDocument(value);
});