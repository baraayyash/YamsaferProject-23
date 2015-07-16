'use strict';


angular.module('internsApp')
	.controller('CustomersCtrl', function($scope, CustomerServices, $rootScope) {

		$scope.show = 0;

		//display all customers
		$scope.getCustomers = function() {
			$scope.customers = [];
			var customersPromise = CustomerServices.getCustomers();
			customersPromise.then(function(d) {

				console.log(d);

				$scope.customers = d.data;
				console.log($scope.customers);

			})
		}
		$scope.getCustomers();


		// Delete customer
		$scope.deleteCustomer = function(custId) {
			swal({
					title: "Are you sure?",
					text: "You will not be able to see this customer any more!",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, delete it!",
					cancelButtonText: "No, cancel please!",
					closeOnConfirm: false,
					closeOnCancel: false
				},
				function(isConfirm) {
					if (isConfirm) {
						swal("Deleted!", "Your customer has been deleted.", "success");
						var deletedCustomerPromise = CustomerServices.deleteCustomerRequest(custId);

						for (var i = 0; i < $scope.customers.length; i++) {
							if ($scope.customers[i]._id == custId) {
								$scope.customers.splice(i, 1);
								break;
							}
						}


						deletedCustomerPromise.then(function(d) {
							console.log(d);
						});

					} else {
						swal("Cancelled", "Your customer is safe.", "error");
					}
				});
		}

		// Show modal of Updating Customer's Data
		$scope.updateCustomer = function(id) {
			$scope.show = 1;
			$scope.custId = id;
			for (var i = 0; i < $scope.customers.length; i++) {
					if ($scope.customers[i]._id == $scope.custId) {
						$scope.editedName=$scope.customers[i].name;
			$scope.editedCountry=$scope.customers[i].country_code;
			$scope.editedEmail=$scope.customers[i].email;
					}
				}
			

		}

		// Save changing after updating
		$scope.saveChanges = function(name, email, country) {
			$scope.show = 0;

			var updatedCustomerPromise = CustomerServices.updateCustomerRequest($scope.custId, name, email, country);
			updatedCustomerPromise.then(function(d) {
				console.log(d);
				for (var i = 0; i < $scope.customers.length; i++) {
					if ($scope.customers[i]._id == $scope.custId) {
						$scope.customers[i].name = name;
						$scope.customers[i].email = email;
						$scope.customers[i].country_code = country;
					}
				}
			});

		}
		$scope.cancelUpdating = function() {
			$scope.show = 0;
		}

		$scope.changeOrder = function(orderBy) {
			$scope.orderBy = orderBy;
		}

		$scope.blockCustomer = function(item, id, blocked) {
			swal({
					title: "Are you sure?",
					// text: "Customer will not be able to contact you!",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes!",
					cancelButtonText: "No, cancel please!",
					closeOnConfirm: false,
					closeOnCancel: false
				},
				function(isConfirm) {
					if (isConfirm) {
						swal("success");
						CustomerServices
							.blockCustomerRequest(id, blocked).then(function(d) {
								if (d.status == 200) {
									item.blocked = d.config.data.blocked;
								} else {
									alert("Something went wrong, contact Sameh Alfar");
								}
							})


					} else {
						swal("Cancelled");
					}
				});

		}



	});