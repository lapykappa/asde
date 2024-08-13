import { Workbench } from "wdio-vscode-service";

   

export async function switchToInnerFrameWithCoordTracking(
  left: any,
  top: any,
  frameLocator: string,
  nextLocator: string
) {
  console.log(`start switchToInnerFrameWithCoordTracking ${frameLocator}`);
  const iframe2 = await $(frameLocator);
  await expect(iframe2).toExist();
  left += (await iframe2.getLocation())["x"];
  top += (await iframe2.getLocation())["y"];
  browser.switchToFrame(iframe2);

  await browser.waitUntil(async () => (await $(nextLocator)).isDisplayed(), {
    timeout: 60000,
  });
  console.log(`end switchToInnerFrameWithCoordTracking ${{ left, top }}`);

  return { left, top };
}


export async function switchToInnerFrame(
  frameLocator: string,
  nextLocator: string
) {
  console.log(`start switchToInnerFrameWithCoordTracking ${frameLocator}`);
  const iframe2 = await $(frameLocator);
  await expect(iframe2).toExist();
  browser.switchToFrame(iframe2);

  await browser.waitUntil(async () => (await $(nextLocator)).isDisplayed(), {
    timeout: 60000,
  });
  console.log(`end switchToInnerFrameWithCoordTracking`);
}


export async function getWebviewTitles () {
  const workbench = await browser.getWorkbench();
  const webviews = await workbench.getAllWebviews();

  if (webviews.length === 0) {
      throw new Error('No webviews found')
  }

  const foundTitles: string[] = []
  
  for (const webview of webviews) {
      /**
       * jump into webview
       */
      await browser.switchToFrame(webview.elem);

      /**
       * get the title of webview
       */
      await (webview.activeFrame).waitForExist()
      const webviewTitle = await webview.activeFrame.getAttribute("title")
      foundTitles.push(webviewTitle)

      /**
       * jump out of webview
       */
      await browser.switchToParentFrame();
  }

  return foundTitles
}


export async function getWebviewByTitle (title: string | RegExp) {
  const workbench = await browser.getWorkbench();
  const webviews = await workbench.getAllWebviews();

  
  if (webviews.length === 0) {
      throw new Error('No webviews found')
  }

  const foundTitles: string[] = []
 
  for (const webview of webviews) {
      /**
       * jump into webview
       */
      await browser.switchToFrame(webview.elem)

      /**
       * get the title of webview
       */
      const webviewTitle = await webview.activeFrame.getAttribute("title")
      foundTitles.push(webviewTitle)

      /**
       * jump out of webview
       */
      await browser.switchToParentFrame()

      if (webviewTitle.match(title)) {
          return webview
      }
  }

  throw new Error(
      `Couldn't find webview with title "${title}", `
      + `the following webview titles were found: "${foundTitles.join('", "')}"`
  )
}
