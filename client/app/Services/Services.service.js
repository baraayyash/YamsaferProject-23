'use strict';

angular.module('internsApp')
	.service('Services', function($http) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return {

			getCustomers: function() {
				var request = {};
				var customersPromise = $http({
					method: 'GET',
					url: 'http://www.w3schools.com/angular/customers.php',
					data: request
				});
				return customersPromise;
			},

			getSingleCustomer: function(custId) {
				var request = {};
				request.custId = custId;
				var singleCustomerPromise = $http({
					method: 'GET',
					url: 'http://www.w3schools.com/angular/customers.php',
					data: request
				});
				return singleCustomerPromise;
			},


			// update customer service


			// updateCustomer:function(custId, name, ...){
			// 	var result={};
			// 	result.custId=custId;
			// 	//all the updated fields
			// 	return result;

			// },

			// update a customer Request Service


			// updateCustomerRequest: function(updatedCustomer) {
			// 	var request = {};
			// 	request.updatedCustomer = updatedCustomer;
			// 	var updatedCustomerPromise = $http({
			// 		method:'POST',
			// 		url:'...',
			// 		data:request
			// 	});
			// 	return updatedCustomerPromise;
			// },



			// delete a customer 


			// deleteCustomerRequest: function(custId) {
			// 	var request = {};
			// 	request.custId = custId;
			// 	var deletedCustomerPromise = $http({
			// 		method: 'POST',
			// 		url: '...',
			// 		data: request

			// 	});
			// 	return deletedCustomerPromise;
			// }
			// },



		}

	});