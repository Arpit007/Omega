package com.starkx.arpit.omega.UI;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.starkx.arpit.omega.R;
import com.starkx.arpit.omega.src.SocketConnection;

public class Url extends BaseActivity {
	EditText url;
	Button update;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_url);

		url = findViewById(R.id.newUrl);
		update = findViewById(R.id.update);

		fetchUrl();
		setUp();
	}

	void fetchUrl() {
		String currentUrl = getUrl();
		if (currentUrl.isEmpty()) {
			update.setText(R.string.setUrl);
		}
		url.setText(currentUrl);
	}

	void setUp() {
		update.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View view) {
				String newUrl = url.getText().toString().trim();
				if (newUrl.isEmpty()) {
					showShortMessage("Enter Url First");
				}
				else {
					getConfig().saveUrl(getApplicationContext(), newUrl);
					SocketConnection.getInstance().reAuthorisedReconnect();
					showShortMessage("Url Updated Successfully");
					Intent intent;
					if (getToken().isEmpty()) {
						intent = new Intent(Url.this, Login.class);
					}
					else {
						intent = new Intent(Url.this, MainActivity.class);
					}
					startActivity(intent);
					finish();
				}
			}
		});
	}
}
