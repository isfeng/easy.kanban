package controllers;

import java.util.HashMap;
import java.util.List;

import models.DrawNote;
import models.Kanban;
import models.StickyNote;
import models.TextNote;
import models.UserKanban;
import models.ValueStream;
import models.VideoNote;
import play.libs.WS.HttpResponse;
import play.mvc.Controller;
import play.mvc.With;
import securesocial.provider.SocialUser;
import controllers.deadbolt.Deadbolt;
import controllers.securesocial.SecureSocial;
import play.modules.pusher.*;

public class NoteController extends Controller
{

	public static void create(long id, String title, String note, String color, String socket_id)
	{
		checkAccess(id);
		Kanban k = Kanban.findById(id);
		TextNote stickynote = new TextNote(k, title, note);
		stickynote.color = color;
		stickynote.save();

		try
		{
			Pusher pusher = new Pusher();
			HttpResponse response = pusher.trigger("kanban_channel_" + k.id, "create_event", stickynote.toJson(), socket_id);
		}
		catch (RuntimeException e)
		{
			e.printStackTrace();
		}

		renderJSON(stickynote.id);
	}


	public static void postURL(long id, String url, String socket_id)
	{
		checkAccess(id);
		Kanban k = Kanban.findById(id);
		DrawNote stickynote = new DrawNote(k, url);
		stickynote.save();

		try
		{
			Pusher pusher = new Pusher();
			HttpResponse response = pusher.trigger("kanban_channel_" + k.id, "create_url_event", stickynote.toJson(), socket_id);
		}
		catch (RuntimeException e)
		{
			e.printStackTrace();
		}

		renderJSON(stickynote.id);
	}


	public static void postVideo(long id, String url, String socket_id)
	{
		checkAccess(id);
		Kanban k = Kanban.findById(id);
		VideoNote stickynote = new VideoNote(k, url);
		stickynote.save();

		try
		{
			Pusher pusher = new Pusher();
			HttpResponse response = pusher.trigger("kanban_channel_" + k.id, "create_video_event", stickynote.toJson(), socket_id);
		}
		catch (RuntimeException e)
		{
			e.printStackTrace();
		}

		renderJSON(stickynote.id);
	}


	public static void delete(long id, String type, String socket_id)
	{
		StickyNote stickynote = null;
		if ("text".equals(type))
			stickynote = TextNote.findById(id);
		else if ("video".equals(type))
			stickynote = VideoNote.findById(id);
		else
			stickynote = DrawNote.findById(id);

		checkAccess(stickynote.kanban.id);
		stickynote.delete();

		try
		{
			Pusher pusher = new Pusher();
			HttpResponse response = pusher.trigger("kanban_channel_" + stickynote.kanban.id, "delete_event", Long.toString(id), socket_id);
		}
		catch (RuntimeException e)
		{
			e.printStackTrace();
		}

		HashMap<String, String> resp = new HashMap();
		resp.put("status", "OK");
		renderJSON(resp);
	}


	public static void updatePosition(long id, int x, int y, int width, int height, String color, String type, int zindex, String socket_id)
	{
		StickyNote stickynote = null;
		if ("text".equals(type))
			stickynote = TextNote.findById(id);
		else if ("video".equals(type))
			stickynote = VideoNote.findById(id);
		else
			stickynote = DrawNote.findById(id);

		checkAccess(stickynote.kanban.id);
		stickynote.x = x;
		stickynote.y = y;
		stickynote.color = color;
		stickynote.zindex = zindex;
		stickynote.width = width;
		stickynote.height = height;

		List<ValueStream> vs = ValueStream.find("byKanban", stickynote.kanban).fetch();
		int valueSize = vs.size();
		if (valueSize > 0)
		{
			int valueWidth = stickynote.kanban.board.width / valueSize;

			int current_x = 0;
			for (int i = 0; i < vs.size(); i++)
			{
				ValueStream valueStream = vs.get(i);
				valueStream.startx = current_x;
				valueStream.endx = current_x + valueWidth;
				current_x += valueWidth;
			}

			for (ValueStream valueStream : vs)
			{
				if (x >= valueStream.startx && x < valueStream.endx)
				{
					stickynote.value = valueStream;
					break;
				}
			}
		}

		stickynote.save();

		try
		{
			Pusher pusher = new Pusher();
			HttpResponse response = pusher.trigger("kanban_channel_" + stickynote.kanban.id, "update_event", stickynote.toJson(), socket_id);
		}
		catch (RuntimeException e)
		{
			e.printStackTrace();
		}

		HashMap<String, String> resp = new HashMap();
		resp.put("status", "OK");
		renderJSON(resp);
	}


	public static void updateTextNote(long id, int x, int y, int width, int height, String color, int zindex, String text, String socket_id)
	{
		TextNote stickynote = null;
		stickynote = TextNote.findById(id);

		checkAccess(stickynote.kanban.id);
		stickynote.x = x;
		stickynote.y = y;
		stickynote.color = color;
		stickynote.zindex = zindex;
		stickynote.width = width;
		stickynote.height = height;
		stickynote.note = text;

		List<ValueStream> vs = ValueStream.find("byKanban", stickynote.kanban).fetch();
		int valueSize = vs.size();
		if (valueSize > 0)
		{
			int valueWidth = stickynote.kanban.board.width / valueSize;

			int current_x = 0;
			for (int i = 0; i < vs.size(); i++)
			{
				ValueStream valueStream = vs.get(i);
				valueStream.startx = current_x;
				valueStream.endx = current_x + valueWidth;
				current_x += valueWidth;
			}

			for (ValueStream valueStream : vs)
			{
				if (x >= valueStream.startx && x < valueStream.endx)
				{
					stickynote.value = valueStream;
					break;
				}
			}
		}

		stickynote.save();

		try
		{
			Pusher pusher = new Pusher();
			HttpResponse response = pusher.trigger("kanban_channel_" + stickynote.kanban.id, "update_event", stickynote.toJson(), socket_id);
		}
		catch (RuntimeException e)
		{
			e.printStackTrace();
		}

		HashMap<String, String> resp = new HashMap();
		resp.put("status", "OK");
		renderJSON(resp);
	}


	private static void checkAccess(long id)
	{
		Kanban kanban = Kanban.findById(id);
		if (!kanban._public)
		{
			SocialUser suser = SecureSocial.getCurrentUser();
			UserKanban uk = UserKanban.findBySocialIDAndKanbanID(suser.id.id, id);
			if (uk == null)
				forbidden();
		}
	}
}
