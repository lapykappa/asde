import { Then } from "@cucumber/cucumber";
import { existsSync } from "fs";
import { InputBox } from "wdio-vscode-service";
import * as fs from 'fs';
import * as path from 'path';

Then(/^the path "([^"]*)" exists$/, (args1) => {
  expect(existsSync(args1)).toBeTruthy();
  return true;
});

// this is just a dummy step to indicate that there is no final state to verify 
// it just relies on all when statements to check error conditions
// should be used rarely
Then(/^no action should have failed$/, () => {
	return true;
});


Then(/^the titlebar shows the quick items:$/, async function (table) {
  console.log(table);
  const workbench = await browser.getWorkbench();
  const inputBox = await (new InputBox(workbench.locatorMap)).wait(20000)

  var labels : string[] = []
  for(const quickitem of await inputBox.getQuickPicks()){
    labels.push(await quickitem.getLabel())
  }
  console.log(labels)
  table.rows().forEach((element) => {
    expect(labels).toContain(element[0]);
  });

	return true;
});

async function checkNotificationForString(targetString:string){
  const workbench = await browser.getWorkbench();
  const notifications = await workbench.getNotifications();

  var hasString = false
  for (const notification of notifications) {
      const msg = await notification.getMessage();
      hasString = hasString || (msg.indexOf(targetString) > -1)
  }
  
  return hasString
}

Then(/^a notification should contain "([^"]*)"$/, async (args1) => {
  await browser.waitUntil(async function() {return await checkNotificationForString(args1)}, {timeout: 60*1000}) 
	return true;
});

Then(/^the file "([^"]*)" contains the content of "([^"]*)"$/, async function (filePath, contentFile) {
  const workbench = await browser.getWorkbench();
  var workbenchName = (await workbench.getTitleBar().getTitle()).replace("_ws", "").replace("[Extension Development Host]", "").replace("[Administrator]", "").replace(" ", "");
  workbenchName = workbenchName.replace(" ", "");

  const directoryPath = path.resolve(process.cwd(), workbenchName, 'data', 'file-content');
  const contentFilePath = path.join(directoryPath, `${contentFile}.txt`);
  
  filePath = path.resolve(process.cwd(), filePath);

  const actualContent = fs.readFileSync(filePath, 'utf8');
  const expectedContent = fs.readFileSync(contentFilePath, 'utf8');
  expect(actualContent).toBe(expectedContent);
});


Then(/^the terminal should contain "([^"]*)"$/, async (args1) => {
	console.log(args1);

  const workbench = await browser.getWorkbench();
  const bottomBar = workbench.getBottomBar();
  await bottomBar.toggle(true)
  const terminalView = await bottomBar.openTerminalView()
  
  await browser.waitUntil(
    async () => (await terminalView.getText()).includes(args1),
    {
      timeout: 60000,
    }
  );

  return true;
});


Then(
  /^I should see a "([^"]*)" with id "([^"]*)" in the runtime$/,
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
          `[data-tif-type="${theType}"]`
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

    var found = false;
    for (const element of elements) {
      const currentId = await element.getAttribute("data-tif-id");
      found = found || currentId == theId;
    }
    expect(found).toBeTruthy();

    return true;
  }
);


Then(/^the "([^"]*)" with id "([^"]*)" should display "([^"]*)"$/, async function(type,id,value) {
  console.log(`Checking for ${type} with id ${id} and value ${value}`);
  console.log(`Current URL: ${await this.rtBrowser.getUrl()}`);
  if(await this.rtBrowser.getUrl() != "https://localhost/WebRH"){
    await this.rtBrowser.url("https://localhost/WebRH");
    await this.rtBrowser.pause(20000);
  
    const closeButton = await this.rtBrowser.$('g[data-tif-id="CloseBtn"]');
    await closeButton.click();
  }

  const elements = await this.rtBrowser.waitUntil(
    async () => {
      const elements = await this.rtBrowser.$$(
        `g[data-tif-type="${type}"]`
      );
      if (elements.length < 1) {
        return false;
      }
      return elements;
    },
    {
      timeout: 60000,
      timeoutMsg: `Never found ${type}`,
    }
  );

  var found = false;
  for (const element of elements) {
    const currentId = await element.getAttribute("data-tif-id");
    if(currentId == id){
      const text = await element.getText();
      found = text == value;
    }
  }

  expect(found).toBeTruthy();

  return true;
});


