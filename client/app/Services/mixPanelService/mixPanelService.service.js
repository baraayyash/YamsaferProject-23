'use strict';

angular.module('internsApp')
	.service('mixpanelService', function($http) {
		// AngularJS will instantiate a singleton by calling "new" on this function

		return {

			// getFromMixPanelEntity: function(UDID) {
			// 	var result = {};
			// 	result.UDID = UDID;
			// 	return result;
			// },

			getFromMixPanel: function(UDID) {
				var request = {};
				request.opcode = "getFromMixPanelRequest";
				request.udid = UDID;

				// var url = '192.168.0.75:9000/api/messages/';
				// Simple POST request example (passing data) :


				// return $http.post({
				// 	url: url,
				// 	withCredentials: true
				// }, request);

				// var http=require('http');

				// var options = {
				//   hostname: 'http://192.168.0.75',
				//   port: 9000,
				//   path: '/api/messages/',
				//   method: 'POST',
				//   headers: {
				//     'Content-Type': 'application/x-www-form-urlencoded'
				// 'Content-Length': postData.length
				//   }
				// };
				// var req = http.request(options, function(res) {
				//  console.log(res);
				// });

				// var mixPanelPromise = $http({
				// 	method: 'POST',
				// 	url:'http://192.168.0.75:9000/api/messages/',
				// 	data: request

				// });
				// return mixPanelPromise;



				// return $http.post({
				// 	url: 'http://192.168.0.75:9000/api/messages/',
				// 	withCredentials: true
				// }, {
				// 	name : "Nasri"
				// });



				var mixPanelPromise = $http({
					method: 'POST',
					url: 'http://192.168.0.75:9000/api/messages/',
					data: request
				});
				return mixPanelPromise;

			}


		};

	});