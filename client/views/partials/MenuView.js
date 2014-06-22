define('partials/StripView', [
    'famous/core/View',
    'famous/core/Transform',
    'famous/core/Surface',
    'famous/core/EventHandler',
    'famous/surfaces/ImageSurface', // https://github.com/Famous/surfaces
    'famous/modifiers/StateModifier',
    'famous/inputs/FastClick',
    'famous/utilities/Timer'
    ], function(require, exports, module){
        var View            = require('famous/core/View');
        var Surface         = require('famous/core/Surface');
        var Transform       = require('famous/core/Transform');
        var EventHandler    = require('famous/core/EventHandler');
        var StateModifier   = require('famous/modifiers/StateModifier');
        var ImageSurface    = require('famous/surfaces/ImageSurface');
        var FastClick       = require('famous/inputs/FastClick');
        var Timer           = require('famous/utilities/Timer');

        var eventHandler = new EventHandler();
        eventHandler.on('hello', function(page) {
            console.log(page);
        });

        function StripView () {
            View.apply(this, arguments);

            _createBackground.call(this);
            _createIcon.call(this);
            _createTitle.call(this);

            _setListeners.call(this);
        }
        StripView.prototype = Object.create(View.prototype);
        StripView.prototype.constructor = StripView;
        StripView.DEFAULT_OPTIONS = {
            width: 320,
            height: 55,
            angle: -0.2,
            iconSize: 32,
            iconUrl: 'http://img3.wikia.nocookie.net/__cb20130623192636/deadoralive/images/archive/4/40/20140501111521!DOA5U_Rachel_Render.png',
            title: 'Famo.us',
            fontSize: 26,
        };

        //add view
        function _createBackground() {
            this.backgroundSurface = new Surface({
                size: [this.options.width, this.options.height],
                properties: {},
                classes: ['grey-bg']
            });
            var rotateModifier = new StateModifier({
                transform: Transform.rotateZ(this.options.angle)
            });
            var skewModifier = new StateModifier({
                transform: Transform.skew(0, 0, this.options.angle)
            });

            // we're first skewing our surface then rotating it
            this.add(rotateModifier).add(skewModifier).add(this.backgroundSurface);
        }
        function _createIcon() {
            var self = this;
            self.iconSurface = new ImageSurface({
                size: [this.options.iconSize, this.options.iconSize],
                content : this.options.iconUrl,
                properties: {
                    pointerEvents : 'none'
                }
            });

            this.iconModifier = new StateModifier({
                // places the icon in the proper location
                transform: Transform.translate(24, 2, 0)
            });

            this.add(this.iconModifier).add(self.iconSurface);
        }
        function _createTitle() {
            var self = this;
            self.titleSurface = new Surface({
                size: [true, true],
                content: this.options.title,
                properties: {
                    color: 'white',
                    fontSize: this.options.fontSize + 'px',
                    textTransform: 'uppercase',
                    pointerEvents : 'none'
                }
            });

            var titleModifier = new StateModifier({
                transform: Transform.thenMove(Transform.rotateZ(this.options.angle), [75, -5, 0])
            });

            this.add(titleModifier).add(self.titleSurface);
        }

        function _setListeners() {
            var self = this;

            self.backgroundSurface.on('click', function() {
                eventHandler.emit('hello', 'page');
            }.bind(self));

            self.backgroundSurface.on('mouseover', function() {
                console.log('mouseover');
                self.backgroundSurface.setClasses(['red-bg']);
                Timer.setTimeout(function() {
                    this.iconModifier.setTransform(
                                          // x, y, 
                        Transform.translate( 0, 0, 100), {
                        duration: 400,
                        curve: 'easeOut'
                    });
                }.bind(this), 100);

            }.bind(self));

            self.backgroundSurface.on('mouseout', function() {
                console.log('mouseout');
                self.backgroundSurface.removeClass('red-bg');
                self.backgroundSurface.setClasses(['grey-bg']);
            }.bind(self));
        }

        module.exports = StripView;
});

define('partials/MenuView', [
    'famous/core/View',
    'famous/core/Surface',
    'famous/modifiers/StateModifier',
    'famous/core/Transform',
    'famous/utilities/Timer',
    'partials/StripView',
    'partials/Each'
    ], function(require, exports, module){
        var View            = require('famous/core/View');
        var Surface         = require('famous/core/Surface');
        var StateModifier   = require('famous/modifiers/StateModifier');
        var Transform       = require('famous/core/Transform');
        var Timer           = require('famous/utilities/Timer');
        var StripView       = require('partials/StripView');
        var Each            = require('partials/Each');

        function MenuView() {
            View.apply(this, arguments);

            _createStripViews.call(this);

        }
        MenuView.prototype = Object.create(View.prototype);
        MenuView.prototype.constructor = MenuView;
        MenuView.DEFAULT_OPTIONS = {
            stripData: {},
            angle: -0.2,
            stripWidth: 320,
            stripHeight: 54,
            topOffset: 37,
            stripOffset: 58,
            staggerDelay: 35,
            transition: {
                duration: 400,
                curve: 'easeOut'
            }
        };
        MenuView.prototype.resetStrips = function() {
            for(var i = 0; i < this.stripModifiers.length; i++) {
                var initX = -this.options.stripWidth;
                var initY = this.options.topOffset
                    + this.options.stripOffset * i
                    + this.options.stripWidth * Math.tan(-this.options.angle);

                this.stripModifiers[i].setTransform(Transform.translate(initX, initY, 0));
            }
        };
        MenuView.prototype.animateStrips = function() {
            this.resetStrips();

            var transition = this.options.transition;
            var delay = this.options.staggerDelay;
            var stripOffset = this.options.stripOffset;
            var topOffset = this.options.topOffset;

            for(var i = 0; i < this.stripModifiers.length; i++) {
                Timer.setTimeout(function(i) {
                    var yOffset = topOffset + stripOffset * i;

                    this.stripModifiers[i].setTransform(
                        Transform.translate( 0, yOffset, 0), transition);
                }.bind(this, i), i * delay);
            }
        };
        //add view
        function _createStripViews(){
            this.stripModifiers = [];
            var yOffset = this.options.topOffset;

            for (var i = 0; i < this.options.stripData.length; i++) {
                var stripView = new StripView({
                    iconUrl: this.options.stripData[i].iconUrl,
                    title: this.options.stripData[i].title
                });

                var stripModifier = new StateModifier({
                    transform: Transform.translate(0, yOffset, 0)
                });

                this.stripModifiers.push(stripModifier);
                this.add(stripModifier).add(stripView);

                yOffset += this.options.stripOffset;
            }
            var s = new Each({
                data: Projects.find({}, {sort: {name: -1}}),
                node: function(data){
                    return new StripView({
                        iconUrl: '',
                        title: data.name
                    });
                }
            });
            this.add(new StateModifier()).add(s);
        }

        module.exports = MenuView;
});