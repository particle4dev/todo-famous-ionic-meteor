define('pages/ProfilePage', [
	'famous/core/View',
	'famous/core/Surface',
	'famous/modifiers/StateModifier'

	], function(require, exports, module){

		var View 			= require('famous/core/View');
		var Surface 		= require('famous/core/Surface');
		var StateModifier 	= require('famous/modifiers/StateModifier');

		function ProfilePage(){
			View.apply(this, arguments);

			_addSurface.call(this);
		}
		ProfilePage.prototype = Object.create(View.prototype);
		ProfilePage.prototype.constructor = ProfilePage;
		ProfilePage.DEFAULT_OPTIONS = {};

		// add view
		function _addSurface(){
			this.add(new StateModifier()).add(new Surface({
				content: 'ProfilePage',
				properties: {
                    backgroundColor: 'red',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                }
			}));
		};

		module.exports = ProfilePage;
	});