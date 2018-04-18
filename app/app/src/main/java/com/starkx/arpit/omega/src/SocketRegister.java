package com.starkx.arpit.omega.src;

import android.util.Pair;

import java.util.ArrayList;

import io.socket.client.Ack;
import io.socket.client.Socket;

public class SocketRegister {
	private ArrayList<Pair<String, SocketEvent>> events;
	private static SocketRegister socketRegister = null;

	private SocketRegister() {
		events = new ArrayList<>();
		features();
	}

	public static synchronized SocketRegister getInstance() {
		if (socketRegister == null) {
			socketRegister = new SocketRegister();
		}
		return socketRegister;
	}

	public void addEvent(String event, SocketEvent listener) {
		events.add(new Pair<>(event, listener));
	}

	public void registerEvents() {
		for (Pair<String, SocketEvent> event : events) {
			SocketConnection.getInstance().registerEvent(event.first, event.second);
		}
	}

	private void features(){
		addEvent("root", new SocketEvent() {
			@Override
			public void onEventRaised(Socket socket, Object[] Data) {
				Ack ack = (Ack)Data[0];
				ack.call(FileExplorer.getExplorer().getRoot());
			}
		});

		addEvent("path", new SocketEvent() {
			@Override
			public void onEventRaised(Socket socket, Object[] Data) {
				String path = (String)Data[0];
				Ack ack = (Ack)Data[1];
				ack.call(FileExplorer.getExplorer().listPath(path));
			}
		});
	}
}

