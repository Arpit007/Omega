package com.starkx.arpit.omega.src;

public class MFile {
	public String name = "";
	public String path = "";
	public Boolean isFile = true;
	public Boolean isFolder = false;
	public Boolean isHidden = false;

	public MFile(){}
	public MFile(String name, String path, Boolean isFile, Boolean isFolder, Boolean isHidden){
		this.name=name;
		this.path=path;
		this.isFile=isFile;
		this.isFolder=isFolder;
		this.isHidden=isHidden;
	}
}
