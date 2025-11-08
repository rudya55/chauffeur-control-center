package com.vtcdispatch.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
	private static final String CHANNEL_ID_RIDES = "rides_channel";
	private static final String[] SOUND_KEYS = new String[]{ "default", "alert1", "alert2", "chime" };

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		createNotificationChannelIfNeeded();
	}

	private void createNotificationChannelIfNeeded() {
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
			NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
			if (nm == null) return;

			// Create one notification channel per available sound so the user can
			// select a different sound in app settings. If a native sound file
			// exists in res/raw (e.g. res/raw/alert1.mp3), the channel will use it.
			AudioAttributes audioAttributes = new AudioAttributes.Builder()
					.setUsage(AudioAttributes.USAGE_NOTIFICATION)
					.setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
					.build();

			for (String key : SOUND_KEYS) {
				Uri soundUri;
				if ("default".equals(key)) {
					soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
				} else {
					int resId = getResources().getIdentifier(key, "raw", getPackageName());
					if (resId != 0) {
						soundUri = Uri.parse("android.resource://" + getPackageName() + "/" + resId);
					} else {
						// Fallback to default if the resource is not present
						soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
					}
				}

				String channelId = CHANNEL_ID_RIDES + "_" + key;
				String channelName = "Nouvelles courses" + ("default".equals(key) ? "" : " - " + key);

				NotificationChannel channel = new NotificationChannel(
					channelId,
					channelName,
					NotificationManager.IMPORTANCE_HIGH
				);
				channel.setDescription("Notifications de nouvelles courses");
				channel.setVibrationPattern(new long[]{0, 200, 100, 200});
				channel.setSound(soundUri, audioAttributes);
				channel.enableLights(true);
				channel.enableVibration(true);

				nm.createNotificationChannel(channel);
			}
		}
	}
}
