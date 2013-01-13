package controllers;

import models.deadbolt.RoleHolder;
import controllers.deadbolt.DeadboltHandler;
import controllers.deadbolt.ExternalizedRestrictionsAccessor;
import controllers.deadbolt.RestrictedResourcesHandler;

public class KanbanAccessHandler implements DeadboltHandler
{

	@Override
	public void beforeRoleCheck()
	{
		// TODO Auto-generated method stub

	}


	@Override
	public RoleHolder getRoleHolder()
	{
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public void onAccessFailure(String controllerClassName)
	{
		// TODO Auto-generated method stub

	}


	@Override
	public ExternalizedRestrictionsAccessor getExternalizedRestrictionsAccessor()
	{
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public RestrictedResourcesHandler getRestrictedResourcesHandler()
	{
		// TODO Auto-generated method stub
		return null;
	}

}
