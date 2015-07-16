'use strict';

angular.module('internsApp')
	.config(function($stateProvider) {
		$stateProvider
			.state('findByUDIDCtrl', {
				url: '/findByUDIDCtrl',
				templateUrl: 'app/findByUDIDCtrl/findByUDIDCtrl.html',
				controller: 'FindByUDIDCtrlCtrl'
			});
	});