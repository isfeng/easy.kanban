
//google web font
WebFontConfig =
{
	google :
	{
		families : [ 'Shadows+Into+Light::latin' ]
	}
};

(function() {
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http')
			+ '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
})();


Mooml.register('text_note_tmpl', function() {
    div(
		div ({'id':'text_note_form'},
            label('Title'),
            input({'type':'text', 'id':'text_note_title'}),
            label('Note'),
            textarea({'id':'text_note_area'})
    	)
	);
});

Mooml.register('post_tmpl', function(note) {
    div({'class':'note', 'nid':note.nid},
        h6(note.title),
        p(note.note)
    );
});


var StickyNote = new Class
({

	Implements:[Options, Events, Mooml.Templates],

	options:
	{
		onTextOk: Class.empty,
		onDrawOk: Class.empty,
		onMove: Class.empty
	},

	initialize:function(options)
	{
		this.setOptions(options);
	},

	tear: function()
	{
		alert('tear');
	},

	showTextForm: function()
	{
		this.sm = new SimpleModal({"btn_ok":"post it"});
        this.sm.addButton("post it", "btn primary", function(){
        	this._onTextOK($('text_note_title').value, $('text_note_area').value);
        	this.fireEvent('textOk', this.post_text_el);
        	this.hide();
        }.bind(this));
        this.sm.addButton("Cancel", "btn secondary");
        this.sm.show({
            "model": "modal",
            "title": "Title",
            "contents": Mooml.render('text_note_tmpl').get('html')
        });
	},

	showDrawForm: function()
	{

	},

	hide: function()
	{
		this.sm.hide();
	},

	_onTextOK: function(title, note)
	{
		var req = new Request.JSON({
		    url: 'notes',
		    method: 'post',
		    data: {'kid':'1', 'title':title, 'note':note},
		    async: false,
		    onRequest: function() {
//		        console.log('onRequest');
		    },
		    onSuccess: function(nid) {
		       	this.nid = nid;
		    }.bind(this),
		    onFailure: function() {
		        console.log('onFailure');
		    }
		});

		req.send();
		//
		this.title = title;
		this.note = note;
		this.post_text_el = Mooml.render('post_tmpl',{'title':title,'note':note,'nid':this.nid});
	},

	_onDrawOK: function()
	{

	}


});

StickyNote.buildNoteEl = function(nid, title, note)
{
	return Mooml.render('post_tmpl',{'title':title,'note':note,'nid':nid});
}

var PostStack = new Class
({

	Implements:[Options, Events],

	options:
	{

	},

	/* add edit event */
	initialize:function(kanban, stack)
	{
		this.kanban = kanban;
		$(stack).addEvent("click", function(){
			this.pull();
			}.bind(this)
		);
	},

	pull: function()
	{
		var stickyNote = new StickyNote({onTextOk: function(el){
				this.kanban.stickText(el, 0, 0);
			}.bind(this)
		});
		stickyNote.showTextForm();
	}

});

var Kanban = new Class
({

	Implements:[Options, Events],

	options:
	{

	},

	initialize:function(container, kid)
	{
		this.kid = kid;
		this.container = container;

	},

	stickText: function(textNote, x, y)
	{
		var el = textNote.inject($(this.container));
		new Drag.Move(el,{
            container : this.container,
            onComplete: function()
            {
            	var req = new Request.JSON({
				    url: 'notes/pos',
				    method: 'post',
				    data: {'nid':el.get('nid'),'x':el.getPosition('space').x, 'y':el.getPosition('space').y},
				    onRequest: function() {
//						console.log(el.getPosition('space'));
				    },
				    onSuccess: function(nid) {
//				       	console.log('onSuccess');
				    },
				    onFailure: function() {
				        console.log('onFailure');
				    }
				});

				req.send();
            	//
            }
        })

        el.setPosition({'x':x,'y':y});
	},

	stickDraw: function()
	{

	},

	clear: function()
	{

	},

	load: function()
	{
		var req = new Request.JSON({
		    url: 'kanbans/'+this.kanbanID,
		    method: 'get',
		    onRequest: function(){
//		        console.log('onRequest');
		    },
		    onSuccess: function(json){
		        json.each(function(el){
//		        	console.log(el);
		        	this.stickText(StickyNote.buildNoteEl(el.id, el.title, el.note), el.x, el.y);
		        }.bind(this));
		    }.bind(this),
		    onFailure: function(){
		        console.log('onFailure');
		    }
		});

		req.send();

		this._loadBackground();
	},

	addStack: function(stack)
	{
		var postStack = new PostStack(this, stack);
	},

	_loadNotes: function()
	{

	},

	_loadBackground: function()
	{
		this.canvas = document.getElementById("mycanvas");
        console.log($('space').getSize());
        this.canvas.width  = $('space').getSize().x;
        this.canvas.height = $('space').getSize().y;

        this.stage = new createjs.Stage(this.canvas);
        this.stage.autoClear = true;
        this.stage.onMouseDown = function(){
			this.isMouseDown = true;

	        var s = new createjs.Shape();
	        this.oldX = this.stage.mouseX;
	        this.oldY = this.stage.mouseY;
	        this.oldMidX = this.stage.mouseX;
	        this.oldMidY = this.stage.mouseY;
	        var g = s.graphics;
	        var thickness = 5;
	        g.setStrokeStyle(thickness + 1, 'round', 'round');
	        var color = createjs.Graphics.getRGB(0, 0, 0);
	        g.beginStroke(color);
	        this.stage.addChild(s);
	        this.currentShape = s;
        }.bind(this);

        this.stage.onMouseUp = function(){
        	this.isMouseDown = false;
        }.bind(this);

		createjs.Touch.enable(this.stage);

        this.stage.update();
		createjs.Ticker.addListener(this);
	},

	tick: function()
	{
        if (this.isMouseDown)
        {
            var pt = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
            var midPoint = new createjs.Point(this.oldX + pt.x>>1, this.oldY+pt.y>>1);
            this.currentShape.graphics.moveTo(midPoint.x, midPoint.y);
            this.currentShape.graphics.curveTo(this.oldX, this.oldY, this.oldMidX, this.oldMidY);

            this.oldX = pt.x;
            this.oldY = pt.y;

            this.oldMidX = midPoint.x;
            this.oldMidY = midPoint.y;

            this.stage.update();
        }
    }

});