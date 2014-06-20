/**
 * @doc http://docs.meteor.com/#assets
 */
var loadProjects = function(){
    if(!Projects.findOne()){
        Projects.insert({
            _id: 'test',
            name: 'project 01'
        })
    }
};
var loadItems = function(){
    if(!Items.findOne()){
        Items.insert({
            _id: 'test01',
            projectId: 'test',
            name: 'item 01'
        });
        Items.insert({
            _id: 'test02',
            projectId: 'test',
            name: 'item 02'
        });
        Items.insert({
            _id: 'test03',
            projectId: 'test',
            name: 'item 03'
        });
    }
};
// export
(function(){
    var self = this;
    self.init = function(){
        loadProjects();
        loadItems();
    };
}).apply(APP.namespace('FIXTURES'));