# v0.1.24 (2013/11/6)
## Bug Fixes
- **macTagAutocomplete:** Remove left padding in tag list
  ([389f337f](https://github.com/StartTheShift/MacGyver/commit/389f337ff50f756fb587bd7f07a03fcea8232429))
- **macTime:** Replaced the comparison of {} since you cannot compare objects to {}.
  ([30b68d1b](https://github.com/StartTheShift/MacGyver/commit/30b68d1b300219d59accc1f448768ef250106404))

## Features
- **macTime:** Converted date to use current instead of unix. Removed notion of end selection because it broke highlighting when you selected more than one section (hour, minute, or marker). Denested some control blocks for readability/dry-ness. Added new lines for readability. Added "A" and "P" events to modify meridian values.
  ([715bbe20](https://github.com/StartTheShift/MacGyver/commit/715bbe20bd41ea521611777ddf37e8fba810bfc3),
   [#135](https://github.com/StartTheShift/MacGyver/issues/135))


# v0.1.23 (2013/11/4)
## Bug Fixes
- **util:** Updated the url regex to be more verbose—more inline with rfc3986. Modified the protocol attribute to return only the protocol.
Close #134
  ([5d573011](https://github.com/StartTheShift/MacGyver/commit/5d5730114625b0482dd1c9dd156472ff80b9327b))


# v0.1.22 (2013/10/30)
## Bug Fixes
- **macAutocomplete:** Changed menu to min width to prevent content getting cut off
  ([d80c4153](https://github.com/StartTheShift/MacGyver/commit/d80c4153fc5e92260b87bc948d68daeb3e1b0f25),
   [#131](https://github.com/StartTheShift/MacGyver/issues/131))
- **macScrollSpy:** Scroll spy doesn't flicker when scrolling to last element.
  ([39ed95db](https://github.com/StartTheShift/MacGyver/commit/39ed95db6e31b91147207253a0422d4c8a61f5f6),
   [#132](https://github.com/StartTheShift/MacGyver/issues/132))


# v0.1.21 (2013/10/24)
## Bug Fixes
- **macMenu:** Removed left padding on menu item
  ([dd2c2495](https://github.com/StartTheShift/MacGyver/commit/dd2c249545e467b053a13a0414716a3a7282894e))
- **macScrollSpy:** Fixed not selecting last anchor when scroll to the bottom
  ([cf104358](https://github.com/StartTheShift/MacGyver/commit/cf104358ad4d5c25b36dcd43d261f4d787763368))
- **macTagAutocomplete:**
  - Placeholder shows when no items are selected and can now accomedate for longer placeholder
  ([671bd823](https://github.com/StartTheShift/MacGyver/commit/671bd82398dcf46f2ebe802ac0eb9b7d53bd9ea8),
   [#110](https://github.com/StartTheShift/MacGyver/issues/110))
  - Fixed clicking on tag autocomplete focus on input
  ([ce73e365](https://github.com/StartTheShift/MacGyver/commit/ce73e365d459c3e79101aafd41cfb30aed474ceb))
  - Removed digest cycle on reset event
  ([d5a53aa6](https://github.com/StartTheShift/MacGyver/commit/d5a53aa6e947be694666ec8707b0bc02fcc2b1a4))


# v0.1.20 (2013/10/21)
## Bug Fixes
- **macScrollSpyAnchor:** Fixed interpolated id not working properly
  ([28f0996f](https://github.com/StartTheShift/MacGyver/commit/28f0996fb54d1e383a7f4b439eb7d2dea51c69ec))
- **macTime:** Removed unnecessary digest cycle on blur
  ([b3faef64](https://github.com/StartTheShift/MacGyver/commit/b3faef64fb32cd1b936c68ecd42f377ad11a4b8d))


# v0.1.19 (2013/10/16)
## Optimizations
- **macAutocomplete:**
    - Updated autocomplete to not append menu initially.
    - Menu is appended to body when needed.
    - Menu will not show up when there is no input or after selecting and item.
    - Menu will be removed when scope is destroyed.
  ([b93d17b1](https://github.com/StartTheShift/MacGyver/commit/b93d17b1393ec935027e5a948956b5f073d73ce2))


# v0.1.18 (2013/10/9)
## Bug Fixes
- **macModal:** Fixed showing modal the first time might invoke a digest cycle
  ([bc532a6b](https://github.com/StartTheShift/MacGyver/commit/bc532a6b3f738f9c5732781d10c9677160a5cf72))
- **macTagAutocomplete:** Fixed autocomplete menu not updating when source gets updated
  ([a26353c5](https://github.com/StartTheShift/MacGyver/commit/a26353c58a13b0a91e730df0588a145321179bc5))


# 0.1.17 (2013/10/8)
## Features
- **macAffix:** Adding mac-affix
  ([c7aaca80](https://github.com/StartTheShift/MacGyver/commit/c7aaca800e018cf5dd5034118f5c6dbd153027d7))

## Optimizations
- **macFocusOnEvent:** Prevent digest cycle from invoking on focus
  ([d019f761](https://github.com/StartTheShift/MacGyver/commit/d019f7616085f2851d77778d2039f075651ebc3b))
- **macModal:** Allow modal to compile with modal trigger scope
  ([17108162](https://github.com/StartTheShift/MacGyver/commit/171081622b560c298de1a25192189885ad06b1c5))
- **macTooltip:** Clear and not show tooltip with empty string. Make sure events propagate up the bubble
  ([2ab95b26](https://github.com/StartTheShift/MacGyver/commit/2ab95b26fd10f533772e431c899a11587cf5621c))

## Breaking Changes
- **macModal:**  mac-modal-content is deprecated. Use mac-modal-data instead.
  ([b29cbd68](https://github.com/StartTheShift/MacGyver/commit/b29cbd687c4c885cbf932b96d268fcc0c4064ee0))


# v0.1.16 (2013/9/25)
## Bug Fixes
- **macKeydown:** Fixed mac-keydown events not firing at all
  ([693d263e](https://github.com/StartTheShift/MacGyver/commit/693d263e72b9ea234ece0174d8daa3ca2effced8))

## Optimizations
- **macCspinner:** Handle timeout better. Switched from setInterval to setTimeout to have better control. Added support for ngShow and ngHide to reduce CPU load.
  ([6f088da9](https://github.com/StartTheShift/MacGyver/commit/6f088da97e6c43d95a849ae75e7568544390702e))


# v0.1.15 (2013/9/24)
## Bug Fixes
- **macTagAutocomplete:** Fixed tags getting pushed even when mac-tag-autocomplete-on-enter is returning false
  ([3cef3e74](https://github.com/StartTheShift/MacGyver/commit/3cef3e74e0a20c1904da82344a9371d06720615a))

## Features
- **cspinner:** Canvas spinner
  ([33d22fd1](https://github.com/StartTheShift/MacGyver/commit/33d22fd150ac2da52b6cc23ed8bfb494a9fc0a4b))
- **util:** Added pyth, degrees, radian and hex2rgb
  ([a3bea8be](https://github.com/StartTheShift/MacGyver/commit/a3bea8beec73875f6134f1dce6a80f0dfed46f7d))

## Optimizations
- **macSpinner:** Updated to make sure size is rendered correctly. Reduced spinner css size and calculate width and height with js.
  ([61c9549b](https://github.com/StartTheShift/MacGyver/commit/61c9549b8b94885f5e3deeb63f0d5256d9559ac0))


# v0.1.14 (2013/9/18)
## Bug Fixes
- **changelog:** Fixed referencing invalid object
  ([9dc09676](https://github.com/StartTheShift/MacGyver/commit/9dc09676c3ab2b02e0b4e6eaab596759cd596e9d))
- **macDatepicker:** Fixed cannot reset macDatepicker with null
  ([9d0ab82b](https://github.com/StartTheShift/MacGyver/commit/9d0ab82b0b72b2c9c60996d9b9c5dd59c8677f29),
   [#119](https://github.com/StartTheShift/MacGyver/issues/119))
- **macMenu:** Fixed menu index bi-directional binding not working properly
  ([db719b0c](https://github.com/StartTheShift/MacGyver/commit/db719b0cd128fcb42873296257e08958a05a1df6))
- **macTime:** Fixed not able to reset time with empty string
  ([4420a547](https://github.com/StartTheShift/MacGyver/commit/4420a5478eb6474490ae9b00e603a360cf75732f),
   [#119](https://github.com/StartTheShift/MacGyver/issues/119))

## Optimizations
- **util:** Added default values to pluralize, toCamelCase and toSnakeCase
  ([166bf16c](https://github.com/StartTheShift/MacGyver/commit/166bf16cf7104ceea64e5f260fe658f920a4f452))

## Breaking Changes
- **util:**  util.isArray has been removed as it is the same as angular.isArray. User should switch to angular.isArray instead
  ([4f797650](https://github.com/StartTheShift/MacGyver/commit/4f7976505d5d547b59786e4538c50b7ccb76c672))


# v0.1.13 (2013/9/15)
## Bug Fixes
- **Grunt:** Fixed configuration errors with css watch task
  ([9c405f84](https://github.com/StartTheShift/MacGyver/commit/9c405f844a9b0884c1e3cfb6b7e69d17f9ac02e8))
- **macDatepicker:** Fixed datepicker possibly watching undefined variables
  ([e6227b73](https://github.com/StartTheShift/MacGyver/commit/e6227b73fc8995a8a2e30d240ddaf75d74c874e7))
- **macTooltip:**
  - Fixed removing tooltip invokes $digest cycle
  ([035d677c](https://github.com/StartTheShift/MacGyver/commit/035d677ca571f8a2b8d7fd0619e4ba540ea71757),
   [#118](https://github.com/StartTheShift/MacGyver/issues/118))
  - Fixed tooltip possibly watching an undefined variable
  ([bc236b27](https://github.com/StartTheShift/MacGyver/commit/bc236b27718a803d42864a626ed7febbe726e630))

## Features
- **jqLite:** Extended jqLite with new functions. Includes height(), width(), outerHeight(), outerWidth(), offset() and scrollTop()
  ([704bc317](https://github.com/StartTheShift/MacGyver/commit/704bc31730aa0e35706704ca8dc6757f57b8bb96))
- **listFilter:** Added list filter
  ([de7e2209](https://github.com/StartTheShift/MacGyver/commit/de7e22097065da2f5472eee72306d24b4e78deb4))

## Optimizations
- **Grunt:** Moved custom tasks to misc folder Switch to use grunt underscore and grunt.file Removed wrench dependency
  ([6d901f0e](https://github.com/StartTheShift/MacGyver/commit/6d901f0e2d2da46200e145e3a1dbc7ef4f48f919))
- **autocomplete:** Removed unnecessary watch
  ([5ae2c1a7](https://github.com/StartTheShift/MacGyver/commit/5ae2c1a7ccea81dcf5278cc89622377948e30bbe))
- **directives:** Updated directives to work with jqLite. Make sure all core directives run properly with AngularJS jqLite
  ([3794efb6](https://github.com/StartTheShift/MacGyver/commit/3794efb64134db9495a591fe5f4d6165a0cffd70))
- **events:** Switched to use `bind` for event binding. On and off aren't introduced in 1.0.x jqLite. This update will make sure MacGyver works with AngularJS jqLite
  ([d11bb52e](https://github.com/StartTheShift/MacGyver/commit/d11bb52e6c880e59b871cab716d34cb8e57a2525))
- **macAutocomplete:** Removed jQuery dependency and make sure it works with jqLite
  ([92b76df8](https://github.com/StartTheShift/MacGyver/commit/92b76df8ed2d5403190fa240c2bb0dfa5bb1d1fe))
- **macDatepicker:**
  - Removed jQuery dependency
  ([7571bdce](https://github.com/StartTheShift/MacGyver/commit/7571bdce95014349eccbc3bfd78b6cdac17b1e87))
  - Removed calling digest cycle when setting datepicker date
  ([87ba396e](https://github.com/StartTheShift/MacGyver/commit/87ba396e0fe5fd97005032cba6a55c8ec89f64e1))
- **macModal:**
  - Updated mac-modal service to work with jqLite
  ([e3dc31d7](https://github.com/StartTheShift/MacGyver/commit/e3dc31d703cb08786d3c8cf4c65d562780153204))
  - Removed calling digest cycle when changing 'visible' class
  ([6569accd](https://github.com/StartTheShift/MacGyver/commit/6569accd486c8562dda208af2982d39191e5377f))
- **macTagAutocomplete:** Cleaned up tag autocomplete Switched from jQuery to angular.element Refactored how events are bind to autocomplete text field Fixed event not clearing autocomplete text
  ([b88edf25](https://github.com/StartTheShift/MacGyver/commit/b88edf25c5d6f5adbc6770a4f3a8148b88a3a64e))
- **macTime:** Removed calling digest cycle when highlighting text
  ([7e731035](https://github.com/StartTheShift/MacGyver/commit/7e731035786915f9290fb733d3c6d208c493823d))
- **macUpload:**
  - Updated directive to be more Angular
  ([fd9a927e](https://github.com/StartTheShift/MacGyver/commit/fd9a927ee403f4c75810f420a3897472201f9804))
  - Removed calling digest cycle when changing class on dropzone
  ([5290aff5](https://github.com/StartTheShift/MacGyver/commit/5290aff5285d9395cc3a56ab2c8f6d31ebf8f6b0))
- **package.json:** Removed wrench and underscore dependencies
  ([0096f558](https://github.com/StartTheShift/MacGyver/commit/0096f558847c4b52335ca9c5add340998845c696))
- **server:** Switched from express to connect
  ([b2179a8c](https://github.com/StartTheShift/MacGyver/commit/b2179a8c38677dbefbcb8c35f4dd20fdc18ca788))


