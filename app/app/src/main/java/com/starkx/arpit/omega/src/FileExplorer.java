package com.starkx.arpit.omega.src;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.File;
import java.io.FileNotFoundException;

public class FileExplorer {
	private static FileExplorer explorer = null;
	private Gson gson;

	private FileExplorer() {
		gson = new GsonBuilder().setPrettyPrinting().create();
	}

	public synchronized static FileExplorer getExplorer() {
		if (explorer == null) {
			explorer = new FileExplorer();
		}
		return explorer;
	}

	public String getRoot() {
		OFile file = new OFile("root", "/", "", false, true, false, true, false);

		for (StorageUtils.StorageInfo info : StorageUtils.getStorageList()) {
			MFile mFile = new MFile(info.getDisplayName(), info.path, false, true, false);

			if (mFile.name.equals("SD card")) {
				mFile.path = "/storage/" + mFile.path.substring(mFile.path.lastIndexOf("/") + 1);
			}

			file.files.add(mFile);
		}
		return gson.toJson(file);
	}

	public String listPath(String path) {
		File tFile = new File(path);
		try {
			if (!tFile.exists()) {
				throw new FileNotFoundException();
			}
			OFile file = new OFile(tFile.getName(), tFile.getCanonicalPath(), tFile.getParent(),
					tFile.isFile(), tFile.isDirectory(), tFile.isHidden(), tFile.canRead(), tFile.canWrite());
			for (File cFile : tFile.listFiles()) {
				MFile mFile = new MFile(cFile.getName(), cFile.getCanonicalPath(),
						cFile.isFile(), cFile.isDirectory(), cFile.isHidden());
				file.files.add(mFile);
			}
			return gson.toJson(file);
		}
		catch (Exception e) {
			OFile file = new OFile();
			file.exists = false;
			return gson.toJson(file);
		}
	}
}
