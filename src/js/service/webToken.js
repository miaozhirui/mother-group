
module.exports = (app) => {

	app.factory('webToken', ['$rootScope', function($rootScope) {

		function getParams() {

			var queryString = location.href.split('?')[location.href.split('?').length-1];

			var params = {};

			queryString.split('&').forEach(function(item) {

				var key = item.split('=')[0];
				var value = item.split('=')[1];

				params[key] = value;
			})

			return params;

		}

		var params = getParams();


		return {

			sign: params.sign || '',
			timestamp: params.timestamp || '',
			token: params.token || '',
			uid: params.uid || ''
		}
	}])
}