var WIDTH=300, HEIGHT=225;

function bind($screen) {
	var $actionPanel = $(".action-panel", $screen),
	    $iframe = $("iframe", $screen),
	    sliderValue = $(".header .slider").slider("option", "value")/100;

	resize($screen, sliderValue);

	$actionPanel.mouseenter(function(event){
		$(event.target).fadeTo("slow", 1);
	}).mouseleave(function(event) {
		if (!$("input", $actionPanel).is(":focus")) {
			$actionPanel.fadeTo("slow", 0);
		}
	});

	$("input", $actionPanel).change(function(){
		$iframe.hide();
		var url = $("input", $actionPanel).val();
		if (url) {
			getHandler(url).start(url, $iframe);
			$actionPanel.fadeTo("slow", 0);
		}
	}).blur(function(){
		if (!$actionPanel.is(":hover"))
			$actionPanel.fadeTo("slow", 0);
	});

	$("button", $actionPanel).each(function() {
		$(this).button({
			icons : {primary: $(this).attr("icon")}
		}).click(function(){
			if ($(this).hasClass("close")) {
				$screen.remove();
			} else {
				detachScreen($screen);
			}
		});
	});

	$iframe.load(function(){
		$(this).hide();
		if (this.contentWindow) {
			getHandler(this.src).load(this.contentWindow.document||this.contentDocument);
			$(this).show();
		}
	});
}

function detachScreen($screen) {
	var attachScreen = function($scrn) {
		resize($scrn, $(".header .slider").slider("option", "value")/100);
		$scrn.removeClass("screen-detached");
		$scrn.css({left: 0, top: 0, "z-index": 0});
	};

	if ($screen.hasClass("screen-detached")) {
		attachScreen($screen);
	} else {
		attachScreen($(".screen-detached"));
		resize($screen, 2.9);
		$screen.addClass("screen-detached");
		$screen.css({"z-index": 100});
		$screen.position({
			of: $(window),
			collision: "fit"
		});
	}
}

function resize($screen, resizeFactor) {
	$screen.width(WIDTH * resizeFactor);
	$screen.height(HEIGHT * resizeFactor);
	$("iframe", $screen).each(function(){
		if (this.contentWindow) {
			getHandler(this.src).resize(this.contentWindow.document||this.contentDocument);
		}
	});
}

function getHandler(url) {
	var handler,
	    isExtDomain = url.match(/:\/\/([^\/]+)/),
	    domain = isExtDomain ? isExtDomain[1] : window.location.host;

	$.each(handlers, function(key, value){
		if (key.indexOf(domain) != -1) {
			handler = value;
		}
	});
	if (!handler) {
		var notSupported = function(iFrameDoc) {
			if (domain != window.location.host) 
				alert("Sorry, it is not supported yet!");
		};
		handler = {
			"start"  : notSupported,
			"load"   : notSupported, 
			"resize" : notSupported 
		};
	}
	return handler;
}

var handlers = {
	"xhamster.com" : {
		"start": function(url, $iframe) {
			$iframe.attr("src", url + "&loading=2");
		},
		"load" : function(iFrameDoc) {
			$("#chat_video", iFrameDoc).css(
				{"position" :"fixed", "top": "0px", "left":"0px", "width": "100%", "height": "100%", "z-index": 999});
			$(".bottom_message", iFrameDoc).hide();
		}, 
		"resize" : function(iFrameDoc) {
			$("#chat_video", iFrameDoc).css({"width": "100%", "height": "100%"});
		}	
	},
	"cams.pichunter.com" : {
		"start": function(url, $iframe) {
			$iframe.attr("src", url);
		},
		"load" : function(iFrameDoc) {
			$("#cams_viewer", iFrameDoc).css(
				{"position" :"fixed", "top": "0px", "left":"0px", "width": "100%", "height": "auto", "z-index": 999});
		}, 
		"resize" : function(iFrameDoc) {
			$("#cams_viewer", iFrameDoc).css({"width": "100%", "height": "auto"});
		}	
	},
	"www.webcamgirls.com" : {
		"start": function(url, $iframe) {
			$iframe.attr("src", url);
		},
		"load" : function(iFrameDoc) {
			$("#avchat", iFrameDoc).css(
				{"position" :"fixed", "top": "0px", "left":"0px", "width": "100%", "height": "auto", "z-index": 999});
			$("#js-eu-cookie", iFrameDoc).hide();
		}, 
		"resize" : function(iFrameDoc) {
			$("#avchat", iFrameDoc).css({"width": "100%", "height": "auto"});
		}	
	},
	"www.onwebcam.com" : {
		"start": function(url, $iframe) {
			$iframe.attr("src", url);
		},
		"load" : function(iFrameDoc) {
			$(".camsPlayerBox", iFrameDoc).css(
				{"position" :"fixed", "top": "0px", "left":"0px", "width": "100%", "height": "auto", "z-index": 999});
			$("#js-eu-cookie", iFrameDoc).hide();
		}, 
		"resize" : function(iFrameDoc) {
			$(".camsPlayerBox", iFrameDoc).css({"width": "100%", "height": "auto"});
		}	
	},
}

