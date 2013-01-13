package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
public class ValueStream extends BaseModel
{
	public String value;
	public int startx;
	public int endx;

	@ManyToOne
	public Kanban kanban;


	public ValueStream(String value, Kanban k)
	{
		this.value = value;
		this.kanban = k;
	}
}
