package models;

import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import play.db.jpa.Model;

@MappedSuperclass
public class StickyNote extends Model
{
	public int x;
	public int y;

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

}
