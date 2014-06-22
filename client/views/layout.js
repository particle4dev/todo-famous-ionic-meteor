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
    
    'partials/MenuView',
    'pages/PageView'
], function(require, exports, module){
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var GenericSync     = require('famous/inputs/GenericSync');
    var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    var Transitionable  = require('famous/transitions/Transitionable');
    var Modifier        = require('famous/core/Modifier');

    var MenuView        = require('partials/MenuView');
    var PageView        = require('pages/PageView');

    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});

    function AppView (){
        View.apply(this, arguments);
        
        this.menuToggle = false;
        // create transitionable with initial value of 0
        this.pageViewPos = new Transitionable(0);

        _createPageView.call(this);
        _createMenuView.call(this);
        //_createBackdrop.call(this);

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

    AppView.prototype.menuToggleLeft = function() {
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

    function _createBackdrop(){
        this.backdrop = new Surface({
            content: '<div class="backdrop visible active"></div>'
        });
        this.backdropModifier = new StateModifier({
            origin: [0, 0.5],
            align : [0, 0.5],
            transform: Transform.inFront
        });
        this.add(this.backdropModifier).add(this.backdrop);
    }

    function _createMenuView(){
        this.menuView = new MenuView({ stripData: [{
            iconUrl: 'http://img3.wikia.nocookie.net/__cb20130623192636/deadoralive/images/archive/4/40/20140501111521!DOA5U_Rachel_Render.png',
            title: 'Home',
            page: 'HomePage'        
        }, {
            iconUrl: 'http://img3.wikia.nocookie.net/__cb20130623192636/deadoralive/images/archive/4/40/20140501111521!DOA5U_Rachel_Render.png',
            title: 'Profile',
            page: 'ProfilePage' 
        }]});
        var menuModifier = new StateModifier({
            transform: Transform.behind
        });
        this.add(menuModifier).add(this.menuView);
    }

    function _setListeners() {
        var self = this;
        self.pageView.on('menuToggleLeft', self.menuToggleLeft.bind(self));
        self.menuView.on('switchPage', function(page){
            this._showPage(page);
            console.log(page);
            self.menuToggleLeft();
        }.bind(self.pageView));
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
/***/
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
