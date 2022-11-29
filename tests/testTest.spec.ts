import { test, expect } from '@playwright/test'

test('tests required by the final project', async ({ page }) => {
    // login page
    await page.goto('http://127.0.0.1:8095/api/login');
  
    // find stuffs with css class .add-ingredient, which returns a list of buttons
    const buttons = await page.locator(".ingredient-buttons")
  
    // compute the total number of buttons 
    const count: number = await buttons.count()
  
    // draw a random number 
    const choice = Math.random() * count
  
    // get the text of our selected button, which returns ["Add XXX"] 
    const text = await buttons.nth(choice).allTextContents()
  
    // get XXX from ["Add XXX"]
    const name = text[0].split(" ")[1]
  
    // click the selected button 
    await buttons.nth(choice).click()
  
    // click save and submit
    await page.locator('button', { hasText: 'save' }).click();
    await page.locator('button', { hasText: 'submit' }).click();
  
    // go to the operator's page 
    await page.goto("http://localhost:8096/operator/mary")
  
    // find all stuffs with css class Ingredients, and then pick the last one 
    const lastElement = await page.locator(".Ingredients").last()
  
    // expect the last one to have the exactly same text of our selected buttons 
    await expect(lastElement).toHaveText(name)

  });
  