package models;

import javax.persistence.Entity;

@Entity
public class Board extends BaseModel
{
	public int width;
	public int height;
	public String name;
	
	
	public static Board getDefaultBoard()
	{
		return Board.find("byName", "default").first();
	}
}
