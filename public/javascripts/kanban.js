//
(function() {
	this.KanbanApp = {
		offline: false
	}
})();

var Delete = new Class({

	initialize: function(route) {
		this.route = route;
	},

	action: function(id) {
		var f = new Element('form', {
			action: this.route + '/' + id + '?x-http-method-override=DELETE',
			method: 'post',
			'accept-charset': 'utf-8',
			enctype: 'application/x-www-form-urlencoded'
		});

		if (!KanbanApp.offline) f.submit();
	}
});


/*
	html tempaltes
	text_form_tmpl: text note form
	uploader_form_tmpl: image uploader form
	url_form_tmpl: post url form
	
	text_post_tmpl: post note
	url_post_tmpl: image note

*/

/* input form */
Mooml.register('text_form_tmpl', function() {
	div(div({
		'id': 'text_note_form'
	}, input({
		'type': 'hidden',
		'id': 'text_note_title',
		'maxlength': 24
	}), textarea({
		'id': 'text_note_area',
		'maxlength': 140,
		'rows': 5
	})));
});

/* uploader form */
Mooml.register('uploader_form_tmpl', function(param) {
	div(
	form({
		method: "POST",
		action: "/kanbans/" + param.kid + "/images",
		enctype: "multipart/form-data"
	},
	div({
		"class": "formRow"
	},
	input({
		type: "file",
		id: "url",
		name: "url[]"
	})),
	div({
		"class": "formRow"
	},
	input({
		"type": "submit",
		"name": "upload",
		"value": "upload"
	}))));
});

/* url form */
Mooml.register('url_form_tmpl', function(param) {
	div(
	span({
		'class': 'radius secondary label'
	}, 'ex: http://goo.gl/bhIk8'),
	input({
		'type': 'text',
		'id': 'url_note_url',
		'maxlength': 255
	}));
});

/* url form */
Mooml.register('video_form_tmpl', function(param) {
	div(
	span({
		'class': 'radius secondary label'
	}, 'ex: http://www.youtube.com/watch?v=5kzl2cNCN1w'),
	input({
		'type': 'text',
		'id': 'video_note_url',
		'maxlength': 255
	}));
});

/* text post */
Mooml.register('text_post_tmpl', function(note) {
	var random = Number.random(-5, 5);
	var rotatecls = 'deg' + random;
	div({
		'class': 'note ' + rotatecls,
		'nid': note.nid,
		'id': 'nid' + note.nid
	},
	h5(),
	p({
		'id': 'drag' + note.nid
	}, note.note),
	div({
		'class': 'note_tool'
	},
	ul({
		'class': 'left'
	},
	li(i({
		'class': 'icon-remove'
	}))),
	ul({
		'class': 'right'
	},
	li(i({
		'class': 'icon-resize-full',
		'id': 'resize' + note.nid
	})))));
});

/* image post */
Mooml.register('url_post_tmpl', function(note) {
	var random = Number.random(-5, 5);
	var rotatecls = 'deg' + random;
	div({
		'class': 'imgnote ' + rotatecls,
		'nid': note.nid,
		'id': 'nid' + note.nid
	},
	h5(),
	img({
		'id': 'drag' + note.nid,
		src: note.url
	}),
	div({
		'class': 'note_tool'
	},
	ul({
		'class': 'left'
	},
	li(i({
		'class': 'icon-remove'
	})))));
});

/* video post */
Mooml.register('video_post_tmpl', function(note) {
	var random = Number.random(-5, 5);
	var rotatecls = 'deg' + random;
	if (!(Browser.chrome || Browser.safari)) rotatecls = '';

	div({
		'class': 'videonote ' + rotatecls,
		'nid': note.nid,
		'id': 'nid' + note.nid
	},
	iframe({
		'id': 'player' + note.nid,
		'src': 'https://www.youtube.com/embed/' + note.url + '?enablejsapi=1&controls=0&rel=0&wmode=transparent',
		'wmode': 'Opaque',
		'width': '640px',
		'height': '360px',
		'frameborder': 0
	}),
	div({
		'class': 'note_tool'
	},
	ul({
		'class': 'left'
	},
	li(i({
		'class': 'icon-remove'
	}))),
	ul({
		'class': 'right'
	},
	li(i({
		'class': 'icon-play',
		'id': 'play' + note.nid
	})))));
});

