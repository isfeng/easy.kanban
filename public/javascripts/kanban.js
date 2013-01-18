//google web font
WebFontConfig = {
	google : {
		families : [ 'Shadows+Into+Light::latin' ]
	}
};

(function()
{
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
})();

//
(function()
{
	this.KanbanApp = {
		offline : false
	}
})();

var Delete = new Class({

	initialize : function(route)
	{
		this.route = route;
	},

	action : function(id)
	{
		var f = new Element('form', {
			action : this.route + '/' + id + '?x-http-method-override=DELETE',
			method : 'post',
			'accept-charset' : 'utf-8',
			enctype : 'application/x-www-form-urlencoded'
		});

		if (!KanbanApp.offline)
			f.submit();
	}
});

/* input form */
Mooml.register('text_note_tmpl', function()
{
	div(div({
		'id' : 'text_note_form'
	}, label('Title'), input({
		'type' : 'text',
		'id' : 'text_note_title'
	}), label('Note'), textarea({
		'id' : 'text_note_area'
	})));
});

/* sticky form */
Mooml.register('post_tmpl', function(note)
{
	div({
		'class' : 'note',
		'nid' : note.nid
	}, h5(note.title), p(note.note));
});

var StickyNote = new Class({

	Implements : [ Options, Events, Mooml.Templates ],

	options : {
		onTextOk : Class.empty,
		onDrawOk : Class.empty,
		onMove : Class.empty
	},

	initialize : function(kid, options)
	{
		this.kid = kid;
		this.setOptions(options);
	},

	tear : function()
	{
		alert('tear');
	},

	showTextForm : function()
	{
		this.sm = new SimpleModal({
			"btn_ok" : "post it"
		});
		this.sm.addButton("post it", "btn primary", function()
		{
			this._onTextOK(this.kid, $('text_note_title').value, $('text_note_area').value);
			this.fireEvent('textOk', this.post_text_el);
			this.hide();
		}.bind(this));
		this.sm.addButton("Cancel", "btn secondary");
		this.sm.show({
			"model" : "modal",
			"title" : "Title",
			"contents" : Mooml.render('text_note_tmpl').get('html')
		});
	},

	showDrawForm : function()
	{

	},

	hide : function()
	{
		this.sm.hide();
	},

	_onTextOK : function(kid, title, note)
	{
		var req = new Request.JSON({
			url : '/notes',
			method : 'post',
			data : {
				'id' : kid,
				'title' : title,
				'note' : note
			},
			async : false,
			onRequest : function()
			{
			},
			onSuccess : function(nid)
			{
				this.nid = nid;
			}.bind(this),
			onFailure : function()
			{
			}
		});

		if (!KanbanApp.offline)
			req.send();

		this.title = title;
		this.note = note;
		this.post_text_el = Mooml.render('post_tmpl', {
			'title' : title,
			'note' : note,
			'nid' : this.nid
		});
	},

	_onDrawOK : function()
	{

	}

});

StickyNote.buildNoteEl = function(nid, title, note)
{
	return Mooml.render('post_tmpl', {
		'title' : title,
		'note' : note,
		'nid' : nid
	});
}

var PostStack = new Class({

	Implements : [ Options, Events ],

	options : {

	},

	/* add edit event */
	initialize : function(kanban, stack)
	{
		this.kanban = kanban;
		$(stack).addEvent("click", function()
		{
			this.pull();
		}.bind(this));
	},

	pull : function()
	{
		var stickyNote = new StickyNote(this.kanban.kid, {
			onTextOk : function(el)
			{
				this.kanban.stickText(el, 0, 0);
			}.bind(this)
		});
		stickyNote.showTextForm();
	}

});

