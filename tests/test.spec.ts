import { test, expect } from '@playwright/test'

test('tests required by the final project', async ({ page }) => {

    // homepage
    await page.goto('http://127.0.0.1:8080');
    // await page.getByRole('button', { name: 'Reload' }).click();
    await page.getByRole('article').filter({ hasText: 'Student Page Login If you\'re a professor, you can log in through this page to an' }).getByRole('link', { name: 'Log in' }).click();

    // login page
    // await page.goto('http://127.0.0.1:8095/api/login');
  
    // find input fields with css class .pf-c-form-control, which returns a list of buttons
    const inputFields = await page.locator(".pf-c-form-control")

    // click the selected input fields
    // username
    await inputFields.nth(0).click()
    await inputFields.nth(0).fill('mhz')

    // password 
    await inputFields.nth(1).click()
    await inputFields.nth(1).fill('110')

    // click button sign in 
    await page.getByRole('button', { name: 'Sign In' }).click()

    // student page

    // add a new post
    await page.getByRole('button', { name: 'New Post' }).click();
    await page.getByLabel('Post Title').click();
    await page.getByLabel('Post Title').fill('this is a new post title');
    await page.getByLabel('Content').click();
    await page.getByLabel('Content').fill('this is a new post content');
    await page.locator('[id="__BVID__34"]').selectOption('public');
    await page.getByText('Anonymous').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Group: public group' }).click();
    await page.getByRole('button', { name: 'this is a new post title Delete' }).click();
    await page.getByRole('img', { name: 'caret up' }).click(); // upvote
    await page.getByRole('img', { name: 'caret down' }).click(); // downvote
    await page.locator('#exampleFormControlTextarea1').click(); // add a new post
    await page.locator('#exampleFormControlTextarea1').fill('this is a new comment');
    await page.getByRole('button', { name: 'Post' }).nth(2).click();
    await page.locator('#exampleFormControlTextarea1').click();
    await page.locator('#exampleFormControlTextarea1').fill('this is a second comment');
    await page.getByRole('button', { name: 'Post' }).nth(2).click();


  
    // // compute the total number of buttons 
    // const count: number = await inputFields.count()
  
    // // draw a random number 
    // const choice = Math.random() * count
  
    // get the text of our selected button, which returns ["Add XXX"] 
    // const text = await inputFields.nth(choice).allTextContents()
  
    // // get XXX from ["Add XXX"]
    // const name = text[0].split(" ")[1]
    
    // // go to the operator's page 
    // await page.goto("http://localhost:8096/operator/mary")
  
    // // find all stuffs with css class Ingredients, and then pick the last one 
    // const lastElement = await page.locator(".Ingredients").last()
  
    // // expect the last one to have the exactly same text of our selected buttons 
    // await expect(lastElement).toHaveText(name)

  });
  