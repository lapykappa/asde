import { When } from "@cucumber/cucumber";
import { sleep } from "@wdio/utils";
import { parse } from "yaml";
import * as utils from "../../00_common/support/webviewutils.js";
import { remote } from "webdriverio";
import { Key } from "webdriverio";

When(/^I dismis all notifications$/, async () => {
  const workbench = await browser.getWorkbench();
  const notifications = await workbench.getNotifications();

  for (const notification of notifications) {
    await notification.dismiss();
  }

  return true;
});

When(
  /^I move screen element "([^"]*)" by "([^"]*)"$/,
  async function (args1, args2) {
    const workbench = await browser.getWorkbench();
    const editorView = workbench.getEditorView();
    const currentTextEditor = await editorView.openEditor(
      this.currentScreenFileEditorName
    );
    const text = await currentTextEditor.getText();

    for (const tab of await editorView.getOpenEditorTitles()) {
      if (tab.includes("Screen Editor")) {
        editorView.openEditor(tab);
      }
    }

    const yamltext = parse(text);

    const width = yamltext["Screens"]["MyScreen"]["Items"][args1]["Width"];
    const height = yamltext["Screens"]["MyScreen"]["Items"][args1]["Height"];
    var top = yamltext["Screens"]["MyScreen"]["Items"][args1]["Top"];
    var left = yamltext["Screens"]["MyScreen"]["Items"][args1]["Left"];

    var top_offset = parseInt(args2.split(",")[1]);
    var left_offset = parseInt(args2.split(",")[0]);

    const webviews = await workbench.getAllWebviews();
    expect(webviews).toHaveLength(1);

    await browser.waitUntil(
      async () => (await $("iframe.webview.ready")).isDisplayed(),
      {
        timeout: 60000,
      }
    );

    ({ left, top } = await utils.switchToInnerFrameWithCoordTracking(
      left,
      top,
      "iframe.webview.ready",
      "#active-frame"
    ));
    ({ left, top } = await utils.switchToInnerFrameWithCoordTracking(
      left,
      top,
      "#active-frame",
      'iframe[src*="localhost"]'
    ));
    ({ left, top } = await utils.switchToInnerFrameWithCoordTracking(
      left,
      top,
      'iframe[src*="localhost"]',
      "#InteractiveCanvas"
    ));

    const canvas = await $("#InteractiveCanvas");
    expect(canvas).toExist();
    left += (await canvas.getLocation())["x"];
    top += (await canvas.getLocation())["y"];
    await sleep(5 * 1000); // we need to blindly wait here to make sure the canvas is actually showing something

    console.log(
      `moving from ${left + 10} ${top + 10} to ${left + left_offset + 10} ${
        top + top_offset + 10
      }`
    );

    await browser.switchToParentFrame();
    await browser.switchToParentFrame();
    await browser.switchToParentFrame();

    await browser.actions([
      browser
        .action("pointer")
        .move(left + 10, top + 10)
        .down()
        .move(left + left_offset + 10, top + top_offset + 10)
        .up(),
    ]);

    return true;
  }
);

When(/^I open the bottombar$/, async () => {
  const workbench = await browser.getWorkbench();
  const bottomBar = workbench.getBottomBar();
  await bottomBar.toggle(true);
});

When(/^I open the tab "([^"]*)" in the bottombar$/, async (args1) => {
  const workbench = await browser.getWorkbench();
  const bottomBar = workbench.getBottomBar();
  var screenItemTab = bottomBar.elem.$(`a=${args1}`);
  await screenItemTab.click();
  return true;
});

When(/^I double click "([^"]*)" in the bottombar$/, async (args1) => {
  const itemsWebview = await utils.getWebviewByTitle("UE Screen Items");
  await itemsWebview.open();
  await (await $(`div=${args1}`)).doubleClick();
  await itemsWebview.close();
  return true;
});


