require(['../unity'], function (UnityJS) {

	//create an instance of unity
	UnityJS({
		"baseUrl": "../",
		"templates": [
			{"id": "header", "url": "example/views/includes/header.hb"},
			{"id": "footer", "url": "example/views/includes/footer.hb"},
			{"id": "home", "url": "example/views/home.hb"}
		]
	}, function(unity) {

		//VARS
		var firstLoad = true;

		//MODELS
		var header = {
			"buttons": [
				{ "label": "Our Services", "target": "/OurServices" },
				{ "label": "Web Portfolio", "target": "/WebPortfolio" },
				{ "label": "Array Creative", "target": "/ArrayCreative" },
				{ "label": "Our Team", "target": "/OurTeam" },
				{ "label": "Evo System", "target": "/EvoSystem" }
			]
		};
		var footer = {
			"company": "Array Studios",
			"companyLogo": "images/arrayStudios.png"
		};
		var home = {

		};
		var creative = {

		};

		//ROUTES
		unity.router.bind('/', function() {
			$('body').addClass('studios').removeClass('creative').empty();
			buildHeader();

			unity.view.create('home', home, 'body');

			buildFooter();
		});
		unity.router.bind('/ArrayCreative', function() {
			$('body').addClass('creative').removeClass('studios').empty();
			buildHeader();

			unity.view.create('creative', creative, 'body');

			buildFooter();
		});
		unity.router.update();

		//LINKS
		$('body').on('click', '[data-target]', function() {
			location.hash = $(this).attr('data-target');
		});


		//BOILERPLATE
		function buildHeader() {
			var $header = unity.view.create('header', header, 'body').element;

			if(firstLoad) {
				//hide and slide in the header
				$header
					.hide()
					.css({
						'top': '-' + $header.height() + 'px'
					})
					.show()
					.animate({
						'top': 0
					}, 600);
			}
		}

		function buildFooter() {
			var $footer = unity.view.create('footer', footer, 'body').element;

			var $buildings1 = $('.buildings1', $footer);
			var $birds = $('.birds', $footer);
			//var $buildings1 = $('.buildings1', $footer).hide();
			//var $buildings1 = $('.buildings1', $footer).hide();

			if(firstLoad) {
				//hide and slide in the header
				$footer
					.hide()
					.css({
						'bottom': '-' + $footer.height() + 'px'
					})
					.show()
					.animate({
						'bottom': 0
					}, 600, nickNacks);

				firstLoad = false;

				//hide the nicknacks
				$buildings1.hide();
				$birds.hide();
			} else {
				//nickNacks();
			}

			function nickNacks() {

				$buildings1
					.css({
						'bottom': '-' + $buildings1.height() + 'px'
					})
					.show()
					.animate({
						'bottom': 0
					}, 800);
				$birds
					.delay(800)
					.css({
						'left': '-' + $birds.width() + 'px'
					})
					.show()
					.animate({
						'left': '260px'
					}, 1100, 'easeOutBack');
			}
		}

	});

});

