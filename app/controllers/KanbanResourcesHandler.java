package controllers;

import java.util.List;
import java.util.Map;

import models.deadbolt.AccessResult;
import controllers.deadbolt.RestrictedResourcesHandler;

public class KanbanResourcesHandler implements RestrictedResourcesHandler
{
	
	@Override
	public AccessResult checkAccess(List<String> resourceNames, Map<String, String> resourceParameters)
	{
		System.out.println(resourceNames);
		System.out.println(resourceParameters);
		return AccessResult.ALLOWED;
	}
	
}
