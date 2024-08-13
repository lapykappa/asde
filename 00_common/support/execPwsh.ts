import { execSync } from "child_process";

export default function (command, cwd = ".", alternativeLogCommand = "") {
  if (alternativeLogCommand) {
    console.log(`PS ${cwd}> ${alternativeLogCommand}`);
  } else {
    console.log(`PS ${cwd}> ${command}`);
  }
  try {
    var stdout = execSync(command, {
      shell: "powershell.exe",
      cwd: cwd,
      encoding:  "utf-8"
    });
  } catch (e) {
    console.error(e);
    return false;
  }

  console.log(stdout);
  return true;
}
