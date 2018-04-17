package com.starkx.arpit.omega.src;

import io.socket.client.Socket;

public class SocketRegister {
	private static SocketRegister socketRegister = null;

	private SocketRegister() {
	}

	public static synchronized SocketRegister getInstance() {
		if (socketRegister == null) {
			socketRegister = new SocketRegister();
		}
		return socketRegister;
	}

	public void registerSocketEvents() {
		/*SocketConnection.getInstance().registerEvent("someEvent", new SocketEvent() {
			@Override
			public void onEventRaised(Socket socket, Object[] Data) {
				*//*Ack ack = (Ack) Data[Data.length - 1];
				ack.call();*//*
			}
		});*/
	}
}

