Template.itemsPage.items = function(){
    return Items.find({}, {sort: {name: -1}});
};

Template.itemsPage.events({
    'click .insertBtn': function(evt, tmp){
        evt.preventDefault();
        console.log('insertBtn');
        Items.insert({
            projectId: 'test',
            name: Random.id()
        });
    },
    'click .updateBtn': function(evt, tmp){
        evt.preventDefault();
        console.log('updateBtn');
        var r = Items.findOne();
        if(r){
            Items.update(r._id, {$set: {name: Random.id()}});
        }
    },
    'click .removeBtn': function(evt, tmp){
        evt.preventDefault();
        var r = Items.findOne();
        if(r){
            Items.remove(r._id);
            console.log('removeBtn', Items.find().count());
        }
    }
});