var Kanban = new Class({

	Implements : [ Options, Events ],

	options:{
		width: 0,
		height: 0,
		board:''
	},

	initialize : function(container, kid, options)
	{
		this.container = container;
		this.kid = kid;
		this.setOptions(options);

		$(this.options.board).setStyles({width: this.options.width, height:this.options.height});
		this.canvas = document.getElementById("mycanvas");
		this.canvas.width = $(container).getSize().x;
		this.canvas.height = $(container).getSize().y;
		this.context = this.canvas.getContext('2d');

		this.thickness = 2;
		this.draw = true;
	},

	stickText : function(textNote, x, y)
	{
		var el = textNote.inject($(this.container));
		
		new Drag.Move(el, {
			container : this.container,
			droppables : '#trashcan',
			precalculate : false,
			onDrop : function(element, droppable, event)
			{
				/* only trashcan droppable */
				if (droppable)
				{
					console.log(element, 'dropped on', droppable, 'event', event);
					_deleteNote(element);
				}
				else
				{
//					_updatePos(element);
					var req = new Request.JSON({
						url : '/notes/pos',
						method : 'post',
						data : {
							'id' : element.get('nid'),
							'x' : element.getPosition(this.container).x,
							'y' : element.getPosition(this.container).y
						},
						onRequest : function()
						{
							console.log('_updatePos onRequest');
						},
						onSuccess : function()
						{
							console.log('_updatePos onSuccess');
						},
						onFailure : function()
						{
							console.log('_updatePos onFailure');
						}
					});

					if (!KanbanApp.offline)
						req.send();
				}
			}.bind(this),

			onEnter : function(element, droppable)
			{
				console.log(element, 'entered', droppable);
			},

			onLeave : function(element, droppable)
			{
				console.log(element, 'left', droppable);
			}
		})

//		el.setPosition({
//			'x' : x,
//			'y' : y
//		});
		el.position(); 
//		$(el).setStyles({
//	          top: window.getCoordinates().width /2 ,
//	          left: window.getCoordinates().width /2 
//	    });
	},

	stickDraw : function()
	{

	},

	clear : function()
	{

	},

	load : function()
	{
		var kid = this.kid;
		var req = new Request.JSON({
			url : '/kanbans/' + kid + '/notes',
			method : 'get',
			onRequest : function()
			{
			},
			onSuccess : function(json)
			{
				json.each(function(el)
				{
					this.stickText(StickyNote.buildNoteEl(el.id, el.title, el.note), el.x, el.y);
				}.bind(this));
			}.bind(this),
			onFailure : function()
			{
			}
		});

		if (!KanbanApp.offline)
			req.send();

		this._loadBackground();
	},

	addStack : function(stack)
	{
		var postStack = new PostStack(this, stack);
	},

	_loadNotes : function()
	{

	},

	_loadBackground : function()
	{
		this.stage = new createjs.Stage(this.canvas);
		this.stage.autoClear = false;

		var kid = this.kid;
		var req = new Request.JSON({
			url : '/kanbans/' + kid + '/background',
			method : 'get',
			onRequest : function()
			{
				// console.log('load background');
			},
			onSuccess : function(json)
			{
				console.log(json);
				var image = new Image();
				image.src = json.background;
				image.onload = function()
				{
					var bm = new createjs.Bitmap(image);
					this.stage.addChild(bm);
					this.stage.update();
				}.bind(this);

				var value_stream = json.stream;
				var space_width = $(this.container).getSize().x;
				console.log(space_width);
				var value_size = value_stream.length;
				console.log(value_size);
				var value_width = space_width / value_size;
				console.log(value_width);
				var current_x = 0;
				value_stream.each(function(el)
				{
					console.log(current_x);
					// display text
					var value_center = (current_x + (current_x + value_width)) / 2;
					console.log(value_center);
					var a_value = new createjs.Text(el.value, 'bold 36px Shadows Into Light');
					a_value.x = value_center;
					a_value.y = 10;
					this.stage.addChild(a_value);

					// draw line
					if (current_x != 0)
					{
						var s = new createjs.Shape();
						var g = s.graphics;
						g.setStrokeStyle(2, 'round', 'round');
						g.beginStroke("#EBECE4");
						g.moveTo(current_x, 50);
						g.lineTo(current_x, $(this.container).getSize().y - 20);
						this.stage.addChild(s);
					}
					this.stage.update();
					current_x += value_width;
				}.bind(this));

			}.bind(this),
			onFailure : function()
			{
			}
		});

		if (!KanbanApp.offline)
			req.send();

		this.stage.onMouseDown = function(evt)
		{
			evt.nativeEvent.preventDefault();
			evt.nativeEvent.stopPropagation();
			evt.nativeEvent.target.style.cursor = 'pointer';
			//$(evt.nativeEvent.target).setStyle('cursor',  'url(/public/images/redarrow.cur), default');

			this.isMouseDown = true;
			if (this.draw)
			{
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
			}
			else
			{
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
			}
		}.bind(this);

		this.stage.onMouseUp = function(evt)	 {
			this.isMouseDown = false;
			this.saveBackground();
			//evt.nativeEvent.target.style.cursor = 'default';
		}.bind(this);

		this.stage.onMouseMove = function(evt)	{

		}.bind(this);

		// createjs.Touch.enable(this.stage);

		this.stage.update();
		createjs.Ticker.addListener(this);
	},

	tick : function()
	{
		if (this.isMouseDown)
		{
			if (this.draw)
			{
				var pt = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
				var midPoint = new createjs.Point(this.oldX + pt.x >> 1, this.oldY + pt.y >> 1);
				this.currentDrawShape.graphics.moveTo(midPoint.x, midPoint.y);
				this.currentDrawShape.graphics.curveTo(this.oldX, this.oldY, this.oldMidX, this.oldMidY);

				this.oldX = pt.x;
				this.oldY = pt.y;

				this.oldMidX = midPoint.x;
				this.oldMidY = midPoint.y;

				this.stage.update();
			}
			else
			{
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

	saveBackground : function()
	{
		var dataURL = this.stage.toDataURL();
		var kid = this.kid;
		var req = new Request.JSON({
			url : '/kanbans/' + kid + '/background',
			data : {
				'dataURL' : dataURL,
				'id' : kid
			},
			method : 'post',
			onRequest : function()
			{
			},
			onSuccess : function(json)
			{
				alert(json);
			},
			onFailure : function()
			{
			}
		});

		if (!KanbanApp.offline)
			req.send();

	},

	addEraser : function(eraser)
	{
		$(eraser).addEvent("click", function()
		{
			this.draw = false;
		}.bind(this));
	},

	addPen : function(pen)
	{
		$(pen).addEvent("click", function()
		{
			this.draw = true;
		}.bind(this));
	}

});

function _updatePos(el)
{
	var req = new Request.JSON({
		url : '/notes/pos',
		method : 'post',
		data : {
			'id' : el.get('nid'),
			'x' : el.getPosition(container).x,
			'y' : el.getPosition(container).y
		},
		onRequest : function()
		{
			console.log('_updatePos onRequest');
		},
		onSuccess : function()
		{
			console.log('_updatePos onSuccess');
		},
		onFailure : function()
		{
			console.log('_updatePos onFailure');
		}
	});

	if (!KanbanApp.offline)
		req.send();
}

function _deleteNote(el)
{
	var req = new Request.JSON({
		url : '/notes/' + el.get('nid') + '?x-http-method-override=DELETE',
		method : 'post',
		onComplete : function()
		{
			console.log('_deleteNote onComplete');
		},
		onSuccess : function(json, txt)
		{
			console.log('_deleteNote onSuccess');
			el.destroy();
		},
		onFailure : function()
		{
			console.log('_deleteNote onFailure ');
		}
	});

	if (!KanbanApp.offline)
		req.send();
	else
		el.destroy();
}
