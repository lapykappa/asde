import { When} from "@cucumber/cucumber";
import execPwsh from "../../00_common/support/execPwsh.js";
import { sleep } from "@wdio/utils";
import { InputBox } from "wdio-vscode-service";
import * as utils from "../../00_common/support/webviewutils.js";
import { Key } from "webdriverio";
import * as fs from 'fs';
import * as path from 'path';
import {TestSettings} from "../../00_common/support/testsettings.js";

When(/^I install the project$/, function () {
  expect(execPwsh("apax install -L -r", this.currentWorkspaceFolder)).toBeTruthy()
});

When(/^I run "(.*)", to/, function (args1) {
  expect(execPwsh(args1, this.currentWorkspaceFolder)).toBeTruthy();
});

When(
  /^I sleep "([^"]*)" seconds, /,
  { timeout: 600 * 1000 },
  async function (args1) {
    await browser.pause(args1*1000)
  }
);

When(
  /^The runtime sleeps "([^"]*)" seconds, /,
  { timeout: 600 * 1000 },
  async function (args1) {
    await this.rtBrowser.pause(args1*1000)
  }
);



When(/^I open the file "([^"]*)"$/, async function (args1) {
  const workbench = await browser.getWorkbench();
  const explorerViewControl = await workbench
    .getActivityBar()
    .getViewControl("Explorer");
  const sideBar = await explorerViewControl.openView();
  const workspaceFolderSection = (await sideBar
    .getContent()
    .getSections())[0];

  await workspaceFolderSection.openItem(...args1.split("/"));

  const editorView = workbench.getEditorView();
  const argsarray = args1.split("/")
  this.openEditor = await editorView.openEditor(argsarray[argsarray.length-1]);
  return true;
});

When(
  /^I select "([^"]*)" from the context menue of "([^"]*)"$/,
  async function (args1, args2) {
    const workbench = await browser.getWorkbench();
    const editorView = workbench.getEditorView();
    this.currentScreenFileEditorName = args2;
    await editorView.openEditor(args2);

    const explorerViewControl = await workbench
      .getActivityBar()
      .getViewControl("Explorer");
    const sideBar = await explorerViewControl.openView();

    const workspaceFolderSection = (await sideBar
      .getContent()
      .getSections())[0];

    const item = await workspaceFolderSection.findItem(args2);

    const menue = await (await item.openContextMenu()).getItem(args1);

    menue.select();

    return true;
  }
);

When(/^I select quick item "([^"]*)"$/, async (args1) => {
  const workbench = await browser.getWorkbench();
  const inputBox = await((new InputBox(workbench.locatorMap)).wait(60000));
  (await inputBox.selectQuickPick(args1))
  return true;
});


When(
  /^I select "([^"]*)" submenu from "([^"]*)" menu from the context menu in explorer "([^"]*)"$/,
  async function (args1, args2, args3) {

    const workbench = await browser.getWorkbench();
    const explorerViewControl = await workbench
    .getActivityBar()
    .getViewControl("Explorer");
    const sideBar = await explorerViewControl.openView();
    const workspaceFolderSection = (await sideBar
      .getContent()
      .getSections())[0];

    await workspaceFolderSection.openItem(...args3.split("/"));

    const count = args3.split("/").length;
    const targetNodeName = args3.split("/")[count-1];

    const targetNode = await workspaceFolderSection.findItem(targetNodeName);
    const menu = await (await targetNode.openContextMenu()).getItem(args2);
    const submenus = menu.select();

    const submenu = await (await submenus).getItem(args1);
    await submenu.select(); // NOT SURE IF WORKING
 
    return true;
  }
);

When(/^in line "([^"]*)" I type "([^"]*)"$/, async function (line, text) {
  await this.openEditor.setTextAtLine(+line, text);
  await this.openEditor.moveCursor(+line, text.length + 1);
  return true;
});

When(/^I select "([^"]*)" in the webview "([^"]*)"$/, async function (componentId, webviewTitle) {  
  const webview = await utils.getWebviewByTitle(webviewTitle); 
  await webview.open();

  await utils.switchToInnerFrame('iframe[src*="localhost"]',"#InteractiveCanvas");

  const component = await $(`[data-tif-id="${componentId}"]`);
  await component.doubleClick();
  await webview.close(); 
  return true;  
});


When(/^I add the content to the file "([^"]*)"$/, async function (fileName) {
  const workbench = await browser.getWorkbench();
  var workbenchName = (await workbench.getTitleBar().getTitle()).replace("_ws", "").replace("[Extension Development Host]", "").replace("[Administrator]", "").replace(" ", "");

  workbenchName = workbenchName.replace(" ", "");
  const directoryPath = path.resolve(process.cwd(), workbenchName, 'data', 'file-content');

  console.log(directoryPath);
  const filePath = path.join(directoryPath, `${fileName}.txt`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`No content file found for ${fileName}`);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  await this.openEditor.setText(content);
  return true;
});


