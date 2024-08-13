import { Given } from "@cucumber/cucumber";
import {TestSettings} from "../../00_common/support/testsettings.js";
import execPwsh from '../../00_common/support/execPwsh.js';
import { remote } from "webdriverio";
import VisualService from "@wdio/visual-service";

Given(/^UE Code is up and running$/, async function () {
    const workbench = await browser.getWorkbench();
    return true;
  });
    

Given(/^a workspace is newly created from the "([^"]*)" template as "([^"]*)"$/, async function(args1, args2) {
    this.currentWorkspaceFolder = `./${TestSettings.WORKSPACES_FOLDER}/${args2}`
    return execPwsh(`cd ${TestSettings.WORKSPACES_FOLDER}; Remove-Item './${args2}' -Force -Recurse; apax create @ue/${args1} ${args2}`)
});

Given(/^the workspace "([^"]*)" is opened$/, async function(args1) {
  this.currentWorkspaceFolder = `./${TestSettings.WORKSPACES_FOLDER}/${args1}`
});

Given(/^I set the workspace to "([^"]*)"$/, function (workspace) {
  this.currentWorkspaceFolder = `./${TestSettings.WORKSPACES_FOLDER}/${workspace}`
  return true;
});

Given(/^the runtime is restarted$/, async function () {
  var comparisonConfig = {};
  for (const service of browser.options.services) {
    if (service[0] == "visual") {
      comparisonConfig = service[1];
      comparisonConfig["hideScrollBars"] = false;
    }
  }
  let visualService = new VisualService(comparisonConfig);

  this.rtBrowser = await remote({
    capabilities: {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: [
          "disable-gpu",  
          '--ignore-certificate-errors',
          "disable-infobars",
          "disable-popup-blocking",
          "disable-notifications",
          "--disable-search-engine-choice-screen"


        ],
        
      },
    },
  });
  visualService.remoteSetup(this.rtBrowser);

  console.log("Restarting runtime");

  // Dismiss license missing dialog
  try {
    await this.rtBrowser.url("https://localhost/WebRH");
    await this.rtBrowser.pause(20000);

    const closeButton = await this.rtBrowser.$('g[data-tif-id="CloseBtn"]');
    await closeButton.click();
  } 
  catch (error) {
    console.log("No license dialog found");
  }





  return true

});
