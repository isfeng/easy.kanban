package models;

import javax.persistence.Entity;

import com.google.gson.Gson;

@Entity
public class TextNote extends StickyNote
{
	public TextNote(Kanban kanban, int x, int y, String title, String note)
	{
		super(kanban, x, y);
		this.title = title;
		this.note = note;
	}
	
	
	public TextNote(Kanban kanban, String title, String note)
	{
		super(kanban, 0, 0);
		this.title = title;
		this.note = note;
	}
	
	
	public String title;
	public String note;
	
	
	public String toJson()
	{
		this.kanban = null;
		this.value = null;
		return new Gson().toJson(this);
	}
}
