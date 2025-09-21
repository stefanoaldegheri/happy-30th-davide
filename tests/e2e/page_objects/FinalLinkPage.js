// Page Object Model for the Final Link page
class FinalLinkPage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    console.log('FinalLinkPage: Navigating to Final page...');
    await this.page.goto('/final');
    console.log('FinalLinkPage: Navigation to Final page completed');
  }

  async isVisible() {
    console.log('FinalLinkPage: Checking if page is visible...');
    const isVisible = await this.page.isVisible('h1:has-text("Congratulations!")');
    console.log(`FinalLinkPage: Page visibility check result: ${isVisible}`);
    return isVisible;
  }

  async getGiftLink() {
    console.log('FinalLinkPage: Getting gift link...');
    const giftLink = await this.page.getAttribute('a.gift-link', 'href');
    console.log(`FinalLinkPage: Gift link: ${giftLink}`);
    return giftLink;
  }
}

module.exports = { FinalLinkPage };