const url = require('../helpers/url')
const { clickByText } = require('../helpers/buttons')

describe('Unlock', () => {
  beforeEach(() => {
    jest.setTimeout(100000)
  })
  it('should display "unlock" text on page', async () => {
    const page = await browser.newPage()
    await page.goto(url('/'))
    await expect(page).toMatch('Unlock')
  })

  it('clicking dashboard takes the user to dashboard page', async () => {
    const page = await browser.newPage()
    await page.goto(url('/'))
    await page.waitForXPath('//h1[text() = "The Web\'s new business model"]')
    await page.waitFor(200)
    await expect(page).not.toMatch('Creator Dashboard')
    await clickByText(page, 'Go to Your Dashboard', Promise.all([
      page.waitForNavigation(),
      page.waitForXPath('//button[text() = "Create Lock"]'),
    ]))
    await expect(page).toMatch('Creator Dashboard')
  })
})
