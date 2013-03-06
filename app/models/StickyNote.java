package models;

import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.google.gson.Gson;

@MappedSuperclass
public class StickyNote extends BaseModel
{
	public int x;
	public int y;
	public String color;
	public int zindex;
	public int width;
	public int height;
	
	@ManyToOne
	public Kanban kanban;
	@ManyToOne
	public ValueStream value;
	
	
	public StickyNote(Kanban kanban, int x, int y)
	{
		this.kanban = kanban;
		this.x = x;
		this.y = y;
	}
	
	
	public String toJson()
	{
		this.kanban = null;
		this.value = null;
		return new Gson().toJson(this);
	}
	
}
