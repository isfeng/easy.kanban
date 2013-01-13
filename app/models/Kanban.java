package models;

import javax.persistence.Entity;
import javax.persistence.Lob;

@Entity
public class Kanban extends BaseModel
{
	public String goal;
	public String name;
	@Lob
	public String background = "";

}
