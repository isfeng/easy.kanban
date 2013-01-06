package models;

import securesocial.provider.SocialUser;
import securesocial.provider.UserId;
import securesocial.provider.UserServiceDelegate;

public class KanbanUserService implements UserServiceDelegate
{

	@Override
	public SocialUser find(UserId id)
	{
		SocialUser suser = new SocialUser();
		User user = User.find("bySocialID", id.id).first();
		if (user != null)
		{
			suser.email = user.email;
			suser.displayName = user.name;
			return suser;
		}
		else
			return null;
	}


	@Override
	public SocialUser find(String email)
	{
		SocialUser suser = new SocialUser();
		User user = User.find("byEmail", email).first();
		if (user != null)
		{
			suser.email = user.email;
			suser.displayName = user.name;
			return suser;
		}
		else
			return null;
	}


	@Override
	public void save(SocialUser user)
	{
		User kanbanUser = new User();
		kanbanUser.name = user.displayName;
		kanbanUser.email = user.email;
		kanbanUser.socialID = user.id.id;
		kanbanUser.save();
	}


	@Override
	public String createActivation(SocialUser user)
	{
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public boolean activate(String uuid)
	{
		// TODO Auto-generated method stub
		return false;
	}


	@Override
	public String createPasswordReset(SocialUser user)
	{
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public SocialUser fetchForPasswordReset(String username, String uuid)
	{
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public void disableResetCode(String username, String uuid)
	{
		// TODO Auto-generated method stub

	}


	@Override
	public void deletePendingActivations()
	{
		// TODO Auto-generated method stub

	}

}
