import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

export async function getWebContainer(): Promise<WebContainer> {
  // If we already have an instance, return it
  if (webcontainerInstance) {
    return webcontainerInstance;
  }

  // If we're already booting, wait for that boot to complete
  if (bootPromise) {
    return bootPromise;
  }

  // Start booting a new instance
  bootPromise = WebContainer.boot();
  
  try {
    webcontainerInstance = await bootPromise;
    return webcontainerInstance;
  } catch (error) {
    // Reset on error so we can try again
    bootPromise = null;
    throw error;
  }
}

export function resetWebContainer() {
  webcontainerInstance = null;
  bootPromise = null;
}
