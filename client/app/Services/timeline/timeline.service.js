'use strict';

angular.module('internsApp')
    .service('timeline', function($http) {
        return {
            getLogs: function() {
                return $http({
                    method: 'GET',
                    url: '/api/callLogs/timeline'
                });
            },
            searchLogs: function(id) {
                return $http({
                    method: 'GET',
                    url: '/api/callLogs/search/' + id
                });
            },
            searchByDate: function(startDate, endDate) {
                var request = {};
                request.startDate;
                request.endDate;
                if (request.endDate == request.startDate)

                    request.endDate = (moment(request.endDate).add(1, 'days')).format('YYYY-MM-DD');
                console.log(request.endDate);

                var searchResultPromise = $http({
                    method: 'GET',
                    url: '/api/callLogs/searchByDate/' + startDate.format('YYYY-MM-DD') + '/' + endDate.format('YYYY-MM-DD'),
                    data: request
                });

                return searchResultPromise;

            }

        }

    });
