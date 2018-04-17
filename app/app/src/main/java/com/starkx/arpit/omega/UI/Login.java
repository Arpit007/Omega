package com.starkx.arpit.omega.UI;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.Volley;
import com.starkx.arpit.omega.R;
import com.starkx.arpit.omega.Util.JRequest;

import org.json.JSONObject;

public class Login extends BaseActivity {
	EditText password, handle;
	Button login;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_login);
		bindViews();
	}

	void bindViews() {
		password = findViewById(R.id.password);
		handle = findViewById(R.id.handle);
		login = findViewById(R.id.login);

		login.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View view) {
				String userHandle = handle.getText().toString().trim();
				String userPassword = password.getText().toString();

				if (userHandle.isEmpty()) {
					showShortMessage("User Handle Missing");
					return;
				}
				else if (userPassword.isEmpty()) {
					showShortMessage("Password Required");
					return;
				}

				try {

					String url = getUrl() + getString(R.string.deviceLogin);

					JSONObject body = new JSONObject();
					body.put("email", userHandle);
					body.put("password", userPassword);

					showProgress();

					JRequest request = new JRequest(Request.Method.POST, url, body, new Response.Listener<JSONObject>() {
						@Override
						public void onResponse(JSONObject response) {
							try {
								String authToken = response.getJSONObject("body").getString("auth-token");
								getConfig().saveUrl(getApplicationContext(), authToken);
								showShortMessage("Success");
								Intent intent = new Intent(Login.this, MainActivity.class);
								startActivity(intent);
								finish();
							}
							catch (Exception e) {
								e.printStackTrace();
								showShortMessage("Please Try again");
							}
							finally {
								dismissProgress();
							}
						}
					}, new Response.ErrorListener() {
						@Override
						public void onErrorResponse(VolleyError error) {
							try {
								dismissProgress();
								JSONObject res = new JSONObject(new String(error.networkResponse.data));
								if (error.networkResponse.statusCode == 503) {
									showShortMessage("Server Error");
								}
								else if (error.networkResponse.statusCode == 400) {
									if (res.getJSONObject("head").getString("msg").equals("unsupported_client")) {
										if (res.getJSONObject("body").getString("tag").equals("user_not_authenticated")) {
											showShortMessage("UnAuthorised");
										}
									}
									else if (res.getJSONObject("head").getString("msg").equals("invalid_request")) {
										if (res.getJSONObject("body").getString("tag").equals("missing_parameter")) {
											showShortMessage("Login Fields Missing");
										}
										else if (res.getJSONObject("body").getString("tag").equals("invalid_user")) {
											showShortMessage("Invalid User/Password");
										}
									}
								}
								else {
									showShortMessage("Some Error Occurred");
								}
							}
							catch (Exception e) {
								e.printStackTrace();
								showShortMessage("Please Try Again");
							}
						}
					});
					RequestQueue queue = Volley.newRequestQueue(getBaseContext());
					queue.add(request);
				}
				catch (Exception e) {
					e.printStackTrace();
					dismissProgress();
					showShortMessage("Please Try Again");
				}
			}
		});
	}
}
