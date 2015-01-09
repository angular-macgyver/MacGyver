describe("Timestamp filter", function() {
  var timestampFilter;

  beforeEach(module("Mac"));
  beforeEach(inject(function($injector) {
    timestampFilter = $injector.get("timestampFilter");
  }));

  it("should format timestamps", function() {
    var aMinuteAgo, fiveMinutesAgo, fourDaysAgo, justNow, now, sixMonthsAgo, tenYearsAgo, threeHoursAgo, twoWeeksAgo;
    now = Math.floor(Date.now() / 1000.0);
    justNow = now - 5;
    aMinuteAgo = now - 60;
    fiveMinutesAgo = now - 60 * 5;
    threeHoursAgo = now - 60 * 60 * 3;
    fourDaysAgo = now - 24 * 60 * 60 * 4;
    twoWeeksAgo = now - 7 * 24 * 60 * 60 * 2;
    sixMonthsAgo = now - 31 * 24 * 60 * 60 * 6;
    tenYearsAgo = now - 365 * 24 * 60 * 60 * 10;
    
    expect(timestampFilter(justNow)).toBe("just now");
    expect(timestampFilter(aMinuteAgo)).toBe("about a minute ago");
    expect(timestampFilter(fiveMinutesAgo)).toBe("5 min ago");
    expect(timestampFilter(threeHoursAgo)).toBe("3 hours ago");
    expect(timestampFilter(fourDaysAgo)).toBe("4 days ago");
    expect(timestampFilter(twoWeeksAgo)).toBe("2 weeks ago");
    expect(timestampFilter(sixMonthsAgo)).toBe("6 months ago");
    expect(timestampFilter(tenYearsAgo)).toBe("10 years ago");
  });
});
