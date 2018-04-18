package com.starkx.arpit.omega.UI;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import com.starkx.arpit.omega.R;
import com.starkx.arpit.omega.src.FileExplorer;
import com.starkx.arpit.omega.src.SocketConnection;
import com.starkx.arpit.omega.src.SocketEvent;

import io.socket.client.Socket;

public class MainActivity extends BaseActivity {
	private TextView status;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		setup();
	}

	void setup() {
		status = findViewById(R.id.status);

		SocketConnection.getInstance().reAuthorisedReconnect();

		SocketConnection.getInstance().setOnConnectListener(new SocketEvent() {
			@Override
			public void onEventRaised(Socket socket, Object[] Data) {
				runOnUiThread(new Runnable() {
					@Override
					public void run() {
						status.setText(R.string.Connected);
					}
				});
			}
		});

		SocketConnection.getInstance().setOnDisconnectListener(new SocketEvent() {
			@Override
			public void onEventRaised(Socket socket, Object[] Data) {
				runOnUiThread(new Runnable() {
					@Override
					public void run() {
						status.setText(R.string.Disconnected);
					}
				});
			}
		});

		/*SocketConnection.getInstance().setOnUnAuthorisedEventListener(new SocketEvent() {
			@Override
			public void onEventRaised(Socket socket, Object[] Data) {
				Intent intent = new Intent(MainActivity.this, Login.class);
				startActivity(intent);
				finish();
			}
		});*/

		if (SocketConnection.getInstance().isConnected()) {
			status.setText(R.string.Connected);
		}
		else {
			status.setText(R.string.Disconnected);
		}
	}
}
