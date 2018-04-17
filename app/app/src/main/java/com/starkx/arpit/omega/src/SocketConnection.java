package com.starkx.arpit.omega.src;


import android.util.Log;

import com.starkx.arpit.omega.App;
import com.starkx.arpit.omega.R;
import com.starkx.arpit.omega.Util.Config;

import io.socket.client.Ack;
import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class SocketConnection {
	private static SocketConnection socketConnection;
	private String Route;
	private Socket socket;
	private Boolean unAuthorized = false;
	private SocketEvent Connect = null;
	private SocketEvent Disconnect = null;
	private SocketEvent unAuthorizedEvent = null;
	private String Url;

	private SocketConnection() {
		socketConnection = this;
		Route = App.getInstance().getApplicationContext().getString(R.string.socket);
		Url = Config.getConfig(App.getInstance().getApplicationContext()).getUrl() + Route;
	}

	public static synchronized SocketConnection getInstance() {
		if (socketConnection == null) {
			socketConnection = new SocketConnection();
		}
		return socketConnection;
	}

	public void initialize() {
		try {
			final String token = Config.getConfig(App.getInstance()).getToken();
			if (token.isEmpty()) {
				return;
			}
			socket = IO.socket(Url);
			socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
				@Override
				public void call(Object... args) {
					try {
						if (Connect != null) {
							Connect.onEventRaised(socket, null);
						}
						socket.emit("verify", String.format("{\"auth-token\":%s}", token), new Ack() {
							@Override
							public void call(Object... args) {
								Log.d("", "");
								unAuthorized = false;
								if (unAuthorized && unAuthorizedEvent != null) {
									unAuthorizedEvent.onEventRaised(socket, null);
								}
								SocketRegister.getInstance().registerSocketEvents();
							}
						});
					}
					catch (Exception e) {
						e.printStackTrace();
					}
				}
			}).on(Socket.EVENT_DISCONNECT, new Emitter.Listener() {
				@Override
				public void call(Object... args) {
					if (Disconnect != null) {
						Disconnect.onEventRaised(socket, null);
					}
				}
			});
			socket.connect();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void reconnect() {
		if (unAuthorized) {
			return;
		}
		if (socket == null) {
			initialize();
		}

		if (socket != null && !isConnected()) {
			socket.connect();
		}
	}

	public void registerEvent(String Name, final SocketEvent event) {
		if (socket != null) {
			socket.on(Name, new Emitter.Listener() {
				@Override
				public void call(Object... args) {
					if (event != null) {
						event.onEventRaised(socket, args);
					}
				}
			});
		}
	}

	public void setOnConnectListener(SocketEvent event) {
		Connect = event;
	}

	public void setOnDisconnectListener(SocketEvent event) {
		Disconnect = event;
	}

	public void setOnUnAuthoeizedListener(SocketEvent event) {
		unAuthorizedEvent = event;
	}

	public boolean isConnected() {
		return ( socket != null && socket.connected() );
	}

	public void reAuthorisedReconnect() {
		Url = Config.getConfig(App.getInstance().getApplicationContext()).getUrl() + Route;
		unAuthorized = false;
		reconnect();
	}
}

