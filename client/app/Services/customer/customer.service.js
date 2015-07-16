'use strict';

angular.module('internsApp')
	.service('CustomerServices', function($http) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return {

			getCustomers: function() {
				var request = {};
				var customersPromise = $http({
					method: 'GET',
					url: 'http://192.168.0.117:9000/api/customers/',
					data: request
				});
				return customersPromise;
			},

			getSingleCustomer: function(custId) {
				var request = {};
				request.custId = custId;
				var singleCustomerPromise = $http({
					method: 'GET',
					url: 'http://192.168.0.117:9000/api/customers/',
					data: request
				});
				return singleCustomerPromise;
			},


			// update a customer Request Service


			updateCustomerRequest: function(custId, name, email, country) {
				var request = {};
				request._id = custId;
				request.name = name;
				request.email = email;
				request.country_code = country;
				// request.updatedCustomer = updatedCustomer;

				var updatedCustomerPromise = $http({
					method: 'PATCH',
					url: 'http://192.168.0.117:9000/api/customers/' + custId,
					data: request
				});

				return updatedCustomerPromise;
			},



			// delete a customer 


			deleteCustomerRequest: function(custId) {
				var request = {};
				request.id = custId;
				var deletedCustomerPromise = $http({
					method: 'Delete',
					url: 'http://192.168.0.117:9000/api/customers/' + request.id,
					data: request

				});
				return deletedCustomerPromise;
			},


			//block customer
			blockCustomerRequest: function(id, blocked) {

				var request = {};
				request.id = id;
				request.blocked = !blocked;

				var blockedCustomerPromise = $http({
					method: 'POST',
					url: 'http://192.168.0.117:9000/api/customers/block/',
					data: request

				});
				return blockedCustomerPromise;

			}


			// getLogsByPageNumber: function(){

			// return 3;


			// }
		}



	});