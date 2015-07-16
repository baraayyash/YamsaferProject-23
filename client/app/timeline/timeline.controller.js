'use strict';

angular.module('internsApp')
    .controller('TimelineCtrl', function($scope, timeline) {

        $scope.logs = [];
        $scope.getLogs = getLogs;
        $scope.searchLogs = searchLogs;
        $scope.searchByDate = searchByDate;

        var socket = io.connect('localhost:9000');
        socket.on('timeline', onTimline);

        // Invoke get logs
        $scope.getLogs();

        function getLogs() {

            var onGetLogsSuccess = function(data) {
                $scope.logs = data.data;
            }

            var onGetLogsFail = function(status) {
                swal({
                    title: 'Error!',
                    text: 'Something went wrong, contact Sameh Alfar',
                    type: 'error'
                });
            }

            timeline.getLogs()
                .then(onGetLogsSuccess, onGetLogsFail);

        }

        function searchLogs(query) {
            timeline.searchLogs(query).then(function(d) {
                    console.log(d);
                    $scope.logs = d.data;
                    console.log($scope.logs);
                }),
                function() {
                    swal({
                        title: 'Error!',
                        text: 'Something went wrong, contact Sameh Alfar',
                        type: 'error'
                    });
                }
        }

        function searchByDate() {
            var logResultPromise = timeline.searchByDate($scope.date.startDate, $scope.date.endDate);
            logResultPromise.then(function(d) {
                    console.log(d);
                    $scope.logs = d.data;
                    console.log($scope.logs);
                }),
                function() {
                    onError();
                }
        }

        function onTimline(obj) {
            $scope.logs.pop();
            $scope.logs.unshift(object);
            $scope.$apply();
        }

        function onError(type, msg) {
            swal({
                title: 'Error!',
                text: msg || 'Something went wrong, contact Sameh Alfar',
                type: type || 'error'
            });
        }

    });
