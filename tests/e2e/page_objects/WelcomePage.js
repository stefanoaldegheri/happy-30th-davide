// Page Object Model for the Welcome page
class WelcomePage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    console.log('WelcomePage: Navigating to home page...');
    await this.page.goto('/');
    console.log('WelcomePage: Navigation to home page completed');
  }

  async clickBeginButton() {
    console.log('WelcomePage: Clicking Begin button...');
    await this.page.click('button:has-text("Begin the Journey")');
    console.log('WelcomePage: Begin button clicked');
  }

  async isVisible() {
    console.log('WelcomePage: Checking if page is visible...');
    const isVisible = await this.page.isVisible('text=A Special Gift Awaits');
    console.log(`WelcomePage: Page visibility check result: ${isVisible}`);
    return isVisible;
  }
}

module.exports = { WelcomePage };