package models;

import javax.persistence.Entity;

@Entity
public class DrawNote extends StickyNote
{

	public DrawNote(Kanban kanban, int x, int y)
	{
		super(kanban, x, y);
		// TODO Auto-generated constructor stub
	}

}
