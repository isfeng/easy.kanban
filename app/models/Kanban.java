package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import play.db.jpa.Model;

@Entity
public class Kanban extends Model
{
	public String goal;
	public String name;
	@Column(length = 65535)
	public String background;

	@ManyToOne
	public User user;

}
