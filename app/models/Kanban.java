package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

import org.hibernate.type.TextType;

import play.db.jpa.Model;

@Entity
public class Kanban extends Model
{
	public String goal;
	public String name;
	@Lob
	public String background = "";
	
	@ManyToOne
	public User user;
	
}
