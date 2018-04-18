package com.starkx.arpit.omega.src;


import com.starkx.arpit.omega.App;
import com.starkx.arpit.omega.R;
import com.starkx.arpit.omega.Util.Config;

import org.json.JSONObject;

import java.net.URI;

import io.socket.client.Ack;
import io.socket.client.Manager;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class SocketConnection {
	private static SocketConnection socketConnection;
	private String Route;
	private Socket socket;
	private Boolean unAuthorized = false;
	private SocketEvent Connect = null;
	private SocketEvent Disconnect = null;
	private SocketEvent UnAuthorisedEvent = null;
	private String Url;

	private SocketConnection() {
		socketConnection = this;
		Route = App.getInstance().getApplicationContext().getString(R.string.socket);
		Url = Config.getConfig(App.getInstance().getApplicationContext()).getUrl();
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
			Manager manager = new Manager(new URI(Url));
			socket = manager.socket(Route);
			socket.connect();
			socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
				@Override
				public void call(Object... args) {
					try {
						socket.once("authenticate", new Emitter.Listener() {
							@Override
							public void call(Object... args) {
								try {
									String data = "{auth-token:" + token + "}";
									Ack ack = (Ack) args[0];
									ack.call(new JSONObject(data));
								}
								catch (Exception e) {
									e.printStackTrace();
								}
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
			}).on("authenticated", new Emitter.Listener() {
				@Override
				public void call(Object... args) {
					SocketRegister.getInstance().registerEvents();
					if (Connect != null) {
						Connect.onEventRaised(socket, null);
					}
				}
			}).on("unauthorised", new Emitter.Listener() {
				@Override
				public void call(Object... args) {
					unAuthorized = true;
					socket.close();
					try{
						UnAuthorisedEvent.onEventRaised(socket, null);
					}
					catch (Exception e){}
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

	public void setOnUnAuthorisedEventListener(SocketEvent event) {
		UnAuthorisedEvent = event;
	}

	public boolean isConnected() {
		return ( socket != null && socket.connected() );
	}

	public void reAuthorisedReconnect() {
		Url = Config.getConfig(App.getInstance().getApplicationContext()).getUrl();
		unAuthorized = false;
		reconnect();
	}
}