var StickyNote = new Class({

	Implements: [Options, Events, Mooml.Templates],

	kanban: null,
	nid: null,
	type: null,

	options: {
		color: 'yellow'
	},

	initialize: function(k, options) {
		this.kanban = k;
		this.kid = k.kid;
		this.setOptions(options);
	},

	tear: function() {
		console.log('tear');
	},

	showTextForm: function() {
		this.sm = new SimpleModal({
			width: 200,
			offsetTop: 120,
			offsetLeft: 25,
			draggable: false
		});
		this.sm.addButton("Post It", "btn primary", function() {
			this._onTextOK(this.kid, $('text_note_title').value, $('text_note_area').value);
			// this.fireEvent('textOk', this.post_text_el);
			this.hide();
		}.bind(this));
		this.sm.addButton("Cancel", "btn secondary");
		this.sm.show({
			"model": "modal",
			"title": "Note",
			"contents": Mooml.render('text_form_tmpl').get('html')
		});
	},

	showUrlForm: function() {
		this.sm = new SimpleModal({
			width: 450,
			offsetTop: 120,
			offsetLeft: 25,
			draggable: false
		});
		this.sm.addButton("Post It", "btn primary", function() {
			this._onUrlOK(this.kid, $('url_note_url').value);
			// console.log(this.post_url_el);
			// this.fireEvent('urlOk', this.post_url_el);
			this.hide();
		}.bind(this));
		this.sm.addButton("Cancel", "btn secondary");
		this.sm.show({
			"model": "modal",
			"title": "IMAGE URL",
			"contents": Mooml.render('url_form_tmpl').get('html')
		});
	},

	showVideoForm: function() {
		this.sm = new SimpleModal({
			width: 450,
			offsetTop: 120,
			offsetLeft: 25,
			draggable: false
		});
		this.sm.addButton("Post It", "btn primary", function() {
			this._onVideoOK(this.kid, $('video_note_url').value);
			this.hide();
		}.bind(this));
		this.sm.addButton("Cancel", "btn secondary");
		this.sm.show({
			"model": "modal",
			"title": "YouTube URL",
			"contents": Mooml.render('video_form_tmpl').get('html')
		});
	},

	showDrawForm: function() {

	},

	hide: function() {
		this.sm.hide();
	},

	_onTextOK: function(kid, title, note) {
		this.type = 'text';
		var socket_id = this.kanban.socket_id
		var color = this.options.color;
		var req = new Request.JSON({
			url: '/notes',
			method: 'post',
			data: {
				'id': kid,
				'title': title,
				'note': note,
				'socket_id': socket_id,
				'color': color
			},
			async: true,
			onRequest: function() {},
			onSuccess: function(nid) {
				this.nid = nid;
				this.title = title;
				this.note = note;
				this.post_text_el = Mooml.render('text_post_tmpl', {
					'title': title,
					'note': note,
					'nid': this.nid
				});

				this.fireEvent('textOk', this.post_text_el);

			}.bind(this),
			onFailure: function() {}
		});

		if (!KanbanApp.offline) req.send();
		else {
			this.nid = 'random' + Number.random(0, 10000);
			this.title = title;
			this.note = note;
			this.post_text_el = Mooml.render('text_post_tmpl', {
				'title': title,
				'note': note,
				'nid': this.nid
			});

			this.fireEvent('textOk', this.post_text_el);
		}

	},

	_onDrawOK: function() {


	},

	_onUrlOK: function(kid, imgurl) {
		var socket_id = this.kanban.socket_id
		var req = new Request.JSON({
			url: '/notes/url',
			method: 'post',
			data: {
				'id': kid,
				'url': imgurl,
				'socket_id': socket_id
			},
			async: true,
			onRequest: function() {},
			onSuccess: function(nid) {
				this.nid = nid;
				this.url = imgurl;
				this.post_url_el = Mooml.render('url_post_tmpl', {
					'url': imgurl,
					'nid': this.nid
				});
				this.fireEvent('urlOk', this.post_url_el);
				// console.log(this.post_url_el);
			}.bind(this),
			onFailure: function() {}
		});

		if (!KanbanApp.offline) req.send();
		else {
			this.nid = 'random' + Number.random(0, 10000);
			this.url = imgurl;
			this.post_url_el = Mooml.render('url_post_tmpl', {
				'url': imgurl,
				'nid': this.nid
			});
			this.fireEvent('urlOk', this.post_url_el);
		}
	},

	_onVideoOK: function(kid, video_url) {
		var vid = video_url.split("v=")[1];
		var socket_id = this.kanban.socket_id
		var req = new Request.JSON({
			url: '/notes/video',
			method: 'post',
			data: {
				'id': kid,
				'url': vid,
				'socket_id': socket_id
			},
			onSuccess: function(nid) {
				this.nid = nid;
				this.url = vid;
				this.post_video_el = Mooml.render('video_post_tmpl', {
					'url': vid,
					'nid': this.nid
				});
				this.fireEvent('videoOk', {
					video_id: vid,
					id: this.nid
				});
			}.bind(this)
		});

		if (!KanbanApp.offline) req.send();
		else {
			this.nid = 'random' + Number.random(0, 10000);
			this.url = vid;
			this.fireEvent('videoOk', {
				video_id: vid,
				id: this.nid
			});
		}
	}

});

