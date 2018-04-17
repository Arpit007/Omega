package com.starkx.arpit.omega.UI;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.starkx.arpit.omega.R;

public class Url extends AppCompatActivity {
	SharedPreferences preferences;
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
		preferences = getSharedPreferences("app", MODE_PRIVATE);
		String currentUrl = preferences.getString("url", "");
		if (currentUrl.isEmpty()) {
			update.setText(R.string.setUrl);
		}
		url.setText(currentUrl);
	}

	void setUp() {
		update.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View view) {
				String newUrl = url.getText().toString();
				if (newUrl.isEmpty()) {
					Toast.makeText(Url.this, "Enter Url First", Toast.LENGTH_SHORT).show();
				}
				else {
					SharedPreferences.Editor editor = preferences.edit();
					editor.putString("url", newUrl);
					editor.apply();
					Toast.makeText(getApplicationContext(), "Url Updated Successfully", Toast.LENGTH_LONG).show();
					Intent intent;
					if (preferences.getString("access-token", "").isEmpty()) {
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
