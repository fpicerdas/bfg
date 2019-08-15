angular.module("batam_fiber_glass", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","batam_fiber_glass.controllers", "batam_fiber_glass.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "BatamFiberGlass" ;
		$rootScope.appLogo = "data/images/background/logo(2).png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = true ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_menu = false ;
		$rootScope.hide_menu_dashboard = false ;
		$rootScope.hide_menu_about_us = false ;
		$rootScope.hide_menu_profile = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "batam_fiber_glass",
				storeName : "batam_fiber_glass",
				description : "The offline datastore for Batam Fiber Glass app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}


			//required: cordova plugin add onesignal-cordova-plugin --save
			if(window.plugins && window.plugins.OneSignal){
				window.plugins.OneSignal.enableNotificationsWhenActive(true);
				var notificationOpenedCallback = function(jsonData){
					try {
						$timeout(function(){
							$window.location = "#/batam_fiber_glass/" + jsonData.notification.payload.additionalData.page ;
						},200);
					} catch(e){
						console.log("onesignal:" + e);
					}
				}
				window.plugins.OneSignal.startInit("95a516ed-2cc5-44dc-a307-898e4705417c").handleNotificationOpened(notificationOpenedCallback).endInit();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("batam_fiber_glass.dashboard");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en-us");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en-us");
})



.config(function($stateProvider,$urlRouterProvider,$sceDelegateProvider,$ionicConfigProvider,$httpProvider){
	/** tabs position **/
	$ionicConfigProvider.tabs.position("bottom"); 
	try{
	// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("batam_fiber_glass",{
		url: "/batam_fiber_glass",
		abstract: true,
		templateUrl: "templates/batam_fiber_glass-tabs.html",
	})

	.state("batam_fiber_glass.about_us", {
		url: "/about_us",
		cache:false,
		views: {
			"batam_fiber_glass-about_us" : {
						templateUrl:"templates/batam_fiber_glass-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.dashboard", {
		url: "/dashboard",
		cache:false,
		views: {
			"batam_fiber_glass-dashboard" : {
						templateUrl:"templates/batam_fiber_glass-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.faqs", {
		url: "/faqs",
		views: {
			"batam_fiber_glass-faqs" : {
						templateUrl:"templates/batam_fiber_glass-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.files", {
		url: "/files",
		cache:false,
		views: {
			"batam_fiber_glass-files" : {
						templateUrl:"templates/batam_fiber_glass-files.html",
						controller: "filesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.floor_plan", {
		url: "/floor_plan",
		cache:false,
		views: {
			"batam_fiber_glass-floor_plan" : {
						templateUrl:"templates/batam_fiber_glass-floor_plan.html",
						controller: "floor_planCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.form_login", {
		url: "/form_login",
		cache:false,
		views: {
			"batam_fiber_glass-form_login" : {
						templateUrl:"templates/batam_fiber_glass-form_login.html",
						controller: "form_loginCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.form_user", {
		url: "/form_user",
		cache:false,
		views: {
			"batam_fiber_glass-form_user" : {
						templateUrl:"templates/batam_fiber_glass-form_user.html",
						controller: "form_userCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.images", {
		url: "/images",
		cache:false,
		views: {
			"batam_fiber_glass-images" : {
						templateUrl:"templates/batam_fiber_glass-images.html",
						controller: "imagesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.language", {
		url: "/language",
		views: {
			"batam_fiber_glass-language" : {
						templateUrl:"templates/batam_fiber_glass-language.html",
						controller: "languageCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.menu_1", {
		url: "/menu_1",
		cache:false,
		views: {
			"batam_fiber_glass-menu_1" : {
						templateUrl:"templates/batam_fiber_glass-menu_1.html",
						controller: "menu_1Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.menu_one", {
		url: "/menu_one",
		views: {
			"batam_fiber_glass-menu_one" : {
						templateUrl:"templates/batam_fiber_glass-menu_one.html",
						controller: "menu_oneCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.menu_two", {
		url: "/menu_two",
		views: {
			"batam_fiber_glass-menu_two" : {
						templateUrl:"templates/batam_fiber_glass-menu_two.html",
						controller: "menu_twoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.opening_hours", {
		url: "/opening_hours",
		cache:false,
		views: {
			"batam_fiber_glass-opening_hours" : {
						templateUrl:"templates/batam_fiber_glass-opening_hours.html",
						controller: "opening_hoursCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.products", {
		url: "/products",
		cache:false,
		views: {
			"batam_fiber_glass-products" : {
						templateUrl:"templates/batam_fiber_glass-products.html",
						controller: "productsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.products_table_singles", {
		url: "/products_table_singles/:id",
		cache:false,
		views: {
			"batam_fiber_glass-products" : {
						templateUrl:"templates/batam_fiber_glass-products_table_singles.html",
						controller: "products_table_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.profile", {
		url: "/profile",
		cache:false,
		views: {
			"batam_fiber_glass-profile" : {
						templateUrl:"templates/batam_fiber_glass-profile.html",
						controller: "profileCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.sitestackplan", {
		url: "/sitestackplan",
		cache:false,
		views: {
			"batam_fiber_glass-sitestackplan" : {
						templateUrl:"templates/batam_fiber_glass-sitestackplan.html",
						controller: "sitestackplanCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"batam_fiber_glass-slide_tab_menu" : {
						templateUrl:"templates/batam_fiber_glass-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.sunday_school", {
		url: "/sunday_school",
		views: {
			"batam_fiber_glass-sunday_school" : {
						templateUrl:"templates/batam_fiber_glass-sunday_school.html",
						controller: "sunday_schoolCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.testimonials", {
		url: "/testimonials",
		cache:false,
		views: {
			"batam_fiber_glass-testimonials" : {
						templateUrl:"templates/batam_fiber_glass-testimonials.html",
						controller: "testimonialsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.video", {
		url: "/video",
		cache:false,
		views: {
			"batam_fiber_glass-video" : {
						templateUrl:"templates/batam_fiber_glass-video.html",
						controller: "videoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.video_singles", {
		url: "/video_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"batam_fiber_glass-video" : {
						templateUrl:"templates/batam_fiber_glass-video_singles.html",
						controller: "video_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.videos", {
		url: "/videos",
		cache:false,
		views: {
			"batam_fiber_glass-videos" : {
						templateUrl:"templates/batam_fiber_glass-videos.html",
						controller: "videosCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.videos_singles", {
		url: "/videos_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"batam_fiber_glass-videos" : {
						templateUrl:"templates/batam_fiber_glass-videos_singles.html",
						controller: "videos_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("batam_fiber_glass.welcome", {
		url: "/welcome",
		cache:false,
		views: {
			"batam_fiber_glass-welcome" : {
						templateUrl:"templates/batam_fiber_glass-welcome.html",
						controller: "welcomeCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/batam_fiber_glass/dashboard");
});
