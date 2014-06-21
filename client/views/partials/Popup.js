define('partials/Popup', [
    'famous/core/Surface',
    'famous/core/RenderNode',
    'famous/core/Entity'
    ], function(require, exports, module){

        var Surface = require('famous/core/Surface');
        var RenderNode = require('famous/core/RenderNode');
        var Entity = require('famous/core/Entity');
        
        function Popup () {
            this.options = Object.create(Popup.DEFAULT_OPTIONS);

            this._entityId = Entity.register(this);
            this.visible = this.options.visible;
            this.backdrop = new RenderNode();
            this.backdrop.add(new Surface({
                content: '<div class="backdrop visible active"></div>'
            }));
        };
        Popup.DEFAULT_OPTIONS = {
            autoShow: true,
            visible: true
        };
        /**
         * Generate a render spec from the contents of this component.
         *
         * @private
         * @method render
         * @return {Object} Render spec for this component
         */
        Popup.prototype.render = function render() {
            return this.visible ? this._entityId : undefined;
        };
        /**
         * It run over and over to render. 
         *
         * Apply changes from this component to the corresponding document element.
         * This includes changes to classes, styles, size, content, opacity, origin,
         * and matrix transforms.
         *
         * @private
         * @method commit
         * @param {Context} context commit context
         */
        Popup.prototype.commit = function commit(context) {
            console.log('Popup.prototype.commit');
            var transform = context.transform;
            var origin = context.origin;
            var size = context.size;
            var opacity = context.opacity;
            return {
                transform: transform,
                opacity: opacity,
                size: size,
                target: [{
                    size:[200, 200],
                    target: this.backdrop.render()
                }]
            };
        };
        /**
         * Place the document element that this component manages into the document.
         *
         * @private
         * @method deploy
         * @param {Node} target document parent of this container
         */
        Popup.prototype.deploy = function deploy(target) {
            console.log('Popup.prototype.deploy');
        };

        Popup.prototype.show = function () {
            this.visible = true;
        };
        Popup.prototype.hide = function () {
            this.visible = false;
        };

        module.exports = Popup;
});

/**

var a = new Popup({
    title: 'Enter Wi-Fi Password',
    subTitle: 'Please use normal things',
    template: '<input type="password">',
    buttons: [
        { text: 'Cancel' },
        {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
                if (!$scope.data.wifi) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                } else {
                    return $scope.data.wifi;
                }
            }
        }
    ]
});

a.show();
a.hide();
*/