StickyNote.buildNoteEl = function(nid, title, note) {
	return Mooml.render('text_post_tmpl', {
		'title': title,
		'note': note,
		'nid': nid
	});
}

StickyNote.buildUrlEl = function(nid, url) {
	return Mooml.render('url_post_tmpl', {
		'url': url,
		'nid': nid
	});
}

StickyNote.buildVideoEl = function(nid, url) {
	console.log(url);
	return Mooml.render('video_post_tmpl', {
		'url': url,
		'nid': nid
	});
}

var PostStack = new Class({

	Implements: [Options, Events],

	kanban: null,

	options: {
		type: 'text', //text, draw, url, video
		color: 'yellow'
	},

	/* add edit event */
	initialize: function(kanban, stack, options) {
		if (options) this.setOptions(options);

		this.kanban = kanban;
		$(stack).addEvent("click", function() {
			if (this.options.type == 'text') this.pull();
			else if (this.options.type == 'url') this.pullUrl();
			else if (this.options.type == 'video') this.pullVideo();
		}.bind(this));
	},

	pull: function() {
		var stickyNote = new StickyNote(this.kanban, {
			color: this.options.color,
			onTextOk: function(el) {
				this.kanban.stickText(el, 0, 0, this.options.color, true);
				// console.log('this.kanban.container '+this.kanban.container);
				// console.log('pull '+this.kanban.socket_id);
				_updatePos(el, this.options.color, this.kanban.container, 'text', this.kanban.socket_id);
			}.bind(this)
		});
		stickyNote.showTextForm();
	},

	pullUrl: function() {
		var stickyNote = new StickyNote(this.kanban, {
			color: this.options.color,
			onUrlOk: function(el) {
				this.kanban.stickUrl(el, 0, 0, this.options.color, true);
				_updatePos(el, this.options.color, this.kanban.container, 'url', this.kanban.socket_id);
			}.bind(this)
		});
		stickyNote.showUrlForm();
	},

	pullVideo: function() {
		var stickyNote = new StickyNote(this.kanban, {
			color: this.options.color,
			onVideoOk: function(el) {
				console.log(el);
				// this.kanban.stickVideo(el, 0, 0, this.options.color, true);
				var vn = new VideoNote(this, el.video_id, el.id);
				kanban.videos.push(vn);
				vn.stick();
				_updatePos(el, this.options.color, this.kanban.container, 'video', this.kanban.socket_id);
			}.bind(this)
		});
		stickyNote.showVideoForm();
	}

});

