import { readdirSync, statSync } from "fs";
import { join } from "path";

export default function getAllFiles(dirPath, arrayOfFiles, pattern, depth) {
  if(depth <=0){
    return arrayOfFiles
  }
  var files = readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    try {
      if (statSync(dirPath + "/" + file).isDirectory()) {
        if(!file.match(/^\./)) { //exclude hidden
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles, pattern, depth-1);
        }
      } else {
        if((dirPath + "/" + file).match(pattern)) {
          arrayOfFiles.push(join(dirPath, "/", file));
        }
      }
    } catch (error) {
      console.log(error)
    }
  });

  return arrayOfFiles;
}
