package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import play.db.jpa.Model;

@Entity
public class ValueStream extends Model
{
	public String value;
	public int _order;

	@ManyToOne
	public Kanban kanban;


	public ValueStream(String value)
	{
		this.value = value;
	}
}