var Kanban = new Class({

	Implements: [Options, Events],

	current_action: 'drag', //draw, erase, drag
	thickness: 2,
	socket_id: null,
	editing: null,
	videos: new Array(),

	options: {
		isNew: false,
		width: 0,
		height: 0,
		board: ''
	},

	initialize: function(container, kid, options) {
		this.container = container;
		this.kid = kid;
		this.setOptions(options);

		$(this.options.board).setStyles({
			width: this.options.width,
			height: this.options.height
		});
		this.canvas = document.getElementById("mycanvas");
		this.canvas.width = $(container).getSize().x;
		this.canvas.height = $(container).getSize().y;
		this.context = this.canvas.getContext('2d');

		this.dragScroller = new Drag('kanban', {
			style: false,
			invert: true,
			modifiers: {
				x: 'scrollLeft',
				y: 'scrollTop'
			}
		});
		this.z = 1;
	},

	stickUrl: function(urlNote, x, y, color, _center, idx) {
		var el = urlNote.inject($(this.container));
		if (idx) {
			el.setStyle('zIndex', idx);
			if (idx > this.z) this.z = idx;
		} else {
			this.z++;
			el.setStyle('zIndex', this.z);
		}

		el.addEvent('click', function() {
			this.z += 1;
			el.setStyle('zIndex', this.z);
			_updatePos(el, color, this.container, 'url', this.socket_id);
		}.bind(this));

		el.getElement('.icon-remove').addEvent('click', function() {
			_deleteNote(el, 'url', this.socket_id);
		}.bind(this));

		new Drag.Move(el, {
			container: this.container,
			handle: 'drag' + el.get('nid'),

			onBeforeStart: function() {
				this.z += 1;
				el.setStyle('zIndex', this.z);
				this.dragScroller.detach();
			}.bind(this),

			onComplete: function() {
				this.dragScroller.attach();
			}.bind(this),

			onCancel: function(element) {
				this.dragScroller.attach();
			}.bind(this)
		})
		if (_center) el.position({
			position: 'upperLeft',
			relativeTo: 'body',
			offset: {
				x: 50,
				y: 120
			}
		});
		else {
			el.setPosition({
				'x': x,
				'y': y
			});
		}


	},

	stickText: function(textNote, x, y, color, _center, idx, width, height) {
		// console.log('stickText ' +color);
		var el = textNote.inject($(this.container));
		if (idx) {
			el.setStyle('zIndex', idx);
			if (idx > this.z) this.z = idx;
		} else {
			this.z++;
			el.setStyle('zIndex', this.z);
		}

		// el.addEvent('click', function(){
		// 	this.z += 1;
		// 	el.setStyle('zIndex', this.z);
		// 	_updatePos(el, color, this.container, 'text', this.socket_id);
		// }.bind(this));

		el.getElement('.icon-remove').addEvent('click', function() {
			_deleteNote(el, 'text', this.socket_id);
		}.bind(this));

		el.makeDraggable({
			container: this.container,
			handle: 'drag' + el.get('nid'),

			onBeforeStart: function() {
				if (this.editing) this.editing.getElement('textarea').blur();
				this.z += 1;
				el.setStyle('zIndex', this.z);
				this.dragScroller.detach();
			}.bind(this),

			onComplete: function() {
				this.dragScroller.attach();
				_updatePos(el, color, this.container, 'text', this.socket_id);
			}.bind(this),

			onCancel: function(element) {
				this.dragScroller.attach();
				_updatePos(el, color, this.container, 'text', this.socket_id);
			}.bind(this)
		})

		// console.log(color);
		if (color == 'pink') el.addClass('pink');
		else el.addClass('yellow');

		if (_center) el.position({
			position: 'upperLeft',
			relativeTo: 'body',
			offset: {
				x: 50,
				y: 120
			}
		});
		else {
			el.setPosition({
				'x': x,
				'y': y
			});
		}

		el.setStyles({
			'width': width || 150,
			'height': height || 150
		});

		el.makeResizable({
			handle: 'resize' + el.get('nid'),

			onBeforeStart: function() {
				if (this.editing) this.editing.getElement('textarea').blur();
				this.dragScroller.detach();
			}.bind(this),

			onComplete: function() {
				this.dragScroller.attach();
				_updatePos(el, color, this.container, 'text', this.socket_id);
			}.bind(this),

			onCancel: function() {
				this.dragScroller.attach();
			}.bind(this),

		});

		el.getElement('p').makeEditable({
			type: 'textarea',
			onBeforeStart: function() {
				// el.retrieve('dragger').detach();
				this.editing = el;
				this.dragScroller.detach();
				el.getElement('.note_tool').toggle();
			}.bind(this),
			onComplete: function() {
				// el.retrieve('dragger').attach();
				this.dragScroller.attach();
				_updateTextNote(el, color, this.container, this.socket_id);
				el.getElement('.note_tool').reveal();
				this.editing = null;
			}.bind(this)
		});
	},

	stickDraw: function() {

	},

	clear: function() {

	},

	load: function() {
		var kid = this.kid;
		var req = new Request.JSON({
			url: '/kanbans/' + kid + '/notes',
			method: 'get',
			onRequest: function() {},
			onSuccess: function(json) {
				json.each(function(el) {
					if (el.url) this.stickUrl(StickyNote.buildUrlEl(el.id, el.url), el.x, el.y, el.color, false, el['zindex']);
					else if (el.videoID) this.videos.push(new VideoNote(this, el.videoID, el.id, {
						x: el.x,
						y: el.y,
						zindex: el.zindex,
						width: el.width,
						height: el.height
					}));
					else this.stickText(StickyNote.buildNoteEl(el.id, el.title, el.note), el.x, el.y, el.color, false, el['zindex'], el.width, el.height);
				}.bind(this));
				// load youtube api
				prepareYouTube();

			}.bind(this),
			onFailure: function() {}
		});

		//if (!KanbanApp.offline)
		req.send();

		this._loadBackground();
	},

	addStack: function(stack, color) {
		var postStack = new PostStack(this, stack, {
			color: color,
			type: 'text'
		});
	},

	_loadNotes: function() {

	},

	_loadBackground: function() {
		this.stage = new createjs.Stage(this.canvas);
		this.stage.autoClear = true;
		if (this.context.setLineDash) this.context.setLineDash([10, 5]);

		var kid = this.kid;
		var req = new Request.JSON({
			url: '/kanbans/' + kid + '/background',
			method: 'get',
			onRequest: function() {
				// console.log('load background');
			},
			onSuccess: function(json) {
				// console.log(json);
				/*
				var image = new Image();
				image.src = json.background;
				image.onload = function()
				{
					var bm = new createjs.Bitmap(image);
					this.stage.addChild(bm);
					this.stage.update();
				}.bind(this);
				*/

				// if(this.options.isNew)
				// {					
				var value_stream = json.stream;
				var space_width = $(this.container).getSize().x;
				//console.log(space_width);
				var value_size = value_stream.length;
				//console.log(value_size);
				var value_width = space_width / value_size;
				//console.log(value_width);
				var current_x = 0;
				value_stream.each(function(el) {
					// console.log(current_x);
					// display text
					var value_center = (current_x + (current_x + value_width)) / 2;
					// console.log(value_center);
					var a_value = new createjs.Text(el.value, "normal normal bold 36px 'Patrick Hand'");
					a_value.x = value_center;
					a_value.y = 10;
					a_value.textAlign = "center";
					this.stage.addChild(a_value);

					// draw line
					if (current_x != 0) {
						var s = new createjs.Shape();
						var g = s.graphics;
						g.setStrokeStyle(2, 'round', 'round');
						g.beginStroke("#8B8378");
						g.moveTo(current_x, 60);
						g.lineTo(current_x, $(this.container).getSize().y - 60);
						this.stage.addChild(s);
					}
					this.stage.update();
					current_x += value_width;
				}.bind(this));

				// this.saveBackground();
				// }
			}.bind(this),
			onFailure: function() {}
		});

		//if (!KanbanApp.offline)
		req.send();

		this.stage.onMouseDown = function(evt) {

			this.isMouseDown = true;
			// console.log(this.current_action);
			if (this.current_action == 'draw') {
				evt.nativeEvent.preventDefault();
				evt.nativeEvent.stopPropagation();
				// evt.nativeEvent.target.style.cursor = 'pointer';
				var s = new createjs.Shape();
				this.oldX = this.stage.mouseX;
				this.oldY = this.stage.mouseY;
				this.oldMidX = this.stage.mouseX;
				this.oldMidY = this.stage.mouseY;
				var g = s.graphics;
				// this.thickness = 2;
				g.setStrokeStyle(this.thickness + 1, 'round', 'round');
				var color = createjs.Graphics.getRGB(0, 0, 0);
				g.beginStroke(color);
				this.stage.addChild(s);
				this.currentDrawShape = s;
			} else if (this.current_action == 'erase') {
				evt.nativeEvent.preventDefault();
				evt.nativeEvent.stopPropagation();
				// evt.nativeEvent.target.style.cursor = 'pointer';
				var s = new createjs.Shape();
				this.oldX = this.stage.mouseX;
				this.oldY = this.stage.mouseY;
				this.oldMidX = this.stage.mouseX;
				this.oldMidY = this.stage.mouseY;
				var g = s.graphics;
				var eraser_thickness = 35;
				g.setStrokeStyle(eraser_thickness, 'round', 'round');
				var color = createjs.Graphics.getRGB(0, 0, 0);
				g.beginStroke(color);
				this.stage.addChild(s);
				s.compositeOperation = "destination-out";
				this.currentEraserShape = s;
			} else if (this.current_action == 'drag') {
				// evt.nativeEvent.target.style.cursor = 'move';
				return false;
			}
		}.bind(this);

		this.stage.onMouseUp = function(evt) {
			this.isMouseDown = false;
			/*
			if(this.current_action=='draw'||this.current_action=='erase')
				this.saveBackground();
			*/
			//evt.nativeEvent.target.style.cursor = 'default';
		}.bind(this);

		this.stage.onMouseMove = function(evt) {

		}.bind(this);

		// createjs.Touch.enable(this.stage);

		this.stage.update();
		createjs.Ticker.addListener(this);
	},

	tick: function() {
		if (this.isMouseDown) {
			if (this.current_action == 'draw') {
				var pt = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
				var midPoint = new createjs.Point(this.oldX + pt.x >> 1, this.oldY + pt.y >> 1);
				this.currentDrawShape.graphics.moveTo(midPoint.x, midPoint.y);
				this.currentDrawShape.graphics.curveTo(this.oldX, this.oldY, this.oldMidX, this.oldMidY);

				this.oldX = pt.x;
				this.oldY = pt.y;

				this.oldMidX = midPoint.x;
				this.oldMidY = midPoint.y;

				this.stage.update();
			} else if (this.current_action == 'erase') {
				var pt = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
				var midPoint = new createjs.Point(this.oldX + pt.x >> 1, this.oldY + pt.y >> 1);
				this.currentEraserShape.graphics.moveTo(midPoint.x, midPoint.y);
				this.currentEraserShape.graphics.curveTo(this.oldX, this.oldY, this.oldMidX, this.oldMidY);

				this.oldX = pt.x;
				this.oldY = pt.y;

				this.oldMidX = midPoint.x;
				this.oldMidY = midPoint.y;

				this.stage.update();
			}
		}
	},

	saveBackground: function() {
		var dataURL = this.stage.toDataURL();
		var kid = this.kid;
		var req = new Request.JSON({
			url: '/kanbans/' + kid + '/background',
			data: {
				'dataURL': dataURL,
				'id': kid
			},
			method: 'post',
			onRequest: function() {},
			onSuccess: function(json) {
				alert(json);
			},
			onFailure: function() {}
		});

		if (!KanbanApp.offline) req.send();

	},

	addEraser: function(eraser) {
		$(eraser).addEvent("click", function() {
			if (this.current_action == 'drag') this.dragScroller.detach();
			this.current_action = 'erase';
			$('board').setStyle('cursor', 'pointer');
			this.activateTool(eraser);
		}.bind(this));
	},

	addPen: function(pen) {
		$(pen).addEvent("click", function() {
			if (this.current_action == 'drag') this.dragScroller.detach();
			this.current_action = 'draw';
			$('board').setStyle('cursor', 'pointer');
			this.activateTool(pen);
		}.bind(this));
	},

	addMover: function(mover) {
		$(mover).addEvent("click", function(evt) {
			if (this.current_action != 'drag') {
				this.dragScroller.attach();
			}
			this.current_action = 'drag';
			$('board').setStyle('cursor', 'move');
			this.activateTool(mover);
		}.bind(this));
	},

	addUploader: function(uploader) {
		var kid = this.kid;
		$(uploader).addEvent("click", function() {
			//show upload form
			var sm = new SimpleModal({
				width: 200,
				offsetTop: 120
			});
			sm.addButton("Cancel", "btn secondary");
			sm.show({
				"model": "modal",
				"title": "Upload Image",
				"contents": Mooml.render('uploader_form_tmpl', {
					"kid": kid
				}).get('html')
			});

			var upload = new Form.Upload('url', {
				onComplete: function() {
					alert('Completed uploading the Files');
				}
			});

		});
	},

	addUrlStack: function(stack) {
		var postStack = new PostStack(this, stack, {
			color: 'black',
			type: 'url'
		});
	},

	addVideoStack: function(stack) {
		var postStack = new PostStack(this, stack, {
			color: 'black',
			type: 'video'
		});
	},

	activateTool: function(el) {
		$('globalmove').removeClass('current_tool');
		$('black_pen').removeClass('current_tool');
		$('eraser').removeClass('current_tool');
		$(el).addClass('current_tool');
	},

	setSocket_id: function(sid) {
		this.socket_id = sid;
	},

	loadYouTube: function() {
		this.videos.each(function(video) {
			video.stick();
		});
	}

});

