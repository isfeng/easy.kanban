package controllers;

import java.util.HashMap;
import java.util.List;

import models.Kanban;
import models.TextNote;
import models.ValueStream;
import play.mvc.Controller;
import play.mvc.With;
import controllers.securesocial.SecureSocial;

@With(SecureSocial.class)
public class NoteController extends Controller
{
	private static int BOARD_WIDTH = 1153;
	
	
	public static void create(long id, String title, String note)
	{
		Kanban k = Kanban.findById(id);
		TextNote stickynote = new TextNote(k, title, note);
		stickynote.save();
		renderJSON(stickynote.id);
	}
	
	
	public static void delete(long id)
	{
		TextNote tn = TextNote.findById(id);
		tn.delete();
		
		HashMap<String, String> resp = new HashMap();
		resp.put("status", "OK");
		renderJSON(resp);
	}
	
	
	public static void updatePosition(long id, int x, int y)
	{
		TextNote stickynote = TextNote.findById(id);
		stickynote.x = x;
		stickynote.y = y;
		
		
		List<ValueStream> vs = ValueStream.find("byKanban", stickynote.kanban).fetch();
		int valueSize = vs.size();
		if (valueSize > 0)
		{
			int valueWidth = NoteController.BOARD_WIDTH / valueSize;
			
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
		
		HashMap<String, String> resp = new HashMap();
		resp.put("status", "OK");
		renderJSON(resp);
	}
	
}
