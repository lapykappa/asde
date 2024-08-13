import { Then } from "@cucumber/cucumber";
import * as utils from "../support/webviewutils.js"

Then(/^"([^"]*)" webview is open$/, async (args1) => {
  return await checkForWebviews(args1);
});

Then(/^"([^"]*)" webviews are open$/, async (args1) => {
  return await checkForWebviews(args1);
});

async function checkForWebviews(args1: any) {
  const workbench = await browser.getWorkbench();
  await browser.waitUntil(
    async () => (await workbench.getAllWebviews()).length > 0,
    {
      timeout: 60000,
    }
  );
  console.log(await utils.getWebviewTitles())
  expect(await workbench.getAllWebviews()).toHaveLength(parseInt(args1));
  return true;
}

