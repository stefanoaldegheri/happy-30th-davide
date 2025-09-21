// Page Object Model for the Reveal Module page
class RevealModulePage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    console.log('RevealModulePage: Navigating to Reveal page...');
    await this.page.goto('/reveal');
    console.log('RevealModulePage: Navigation to Reveal page completed');
  }

  async isVisible() {
    console.log('RevealModulePage: Checking if page is visible...');
    const isVisible = await this.page.isVisible('text=Reveal the Secret');
    console.log(`RevealModulePage: Page visibility check result: ${isVisible}`);
    return isVisible;
  }

  async adjustSlider() {
    console.log('RevealModulePage: Adjusting slider to 100%...');
    // Move the slider to 100% to reveal the secret
    const slider = await this.page.$('input[type="range"]');
    await slider.fill('100');
    console.log('RevealModulePage: Slider adjusted to 100%');
  }

  async clickContinue() {
    console.log('RevealModulePage: Clicking Continue button...');
    await this.page.click('button:has-text("Continue to Final Gift")');
    console.log('RevealModulePage: Continue button clicked');
  }
}

module.exports = { RevealModulePage };