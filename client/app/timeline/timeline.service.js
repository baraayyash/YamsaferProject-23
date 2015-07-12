'use strict';

angular.module('callLogsApp')
	.service('timeline', function($http) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return {
			getLogsRequest: function() {
				var logsPromise = $http({
					method: 'GET',
					url: 'http://192.168.0.75:9000/api/callLogs/timeline'
				});
				return logsPromise;
			},
			
		
		}

	});