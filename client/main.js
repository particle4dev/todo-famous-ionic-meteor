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
});