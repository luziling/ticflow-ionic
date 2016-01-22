angular.module('ticflow.controllers')

.controller('CheckedCtrl', function ($rootScope, $scope, API, $window, $filter) {

    $scope.select = {
        saler: "",
        engineer: "",
    };

    $scope.$on('$ionicView.beforeEnter', function () {

        $scope.isManager = (API.getRole() == 'manager');

        API.getUsers({role: 'saler'})
            .success(function (salers) {
                $scope.salers = salers;
            })
            .error(function () {
                $rootScope.notify("获取销售人员列表失败！请检查您的网络！");
            });

        API.getUsers({role: 'engineer'})
            .success(function (engineers) {
                $scope.engineers = engineers;
            })
            .error(function () {
                $rootScope.notify("获取工程师列表失败！请检查您的网络！");
            });

        $scope.loadChecked();
    });

    $scope.loadChecked = function () {
        $scope.isEngineer = (API.getRole() == 'engineer');

        var query = {checked: true};
        if (API.getRole() == 'saler')
            query.saler = API.getId();
        else if (API.getRole() == 'engineer')
            query.engineer = API.getId();
        else if ($scope.isManager) {
            if ($scope.select.saler !== "")
                query.saler = $scope.select.saler;
            if ($scope.select.engineer !== "")
                query.engineer = $scope.select.engineer;
        }

        $scope.totalValue = 0;

        //console.log(JSON.stringify(query));

        API.getLists(query)
            .success(function (listsChecked) {
                $scope.noData = false;
                if (listsChecked.length === 0)
                    $scope.noData = true;
                $scope.listsChecked = listsChecked;
                $scope.listsChecked.forEach(function (entry) {
                    entry.date = $filter('date')(entry.date, "yyyy/MM/dd HH:mm");
                    $scope.totalValue += entry.value;
                });
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadChecked();
    };
});