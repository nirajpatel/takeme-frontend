// app.js
// create our angular app and inject ngAnimate, ui-router, and ngResource
// =============================================================================
angular.module('tripForm', ['ngAnimate', 'ui.router', 'ngResource'])

// configuring routes 
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {
	
	$stateProvider
	
		// route to show our basic form (/form)
		.state('form', {
			url: '/form',
			templateUrl: 'form.html',
			controller: 'formController'
		})
		
		// nested states 
		// each of these sections will have their own view
		// url will be nested (/form/profile)
		.state('form.start', {
			url: '/start',
			templateUrl: 'form-start.html'
		})

		// url will be /form/destination
		.state('form.origin', {
			url: '/origin',
			templateUrl: 'form-origin.html'
		})
		
		// url will be /form/destination
		.state('form.destination', {
			url: '/destination',
			templateUrl: 'form-destination.html'
		})
		
		// url will be /form/result
		.state('form.result', {
			url: '/result',
			templateUrl: 'form-result.html'
		});
		
	// catch all route
	// send users to the start page 
	$urlRouterProvider.otherwise('/form/start');
})

// Factories
// =============================================================================
.factory('UserLocation', function($resource) {
	return {
		query: function(_latitude, _longitude) {
			return $resource('http://localhost:8080/location/origin/getlocation', {}, {
				query: {method: 'GET', params: {latitude:_latitude, longitude:_longitude}, isArray: false}});
		}
	}
})

.factory('Result', function($resource) {
	return {
		query: function(_origin, _destination, _mode, _time) {
			return $resource('http://localhost:8080/trips/itineraries/gettrip', {}, {
				query: {method: 'GET', params: {origin: _origin, destination: _destination, mode: _mode, time: _time}, isArray: false}});
		}
	}
})

// Form controller
// =============================================================================
.controller('formController', ['$scope', 'UserLocation', 'Result', function($scope, UserLocation, Result) {
	
	$scope.error = "";
	//form data store
	$scope.formData = {};
	//location data store
	$scope.locationData = {};
	//result data store
	$scope.resultData = {};

	$scope.latitude = "";
	$scope.longitude = "";

	//get location based on latitude longitude
	$scope.getLocation = function() {
		UserLocation.query($scope.latitude, $scope.longitude).query(function(response) {
			$scope.saveLocation(response);
		})
	}

	//save location response from api in formData object
	$scope.saveLocation = function(response) {
		$scope.locationData.origin = response;

		$scope.formData.originAddress = ($scope.locationData.origin.address === undefined) ? "" : $scope.locationData.origin.address;
		$scope.formData.originCity = ($scope.locationData.origin.city === undefined) ? "" : $scope.locationData.origin.city;
		$scope.formData.originState = ($scope.locationData.origin.state === undefined) ? "" : $scope.locationData.origin.state;
		$scope.formData.originZipcode = ($scope.locationData.origin.zipcode === undefined) ? "" : $scope.locationData.origin.zipcode;

		$scope.formData.originFull = $scope.formData.originAddress + ', ' + $scope.formData.originCity +
			', ' + $scope.formData.originState + ', ' + $scope.formData.originZipcode;
	}

	//get result based on origin and destination data sent to api
	$scope.getResult = function() {
		$scope.formData.destinationAddress = ($scope.formData.destinationAddress === undefined) ? "" : $scope.formData.destinationAddress;
		$scope.formData.destinationCity = ($scope.formData.destinationCity === undefined) ? "" : $scope.formData.destinationCity;
		$scope.formData.destinationState = ($scope.formData.destinationState === undefined) ? "" : $scope.formData.destinationState;
		$scope.formData.destinationZipcode = ($scope.formData.destinationZipcode === undefined) ? "" : $scope.formData.destinationZipcode;

		$scope.formData.destinationFull = $scope.formData.destinationAddress + ', ' + $scope.formData.destinationCity +
			', ' + $scope.formData.destinationState + ', ' + $scope.formData.destinationZipcode;

		//public transportation
		var mode = 'transit';
		//get current time from January 1, 1970 in seconds. give 10 minute leeway
		var time = Math.round((new Date().getTime()) / 1000) + 600;
		Result.query($scope.formData.originFull, $scope.formData.destinationFull, mode, time).query(function(response) {
			$scope.saveResult(response);
		})
	}

	//save trip response from api in formData object
	$scope.saveResult = function(response) {
		$scope.resultData.itinerary = response;

		$scope.formData.arrivalTime = ($scope.resultData.itinerary.arrivalTime === undefined) ? "" : $scope.resultData.itinerary.arrivalTime;
		$scope.formData.departureTime = ($scope.resultData.itinerary.departureTime === undefined) ? "" : $scope.resultData.itinerary.departureTime;
		$scope.formData.duration = ($scope.resultData.itinerary.duration === undefined) ? "" : $scope.resultData.itinerary.duration;
		$scope.formData.distance = ($scope.resultData.itinerary.distance === undefined) ? "" : $scope.resultData.itinerary.distance;
		$scope.formData.startAddress = ($scope.resultData.itinerary.startAddress === undefined) ? "" : $scope.resultData.itinerary.startAddress;
		$scope.formData.endAddress = ($scope.resultData.itinerary.endAddress === undefined) ? "" : $scope.resultData.itinerary.endAddress;
	}

	//function that returns boolean if result exists
	$scope.resultExists = function() {
		return ($scope.formData.departureTime === "" || $scope.formData.departureTime === undefined) ? false : true;
	}

	$scope.showResult = function() {
		return $scope.error == "";
	}

	//get userlocation based on latitude longitude
	$scope.getOrigin = function() {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition($scope.saveOrigin, $scope.showError);
		} else {
			$scope.error = "Geolocation is not supported by this browser.";
		}
	}

	//save user latitude longitude to variables and get location
	$scope.saveOrigin = function(position) {
		$scope.latitude = position.coords.latitude;
		$scope.longitude = position.coords.longitude;
		$scope.$apply();

		$scope.getLocation();
	}

	//location errors
	$scope.showError = function(error) {
		switch(error.code) {
			case error.PERMISSION_DENIED:
				$scope.error = "User denied request for geolocation."
				break;
			case error.POSITION_UNAVAILABLE:
				$scope.error = "Location information is unavailable."
				break;
			case error.TIMEOUT:
				$scope.error = "The request to get user location timed out."
				break;
			case error.UNKNOWN_ERROR:
				$scope.error = "An unknown error occurred."
				break;
		}
		$scope.$apply();
	}
	
	//clear data on form reset
	$scope.clear = function() {
		$scope.formData = {};
		$scope.locationData = {};
		$scope.resultData = {};
	}
	
}]);
