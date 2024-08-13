import { execSync } from "child_process";

export default function (command, checkStdout, checkStdErr, cwd = ".", alternativeLogCommand = "") {

  if (alternativeLogCommand) {
    console.log(`PS ${cwd}> ${alternativeLogCommand}`);
  } else {
    console.log(`PS ${cwd}> ${command}`);
  }
  var stdout = execSync(command, {
    shell: "powershell.exe",
    cwd: cwd,
  });

  console.log(stdout);
  checkStdout(stdout)
  
  return true;
}

