'use strict';


angular.module('internsApp')
	.controller('CustomersCtrl', function($scope, CustomerServices, $rootScope) {
		// $('#editUser').hide();
		$scope.show = 0;
		//Declaring variables 

		// $scope.pageNumber = 1;
		// $scope.elementsPerPage = 3;
		// //finding the indexes of the data will be displayed
		// var index = function() {
		// 	$scope.fromIndex = ($scope.pageNumber * $scope.elementsPerPage) - ($scope.elementsPerPage);
		// 	$scope.toIndex = ($scope.pageNumber * $scope.elementsPerPage) - 1;
		// }

		// index();



		$scope.getCustomers = function() {
			$scope.customers = [];
			var customersPromise = CustomerServices.getCustomers();
			customersPromise.then(function(d) {

				console.log(d);

				$scope.customers = d.data;
				console.log($scope.customers);
				// console.log($scope.customers[2].id);

				// console.log($scope.customers.length);
				// $scope.results = $scope.customers.results;


				// $scope.count = $scope.results.length;
				// $scope.lastPage = $scope.count / $scope.elementsPerPage;
				// console.log($scope.count);
				// console.log($scope.toIndex);
				// console.log($scope.fromIndex);
				// console.log($scope.lastPage);

			})
		}
		$scope.getCustomers();



		//increase the page number when clicking on Next button
		// $scope.increase = function() {
		// 	$scope.pageNumber += 1;
		// 	index();
		// }

		//Decrease the page number when clicking on Previous button

		// $scope.decrease = function() {
		// 	$scope.pageNumber -= 1;
		// 	index();
		// }

		//checking if it is the last page or not; to determin if the previous button should be appear or not
		// $scope.check = function() {

		// 	index();
		// 	if ($scope.pageNumber == $scope.lastPage)
		// 		return 1;
		// 	else
		// 		return 0;
		// }



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
			// ng-hide ng-show ng-if ng-animateion
		}

		// Save changing after updating
		$scope.saveChanges = function(name, email, country) {
			$scope.show = 0;

			var updatedCustomerPromise = CustomerServices.updateCustomerRequest($scope.custId, name, email, country);
			updatedCustomerPromise.then(function(d) {
				console.log(d);
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
			// console.log(item,id,blocked);
			// item.blocked = !item.blocked;
			// var blockedCustomer = CustomerServices.blockCustomer(id, blocked);

		}


		
	});