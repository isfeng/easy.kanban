package models;

import javax.persistence.Entity;

import play.db.jpa.Model;
import securesocial.provider.ProviderType;

@Entity
public class User extends Model
{
	public String email;
	public String name;
	public String socialID;
	public ProviderType providerType;
}
