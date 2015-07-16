'use strict';

angular.module('internsApp')
	.service('singleCustomer', function($http) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return {

			// getLogsByPageNumber: function(pageScrolls, custId) {
			// 	var request = {};
			// 	request.pageScrolls = pageScrolls;
			// 	request.custId = custId;

			// 	var getLogsByPageNumberPromise = $http({
			// 		method: "GET",
			// 		data: request
			// 			// url:"..."
			// 	});
			// 	return getLogsByPageNumberPromise;

			// },


			getData: function(custID) {
				var request = {};
				request.custID = custID;

				var getDataPromise = $http({
					method: 'GET',
					url: 'http://192.168.0.117:9000/api/customers/' + custID,
					data: request
				});

				return getDataPromise;
			}
		}



	});