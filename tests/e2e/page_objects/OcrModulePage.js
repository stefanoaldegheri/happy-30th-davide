// Page Object Model for the OCR Module page
class OcrModulePage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    console.log('OcrModulePage: Navigating to OCR page...');
    await this.page.goto('/ocr');
    console.log('OcrModulePage: Navigation to OCR page completed');
  }

  async isVisible() {
    console.log('OcrModulePage: Checking if page is visible...');
    const isVisible = await this.page.isVisible('text=Text Recognition Challenge');
    console.log(`OcrModulePage: Page visibility check result: ${isVisible}`);
    return isVisible;
  }

  async startCamera() {
    console.log('OcrModulePage: Clicking Start Camera button...');
    await this.page.click('button:has-text("Start Camera")');
    console.log('OcrModulePage: Start Camera button clicked');
  }

  async clickContinue() {
    console.log('OcrModulePage: Clicking Continue button...');
    await this.page.click('button:has-text("Reveal the Secret")');
    console.log('OcrModulePage: Continue button clicked');
  }
}

module.exports = { OcrModulePage };