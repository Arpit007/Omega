package com.starkx.arpit.omega.src;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class NetworkChanged extends BroadcastReceiver
{
	public NetworkChanged()
	{
	}

	@Override
	public void onReceive(Context context, Intent intent)
	{
		SocketConnection.getInstance().reconnect();
	}
}
