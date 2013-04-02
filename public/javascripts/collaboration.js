var Collaboration = new Class({

	Implements: [Options, Events],

	options: {

	},

	kanban: null,

	initialize: function(k, debug) {
		// console.log('initialize');
		this.kanban = k;

		if (debug) {
			Pusher.log = function(message) {
				if (window.console && window.console.log) window.console.log(message);
			};
			// Flash fallback logging - don't include this in production
			WEB_SOCKET_DEBUG = true;
		}
	},

	listenChannel: function(pusher_key) {
		// console.log('start listening channel ' + this.kanban.kid);
		var pusher = new Pusher(pusher_key);
		var channel = pusher.subscribe('kanban_channel_' + this.kanban.kid);

		pusher.connection.bind('connected', function() {
			this.socket_id = pusher.connection.socket_id;
			// console.log('connected '+ this.socket_id);
			this.kanban.setSocket_id(this.socket_id);
		}.bind(this));

		channel.bind('create_event', function(data) {
			// console.log("create_event - " + data);
			// console.log('create_event color '+data.color);
			this.kanban.stickText(StickyNote.buildNoteEl(data.id, data.title, data.note), data.x, data.y, data.color, false, data.zindex, data.width, data.height);
		}.bind(this));

		channel.bind('create_url_event', function(data) {
			// console.log("create_event - " + data);
			this.kanban.stickUrl(StickyNote.buildUrlEl(data.id, data.url), data.x, data.y, data.color, false, data.zindex);
		}.bind(this));

		channel.bind('create_video_event', function(data) {
			// console.log("create_event - " + data);
			this.kanban.stickUrl(StickyNote.buildVideoEl(data.id, data.url), data.x, data.y, data.color, false, data.zindex);
		}.bind(this));

		channel.bind('update_event', function(data) {
			// console.log("update_event - " + data);
			var el = document.id('nid' + data.id);
			el.morph({
				height: data.height,
				width: data.width,
				left: data.x,
				top: data.y,
				zIndex: data.zindex
			});
			if (data.note) el.getElement('p').set('text', data.note);
		}.bind(this));

		channel.bind('delete_event', function(data) {
			// console.log("delete_event - " + data);
			var el = document.id('nid' + data);
			el.set('tween', {
				onComplete: function() {
					el.destroy();
				}
			}).fade(0);
		}.bind(this));
	}

});