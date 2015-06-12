module("Absolute animate Test", {
	beforeEach : function() {
		this.transform = $.support["transform"];
		this.egAnimate = eg.invoke("animate",[jQuery,window]);
		this.$el1 = $("#box1");
		this.$el2 = $("#box2");
	},
	afterEach : function() {
		this.$el1.css(this.transform, "none");
		this.$el2.css(this.transform, "none");
	}
});

var ABSOLUTE_CASE = [
	{title : "rotate(45deg)", css : "rotate(45deg)", transform: "rotate(45deg)"},
	{title : "skewX(30deg) skewY(10deg)", css : "skewX(30deg) skewY(10deg)", transform: "skewX(30deg) skewY(10deg)"},
	{title : "translate(100px, 10px)", css : "translate(100px, 10px)", transform: "translate(100px, 10px)"},
	{title : "matrix(.5, .433, -.5, 1.033, 50, -10)", css : "matrix(.5, .433, -.5, 1.033, 50, -10)", transform: "matrix(.5, .433, -.5, 1.033, 50, -10)"},
	{title : "rotate(45deg) translate(38px)", css : "rotate(45deg) translate(38px)", transform: "rotate(45deg) translate(38px)"},
	{title : "rotate&translate&skew&scale&matrix", css : "rotate(45deg) translateY(-68px) skewX(-30deg) scale(1.2) matrix(.5, .433, -.5, 1.033, 50, -10)", transform: "rotate(45deg) translateY(-68px) skewX(-30deg) scale(1.2) matrix(.5, .433, -.5, 1.033, 50, -10)"}
];

$.each(ABSOLUTE_CASE, function(i, val) {
	//Given
	//ABSOLUTE_CASE

	test(val.title, function(assert) {
		var done = assert.async(),
			self = this,
			trsf = self.transform;

		//When
		this.$el1
			.css(trsf, val.css);

		this.$el2
			.animate({"transform" : val.transform}, function() {
				//Then
				var t1 = self.egAnimate.toMatrix(val.css),
					t2 = self.egAnimate.toMatrix(self.$el2.css(self.transform));

				// Ignore very tiny difference. 
				// Because output matrixes can be different with input matrixes.) 
				$.each(t1[1], function(i) {
					t1[1][i] = parseFloat(t1[1][i]).toFixed(3);
					t2[1][i] = parseFloat(t2[1][i]).toFixed(3);
				});

				equal(t1[1].toString(), t2[1].toString());
				// setTimeout(function() {
				done();	
				// }, 1000);
				
			});
	});
});

/**
 * On PhantomJS, 'Relative animate Test' case cannot be tested.
 * Because jQuery cannot get a start matrix which is latest position.
 * 
 */
if ( navigator.userAgent.indexOf("PhantomJS") == -1 ) {
	var relativeTestCount = 0;

	module("Relative animate Test", {
		beforeEach : function() {
			this.egAnimate = eg.invoke("animate",[jQuery,window]);
		},
		afterEach : function() {
		}
	});

	var RELATIVE_CASE = [
		{title : "+=translate(100px, 0)", css : "translate(100px, 0)", transform: "+=translate(100px, 0)"},
		{title : "+=translate(0, 100px)", css : "translate(100px, 100px)", transform: "+=translate(0, 100px)"},
		{title : "+=translate(100, 100)", css : "translate(200px, 200px)", transform: "+=translate(100, 100)"},
		{title : "+=scale(2) translate(-100, -100)", css : "scale(2) translate(0px, 0px)", transform: "+=scale(2) translate(-100, -100)"},
		{title : "+=scale(0.5) rotate(30deg)", css : "rotate(30deg)", transform: "+=scale(0.5) rotate(30deg)"}	
	];

	$.each(RELATIVE_CASE, function(i, val) {
		//Given
		var $el1 = $("#box1"),
			$el2 = $("#box2"),
			trsf = $.support["transform"];

		var initialTransform = "translate(100px, 0px)";
		$el1.css(trsf, initialTransform);
		$el2.css(trsf, initialTransform);

		//RELATIVE_CASE
		test(val.title, function(assert) {
			var done = assert.async(),
				self = this;

			//When
			$el1
				.css(trsf, val.css);

			$el2
				.animate({"transform" : val.transform},
					function() {
						//Then
						var expected = self.egAnimate.toMatrix(val.css),
						 	result = self.egAnimate.toMatrix($el2.css(trsf));

						// Ignore very tiny difference. 
						// Because output matrixes can be different with input matrixes.) 
						$.each(expected[1], function(i) {
							expected[1][i] = parseFloat(expected[1][i]).toFixed(3);
							result[1][i] = parseFloat(result[1][i]).toFixed(3);
						});

						equal(result[1].toString(), expected[1].toString());
						//setTimeout(function() {
							done();	
						//}, 500);
					}	
				);
		});
	});
}

module("3d animate Test", {
	beforeEach : function() {
		this.egAnimate = eg.invoke("animate",[jQuery,window]);
	},
	afterEach : function() {
	}
});

var ANI_3D_CASE = [
	{title : "translate3d(100px, 100px, 100px)", css : "translate3d(100px, 100px, 100px)", transform: "translate3d(100px, 100px, 100px)"}
];

/**
 * On PhantomJS, 'Relative animate Test' case cannot be tested.
 * Because jQuery cannot get a start matrix which is latest position.
 * 
 */
if (navigator.userAgent.indexOf("PhantomJS") == -1) {
	ANI_3D_CASE.push({title : "+=translate(0px, 100px)", css : "translate3d(100px, 200px, 100px)", transform: "+=translate(0px, 100px)"});
}

$.each(ANI_3D_CASE, function(i, val) {
	//Given
	var $el1 = $("#box1"),
		$el2 = $("#box2"),
		trsf = $.support["transform"];
	
	$el1.css(trsf, "none");
	$el2.css(trsf, "none");

	//RELATIVE_CASE
	test(val.title, function(assert) {
		var done = assert.async(),
			self = this;

		//When
		$el1
			.css( trsf, val.css );

		$el2
			.animate({"transform" : val.transform},
				function() {
					//Then
					var t1 = self.egAnimate.toMatrix(val.css),
					 	t2 = self.egAnimate.toMatrix($el2.css(trsf));

					if (t1[1].length < t2[1].length) {
						t1 = self.egAnimate.toMatrix3d(t1);
					} else if (t1[1].length > t2[1].length) {
						t2 = self.egAnimate.toMatrix3d(t2);
					}

					// Ignore very tiny difference. 
					// Because output matrixes can be different with input matrixes.) 
					$.each(t1[1], function(i) {
						t1[1][i] = parseFloat(t1[1][i]).toFixed(3);
						t2[1][i] = parseFloat(t2[1][i]).toFixed(3);
					});

					equal(t1[1].toString(), t2[1].toString());
					done();	
				}	
			);
	});
});
