(function() {

	var paths = {
		'default': 'home',
		'location': 'view',
		'share': 'share'
	};

	var els = {
		content: document.querySelector('#content')
	};

	var routes = {
		home: function() {
			var source = document.querySelector('#start-template').innerHTML,
				template = Handlebars.compile(source);
			els.content.innerHTML = template();

		function initialize() {
			var mapOptions = {
				zoom: 15
			};
			map = new google.maps.Map(document.querySelector('#map'),
				mapOptions);

			// Try HTML5 geolocation
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					// users location
					var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
					// Croydon Creatives Location
					var ccLoc = new google.maps.LatLng(51.3724092,-0.1014937);

					var marker = new google.maps.Marker({
						position: pos,
						map: map,
						title: 'Found you!'
					});
					var ccMarker = new google.maps.Marker({
						position: ccLoc,
						map: map,
						icon: "img/cc_drop.png",
						title: 'CroydonCreatives'
					});

					map.setCenter(pos);
				}, function() {
					handleNoGeolocation(true);
				});
			} else {
				// Browser doesn't support Geolocation
				handleNoGeolocation(false);
			}

			window.directionsDisplay = new google.maps.DirectionsRenderer();
			var them = new google.maps.LatLng(51.3724092,-0.1014937);
			var mapOptions = {
				zoom: 15,
				center: them
			};
			window.map = new google.maps.Map(document.getElementById('map'), mapOptions);
			window.marker = new google.maps.Marker({
				position: them,
				map: window.map,
				title: 'Your friend!'
			});
			window.directionsDisplay.setMap(window.map);
		}


		function handleNoGeolocation(errorFlag) {
			var content = (errorFlag) ? 'Maybe next time, yeah?' : 'Error: Your browser doesn\'t support geolocation.',
				options = {
					map: map,
					position: new google.maps.LatLng(60, 105),
					content: content
				},
				infowindow = new google.maps.InfoWindow(options);

			map.setCenter(options.position);
		}


		function calcRoute() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var pos = new google.maps.LatLng(position.coords.latitude,
					position.coords.longitude);
					var $ccLoc = new google.maps.LatLng(51.3724092,-0.1014937);

					var start = pos;
					var end = $ccLoc;
					var request = {
						origin: start,
						destination: end,
						travelMode: google.maps.TravelMode.WALKING
					};
					window.directionsService = new google.maps.DirectionsService();

					window.directionsService.route(request, function(response, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							window.directionsDisplay.setDirections(response);
							window.marker.setMap(null);
						}
					});
				});
			}
		}

		setTimeout(initialize, 750);
		calcRoute();
	},

		share: function() {

			var source = document.querySelector('#share-template').innerHTML,
				template = Handlebars.compile(source),
				map;
			els.content.innerHTML = template();

			document.querySelector('#addMapUser').addEventListener('click', function(e) {
				e.preventDefault();
				calcRoute();
				this.setAttribute('hidden', true);
			});

			function initialize() {
				var mapOptions = {
					zoom: 15
				};
				map = new google.maps.Map(document.querySelector('#map'),
					mapOptions);

				// Try HTML5 geolocation
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						// users location
						var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
						// Croydon Creatives Location
						var ccLoc = new google.maps.LatLng(51.3724092,-0.1014937);

						processLinks(position.coords);

						var marker = new google.maps.Marker({
							position: pos,
							map: map,
							title: 'Found you!'
						});

						map.setCenter(pos);
					}, function() {
						handleNoGeolocation(true);
					});
				} else {
					// Browser doesn't support Geolocation
					handleNoGeolocation(false);
				}
			}

			function handleNoGeolocation(errorFlag) {
				var content = (errorFlag) ? 'Maybe next time, yeah?' : 'Error: Your browser doesn\'t support geolocation.',
					options = {
						map: map,
						position: new google.maps.LatLng(60, 105),
						content: content
					},
					infowindow = new google.maps.InfoWindow(options);

				map.setCenter(options.position);
			}

			setTimeout(initialize, 750);
		},

		view: function() {

			var source = document.querySelector('#view-template').innerHTML,
				template = Handlebars.compile(source);
			els.content.innerHTML = template();

			document.querySelector('#addMapUser').addEventListener('click', function(e) {
				e.preventDefault();
				calcRoute();
				this.setAttribute('hidden', true);
			});

			var path = window.location.hash.slice(1),
				data = JSON.parse(decodeURIComponent(path.split('=')[1]));

			window.directionsService = new google.maps.DirectionsService();

			function initialize() {
				window.directionsDisplay = new google.maps.DirectionsRenderer();
				var them = new google.maps.LatLng(data.latitude, data.longitude);
				var mapOptions = {
					zoom: 15,
					center: them
				};
				window.map = new google.maps.Map(document.getElementById('map'), mapOptions);
				window.marker = new google.maps.Marker({
					position: them,
					map: window.map,
					title: 'Your friend!'
				});
				window.directionsDisplay.setMap(window.map);
			}

			function calcRoute() {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						var pos = new google.maps.LatLng(position.coords.latitude,
							position.coords.longitude);
						var ccLoc = new google.maps.LatLng(51.3724092,-0.1014937);

						var start = pos;
						var end = ccLoc;
						var request = {
							origin: start,
							destination: end,
							travelMode: google.maps.TravelMode.WALKING
						};
						window.directionsService.route(request, function(response, status) {
							if (status == google.maps.DirectionsStatus.OK) {
								window.directionsDisplay.setDirections(response);
								window.marker.setMap(null);
							}
						});
					});
				}
			}
			initialize();
			calcRoute();
		}
	};

	var router = (function() {
		return {
			init: function() {
				var path = window.location.hash.slice(1);
				if (path === '' || path === '#') {
					routes[paths['default']]();
				} else if (path.match(/location/i)) {
					routes[paths.location]();
				} else {
					routes[paths[path]]();
				}
			}
		};
	})();

	router.init();

	window.addEventListener('hashchange', router.init);

})();
