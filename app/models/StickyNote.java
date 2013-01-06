package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import play.db.jpa.Model;

@Entity
public class StickyNote extends Model
{
	@ManyToOne
	public Kanban kanban;
	public int x;
	public int y;


	public StickyNote(Kanban kanban, int x, int y)
	{
		this.kanban = kanban;
		this.x = x;
		this.y = y;
	}

	public StickyNote(int x, int y)
	{
		this.x = x;
		this.y = y;
	}
}
