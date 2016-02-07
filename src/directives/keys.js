/**
 * @ngdoc constant
 * @name keys
 * @description
 * MacGyver comes with character code enum for easy reference and better
 * readability.
 *
 * |  |  |  |  |
 * | --- | --- | --- | --- |
 * | **CANCEL** - 3 |	**FOUR** - 52 | **U** - 85 | **F7** - 118 |
 * | **HELP** - 6 |	**FIVE** - 53 | **V** - 86 | **F8** - 119 |
 * | **BACKSPACE** - 8 |	**SIX** - 54 | **W** - 87 | **F9** - 120 |
 * | **TAB** - 9 |	**SEVEN** - 55 | **X** - 88 | **F10** - 121 |
 * | **CLEAR** - 12 |	**EIGHT** - 56 | **Y** - 89 | **F11** - 122 |
 * | **ENTER** - 13 |	**NINE** - 57 | **Z** - 90 | **F12** - 123 |
 * | **RETURN** - 13 |	**SEMICOLON** - 59 | **CONTEXT_MENU** - 93 | **F13** - 124 |
 * | **SHIFT** - 16 |	**EQUALS** - 61 | **NUMPAD0** - 96 | **F14** - 125 |
 * | **CONTROL** - 17 |	**COMMAND** - 91 | **NUMPAD1** - 97 | **F15** - 126 |
 * | **ALT** - 18 |	**A** - 65 | **NUMPAD2** - 98 | **F16** - 127 |
 * | **PAUSE** - 19 |	**B** - 66 | **NUMPAD3** - 99 | **F17** - 128 |
 * | **CAPS_LOCK** - 20 |	**C** - 67 | **NUMPAD4** - 100 | **F18** - 129 |
 * | **ESCAPE** - 27 |	**D** - 68 | **NUMPAD5** - 101 | **F19** - 130 |
 * | **SPACE** - 32 |	**E** - 69 | **NUMPAD6** - 102 | **F20** - 131 |
 * | **PAGE_UP** - 33 |	**F** - 70 | **NUMPAD7** - 103 | **F21** - 132 |
 * | **PAGE_DOWN** - 34 |	**G** - 71 | **NUMPAD8** - 104 | **F22** - 133 |
 * | **END** - 35 |	**H** - 72 | **NUMPAD9** - 105 | **F23** - 134 |
 * | **HOME** - 36 |	**I** - 73 | **MULTIPLY** - 106 | **F24** - 135 |
 * | **LEFT** - 37 |	**J** - 74 | **ADD** - 107 | **NUM_LOCK** - 144 |
 * | **UP** - 38 |	**K** - 75 | **SEPARATOR** - 108 | **SCROLL_LOCK** - 145 |
 * | **RIGHT** - 39 |	**L** - 76 | **SUBTRACT** - 109 | **COMMA** - 188 |
 * | **DOWN** - 40 |	**M** - 77 | **DECIMAL** - 110 | **PERIOD** - 190 |
 * | **PRINT_SCREEN** - 44 |	**N** - 78 | **DIVIDE** - 111 | **SLASH** - 191 |
 * | **INSERT** - 45 |	**O** - 79 | **F1** - 112 | **BACK_QUOTE** - 192 |
 * | **DELETE** - 46 |	**P** - 80 | **F2** - 113 | **OPEN_BRACKET** - 219 |
 * | **ZERO** - 48 |	**Q** - 81 | **F3** - 114 | **BACK_SLASH** - 220 |
 * | **ONE** - 49 |	**R** - 82 | **F4** - 115 | **CLOSE_BRACKET** - 221 |
 * | **TWO** - 50 |	**S** - 83 | **F5** - 116 | **QUOTE** - 222 |
 * | **THREE** - 51 |	**T** - 84 | **F6** - 117 | **META** - 224 |
 */
angular.module('Mac').constant('keys', {
  CANCEL: 3,
  HELP: 6,
  BACKSPACE: 8,
  TAB: 9,
  CLEAR: 12,
  ENTER: 13,
  RETURN: 13,
  SHIFT: 16,
  CONTROL: 17,
  ALT: 18,
  PAUSE: 19,
  CAPS_LOCK: 20,
  ESCAPE: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  PRINT_SCREEN: 44,
  INSERT: 45,
  DELETE: 46,
  ZERO: 48,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
  SIX: 54,
  SEVEN: 55,
  EIGHT: 56,
  NINE: 57,
  SEMICOLON: 59,
  EQUALS: 61,
  COMMAND: 91,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  CONTEXT_MENU: 93,
  NUMPAD0: 96,
  NUMPAD1: 97,
  NUMPAD2: 98,
  NUMPAD3: 99,
  NUMPAD4: 100,
  NUMPAD5: 101,
  NUMPAD6: 102,
  NUMPAD7: 103,
  NUMPAD8: 104,
  NUMPAD9: 105,
  MULTIPLY: 106,
  ADD: 107,
  SEPARATOR: 108,
  SUBTRACT: 109,
  DECIMAL: 110,
  DIVIDE: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  F13: 124,
  F14: 125,
  F15: 126,
  F16: 127,
  F17: 128,
  F18: 129,
  F19: 130,
  F20: 131,
  F21: 132,
  F22: 133,
  F23: 134,
  F24: 135,
  NUM_LOCK: 144,
  SCROLL_LOCK: 145,
  COMMA: 188,
  PERIOD: 190,
  SLASH: 191,
  BACK_QUOTE: 192,
  OPEN_BRACKET: 219,
  BACK_SLASH: 220,
  CLOSE_BRACKET: 221,
  QUOTE: 222,
  META: 224
});
