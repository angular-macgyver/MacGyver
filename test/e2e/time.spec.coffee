describe "Mac Time Input", ->
  beforeEach ->
    browser.get "/test/e2e/time.html"
    browser.waitForAngular()
    return

  it "should return true", ->
    input = element(By.css(".mac-date-time input"))
    input.click()
    expect(input.getAttribute("value")).toEqual "10:55 PM"
    return

  it "should change the meridian to AM after pressing the A button", ->
    input = element(By.css(".mac-date-time input"))
    input.click()
    input.sendKeys "A"
    input.sendKeys "A"
    expect(input.getAttribute("value")).toEqual "10:55 AM"
    return

  it "should not change the meridian to AM after pressing the P button", ->
    input = element(By.css(".mac-date-time input"))
    input.click()
    input.sendKeys "P"
    input.sendKeys "P"
    expect(input.getAttribute("value")).toEqual "10:55 PM"
    return

  it "should change the model after pressing down button", ->
    input = element(By.css(".mac-date-time input"))
    input.click()
    input.sendKeys protractor.Key.DOWN
    expect(input.getAttribute("value")).toEqual "09:55 PM"
    return

  it "should change the model after pressing up button", ->
    input = element(By.css(".mac-date-time input"))
    input.click()
    input.sendKeys protractor.Key.UP
    expect(input.getAttribute("value")).toEqual "11:55 PM"
    return
