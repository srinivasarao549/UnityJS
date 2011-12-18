UnityJS({
	"baseUrl": "../"
}, function(unity) {

	var data = {
		"buttons": [
			{
				"label": "Our Services",
				"target": "services"
			},
			{
				"label": "Web Portfolio",
				"target": "portfolio"
			},
			{
				"label": "Array Creative",
				"target": "creative"
			},
			{
				"label": "Our Team",
				"target": "team"
			},
			{
				"label": "Evo System",
				"target": "evo"
			}
		]
	};

	window.data = data;

	var nav = unity.element.create('nav', data, 'nav');

	nav.element.appendTo('body');

	throw "I'm going to try to kill unity!"

});