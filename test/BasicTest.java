import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.MultiPartEmail;
import org.apache.commons.mail.SimpleEmail;
import org.junit.Test;

import play.libs.Mail;
import play.test.UnitTest;

public class BasicTest extends UnitTest
{
	
	@Test
	public void aVeryImportantThingToTest() throws EmailException
	{
		SimpleEmail email = new SimpleEmail();
		email.setFrom("sergio.huang@gmail.com");
		email.addTo("sergio.huang@gmail.com");
		email.setSubject("subject");
		email.setMsg("Message");
		Mail.send(email);
	}
	
}
