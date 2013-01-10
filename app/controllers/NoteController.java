package controllers;

import java.util.List;

import models.Kanban;
import models.TextNote;
import models.ValueStream;
import play.mvc.Controller;
import play.mvc.With;

@With(KanbanSecure.class)
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
		renderJSON("OK");
	}
	
	
	public static void updatePosition(long id, int x, int y)
	{
		TextNote stickynote = TextNote.findById(id);
		stickynote.x = x;
		stickynote.y = y;
		
		
		List<ValueStream> vs = ValueStream.find("byKanban", stickynote.kanban).fetch();
		int valueSize = vs.size();
		int valueWidth = NoteController.BOARD_WIDTH / valueSize;
		
		int current_x = 0;
		for (int i = 0; i < vs.size(); i++)
		{
			ValueStream valueStream = vs.get(i);
			valueStream.start = current_x;
			valueStream.end = current_x + valueWidth;
			current_x += valueWidth;
		}
		
		for (ValueStream valueStream : vs)
		{
			if (x >= valueStream.start && x < valueStream.end)
			{
				stickynote.value = valueStream;
				break;
			}
		}
		
		stickynote.save();
		renderJSON("OK");
	}
	
}
