Projects = new Meteor.Collection('projects',{
    transform: function(doc) {return new ProjectDocument(doc);}
});
Projects.deny({
    insert: function() {return true;},
    update: function() {return true;},
    remove: function() {return true;}
});
ProjectDocument = function(doc){
    var self = this;
    _.extend(self, doc);
};
_.extend(ProjectDocument.prototype, {
    constructor: ProjectDocument,
    // EJSON
    clone: function(){
        return new ProjectDocument(this.toJSONValue());
    },
    equals: function(other){
        if (!(other instanceof ProjectDocument))
            return false;
        return EJSON.stringify(this) == EJSON.stringify(other);
    },
    typeName: function(){
        return "ProjectDocument";
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
EJSON.addType("ProjectDocument", function fromJSONValue(value) {
    return new ProjectDocument(value);
});