/*** Surface2.js ***/
if(Meteor.isClient)
define('partials/Surface2', [
        'famous/core/Surface',
    ], function(require, exports, module){
        var Surface             = require('famous/core/Surface');

        function Surface2 (){
            Surface.apply(this, arguments);

        };
        Surface2.prototype = Object.create(Surface.prototype);
        Surface2.prototype.constructor = Surface2;
        Surface2.prototype.deploy = function deploy(target) {
            //https://github.com/meteor/meteor/blob/devel/packages/ui/render.js#L343
            var self = this;
            self.rangeUpdater = Deps.autorun(function (c) {
                var content = self.getContent();
                if(typeof content === 'function')
                    content = content();
                if (content instanceof Node) {
                    while (target.hasChildNodes()) target.removeChild(target.firstChild);
                    target.appendChild(content);
                }
                else target.innerHTML = content;
            });
        };
        /**
         * Set or overwrite inner (HTML) content of this surface. Note that this
         *    causes a re-rendering if the content has changed.
         *
         * @method setContent
         * @param {string|Document Fragment} content HTML content
         */
        Surface.prototype.setContent = function setContent(content) {
            var self = this;
            if(self.rangeUpdater && self.rangeUpdater.stop){
                self.rangeUpdater.stop()
                self.rangeUpdater = null;
            }
            if (this.content !== content) {
                this.content = content;
                this._contentDirty = true;
            }
        };
        module.exports = Surface2;
});