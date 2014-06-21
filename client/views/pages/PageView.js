/*** PageView.js ***/
define('pages/PageView', [
        'famous/core/View',
        'famous/core/Surface',
        'famous/core/Group',        
        'famous/core/Transform',
        'famous/modifiers/StateModifier',
        'famous/views/HeaderFooterLayout',
        'famous/surfaces/ImageSurface',
        'famous/views/Scrollview',
        'famous/inputs/FastClick',
        'partials/Surface2',
        'partials/Popup'
    ], function(require, exports, module){
        var View                = require('famous/core/View');
        var Surface             = require('famous/core/Surface');
        var Transform           = require('famous/core/Transform');
        var StateModifier       = require('famous/modifiers/StateModifier');
        var HeaderFooterLayout  = require('famous/views/HeaderFooterLayout');
        var ImageSurface        = require('famous/surfaces/ImageSurface');
        var Group               = require('famous/core/Group');
        var Scrollview          = require('famous/views/Scrollview');
        var FastClick           = require('famous/inputs/FastClick');
        var Surface2            = require('partials/Surface2');
        var Popup               = require('partials/Popup');

        function PageView(){
            View.apply(this, arguments);

            _createBacking.call(this);
            _createLayout.call(this);
            _createHeader.call(this);
            _createBody.call(this);

            _setListeners.call(this);
        }
        PageView.prototype = Object.create(View.prototype);
        PageView.prototype.constructor = PageView;
        PageView.DEFAULT_OPTIONS = {
            headerSize: 44 //standard ios app
        };

        //
        function _createLayout(){
            this.layout = new HeaderFooterLayout({
                headerSize: this.options.headerSize
            });

            var layoutModifier = new StateModifier({
                transform: Transform.translate(0, 0, 0.1)
            });

            this.add(layoutModifier).add(this.layout);
        }
        function _createHeader() {
            var backgroundSurface = new Surface({
                properties: {
                    backgroundColor: '#444444'
                }
            });

            var backgroundModifier = new StateModifier({
                transform: Transform.inFront
            });

            this.hamburgerSurface = new Surface({
                size: [44, 44],
                content: '<button class="button button-icon icon ion-navicon disable-user-behavior"></button>'
            });

            var searchSurface = new Surface2({
                size: [232, 44],
                content: function(){ 
                    //return '<h1 class="title"> ' + Session.get('title') + ' </h1> ';

                    //Projects.update("test", {$set: {name: Random.id()}})
                    var project = Projects.findOne("test");
                    if(project)
                        return '<h1 class="title"> ' + project.name + ' </h1> ';
                    return '<h1 class="title"> ' + 'No name' + ' </h1> ';
                }
            });

            this.iconSurface = new Surface({
                size: [44, 44],
                content: '<button class="button button-icon disable-user-behavior">' +
                            '<i class="icon ion-compose"></i>' +
                        '</button>'
            });

            var hamburgerModifier = new StateModifier({
                origin: [0, 0.5],
                align : [0, 0.5]
            });

            var searchModifier = new StateModifier({
                origin: [0.5, 0.5],
                align : [0.5, 0.5]
            });

            var iconModifier = new StateModifier({
                origin: [1, 0.5],
                align : [1, 0.5]
            });

            var headerIonic = new Group({
                size: [true, 44],
                classes: ['bar', 'bar-header', 'bar-dark', 'disable-user-behavior']
            });
            this.layout.header.add(backgroundModifier).add(headerIonic);
            headerIonic.add(hamburgerModifier).add(this.hamburgerSurface);
            headerIonic.add(searchModifier).add(searchSurface);
            headerIonic.add(iconModifier).add(this.iconSurface);
        }
        function _createBody() {
            this.bodySurface = new Scrollview();
            var surfaces = [];

            this.bodySurface.sequenceFrom(surfaces);

            for (var i = 0, temp; i < 40; i++) {
                temp = new Surface({
                     content: "Surface: " + (i + 1),
                     size: [undefined, 200],
                     properties: {
                         backgroundColor: "hsl(" + (i * 360 / 40) + ", 100%, 50%)",
                         lineHeight: "200px",
                         textAlign: "center"
                     }
                });

                temp.pipe(this.bodySurface);
                surfaces.push(temp);
            }

            this.layout.content.add(this.bodySurface);
        }
        function _createBacking() {
            var backing = new Surface({
                properties: {
                    backgroundColor: 'black',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                }
            });

            this.add(backing);
        }
        function _showPopup() {
            var self = this;
            if(!self._popup){
                self._popup = new Popup({
                    visible: false
                });
                self._popupModifier = new StateModifier({
                    origin: [0, 0.5],
                    align : [0, 0.5],
                    transform: Transform.inFront
                });
                self.add(self._popupModifier).add(self._popup);
            }
        }

        function _setListeners() {
            var self = this;
            self.hamburgerSurface.on('click', function() {
                self._eventOutput.emit('menuToggleLeft');
            }.bind(self));

            self.iconSurface.on('click', function() {
                _showPopup.call(this);
            }.bind(self));

            self.bodySurface._eventInput.pipe(self._eventOutput);
        }
        module.exports = PageView;
});


/**
 * Bai toan
 * 
 * dung Session de render, session thay doi, render thay doi theo.
 */
Session.setDefault('title', 'SEX');
Meteor.setTimeout(function(){
    Session.set('title', 'Default');
    console.log(Session.get('title'));
}, 3000);