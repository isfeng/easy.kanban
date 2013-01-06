package controllers;

import java.util.Collection;

import controllers.securesocial.SecureSocial;

import play.libs.OAuth;
import play.mvc.Before;
import play.mvc.Controller;
import securesocial.provider.AuthenticationMethod;
import securesocial.provider.IdentityProvider;
import securesocial.provider.OAuth1Provider;
import securesocial.provider.OpenIDOAuthHybridProvider;
import securesocial.provider.ProviderRegistry;
import securesocial.provider.ProviderType;
import securesocial.provider.SocialUser;
import securesocial.provider.UserId;
import securesocial.provider.UserService;

public class KanbanSecure extends Controller
{
	@Before(unless = { "login", "authenticate", "authByPost", "logout" })
	static void checkAccess() throws Throwable
	{
		String tryit = flash.get("tryit");
		if (tryit == null)
		{
			final String userId = session.get("securesocial.user");
			final String networkId = session.get("securesocial.network");

			if (userId == null || networkId == null)
			{
				final String originalUrl = request.method.equals("GET") ? request.url : "/";
				flash.put("originalUrl", originalUrl);
				login();
			}
			else
			{
				UserId uid = new UserId();
				uid.id = userId;
				uid.provider = ProviderType.valueOf(networkId);

				final SocialUser user = loadCurrentUser(uid);
				if (user == null)
				{
					session.remove("securesocial.user");
					session.remove("securesocial.network");
					login();
				}
			}
		}
		flash.put("tryit", "Y");
	}


	private static SocialUser loadCurrentUser(UserId userID)
	{
		SocialUser user = UserService.find(userID);

		if (user != null)
		{
			// if the user is using OAUTH1 or OPENID HYBRID OAUTH set the ServiceInfo
			// so the app using this module can access it easily to invoke the APIs.
			if (user.authMethod == AuthenticationMethod.OAUTH1 || user.authMethod == AuthenticationMethod.OPENID_OAUTH_HYBRID)
			{
				final OAuth.ServiceInfo sinfo;
				IdentityProvider provider = ProviderRegistry.get(user.id.provider);
				if (user.authMethod == AuthenticationMethod.OAUTH1)
				{
					sinfo = ((OAuth1Provider) provider).getServiceInfo();
				}
				else
				{
					sinfo = ((OpenIDOAuthHybridProvider) provider).getServiceInfo();
				}
				user.serviceInfo = sinfo;
			}
			// make the user available in templates
			renderArgs.put("user", user);
		}
		return user;
	}


	public static void login()
	{
		SecureSocial.login();

	}
}