function _updatePos(element, color, container, type, socket_id) {
	var req = new Request.JSON({
		url: '/notes/pos',
		method: 'post',
		data: {
			'id': element.get('nid'),
			'x': element.getPosition(container).x,
			'y': element.getPosition(container).y,
			'width': element.getCoordinates(container).width,
			'height': element.getCoordinates(container).height,
			'color': color,
			'type': type,
			'zindex': element.getStyle('zIndex'),
			'socket_id': socket_id
		},
		onRequest: function() {
			// console.log('_updatePos onRequest', 'text');
		},
		onSuccess: function() {
			// console.log('_updatePos onSuccess', 'text');
		},
		onFailure: function() {
			// console.log('_updatePos onFailure', 'text');
		}
	});

	if (!KanbanApp.offline) req.send();
}

function _updateTextNote(element, color, container, socket_id) {
	var req = new Request.JSON({
		url: '/notes/text',
		method: 'post',
		data: {
			'id': element.get('nid'),
			'x': element.getPosition(container).x,
			'y': element.getPosition(container).y,
			'width': element.getCoordinates(container).width,
			'height': element.getCoordinates(container).height,
			'color': color,
			'zindex': element.getStyle('zIndex'),
			'text': element.getElement('p').get('text'),
			'socket_id': socket_id
		}
	});

	if (!KanbanApp.offline) req.send();
}

