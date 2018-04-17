package com.starkx.arpit.omega.Util;

import android.content.Context;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Response;
import com.android.volley.toolbox.JsonObjectRequest;
import com.starkx.arpit.omega.App;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class JRequest extends JsonObjectRequest {

	public JRequest(int method, String url, JSONObject jsonRequest,
	                Response.Listener<JSONObject> listener, Response.ErrorListener errorListener) {
		super(method, url, jsonRequest, listener, errorListener);
	}

	@Override
	public Map<String, String> getHeaders() throws AuthFailureError {
		Map<String, String> headers = new HashMap<>(super.getHeaders());
		headers.put("access-token", Config.getConfig(App.getInstance()).getToken());
		return headers;
	}
}
