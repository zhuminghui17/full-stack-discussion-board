import { test, expect, chromium, Page } from '@playwright/test'


test.describe("student's user flow", () => {
  test('tests for posting new posts and comments', async ({ page }) => {


    // homepage
    await page.goto(process.env.APP_URL || 'http://127.0.0.1:8080');
    await page.getByRole('article').filter({ hasText: 'Students Login' }).getByRole('link', { name: 'Log in' }).click();


    // find input fields with css class .pf-c-form-control, which returns a list of buttons
    const inputFields = page.locator(".pf-c-form-control")

    // click the selected input fields
    // username
    await inputFields.nth(0).click()
    await inputFields.nth(0).fill('rowling')

    // password 
    await inputFields.nth(1).click()
    await inputFields.nth(1).fill('110')


    // click button sign in 
    await page.getByRole('button', { name: 'Sign In' }).click()

    // student page

    // add a new post
    await page.getByRole('button', { name: 'New Post' }).click();
    await page.getByLabel('Post Title').click();
    await page.getByLabel('Post Title').fill('this is a a new post title');
    await page.getByLabel('Content').click();
    await page.getByLabel('Content').fill('this is a new post content');
    await page.locator(".custom-select").selectOption('public');
    await page.locator('.custom-control-label').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'public group' }).click();

    const lastPost = page.locator(".postItem").last()
    await expect(lastPost).toHaveText("this is a a new post title")


    await lastPost.click()
    await page.locator('#exampleFormControlTextarea1').click();
    await page.locator('#exampleFormControlTextarea1').fill('this is a test comment');
    await page.locator(".postCommentBtn").click()

    await expect(page.locator(".commentContent").last()).toHaveText("this is a test comment")

  })
})




test.describe("professor's userFlow", () => {
  test('tests for adding a new group', async ({ page }) => {
    const browser = await chromium.launch()
    page = await browser.newPage()
    await page.goto(process.env.APP_URL || 'http://127.0.0.1:8080');
    await page.getByRole('article').filter({ hasText: 'Professors Login' }).getByRole('link', { name: 'Log in' }).click();

    const inputFields = page.locator(".pf-c-form-control")

    await inputFields.nth(0).click()
    await inputFields.nth(0).fill('ccdd')

    // password 
    await inputFields.nth(1).click()
    await inputFields.nth(1).fill('ddcc')


    await page.getByRole('button', { name: 'Sign In' }).click()


    const name = Math.random().toString(36).slice(-6)
    const id = Math.random().toString(36).slice(-3)
    await page.getByRole('button', { name: 'New Group' }).click();
    await page.getByLabel("Group Id").fill(id);
    await page.getByLabel("Group Name").fill(name);
    await page.getByRole('button', { name: 'OK' }).click();

    await expect(page.locator(".groupName").last()).toHaveText(name)





  })
  test("testing for inviting students", async ({ page }) => {
    const browser = await chromium.launch()
    page = await browser.newPage()
    await page.goto(process.env.APP_URL || 'http://127.0.0.1:8080');
    await page.getByRole('article').filter({ hasText: 'Professors Login' }).getByRole('link', { name: 'Log in' }).click();

    const inputFields = page.locator(".pf-c-form-control")

    // click the selected input fields
    // username
    await inputFields.nth(0).click()
    await inputFields.nth(0).fill('ccdd')

    // password 
    await inputFields.nth(1).click()
    await inputFields.nth(1).fill('ddcc')
    await page.getByRole('button', { name: 'Sign In' }).click()


    // add a dummy group, using random name and random id
    await page.getByRole('button', { name: 'New Group' }).click();

    await page.getByLabel("Group Id").fill(Math.random().toString(36).slice(-2));
    await page.getByLabel("Group Name").fill(Math.random().toString(36).slice(-6));
    await page.getByRole('button', { name: 'OK' }).click();


    const groupCards = page.locator(".groupCards")
    const cardCount = await groupCards.count()
    const choice = Math.random() * cardCount

    const aRandomCard = groupCards.nth(choice)

    const allTextInCard = (await aRandomCard.allTextContents())[0].split(" ")

    // console.log(allTextInCard)
    const groupId = allTextInCard[0]
    const groupName = allTextInCard[1]

    await aRandomCard.getByRole("button", { name: "Invite Student" }).click()

    await page.getByLabel("Student Id").fill("rowling")

    await page.getByRole("button", { name: "OK" }).click()


    // now, go to student's page see whether being invited

    await page.goto(process.env.APP_URL || 'http://127.0.0.1:8080')
    await page.getByRole('article').filter({ hasText: 'Students Login' }).getByRole('link', { name: 'Log in' }).click();

    await page.locator("#reset-login").click()


    // username
    await inputFields.nth(0).fill('rowling')

    // password 
    await inputFields.nth(1).fill('110')

    // click button sign in 
    await page.getByRole('button', { name: 'Sign In' }).click()

    await page.getByRole('button', { name: groupName }).first().click();

  })

})