function _deleteNote(el, type, socket_id) {
	// console.log('_deleteNote ' + socket_id);
	$(el).removeEvents('click');
	var req = new Request.JSON({
		url: '/notes/' + $(el).get('nid') + '?x-http-method-override=DELETE&type=' + type + '&socket_id=' + socket_id,
		method: 'post',
		onComplete: function() {
			// console.log('_deleteNote onComplete');
		},
		onSuccess: function(json, txt) {
			$(el).set('tween', {
				onComplete: function() {
					$(el).destroy();
				}
			}).fade(0);
		},
		onFailure: function() {
			// console.log('_deleteNote onFailure ');
		}
	});

	if (!KanbanApp.offline) req.send();
	else $(el).set('tween', {
		onComplete: function() {
			$(el).destroy();
		}
	}).fade(0);

}

function prepareYouTube() {
	var tag = document.createElement('script');
	tag.src = "//www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
	kanban.loadYouTube();
}

/*
 * 	var vn = new VideoNote(kanban, video_id, nid);
 	vn.stick();
 */
var VideoNote = new Class({

	Implements: [Options, Events],

	kanban: null,
	video_id: '',
	nid: '',
	element: null,
	player: null,

	options: {
		x: 50,
		y: 200,
		width: 360,
		height: 640
	},

	initialize: function(Kanban, video_id, nid, options) {
		this.setOptions(options);
		this.kanban = kanban;
		this.video_id = video_id;
		this.nid = nid;
		this.element = Mooml.render('video_post_tmpl', {
			'url': video_id,
			'nid': nid,
			width: this.options.width,
			height: this.options.height
		});
	},

	tear: function() {
		this.element.destroy();
	},

	play: function() {
		this.player.playVideo();
	},

	pause: function() {
		this.player.pauseVideo();
	},

	stick: function() {
		var el = this.element;
		el.inject(this.kanban.container);
		this._overlay();

		this.kanban.z++;

		el.setStyle('zIndex', this.kanban.z);

		el.getElement('.icon-remove').addEvent('click', function() {
			_deleteNote(el, 'video', this.kanban.socket_id);
		}.bind(this));

		el.makeDraggable({
			container: this.kanban.container,
			handle: 'overlay' + this.nid,

			onBeforeStart: function() {
				this.kanban.z += 1;
				el.setStyle('zIndex', this.kanban.z);
				this.kanban.dragScroller.detach();
			}.bind(this),

			onComplete: function() {
				this.kanban.dragScroller.attach();
				_updatePos(el, 'yellow', this.kanban.container, 'video', this.kanban.socket_id);
			}.bind(this),

			onCancel: function(element) {
				this.kanban.dragScroller.attach();
				_updatePos(el, 'yellow', this.kanban.container, 'video', this.kanban.socket_id);
			}.bind(this)
		});

		el.setPosition({
			'x': this.options.x,
			'y': this.options.y
		});

		this.player = new YT.Player('player' + this.nid, {
			events: {
				'onReady': this._onPlayerReady.bind(this)
			}
		});
	},

	_overlay: function() {
		var overlay = new Overlay('nid' + this.nid, {
			id: 'overlay' + this.nid,
			opacity: 0,
			height: '360px'
		});

		var xbound = [320 - 50, 320 + 50]; //640 320 100
		var ybound = [180 - 35, 180 + 35]; //360 180  70

		$('overlay' + this.nid).addEvent('click', function(e) {
			if (e.event.offsetX >= xbound[0] && e.event.offsetX <= xbound[1] && e.event.offsetY >= ybound[0] && e.event.offsetY <= ybound[1]) {

				if (!this.playing) this.play();
				else this.pause();

				this.playing = !this.playing;

			}
		}.bind(this));

		$('overlay' + this.nid).addEvent('mousemove', function(e) {
			if (e.event.offsetX >= xbound[0] && e.event.offsetX <= xbound[1] && e.event.offsetY >= ybound[0] && e.event.offsetY <= ybound[1]) {
				e.target.setStyle('cursor', 'pointer');
			} else {
				e.target.setStyle('cursor', 'move');
			}
		}.bind(this));

		overlay.open();
	},

	_onPlayerReady: function(event) {
		this.element.getElement('.icon-play').addEvent('click', function() {
			if (!this.playing) event.target.playVideo();
			else event.target.pauseVideo();

			this.playing = !this.playing;
		});
	}

});