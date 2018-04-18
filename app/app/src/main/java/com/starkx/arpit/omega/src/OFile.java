package com.starkx.arpit.omega.src;

import java.util.HashMap;

public class OFile extends MFile {
	public String parent = "";
	public Boolean isReadable = true;
	public Boolean isWritable = true;
	public Boolean exists = true;
	HashMap<String, MFile> files = new HashMap<>();

	public OFile() {
		super();
	}

	public OFile(String name, String path, String parent, Boolean isFile, Boolean isFolder, Boolean isHidden,
	             Boolean isReadable, Boolean isWritable) {
		super(name, path, isFile, isFolder, isHidden);
		this.parent = parent;
		this.isReadable = isReadable;
		this.isWritable = isWritable;
	}
}
