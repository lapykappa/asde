import { Then } from "@cucumber/cucumber";
import { sleep } from "@wdio/utils";
import allureReporter from "@wdio/allure-reporter";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";
import * as fs from 'fs';
import * as path from 'path';

import * as utils from "../../00_common/support/webviewutils.js";

Then(
  /^the webview should look like reference image "([^"]*)"$/,
  async (reference) => {
    if (! hasBaseLineImage(reference)) {
      await sleep(30 * 1000); // without reference we need to explicitly wait for thing to stabilize
    }
    try {
      await browser.waitUntil(
        async () => {
          const difference = await checkWebview(reference);
          console.log(difference);
          return difference.valueOf() < 2;
        },
        {
          timeout: 30000,
          timeoutMsg: `expected the images to be the same (difference: ${await checkWebview(
            reference
          )})`,
        }
      );
    } finally {
      attachImages(reference);
    }

    return true;
  }
);

Then(
  /^the webview "([^"]*)" should look like reference image "([^"]*)"$/,
  async (title, reference) => {
    if (! hasBaseLineImage(reference)) {
      await sleep(30 * 1000); // without reference we need to explicitly wait for thing to stabilize
    }
    try {
      await browser.waitUntil(
        async () => {
          const difference = await checkWebviewByTitle(reference, title);
          console.log(difference);
          return difference.valueOf() < 2;
        },
        {
          timeout: 30000,
          timeoutMsg: `expected the images to be the same (difference: ${await checkWebviewByTitle(
            reference,
            title
          )})`,
        }
      );
    } finally {
      attachImages(reference);
    }

    return true;
  }
);

function hasBaseLineImage(referennce: string) {
  console.log("attaching images");
  var comparisonConfig = {};
  for (const service of browser.options.services) {
    if (service[0] == "image-comparison") {
      comparisonConfig = service[1];
    }
  }

  const file2check = join(
    comparisonConfig["baselineFolder"],
    "desktop_chrome",
    `${referennce}--1600x900.png`
  );

  return existsSync(file2check);
}

async function attachImages(args1: any) {
  console.log("attaching images");
  var comparisonConfig = {};
  for (const service of browser.options.services) {
    if (service[0] == "image-comparison") {
      comparisonConfig = service[1];
    }
  }

  var file2Append = join(
    comparisonConfig["baselineFolder"],
    "desktop_chrome",
    `${args1}--1600x900.png`
  );

  if (existsSync(file2Append)) {
    var contents = readFileSync(file2Append);
    allureReporter.addAttachment(`orig:${args1}`, contents, "image/png");
  }

  file2Append = join(
    comparisonConfig["screenshotPath"],
    "actual",
    "desktop_chrome",
    `${args1}--1600x900.png`
  );

  if (existsSync(file2Append)) {
    var contents = readFileSync(file2Append);
    allureReporter.addAttachment(`actual:${args1}`, contents, "image/png");
  }

  file2Append = join(
    comparisonConfig["screenshotPath"],
    "diff",
    "desktop_chrome",
    `${args1}--1600x900.png`
  );

  if (existsSync(file2Append)) {
    var contents = readFileSync(file2Append);
    allureReporter.addAttachment(`diff:${args1}`, contents, "image/png");
  }
}

async function checkWebviewByTitle(reference: string, title: string) {
  const webview = await utils.getWebviewByTitle(title);
  const difference = await browser.checkElement(webview.elem, reference);
  return difference;
}

async function checkWebview(reference: string) {
  const workbench = await browser.getWorkbench();
  const webviews = await workbench.getAllWebviews();
  expect(webviews).toHaveLength(1);
  const webview = webviews[0];
  const difference = await browser.checkElement(webview.elem, reference);
  return difference;
}

Then(/^the file "([^"]*)" should contain "([^"]*)"$/, async function (file, content) {    

  const relativePath = path.resolve(process.cwd(), "test-workspaces/uj03_graphical_screen_editing_ws", file)
    
  const fileContent = readFileSync(relativePath, "utf-8");     
    
  expect(fileContent).toContain(content);  
  return true;  
});    