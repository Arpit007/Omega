package com.starkx.arpit.omega.Util;

import android.content.Context;
import android.content.SharedPreferences;

public class Config {
	private String token = "", url = "";
	static private Config config = null;

	private Config() {
	}

	synchronized public static Config getConfig(Context context) {
		if (config == null) {
			config = new Config();
			config.readToken(context);
			config.readUrl(context);
		}
		return config;
	}

	private String read(Context context, String var){
		SharedPreferences preferences = context.getSharedPreferences("app", Context.MODE_PRIVATE);
		return preferences.getString(var, "");
	}

	private void save(Context context, String var, String value) {
		SharedPreferences.Editor editor = context.getSharedPreferences("app", Context.MODE_PRIVATE).edit();
		editor.putString(var, value);
		editor.apply();
	}

	public void readToken(Context context) {
		token = read(context, "token");
	}

	public void saveToken(Context context, String token) {
		this.token = token;
		save(context, "token", token);
	}

	public void readUrl(Context context) {
		url = read(context, "url");
	}

	public void saveUrl(Context context, String url) {
		this.url = url;
		save(context, "url", url);
	}

	public String getToken() {
		return token;
	}

	public String getUrl(){
		return url;
	}
}
