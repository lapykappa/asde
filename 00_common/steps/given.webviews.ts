import { Given } from "@cucumber/cucumber";

Given(/^no webviews are open$/, async function () {
    const workbench = await browser.getWorkbench();
    expect(await workbench.getAllWebviews()).toHaveLength(0);
    return true;
  });
  