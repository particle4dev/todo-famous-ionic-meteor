define('pages/HomePage', [
	'famous/core/View',
	'famous/core/Surface',
	'famous/modifiers/StateModifier'

	], function(require, exports, module){

		var View 			= require('famous/core/View');
		var Surface 		= require('famous/core/Surface');
		var StateModifier 	= require('famous/modifiers/StateModifier');

		function HomePage(){
			View.apply(this, arguments);

			_addSurface.call(this);
		}
		HomePage.prototype = Object.create(View.prototype);
		HomePage.prototype.constructor = HomePage;
		HomePage.DEFAULT_OPTIONS = {};

		// add view
		function _addSurface(){
			this.add(new StateModifier()).add(new Surface({
				content: 'HomePage',
				properties: {
                    backgroundColor: 'red',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                }
			}));
		};

		module.exports = HomePage;
	});