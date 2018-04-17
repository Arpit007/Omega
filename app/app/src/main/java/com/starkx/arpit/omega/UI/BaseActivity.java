package com.starkx.arpit.omega.UI;

import android.app.ProgressDialog;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.widget.Toast;

import com.starkx.arpit.omega.Util.Config;

public abstract class BaseActivity extends AppCompatActivity {
	private ProgressDialog progressDialog;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
	}

	@Override
	protected void onPostCreate(@Nullable Bundle savedInstanceState) {
		super.onPostCreate(savedInstanceState);

		progressDialog = new ProgressDialog(BaseActivity.this);
		progressDialog.setMessage("Please Wait...");
		progressDialog.setCancelable(false);
	}

	public void showShortMessage(String message) {
		Toast.makeText(getBaseContext(), message, Toast.LENGTH_SHORT).show();
	}

	public void showLongMessage(String message) {
		Toast.makeText(getBaseContext(), message, Toast.LENGTH_LONG).show();
	}

	public String getUrl() {
		return Config.getConfig(getApplicationContext()).getUrl();
	}

	public String getToken() {
		return Config.getConfig(getApplicationContext()).getToken();
	}

	public Config getConfig() {
		return Config.getConfig(getApplicationContext());
	}

	public void showProgress() {
		progressDialog.show();
	}

	public void dismissProgress() {
		progressDialog.dismiss();
	}
}
