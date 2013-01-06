package models;

import javax.persistence.Entity;

import play.db.jpa.Model;

@Entity
public class User extends Model
{
	public String email;
	public String name;
	public String socialID;
}
