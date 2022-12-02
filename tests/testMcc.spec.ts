import { test, expect } from '@playwright/test'


test.describe("student's user flow",() => {
test('tests for posting new posts and comments', async ({ page }) => {

  // homepage
  await page.goto('http://127.0.0.1:8096');
  // await page.getByRole('button', { name: 'Reload' }).click();
  await page.getByRole('article').filter({ hasText: 'Student Page Login' }).getByRole('link', { name: 'Log in' }).click();

  // login page
  // await page.goto('http://127.0.0.1:8095/api/login');

  // find input fields with css class .pf-c-form-control, which returns a list of buttons
  const inputFields = await page.locator(".pf-c-form-control")

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
  await page.getByText('Anonymous').click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Group: public group' }).click();

  const lastPost = page.locator(".postItem").last()
  await expect(lastPost).toHaveText("this is a a new post title")

  await lastPost.click()
  await page.locator('#exampleFormControlTextarea1').click();
  await page.locator('#exampleFormControlTextarea1').fill('this is a second comment');
  await page.getByRole('button', { name: 'Post' }).nth(2).click();


  // await page.getByRole('button', { name: 'this is a new post title' }).click();
  // await page.getByRole('img', { name: 'caret up' }).click(); // upvote
  // await page.getByRole('img', { name: 'caret down' }).click(); // downvote
  // await page.locator('#exampleFormControlTextarea1').click(); // add a new post
  // await page.locator('#exampleFormControlTextarea1').fill('this is a new comment');
  // await page.getByRole('button', { name: 'Post' }).nth(2).click();
  await page.locator('#exampleFormControlTextarea1').click();
  await page.locator('#exampleFormControlTextarea1').fill('this is a second comment');
  await page.locator(".postCommentBtn").click()

  await expect(page.locator(".commentContent").last()).toHaveText("this is a second comment")


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
})})

test.describe("professor's userFlow", () => {
  test('tests for adding a new group', async ({ page }) => {
    await page.goto('http://127.0.0.1:8096');
    await page.getByRole('article').filter({ hasText: 'Professor Page Login' }).getByRole('link', { name: 'Log in' }).click();
  
    const inputFields = await page.locator(".pf-c-form-control")
  
    // click the selected input fields
    // username
    await inputFields.nth(0).click()
    await inputFields.nth(0).fill('ccdd')
  
    // password 
    await inputFields.nth(1).click()
    await inputFields.nth(1).fill('ddcc')
    await page.getByRole('button', { name: 'Sign In' }).click()


    const name = Math.random().toString(36).slice(-6)
    const id =  Math.random().toString(36).slice(-3)
    await page.getByRole('button', { name: 'New Group' }).click();
    await page.getByLabel("Group Id").fill(id);
    await page.getByLabel("Group Name").fill(name);
    await page.getByRole('button', { name: 'OK' }).click();

    await expect(page.locator(".groupName").last()).toHaveText(name)










  })
  test("testing for inviting students",async ({ page }) => {
    await page.goto('http://127.0.0.1:8096');
    await page.getByRole('article').filter({ hasText: 'Professor Page Login' }).getByRole('link', { name: 'Log in' }).click();
  
    const inputFields = await page.locator(".pf-c-form-control")
  
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

    console.log(allTextInCard)
    const groupId = allTextInCard[0]
    const groupName = allTextInCard[1]

    await aRandomCard.getByRole("button", {name: "Invite Student"}).click()

    await page.getByLabel("Student Id").fill("rowling")

    await page.getByRole("button", {name: "OK"}).click()


    // now, go to student's page see whether being invited

    await page.goto('http://127.0.0.1:8096/api/login')

    await page.locator("#reset-login").click()


    // username
    await inputFields.nth(0).fill('rowling')
  
    // password 
    await inputFields.nth(1).fill('110')
  
    // click button sign in 
    await page.getByRole('button', { name: 'Sign In' }).click()

    const groupLists =  page.getByRole("button", {name: "Group:"}).nth(-2)

    await expect(groupLists.locator(".groupName")).toHaveText(" Group: " + groupName)



  })

})