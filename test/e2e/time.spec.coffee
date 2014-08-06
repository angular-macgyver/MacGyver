describe "Mac Time Input", ->
  beforeEach ->
    browser.get "/test/e2e/time.html"
    browser.waitForAngular()

  it "should return true", ->
    input = element(By.css(".mac-date-time"))
    input.click()
    expect(input.getAttribute("value")).toEqual "10:55 PM"

  it "should change the meridian to AM after pressing the A button", ->
    input = element(By.css(".mac-date-time"))
    input.click()
    input.sendKeys "A"

    input = element(By.css(".mac-date-time"))
    expect(input.getAttribute("value")).toEqual "10:55 AM"

  it "should not change the meridian to AM after pressing the P button", ->
    input = element(By.css(".mac-date-time"))
    input.click()
    input.sendKeys "P"

    input = element(By.css(".mac-date-time"))
    expect(input.getAttribute("value")).toEqual "10:55 PM"

  it "should change the model after pressing down button", ->
    input = element(By.css(".mac-date-time"))
    input.click()
    input.sendKeys protractor.Key.DOWN
    expect(input.getAttribute("value")).toEqual "10:55 AM"

  it "should change the model after pressing up button", ->
    input = element(By.css(".mac-date-time"))
    input.click()
    input.sendKeys protractor.Key.UP
    expect(input.getAttribute("value")).toEqual "10:55 AM"
