'use strict';

angular.module('internsApp').controller('FindByUDIDCtrlCtrl', function($rootScope, $scope, mixpanelService) {

          
        $scope.bringFromMixPanel=function(UDID) {

           // var searchEntity = mixpanelService.getFromMixPanelEntity(UDID);

            var searchPromise = mixpanelService.getFromMixPanel(UDID);

            searchPromise.then(function (d) {

                console.log(d);
                $scope.result = d.data;


            });
      }
 
 
     }); 
