package macvalidate;

import java.io.IOException;
import java.math.BigInteger;
import java.net.NetworkInterface;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Enumeration;
import java.util.LinkedHashSet;
import java.util.Set;

public class Main {

	public static void main(String[] args) {
		String[] addresses = new Main().getAllMacs();
		System.out.println("printing mac addresses");
		for (String string : addresses) {
			System.out.println(string);
		}
		System.out.println("printing the hashed version of it");
		for (String string : addresses) {
			System.out.println(new Main().encryptMac(string));
		}
		System.out.println("Reading the hashed fild");
		System.out.println(new Main().readFileSerial());

	}

	public String readFileSerial() {
		try {
			String content = new String(Files.readAllBytes(Paths.get("license.lic")));
			return content;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	public String encryptMac(String input) {
		try {

			// Static getInstance method is called with hashing MD5
			MessageDigest md = MessageDigest.getInstance("MD5");

			// digest() method is called to calculate message digest
			// of an input digest() return array of byte
			byte[] messageDigest = md.digest(input.getBytes());

			// Convert byte array into signum representation
			BigInteger no = new BigInteger(1, messageDigest);

			// Convert message digest into hex value
			String hashtext = no.toString(16);
			while (hashtext.length() < 32) {
				hashtext = "0" + hashtext;
			}
			return hashtext;
		}

		// For specifying wrong message digest algorithms
		catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}

	}

	public String[] getAllMacs() {
		try {
			// DHCP Enabled - InterfaceMetric
			Set<String> macs = new LinkedHashSet<String>();

			Enumeration<NetworkInterface> nis = NetworkInterface.getNetworkInterfaces();
			while (nis.hasMoreElements()) {
				NetworkInterface ni = nis.nextElement();
				byte mac[] = ni.getHardwareAddress(); // Physical Address (MAC - Medium Access Control)
				if (mac != null) {
					final StringBuilder macAddress = new StringBuilder();
					for (int i = 0; i < mac.length; i++) {
						macAddress.append(String.format("%s" + "%02x", (i == 0) ? "" : "~", mac[i]));
						// macAddress.append(String.format(format+"%s", mac[i], (i < mac.length - 1) ?
						// ":" : ""));
					}
					macs.add(macAddress.toString());
				}
			}
			return macs.toArray(new String[0]);
		} catch (Exception ex) {
			System.err.println("Exception:: " + ex.getMessage());
			ex.printStackTrace();
		}
		return new String[0];
	}
}