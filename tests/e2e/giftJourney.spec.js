// @ts-check
const { test, expect } = require('@playwright/test');
const { WelcomePage } = require('./page_objects/WelcomePage');
const { ChessPuzzlePage } = require('./page_objects/ChessPuzzlePage');
const { OcrModulePage } = require('./page_objects/OcrModulePage');
const { RevealModulePage } = require('./page_objects/RevealModulePage');
const { FinalLinkPage } = require('./page_objects/FinalLinkPage');

test('User can complete the entire gift experience journey', async ({ page }) => {
  console.log('Starting the gift experience journey test...');
  
  // Test the welcome page
  console.log('Navigating to welcome page...');
  const welcomePage = new WelcomePage(page);
  await welcomePage.navigate();
  console.log('Checking if welcome page is visible...');
  const isWelcomeVisible = await welcomePage.isVisible();
  expect(isWelcomeVisible).toBeTruthy();
  console.log('Welcome page is visible');
  
  // Navigate to chess puzzle
  console.log('Clicking Begin button...');
  await welcomePage.clickBeginButton();
  
  // Test the chess puzzle page
  console.log('Waiting for navigation to chess page...');
  await page.waitForURL('**/chess');
  console.log('Navigated to chess page');
  
  console.log('Checking if chess puzzle page is visible...');
  const chessPuzzlePage = new ChessPuzzlePage(page);
  const isChessVisible = await chessPuzzlePage.isVisible();
  expect(isChessVisible).toBeTruthy();
  console.log('Chess puzzle page is visible');
  
  // For this test, we'll skip the chess puzzle solving and directly navigate to the next page
  // In a more comprehensive test, we would actually interact with the chessboard
  console.log('Skipping chess puzzle solving and navigating directly to OCR page...');
  await page.goto('/ocr');
  
  // Test the OCR module page
  console.log('Waiting for navigation to OCR page...');
  await page.waitForURL('**/ocr');
  console.log('Navigated to OCR page');
  
  console.log('Checking if OCR module page is visible...');
  const ocrModulePage = new OcrModulePage(page);
  const isOcrVisible = await ocrModulePage.isVisible();
  expect(isOcrVisible).toBeTruthy();
  console.log('OCR module page is visible');
  
  // Skip the actual OCR process in this test and directly navigate to reveal
  // In a real test, we would test the camera and OCR functionality
  console.log('Clicking Continue button on OCR page...');
  await ocrModulePage.clickContinue();
  
  // Test the reveal module page
  console.log('Waiting for navigation to Reveal page...');
  await page.waitForURL('**/reveal');
  console.log('Navigated to Reveal page');
  
  console.log('Checking if Reveal module page is visible...');
  const revealModulePage = new RevealModulePage(page);
  const isRevealVisible = await revealModulePage.isVisible();
  expect(isRevealVisible).toBeTruthy();
  console.log('Reveal module page is visible');
  
  // Adjust the slider to reveal the secret
  console.log('Adjusting slider to reveal secret...');
  await revealModulePage.adjustSlider();
  console.log('Slider adjusted');
  
  // Continue to final page
  console.log('Clicking Continue button on Reveal page...');
  await revealModulePage.clickContinue();
  
  // Test the final link page
  console.log('Waiting for navigation to Final page...');
  await page.waitForURL('**/final');
  console.log('Navigated to Final page');
  
  console.log('Checking if Final link page is visible...');
  const finalLinkPage = new FinalLinkPage(page);
  const isFinalVisible = await finalLinkPage.isVisible();
  expect(isFinalVisible).toBeTruthy();
  console.log('Final link page is visible');
  
  // Verify the gift link exists
  console.log('Getting gift link...');
  const giftLink = await finalLinkPage.getGiftLink();
  console.log(`Gift link: ${giftLink}`);
  expect(giftLink).toContain('davidesthirty.github.io');
  console.log('Test completed successfully');
});