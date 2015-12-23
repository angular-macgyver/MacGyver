describe('Mac Time Util', function () {
  var macTimeUtil, $timeout, element;

  beforeEach(module('Mac'));

  beforeEach(inject(function(_$timeout_, _macTimeUtil_) {
    $timeout = _$timeout_;
    macTimeUtil = _macTimeUtil_;

    // Create a fake object to simulate text input since PhantomJS
    // has trouble with element.selectionStart
    element = [{
      selectionStart: 0,
      selectionEnd: 0,
      setSelectionRange: function (start, end) {
        this.selectionStart = start;
        this.selectionEnd = end;
      }
    }];
  }));

  describe('initializeTime', function () {
    it('should use options passed in', function () {
      var today = new Date(),
          output = macTimeUtil.initializeTime({
            default: '02:00 AM'
          }),
          expected = new Date(today.toDateString() + ' 02:00 AM');

      expect(output).toEqual(expected);
    });

    it('should use default when option is invalid', function () {
      var today = new Date(),
          output = macTimeUtil.initializeTime({
            default: '14:00 AM'
          }),
          expected = new Date(today.toDateString() + ' 12:00 AM');

      expect(output).toEqual(expected);
    });
  });

  describe('getSelection', function () {
    it('should select hour from 0 to 2', function () {
      var i;
      for (i = 0; i < 3; i++) {
        element[0].selectionStart = i;
        expect(macTimeUtil.getSelection(element)).toBe('hour');
      }
    });

    it('should select hour from 0 to 2', function () {
      var i;
      for (i = 0; i < 3; i++) {
        element[0].selectionStart = i;
        expect(macTimeUtil.getSelection(element)).toBe('hour');
      }
    });

    it('should select hour from 3 to 5', function () {
      var i;
      for (i = 3; i < 6; i++) {
        element[0].selectionStart = i;
        expect(macTimeUtil.getSelection(element)).toBe('minute');
      }
    });

    it('should select hour from 6 to 8', function () {
      var i;
      for (i = 6; i < 9; i++) {
        element[0].selectionStart = i;
        expect(macTimeUtil.getSelection(element)).toBe('meridian');
      }
    });
  });

  describe('setSelectionRange', function () {
    it('should selectRange properly', function () {
      macTimeUtil.selectRange(element, 3, 5);

      $timeout.flush();

      expect(element[0].selectionStart).toBe(3);
      expect(element[0].selectionEnd).toBe(5);
    });

    it('should selectHours properly', function () {
      macTimeUtil.selectHours(element);

      $timeout.flush();

      expect(element[0].selectionStart).toBe(0);
      expect(element[0].selectionEnd).toBe(2);
    });

    it('should selectMinutes properly', function () {
      macTimeUtil.selectMinutes(element);

      $timeout.flush();

      expect(element[0].selectionStart).toBe(3);
      expect(element[0].selectionEnd).toBe(5);
    });

    it('should selectMeridian properly', function () {
      macTimeUtil.selectMeridian(element);

      $timeout.flush();

      expect(element[0].selectionStart).toBe(6);
      expect(element[0].selectionEnd).toBe(8);
    });
  });

  describe('selectSection', function () {
    it('should selectNextSection minute', function () {
      macTimeUtil.selectHours(element);
      $timeout.flush();
      macTimeUtil.selectNextSection(element);
      $timeout.flush();

      expect(element[0].selectionStart).toBe(3);
      expect(element[0].selectionEnd).toBe(5);
    });

    it('should selectNextSection meridian', function () {
      macTimeUtil.selectMinutes(element);
      $timeout.flush();
      macTimeUtil.selectNextSection(element);
      $timeout.flush();

      expect(element[0].selectionStart).toBe(6);
      expect(element[0].selectionEnd).toBe(8);
    });

    it('should selectNextSection meridian', function () {
      macTimeUtil.selectMeridian(element);
      $timeout.flush();
      macTimeUtil.selectNextSection(element);
      $timeout.flush();

      expect(element[0].selectionStart).toBe(6);
      expect(element[0].selectionEnd).toBe(8);
    });

    it('should selectPreviousSection hour', function () {
      macTimeUtil.selectHours(element);
      $timeout.flush();
      macTimeUtil.selectPreviousSection(element);
      $timeout.flush();

      expect(element[0].selectionStart).toBe(0);
      expect(element[0].selectionEnd).toBe(2);
    });

    it('should selectPreviousSection hour', function () {
      macTimeUtil.selectMinutes(element);
      $timeout.flush();
      macTimeUtil.selectPreviousSection(element);
      $timeout.flush();

      expect(element[0].selectionStart).toBe(0);
      expect(element[0].selectionEnd).toBe(2);
    });

    it('should selectPreviousSection minute', function () {
      macTimeUtil.selectMeridian(element);
      $timeout.flush();
      macTimeUtil.selectPreviousSection(element);
      $timeout.flush();

      expect(element[0].selectionStart).toBe(3);
      expect(element[0].selectionEnd).toBe(5);
    });
  });

  describe('setMeridian', function () {
    it('should flip hour to AM', function () {
      var time = new Date('Thu Jan 01 2015 13:12:00 GMT-0800 (PST)');

      spyOn(time, 'getHours').and.returnValue(13);
      spyOn(time, 'setHours');

      macTimeUtil.setMeridian(time, 'AM');
      expect(time.setHours.calls.argsFor(0)[0]).toBe(1);
    });

    it('should keep the hour for AM', function () {
      var time = new Date('Thu Jan 01 2015 07:12:00 GMT-0800 (PST)');

      spyOn(time, 'getHours').and.returnValue(7);
      spyOn(time, 'setHours');

      macTimeUtil.setMeridian(time, 'AM');
      expect(time.setHours.calls.argsFor(0)[0]).toBe(7);
    });

    it('should flip hour to PM', function () {
      var time = new Date('Thu Jan 01 2015 07:12:00 GMT-0800 (PST)');

      spyOn(time, 'getHours').and.returnValue(7);
      spyOn(time, 'setHours');

      macTimeUtil.setMeridian(time, 'PM');
      expect(time.setHours.calls.argsFor(0)[0]).toBe(19);
    });

    it('should keep the hour for PM', function () {
      var time = new Date('Thu Jan 01 2015 15:12:00 GMT-0800 (PST)');

      spyOn(time, 'getHours').and.returnValue(15);
      spyOn(time, 'setHours');

      macTimeUtil.setMeridian(time, 'PM');
      expect(time.setHours.calls.argsFor(0)[0]).toBe(15);
    });

    it('should keep the hour with invalid meridian value', function () {
      var time = new Date('Thu Jan 01 2015 15:12:00 GMT-0800 (PST)');

      spyOn(time, 'getHours').and.returnValue(15);
      spyOn(time, 'setHours');

      macTimeUtil.setMeridian(time, 'GM');
      expect(time.setHours.calls.argsFor(0)[0]).toBe(15);
    });
  });

  describe('toggleMeridian', function () {
    it('should change 7 -> 19', function () {
      var time = new Date('Thu Jan 01 2015 07:12:00 GMT-0800 (PST)');

      spyOn(time, 'getHours').and.returnValue(7);
      spyOn(time, 'setHours');

      macTimeUtil.toggleMeridian(time);
      expect(time.setHours.calls.argsFor(0)[0]).toBe(19);
    });

    it('should change 19 -> 7', function () {
      var time = new Date('Thu Jan 01 2015 19:12:00 GMT-0800 (PST)');

      spyOn(time, 'getHours').and.returnValue(19);
      spyOn(time, 'setHours');

      macTimeUtil.toggleMeridian(time);
      expect(time.setHours.calls.argsFor(0)[0]).toBe(7);
    });
  });

  describe('increment', function () {
    var time;

    beforeEach(function() {
      time = new Date('Thu Jan 01 2015 05:14:00 GMT-0800 (PST)');

      spyOn(time, 'getHours').and.returnValue(5);
      spyOn(time, 'setHours');
      spyOn(time, 'setMinutes');
    });

    it('should increment hour', function() {
      macTimeUtil.incrementHour(time, 5);
      expect(time.setHours.calls.argsFor(0)[0]).toBe(10);
    });

    it('should decrement hour', function() {
      macTimeUtil.incrementHour(time, -2);
      expect(time.setHours.calls.argsFor(0)[0]).toBe(3);
    });

    it('should increment minute', function() {
      macTimeUtil.incrementMinute(time, 26);
      expect(time.setMinutes.calls.argsFor(0)[0]).toBe(40);
    });

    it('should decrement minute', function() {
      macTimeUtil.incrementMinute(time, -12);
      expect(time.setMinutes.calls.argsFor(0)[0]).toBe(2);
    });
  });
});
