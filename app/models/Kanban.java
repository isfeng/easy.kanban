package models;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.OneToOne;

@Entity
public class Kanban extends BaseModel
{
	public String goal;
	public String name;
	@Lob
	public String background = "";
	
	@OneToOne
	public Board board;

	public boolean _public;

}
