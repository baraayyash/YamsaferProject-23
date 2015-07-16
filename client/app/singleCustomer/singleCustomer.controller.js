'use strict';

angular.module('internsApp')
	.controller('SingleCustomerCtrl', function($scope, singleCustomer, CustomerServices, $stateParams) {

		$scope.custId = $stateParams.id;
		$scope.city = {};
		$scope.center = {};
		$scope.transactionsType = {};
		$scope.cancelledTransactions = [];
		$scope.noShowTransactions = [];
		$scope.doneTransactions = [];
		$scope.allTransactions=[];

		$scope.getCustomerData = function() {

			var customerDataPromise = singleCustomer.getData($scope.custId);
			customerDataPromise.then(function(d) {
					console.log(d.data);
					$scope.customerData = d.data;
					$scope.transactions = $scope.customerData.transactions;
					$scope.noTransactions = $scope.customerData.transactions.length;
					$scope.nocallLogs = $scope.customerData.callLogs.length;
					$scope.callLogs = d.data.callLogs;
					$scope.allTransactions = $scope.customerData.transactions;

					

					if ($scope.customerData.blocked == true) {
						$scope.block = 1;
						$scope.blocked = 'Blocked';
					} else {
						$scope.block = 0;
						$scope.blocked = 'Unblocked';
					}

					var local_icons = {
						defaultIcon: {},
						fromicon: {
							iconUrl: '../assets/images/from.png',
							iconSize: [45, 45],
							iconAnchor: [12, 12],
							popupAnchor: [0, 0]
						},
						toicon: {
							iconUrl: '../assets/images/to.png',
							iconSize: [45, 45],
							iconAnchor: [12, 12],
							popupAnchor: [0, 0]
						}
					}

					$scope.center = {
						lat: 15.505,
						lng: 20.09,
						zoom: 3
					}

					$scope.city[$scope.customerData.region] = {
						lat: $scope.customerData.cityLng,
						lng: $scope.customerData.cityLat,
						message: $scope.customerData.region,
						focus: true,
						draggable: false,
						icon: local_icons.fromicon

					}

					for (var i = 0; i < $scope.noTransactions; i++) {
						if ($scope.transactions[i].cancelled == 1){
							$scope.transactions[i].status="Cancelled";
							$scope.cancelledTransactions.push($scope.transactions[i]);
							}
						else if ($scope.transactions[i].no_show == 1){
							$scope.transactions[i].status="No show";
							$scope.noShowTransactions.push($scope.transactions[i]);
						}
							
						else{
							$scope.transactions[i].status="Consumed";
							$scope.doneTransactions.push($scope.transactions[i]);
						}
							


						$scope.city[$scope.customerData.transactions[i].Hotel.replace('-', ' ')] = {
							lat: $scope.customerData.transactions[i].lat,

							lng: $scope.customerData.transactions[i].lng,
							message: $scope.customerData.transactions[i].Hotel,
							focus: true,
							draggable: false,
							icon: local_icons.toicon

						}
					}

				},
				function(d) {
					swal({
						title: "Error!",
						text: "Something went wrong, Connect Sameh Alfar",
						type: "error"
					});
				});
		};

		$scope.getCustomerData();

		$scope.blockCustomer = function(item, blocked) {

			swal({
					title: "Are you sure?",
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
							.blockCustomerRequest($scope.custId, blocked).then(function(d) {
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

		$scope.getCancelledTransactions=function(){
			$scope.transactions=$scope.cancelledTransactions;
			$scope.noTransactions=$scope.cancelledTransactions.length;

		}
		$scope.getAllTransactions=function(){
			$scope.transactions=$scope.allTransactions;
			$scope.noTransactions=$scope.allTransactions.length;

		}
		$scope.getNoShowTransactions=function(){
			$scope.transactions=$scope.noShowTransactions;
			$scope.noTransactions=$scope.noShowTransactions.length;

		}
		$scope.getDoneTransactions=function(){
			$scope.transactions=$scope.doneTransactions;
			$scope.noTransactions=$scope.doneTransactions.length;

		}

		$scope.deleteCustomer = function() {
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
						var deletedCustomerPromise = CustomerServices.deleteCustomerRequest($scope.custId);



						deletedCustomerPromise.then(function(d) {
							console.log(d);
						});

					} else {
						swal("Cancelled", "Your customer is safe.", "error");
					}
				});
		}
	});