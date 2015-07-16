'use strict';

angular.module('internsApp')
	.controller('SingleCustomerCtrl', function($scope, singleCustomer, CustomerServices, $stateParams) {

		$scope.custId = $stateParams.id;

		$scope.date = [];
		$scope.obj = {
			time: undefined,
			date: undefined
		};



		$scope.getCustomerData = function() {


			var customerDataPromise = singleCustomer.getData($scope.custId);
			customerDataPromise.then(function(d) {
					console.log(d.data);
					$scope.customerData = d.data;
					$scope.noTransactions = $scope.customerData.transactions.length;
					$scope.nocallLogs = $scope.customerData.callLogs.length;

					for (var i = 0; i < $scope.nocallLogs; i++) {
						$scope.obj.time = moment($scope.customerData.callLogs[i].date).format(' h:mm:ss a');
						$scope.obj.date = moment($scope.customerData.callLogs[i].date).format("MM-DD-YYYY");
						$scope.date.push($scope.obj);
					}
					console.log($scope.date);
					if ($scope.customerData.blocked == true) {
						$scope.block = 1;
						$scope.blocked = 'Blocked';

					} else {
						$scope.block = 0;
						$scope.blocked = 'Unblocked';
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


		$scope.pageScrolls = 1;
		$scope.loadMoreCustomerLogs = function() {
			//alert("load");

			$scope.show = 1;
			//$("html, body").animate({ scrollTop: $(document).height() }, 1000);

			alert($scope.custId);
			$scope.pageScrolls = $scope.pageScrolls + 1;

			var logsPromise = singleCustomer.getLogsByPageNumber($scope.pageScrolls, $scope.custId);

			logsPromise.then(function(d) {
				console.log(d);
				// $scope.show = 0;
				$scope.pageScrolls = $scope.pageScrolls + 1;
				//alert($scope.pageScrolls);
				$scope.logs = $scope.logs.concat(d.data);

				//$(window).bind('scroll', bindScroll);

			}, function(d) {
				swal({
					title: "Error!",
					text: "Something went wrong, Connect Sameh Alfar",
					type: "error"
				});
			});
		};


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