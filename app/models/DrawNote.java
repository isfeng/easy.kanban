package models;

import javax.persistence.Entity;

import com.google.gson.Gson;

@Entity
public class DrawNote extends StickyNote
{
	public String url;
	
	
	public DrawNote(Kanban kanban, int x, int y)
	{
		super(kanban, x, y);
	}
	
	
	public DrawNote(Kanban kanban, String url)
	{
		super(kanban, 0, 0);
		this.url = url;
	}
	
	
	public String toJson()
	{
		this.kanban = null;
		this.value = null;
		return new Gson().toJson(this);
	}
	
}