When(/^I change "([^"]*)" to "([^"]*)" in the bottombar$/, async (args1,args2) => {
  const propertiesWebview = await utils.getWebviewByTitle("UE Properties");
  await propertiesWebview.open();

  const label = await $(`div=${args1}`)
  const editField = await label.$("..").$(`div[tabulator-field="Value"]`);

  await editField.click()
  
  const dropdown = await $(".tabulator-popup-container")
  const items = await dropdown.$$(".tabulator-edit-list-item")
  var selectedElement = null
  for(const item of items){
    const text = await item.getText()
    console.log(text)
    if(text.includes(args2)){
      selectedElement = item
    }
  }  

  expect(selectedElement).not.toBeNull()
  await selectedElement.click()

	await propertiesWebview.close();
  return true;
});


When(
  /^I drag "([^"]*)" from the bottombar to "([^"]*)"$/,
  async (args1, args2) => {
    console.log(args1, args2);

    const ueElementType = await dropUEElementFromItems(args1);
    await dropUEElementInScreen(args2, ueElementType);

    return true;
  }
);

async function dropUEElementFromItems(args1: string) {
  const itemsWebview = await utils.getWebviewByTitle("UE Screen Items");
  await itemsWebview.open();

  const result = await browser.execute((ueElement) => {
    const createEvent = (type, props = {}) => {
      const event = new Event(type, { bubbles: true });
      Object.assign(event, props);
      return event;
    };
    var event = new DataTransfer();
    document.querySelector(`div[title='${ueElement}']`).dispatchEvent(
      createEvent("dragstart", {
        clientX: 0,
        clientY: 0,
        dataTransfer: event,
      })
    );

    return event.types;
  }, args1);

  const ueElementType = result[0];
  await itemsWebview.close();
  return ueElementType;
}

async function dropUEElementInScreen(coordsAsString: string, ueElementType: string) {
  const editorWebview = await utils.getWebviewByTitle(
    "Screen Editor | MyScreen"
  );
  await editorWebview.open();

  await utils.switchToInnerFrame(
    'iframe[src*="localhost"]',
    "#InteractiveCanvas"
  );

  var coords = await $("canvas.upper-canvas").getLocation();
  console.log(coords);
  coords['x'] += parseInt(coordsAsString.split(",")[0]);
  coords['y'] += parseInt(coordsAsString.split(",")[1]);
  console.log(coords);

  await browser.execute(
    (ueElementType, coords) => {
      const createEvent = (type, props = {}) => {
        const event = new Event(type, { bubbles: true });
        Object.assign(event, props);
        return event;
      };
      var event = new DataTransfer();
      event.setData(ueElementType, "");
      document.querySelector("canvas.upper-canvas").dispatchEvent(
        createEvent("drop", {
          clientX: coords['x'],
          clientY: coords['y'],
          pageX: coords['x'],
          pageY: coords['y'],
          x: coords['x'],
          y: coords['y'],
          ctrlKey: false, // important
          dataTransfer: event,
        })
      );

      return event.types;
    },
    ueElementType,
    coords
  );

  await browser.switchToParentFrame();
  await editorWebview.close();
}

When(/^I open the tab "([^"]*)" in the activitybar$/, async (args1) => {
  const workbench = await browser.getWorkbench();
  const explorerViewControl = await workbench
    .getActivityBar()
    .getViewControl("UE Screen Editor");
  await explorerViewControl.openView();

  await sleep(3 * 1000);
  
  const graphicsWebview = await utils.getWebviewByTitle("UE Graphics");
  await graphicsWebview.open();

  const valves = await $('div=Valves')
  await valves.click()
    
  graphicsWebview.close()
  return true;
});

When(/^I select "([^"]*)" from tagDialogContentsWrapper$/, async function (componentId) {  
  const webview = await utils.getWebviewByTitle("UE Properties"); 
  await webview.open();

  const componentID = componentId;

  const cell = await $(".tabulator-cell");
  await cell.waitForDisplayed();

  await cell.doubleClick();

  const container = await $(".tabulator-popup-container");
  await container.waitForDisplayed();

  await container.doubleClick();
  
  await webview.close(); 
  return true;
});

When(/^I clear the notification, if necessary/, async () => {

  if (await $(".codicon-notifications-clear").isDisplayed()){
    const notificationsClear = await $(".codicon-notifications-clear");
    await notificationsClear.click();
  }

  return true;
});

When(/^I change "([^"]*)" to the color "([^"]*)" in the bottombar$/, async (property,color) => {
  const propertiesWebview = await utils.getWebviewByTitle("UE Properties");
  await propertiesWebview.open();
 
  const label = await $(`div=${property}`);
  const editField = await label.$("..").$(`.tabulator-cell-inner--colorpicker`);
 
  await editField.waitForDisplayed();
  await editField.click();
 
  const picker = await $("input.pcr-result");
  await picker.click();
  await browser.keys([Key.Delete,Key.Delete,Key.Delete,Key.Delete,Key.Delete,Key.Delete,Key.Delete,Key.Backspace,Key.Backspace,Key.Backspace,Key.Backspace,Key.Backspace,Key.Backspace,Key.Backspace,Key.Backspace,Key.Backspace,color]);
 
  const save = await $("input.pcr-save");
  await save.click();
 
  propertiesWebview.close();
  return true;
});

When(/^I dynamize "([^"]*)" with Tag "([^"]*)"$/, async (property, Tag) => {
  const propertiesWebview = await utils.getWebviewByTitle("UE Properties");
  await propertiesWebview.open();

  const label = await $(`div=${property}`);
  const meatballMenu = await label.$("..").$(`.meatballMenu`);
 
  await meatballMenu.doubleClick();

  const contextMenu = await $(".tabulator-popup-container");
  await contextMenu.waitForDisplayed();
  const menuEntry = await $(`div=Dynamize with Tag...`);
  await menuEntry.click();

  const TagDialog = await $(".tag-select-header-icon");
  await TagDialog.waitForDisplayed();
  const tagInput = await $(`div=${Tag}`);
  await tagInput.click();

  const OkButton = await $(".tag-select-ok.primary");
  await OkButton.click();

  propertiesWebview.close();
  return true;
});

When(/^I open the "([^"]*)" view control$/, async function (args1) {
  const workbench = await browser.getWorkbench();

  const extensionView = await workbench
    .getActivityBar()
    .getViewControl(args1);
  const section = await extensionView?.openView();
  return true;
});

When(/^I select Set as Start Screen from the menue of "([^"]*)"$/, async function (screen) {
  const label = await $(`div=${screen}`);
  await label.waitForDisplayed();
  await label.click();
  
  return true;
});

When(/^I click on the home icon/, async () => {

  const contextMenu = await $(".codicon-home");
  await contextMenu.waitForDisplayed();
  await contextMenu.click();

  return true;
});

When(/^I confirm the dialog/, async () => {

  await browser.keys([Key.Tab, Key.Enter]);
  return true;
});