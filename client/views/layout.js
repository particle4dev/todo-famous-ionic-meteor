define('AppView', [
    'famous/core/View',
    'famous/core/Surface',
    'famous/core/Transform',
    'famous/core/Modifier',
    'famous/modifiers/StateModifier',
    'famous/inputs/GenericSync',
    'famous/inputs/MouseSync',
    'famous/inputs/TouchSync',
    'famous/transitions/Transitionable',
    'pages/PageView',
    'partials/MenuView'
], function(require, exports, module){
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var PageView        = require('pages/PageView');
    var MenuView        = require('partials/MenuView');
    var GenericSync     = require('famous/inputs/GenericSync');
    var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    var Transitionable  = require('famous/transitions/Transitionable');
    var Modifier        = require('famous/core/Modifier');

    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});

    function AppView (){
        View.apply(this, arguments);
        
        this.menuToggle = false;
        // create transitionable with initial value of 0
        this.pageViewPos = new Transitionable(0);

        _createPageView.call(this);
        _createMenuView.call(this);

        _setListeners.call(this);
        _handleSwipe.call(this);
    }
    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;
    AppView.DEFAULT_OPTIONS = {
        openPosition: 276,
        transition: {
            duration: 300,
            curve: 'easeOut'
        },
        posThreshold: 138,
        velThreshold: 0.75
    };

    AppView.prototype.toggleMenu = function() {
        if(this.menuToggle) {
            this.slideLeft();
        } else {
            this.slideRight();
            this.menuView.animateStrips();
        }
        this.menuToggle = !this.menuToggle;
    };
    AppView.prototype.slideLeft = function() {
        this.pageViewPos.set(0, this.options.transition, function() {
            this.menuToggle = false;
        }.bind(this));
    };
     AppView.prototype.slideRight = function() {
        this.pageViewPos.set(this.options.openPosition, this.options.transition, function() {
            this.menuToggle = true;
        }.bind(this));
    };

    // add view 
    function _createPageView(){
        this.pageView = new PageView();
        this.pageModifier = new Modifier({
            transform: function() {
                return Transform.translate(this.pageViewPos.get(), 0, 0);
            }.bind(this)
        });
        this.add(this.pageModifier).add(this.pageView);
    }

    function _createMenuView(){
        this.menuView = new MenuView({ stripData: [{
            iconUrl: 'http://img3.wikia.nocookie.net/__cb20130623192636/deadoralive/images/archive/4/40/20140501111521!DOA5U_Rachel_Render.png',
            title: 'Famo.us'        
        }, {
            iconUrl: 'http://img3.wikia.nocookie.net/__cb20130623192636/deadoralive/images/archive/4/40/20140501111521!DOA5U_Rachel_Render.png',
            title: 'Famo.us2'
        }]});
        var menuModifier = new StateModifier({
            transform: Transform.behind
        });
        this.add(menuModifier).add(this.menuView);
    }

    function _setListeners() {
        this.pageView.on('menuToggle', this.toggleMenu.bind(this));
    }
    function _handleSwipe() {
        var sync = new GenericSync(
            ['mouse', 'touch'],
            {direction : GenericSync.DIRECTION_X}
        );

        this.pageView.pipe(sync);

        sync.on('update', function(data) {
            var currentPosition = this.pageViewPos.get();
             if(currentPosition === 0 && data.velocity > 0) {
                this.menuView.animateStrips();
            }
            this.pageViewPos.set(Math.max(0, currentPosition + data.delta));
        }.bind(this));
        sync.on('end', (function(data) {
            var velocity = data.velocity;
            var position = this.pageViewPos.get();

            if(position > this.options.posThreshold) {
                if(velocity < -this.options.velThreshold) {
                    this.slideLeft();
                } else {
                    this.slideRight();
                }
            } else {
                if(velocity > this.options.velThreshold) {
                    this.slideRight();
                } else {
                    this.slideLeft();
                }
            }
        }).bind(this));
    }

    module.exports = AppView;
});

// start app
Meteor.startup(function(){
    define([
        'famous/core/Engine',
        'AppView'
    ], function(){
        var Engine  = require('famous/core/Engine');
        var AppView = require('AppView');
        var mainContext = Engine.createContext();
        var appView = new AppView();
        mainContext.add(appView);
    });
});