'use strict';

// Admins controller
angular.module('admin')
	.controller('AdminUsersListController', ['$scope', '$filter', '$state', 'Admin',
		function($scope, $filter, $state, Admin) {
			// Find a list of Users
			$scope.find = function() {
				Admin.query({type: 'users'}, function (data) {
					$scope.users = data;
					$scope.buildPager();
				});

			};

			$scope.find();

			$scope.buildPager = function () {
				$scope.pagedItems = [];
				$scope.itemsPerPage = 2;
				$scope.currentPage = 1;
				$scope.figureOutItemsToDisplay();
			};

			$scope.figureOutItemsToDisplay = function () {
				$scope.filteredItems = $filter('filter')($scope.users, { $: $scope.search});
				$scope.filterLength = $scope.filteredItems.length;
				var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
				var end = begin + $scope.itemsPerPage;
				$scope.pagedItems = $scope.filteredItems.slice(begin, end);
			};

			$scope.pageChanged = function() {
				$scope.figureOutItemsToDisplay();
			};

		}
	])
	.controller('AdminUsersViewController', ['$scope', '$state', 'Admin',
		function($scope, $state, Admin) {
			if (!$scope.user) {
				$state.go('admin-users.list');
			}

			// Remove existing Admin
			$scope.remove = function(admin) {
				if (confirm('Are you sure you want to Delete?')) {
					Admin.delete({type: 'users', id: $scope.user._id}, $scope.user, function (data) {
						$scope.users.splice($scope.users.indexOf($scope.user), 1);
						$scope.user = {};
						$state.go('admin-users.list');
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}
			};
		}
	])
	.controller('AdminUsersEditController', ['$scope', '$state', 'Admin',
		function($scope, $state, Admin) {

		//Redirect if user is not set.
		if (!$scope.user) {
			$state.go('admin-users.list');
		}

		// Update existing Admin
		$scope.update = function() {

			Admin.update({type: 'users', id: $scope.user._id}, $scope.user, function (data) {
				$state.go('admin-users.view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

		};

		$scope.toggleRole = function (role) {
			if ($scope.user.roles.indexOf(role) === -1) {
				$scope.user.roles.push(role);
			}
			else {
				$scope.user.roles.splice($scope.user.roles.indexOf(role), 1);
			}
		};

	}])
	.controller('AdminUsersController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Admin',
	function($scope, $state, $stateParams, $location, Authentication, Admin) {
		//Redirect if not sub route
		if ($state.current.name === 'admin-users') {
			$state.go('admin-users.list');
		}

		//Redirect if not Admin
		if(!Authentication.isAdmin()) {
			$state.go('home');
		}

		$scope.users = [];
		$scope.user = undefined;
		$scope.authentication = Authentication;


		$scope.setUser = function (user) {
			$scope.user = user;
		};

		// Find existing Admin
		$scope.findOne = function() {
			$scope.user = Admin.get({
				type: 'users',
				id: $stateParams.userId
			});
		};
	}
]);