When(/^I add references to the Main.hmi.yml:$/, async function (references) {
  const lines = await this.openEditor.getNumberOfLines();

  var content = [];

  var startline = 1;
  var indentationCounter = 0;

  for (let line = 1; line <= lines; line++) {
    const textAtLine = await this.openEditor.getTextAtLine(line);
    const spaces = indentationCounter <= 2 ? '' : indentationCounter === 3 ? ' ' : '  ';
    content.push(`${spaces}${textAtLine}`);

    if (textAtLine.includes("Files:") && startline === 1) {
      startline = line;
    }

    indentationCounter++;
  }

  for (const reference of references.rows()) {
    startline = startline + 1;
    const spaces = indentationCounter <= 2 ? '' : indentationCounter === 3 ? ' ' : '  ';
    content.splice(startline, 0, `${spaces}- ${reference}`);
    indentationCounter++;
  }

  await this.openEditor.setText(content.join('\n'));

  return true;
});
  
When(/^I save the texteditor$/, async function () {
  await this.openEditor.save();
	return true;
});

When(/^I remove all runtime projects$/, () => {
  const currentWorkingDirectory = path.resolve(process.cwd(), '..');
  console.log(`Current Working Directory: ${currentWorkingDirectory}`);
  const scriptPath = path.join(currentWorkingDirectory, "scripts\\Runtime-Manager\\Remove-RuntimeProjects.ps1");
  const command = `& '${scriptPath}'`;
  console.log(`Executing Remove-RuntimeProjects.ps1`);
  return execPwsh(command);
});


When(/^I login with username "([^"]*)" and password "([^"]*)"$/, async function(username, password) {
	 // Dismiss license missing dialog
   try {
    if(await this.rtBrowser.getUrl() != "https://localhost/WebRH"){
      await this.rtBrowser.url("https://localhost/WebRH");
      await this.rtBrowser.pause(20000);
    
      const closeButton = await this.rtBrowser.$('g[data-tif-id="CloseBtn"]');
      await closeButton.click();
    }
  } 
  catch (error) {
    console.log("No license dialog found");
  }

  const elements = await this.rtBrowser.waitUntil(
    async () => {
      const elements = await this.rtBrowser.$$('input');
      if (elements.length < 1) {
        return false;
      }
      return elements;
    }
  );

  var ele = await this.rtBrowser.$$('*');
  for (var i = 0; i < ele.length; i++) {
    console.log(await ele[i].getTagName());
    console.log(await ele[i].getAttribute('id'));
  }

  // Get the specific input element with id="username"
const usernameInput = await this.rtBrowser.$('#username');

// Log the HTML content of the username input element
const usernameInputHTML = await usernameInput.getHTML();
console.log('Username input element:', JSON.stringify({ html: usernameInputHTML }, null, 2));


  elements.forEach(element => {
    console.log(`element:`, JSON.stringify(element));
    

  });
  
  const userNameDialog = await this.rtBrowser.$('username');

console.log('usernamedialog:', JSON.stringify({ html: userNameDialog }, null, 2));

const passwordDialog = await this.rtBrowser.$('password');

console.log('passworddialog:', JSON.stringify({ html: passwordDialog }, null, 2));


  await userNameDialog.setValue(username);
  await passwordDialog.setValue(password);

  const loginButton = await this.rtBrowser.$$('loginFormSubmit');
  loginButton.click();

  await this.rtBrowser.pause(60000);

	return true;
});



When(/^I click on the "([^"]*)" with id "([^"]*)"$/, 
async function (theType, theId) {
      // Dismiss license missing dialog
    try {
      if(await this.rtBrowser.getUrl() != "https://localhost/WebRH"){
        await this.rtBrowser.url("https://localhost/WebRH");
        await this.rtBrowser.pause(20000);
      
        const closeButton = await this.rtBrowser.$('g[data-tif-id="CloseBtn"]');
        await closeButton.click();
      }
    } 
    catch (error) {
      console.log("No license dialog found");
    }
  
      const elements = await this.rtBrowser.waitUntil(
        async () => {
          const elements = await this.rtBrowser.$$(
            `g[data-tif-type="${theType}"]`
          );
          if (elements.length < 1) {
            return false;
          }
          return elements;
        },
        {
          timeout: 60000,
          timeoutMsg: `Never found ${theType}`,
        }
      );
      
      console.log(`Found ${elements.length} elements`);
      for(const element of elements){
          console.log(`element: ${element}`);
          
          const currentId = await element.getAttribute("data-tif-id");
          if(currentId == theId){
              await element.click();
              return true;
          }
      }
  
      return true;
    }
);

When(/^I set the value of the "([^"]*)" with id "([^"]*)" to "([^"]*)"$/, 
async function (theType, theId, value) {
      // Dismiss license missing dialog
    try {
      if(await this.rtBrowser.getUrl() != "https://localhost/WebRH"){
        await this.rtBrowser.url("https://localhost/WebRH");
        await this.rtBrowser.pause(20000);
      
        const closeButton = await this.rtBrowser.$('g[data-tif-id="CloseBtn"]');
        await closeButton.click();
      }
    } 
    catch (error) {
      console.log("No license dialog found");
    }
  
      const elements = await this.rtBrowser.waitUntil(
        async () => {
          const elements = await this.rtBrowser.$$(
            `g[data-tif-type="${theType}"]`
          );
          if (elements.length < 1) {
            return false;
          }
          return elements;
        },
        {
          timeout: 60000,
          timeoutMsg: `Never found ${theType}`,
        }
      );
      
      console.log(`Found ${elements.length} elements`);
      for(const element of elements){
          console.log(`element: ${element}`);
          
          const currentId = await element.getAttribute("data-tif-id");
          if(currentId == theId){
              await element.setValue(value);
          }
      }
  
      return true;
    }
);





