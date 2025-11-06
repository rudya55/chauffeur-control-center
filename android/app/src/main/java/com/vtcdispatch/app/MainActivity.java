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

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		createNotificationChannelIfNeeded();
	}

	private void createNotificationChannelIfNeeded() {
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
			NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
			if (nm == null) return;

			// Use default notification sound unless an app-specific sound is added to res/raw
			Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

			AudioAttributes audioAttributes = new AudioAttributes.Builder()
					.setUsage(AudioAttributes.USAGE_NOTIFICATION)
					.setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
					.build();

			NotificationChannel channel = new NotificationChannel(
					CHANNEL_ID_RIDES,
					"Nouvelles courses",
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
