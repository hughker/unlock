module.exports = {
  clickByText: async (page, text, next = Promise.resolve()) => {
    const search = `//button[text() = "${text}"]`
    await page.waitForXPath(search)
    return Promise.all([
      page.evaluate((s) => {
        const button = document.evaluate(s, document).iterateNext()
        button.click()
      }, search),
      next,
    ])
  },
  clickByTitle: async (page, title, type = 'button', next = Promise.resolve()) => {
    const search = `${type}[title="${title}"]`
    await page.waitForSelector(search)
    await page.waitFor(400)
    return Promise.all([
      page.evaluate((s) => {
        const button = document.querySelector(s)
        button.click()
      }, search),
      next,
    ])
  },
}
