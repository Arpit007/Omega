package com.starkx.arpit.omega.UI;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.widget.Toast;

import com.starkx.arpit.omega.R;
import com.starkx.arpit.omega.Util.Permission;

public class Splash extends BaseActivity {
	private static final int PermissionRequest = 100;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_splash);

		checkPermissions();
	}

	void checkPermissions() {
		String[] Permissions = Permission.getUnGrantedPermissions(this);
		if (Permissions != null && Permissions.length > 0) {
			ActivityCompat.requestPermissions(this, Permissions, PermissionRequest);
		}
		else {
			loadApp();
		}
	}

	void loadApp() {
		new Handler().postDelayed(new Runnable() {
			@Override
			public void run() {
				startActivity(new Intent(Splash.this, Url.class));
				finish();
			}
		}, getResources().getInteger(R.integer.SplashDuration));
	}

	public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
		switch (requestCode) {
			case PermissionRequest:
				String[] Perms = Permission.getUnGrantedPermissions(this);
				if (Perms != null && Perms.length != 0) {
					Toast.makeText(this, "Requested Permission Not granted, Exiting", Toast.LENGTH_LONG).show();
					new Handler().postDelayed(new Runnable() {
						@Override
						public void run() {
							System.exit(-1);
						}
					}, 2000);
				}
				else {
					loadApp();
				}
		}
	}
}
