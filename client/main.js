Meteor.startup(function(){
/**
define(function(require, exports, module) {
    var Engine                  = require("famous/core/Engine");
    var Surface                 = require("famous/core/Surface");
    var Modifier                = require("famous/core/Modifier");
    var TransitionableTransform = require("famous/transitions/TransitionableTransform");
    var TweenTransition         = require("famous/transitions/TweenTransition");
    var Easing                  = require("famous/transitions/Easing");
    var Transform               = require("famous/core/Transform");
    var mainContext = Engine.createContext();

    var surface = new Surface({
        size:[100, 100],
        content: 'Click Me',
        classes: ['red-bg'],
        properties: {
            textAlign: 'center',
            lineHeight: '100px'
        }
    });

    var transitionableTransform = new TransitionableTransform(Transform.scale(3, 3, 3));
    
    var modifier = new Modifier({
        origin: [.5,.5],

        transform: transitionableTransform
    });
    _.each(Easing, function(curve, curveName){
        TweenTransition.registerCurve(curveName, curve)
    });

    surface.on("click", function(){
        transitionableTransform
        .setScale([1, 1, 1], {
            duration: 300,
            curve: 'inSine'
        });
    });

    mainContext.add(modifier).add(surface);
});
*/
/**
define(function(require, exports, module) {
    var Engine           = require("famous/core/Engine");
    var Modifier         = require("famous/core/Modifier");
    var Surface          = require("famous/core/Surface");
    var RenderController = require("famous/views/RenderController");

    var mainContext = Engine.createContext();
    var renderController = new RenderController();
    var surfaces = [];
    var counter = 0;

    for (var i = 0; i < 10; i++) {
        surfaces.push(new Surface({
             content: "Surface: " + (i + 1),
             size: [200, 200],
             properties: {
                 backgroundColor: "hsl(" + (i * 360 / 10) + ", 100%, 50%)",
                 lineHeight: "200px",
                 textAlign: 'center'
             }
        }));
    }

    renderController.show(surfaces[0]);

    Engine.on("click", function() {
        var next = (counter++ + 1) % surfaces.length;
        this.show(surfaces[next]);
    }.bind(renderController));

    mainContext.add(new Modifier({origin: [.5, .5]})).add(renderController);
});
*/
});