Then(
  /^runtime screen should look like reference image "([^"]*)"$/,
  async function (reference) {
    await browser.waitUntil(
      async () => {
        const difference = await this.rtBrowser.checkScreen(reference, {});
        console.log(difference);
        return difference.valueOf() < 2;
      },
      {
        timeout: 30000,
        timeoutMsg: `expected the images to be the same (difference: ${await this.rtBrowser.checkScreen(
          reference,
          {}
        )})`,
      }
    );

    return true;
  }
);


Then(/^the "([^"]*)" with id "([^"]*)" should have color "([^"]*)"$/, async function(type, id, expectedColor) {  
  if (await this.rtBrowser.getUrl() != "https://localhost/WebRH") {  
      await this.rtBrowser.url("https://localhost/WebRH");  
      await this.rtBrowser.pause(20000);  
      const closeButton = await this.rtBrowser.$('g[data-tif-id="CloseBtn"]');  
      await closeButton.click();  
  }  
    
  const elements = await this.rtBrowser.waitUntil(  
      async () => {  
          const elements = await this.rtBrowser.$$(`g[data-tif-type="${type}"]`);  
          if (elements.length < 1) {  
              return false;  
          }  
          return elements;  
      },  
      {  
          timeout: 60000,  
          timeoutMsg: `Never found ${type}`,  
      }  
  );  

  var found = false;  
  for (const element of elements) {  
      const currentId = await element.getAttribute("data-tif-id");  
      if (currentId == id) {  
          const childElement = await element.$('circle');  
          if (childElement) {  
              const color = await childElement.getAttribute('fill');  
              console.log(`Element with id ${id} has color ${color}`);  
              if (color === expectedColor) {  
                  found = true;  
                  break;
              }  
          } else {  
              console.warn(`Element with id ${id} does not have a child 'circle' element.`);  
          }  
      }  
  }  

  if (!found) {  
      console.error(`Expected color: ${expectedColor}, but found different color or element not found.`);  
  }  

  expect(found).toBeTruthy();  
  return true;  
});  


Then(/^the "([^"]*)" with id "([^"]*)" should have position "x=(\d+), y=(\d+)"$/, async function(type, id, expectedX, expectedY) {  
  expectedX = parseInt(expectedX, 10);  
  expectedY = parseInt(expectedY, 10);  
  
  if (await this.rtBrowser.getUrl() != "https://localhost/WebRH") {  
    await this.rtBrowser.url("https://localhost/WebRH");  
    await this.rtBrowser.pause(20000);  
    const closeButton = await this.rtBrowser.$('g[data-tif-id="CloseBtn"]');  
    await closeButton.click();  
  }  
  
  const elements = await this.rtBrowser.waitUntil(  
    async () => {  
      const elements = await this.rtBrowser.$$(`g[data-tif-type="${type}"]`);  
      if (elements.length < 1) {  
        return false;  
      }  
      return elements;  
    },  
    {  
      timeout: 60000,  
      timeoutMsg: `Never found ${type}`,  
    }  
  );  
  
  var found = false;  
  for (const element of elements) {  
    const currentId = await element.getAttribute("data-tif-id");  
    if (currentId == id) {  
      const childElement = await element.$('svg');
      if (childElement) {  
        let posX = await childElement.getAttribute('x');  
        let posY = await childElement.getAttribute('y');  
  
        if (posX === null || posY === null) {  
          const transform = await childElement.getAttribute('transform');  
          if (transform) {  
            const match = transform.match(/translate\((\d+),\s*(\d+)\)/);  
            if (match) {  
              posX = match[1];  
              posY = match[2];  
            }  
          }  
        }  
  
        console.log(`Extracted position: x=${posX}, y=${posY}`);
        found = (parseInt(posX, 10) === expectedX) && (parseInt(posY, 10) === expectedY);  
      }  
    }  
  }  
  
  if (!found) {  
    console.error(`Expected position: x=${expectedX}, y=${expectedY}, but found different position or element not found.`);  
  }  
  
  expect(found).toBeTruthy();  
  return true;  
});  