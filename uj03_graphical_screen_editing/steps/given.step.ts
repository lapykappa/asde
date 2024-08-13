import { Given } from "@cucumber/cucumber";
import { existsSync } from "fs";
import {TestSettings} from "../../00_common/support/testsettings.js";

import execPwsh from '../../00_common/support/execPwsh.js';

Given(/^no UECode is installed$/, () => {
    execPwsh("./unins000.exe /VERYSILENT /SUPPESSMSGBOXES", `C:/Users/${process.env.USERNAME}/AppData/Local/Programs/UE Code`)
    return true;
});

Given(/^no Screen Editor is installed$/, () => {
    // To be implemented
    return true;
});

Given(/^the workspace "([^"]*)" exists$/, function (args1) {
    const folder = `./${TestSettings.WORKSPACES_FOLDER}/${args1}`
	expect(existsSync(folder)).toBeTruthy()
    this.currentWorkspaceFolder = folder
	return true;
});
