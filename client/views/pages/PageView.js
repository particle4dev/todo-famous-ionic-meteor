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
        'famous/inputs/FastClick'
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

        function PageView(){
            View.apply(this, arguments);

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
                content: '<button class="button button-icon icon ion-navicon"></button>'
            });

            var searchSurface = new Surface({
                size: [232, 44],
                content: '<h1 class="title"> Title </h1> '
            });

            var iconSurface = new Surface({
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
                classes: ['bar', 'bar-header', 'bar-dark']
            });
            this.layout.header.add(backgroundModifier).add(headerIonic);
            headerIonic.add(hamburgerModifier).add(this.hamburgerSurface);
            headerIonic.add(searchModifier).add(searchSurface);
            headerIonic.add(iconModifier).add(iconSurface);

            //this.layout.header.add(backgroundModifier).add(backgroundSurface);
            //this.layout.header.add(hamburgerModifier).add(this.hamburgerSurface);
            //this.layout.header.add(searchModifier).add(searchSurface);
            //this.layout.header.add(iconModifier).add(iconSurface);
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
        function _setListeners() {
            this.hamburgerSurface.on('click', function() {
                this._eventOutput.emit('menuToggle');
            }.bind(this));
            this.bodySurface._eventInput.pipe(this._eventOutput);
        }
        module.exports = PageView;
});