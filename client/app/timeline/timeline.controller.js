'use strict';

angular.module('callLogsApp')
	.controller('TimelineCtrl', function($scope, timeline) {



		$scope.getLogs = function() {


			$scope.logs = [];

			var getLogsPromise = timeline.getLogsRequest();
			getLogsPromise.then(function(d) {

					console.log(d);
					$scope.logs = d.data;
					console.log($scope.logs);

				}),
				function() {
					swal({
						title: "Error!",
						text: "Something went wrong, contact Sameh Alfar",
						type: "error"
					});
				}

		}

		$scope.getLogs();

	
		
		

	});