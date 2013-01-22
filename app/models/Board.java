package models;

import javax.persistence.Entity;

@Entity
public class Board extends BaseModel
{
	public int width;
	public int height;
	public String name;
	
	
	public static Board getDefaultBoard(String size)
	{
		return Board.find("byName", size).first();
	}
}
