
//Configure require
require.config({
	"baseUrl": "../"
});

require(["unity"], function (UnityJS) {

	//create an instance of unity
	UnityJS({
		"baseUrl": "../"
	}, function(unity) {

		var data = {
			"buttons": [
				{ "label": "Our Services", "target": "services" },
				{ "label": "Web Portfolio", "target": "portfolio" },
				{ "label": "Array Creative", "target": "creative" },
				{ "label": "Our Team", "target": "team" },
				{ "label": "Evo System", "target": "evo" }
			]
		};

		var nav = unity.view.create('nav', data, 'nav');

		nav.element.appendTo('body');

	});

});

