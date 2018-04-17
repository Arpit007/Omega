package com.starkx.arpit.omega.src;

import io.socket.client.Socket;

public interface SocketEvent {
	void onEventRaised(Socket socket, Object[] Data);
}
