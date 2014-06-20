Meteor.publish("projects", function(){
    return Projects.find();
});
Meteor.publish("items", function(){
    return Items.find();
});