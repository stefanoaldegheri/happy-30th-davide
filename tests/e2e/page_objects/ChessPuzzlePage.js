// Page Object Model for the Chess Puzzle page
class ChessPuzzlePage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    console.log('ChessPuzzlePage: Navigating to chess page...');
    await this.page.goto('/chess');
    console.log('ChessPuzzlePage: Navigation to chess page completed');
  }

  async isVisible() {
    console.log('ChessPuzzlePage: Checking if page is visible...');
    const isVisible = await this.page.isVisible('h1:has-text("Chess Challenge")');
    console.log(`ChessPuzzlePage: Page visibility check result: ${isVisible}`);
    return isVisible;
  }

  async solvePuzzle() {
    console.log('ChessPuzzlePage: Solving puzzle by making correct moves...');
    
    // Solution sequence from PRD:
    // 1. e4+ (White) fxe3 (Black)
    // 2. g4+ (White) hxg3 (Black)
    // 3. Nxg3+ (White) Kf4 (Black)
    // 4. Ne2+ (White) Kf3 (Black)
    // 5. Nd4+ (White) Kf4 (Black)
    // 6. Bg3# (White Checkmate)
    
    // Make the first move: e4+
    console.log('ChessPuzzlePage: Making move 1: e4+');
    await this.page.click('.square-e2 .piece');
    await this.page.click('.square-e4');
    // Wait a bit for the black response
    await this.page.waitForTimeout(1000);
    
    // Make the second move: g4+
    console.log('ChessPuzzlePage: Making move 2: g4+');
    await this.page.click('.square-g2 .piece');
    await this.page.click('.square-g4');
    // Wait a bit for the black response
    await this.page.waitForTimeout(1000);
    
    // Make the third move: Nxg3+
    console.log('ChessPuzzlePage: Making move 3: Nxg3+');
    await this.page.click('.square-f1 .piece');
    await this.page.click('.square-g3');
    // Wait a bit for the black response
    await this.page.waitForTimeout(1000);
    
    // Make the fourth move: Ne2+
    console.log('ChessPuzzlePage: Making move 4: Ne2+');
    await this.page.click('.square-g3 .piece');
    await this.page.click('.square-e2');
    // Wait a bit for the black response
    await this.page.waitForTimeout(1000);
    
    // Make the fifth move: Nd4+
    console.log('ChessPuzzlePage: Making move 5: Nd4+');
    await this.page.click('.square-e2 .piece');
    await this.page.click('.square-d4');
    // Wait a bit for the black response
    await this.page.waitForTimeout(1000);
    
    // Make the sixth move: Bg3#
    console.log('ChessPuzzlePage: Making move 6: Bg3#');
    await this.page.click('.square-e1 .piece');
    await this.page.click('.square-g3');
    
    // Wait for the success modal to appear
    console.log('ChessPuzzlePage: Waiting for success message...');
    await this.page.waitForSelector('div.success-modal h2:has-text("Congratulations!")', { timeout: 30000 });
    console.log('ChessPuzzlePage: Puzzle solved (success message appeared)');
  }

  async clickContinue() {
    console.log('ChessPuzzlePage: Clicking Continue button...');
    await this.page.click('div.success-modal button:has-text("Continue to Next Challenge")');
    console.log('ChessPuzzlePage: Continue button clicked');
  }
}

module.exports = { ChessPuzzlePage };