# v1.0.0 (2016/10/8)
## Bug Fixes
- **macPopover:** Fix mac-popover-refresh-on not registering properly (ec9e4ff4, #38)

# 1.0.0-rc.1 (2016/5/22)
## Bug Fixes
- **macTagAutocomplete:**
  - Fix macTagAutocompleteOnSuccess not using '&'
  (50edb3a7)
  - Fix not creating event directives
  (f13e6bb0)

## Optimizations
- **macTagAutocomplete:**
  - Switch to use macTagAutocompleteController (9e83d0e1)
  - Add mac-tag-autocomplete-on-success attribute for callback on a successful xhr request. This will allow users to modify the data pass back to mac-autocomplete before rendering (9e83d0e1)

## Breaking Changes
- **macTagAutocomplete:**
  - Directly populate item from source without filtering (9e83d0e1)


# 1.0.0-rc.0 (2016/2/10)
## Bug Fixes
- **macAffix:** Fix referencing incorrect variable due to JS conversion (7d95b2a7)
- **macModal:** Fix not closing modal with escape (ac70db5c)
- **macPopover:**
  - Fix always switching to aligning right (34d94c5e)
  - Fix not extending proper popover default values (bf03f6b3)
- **macTagAutocomplete:** Fix bugs introduced in refactor (c55011d1)
- **macTooltip:** Fix appending tooltip inside does not calculate offset correctly (19cbb097, #31)
- **main:** Update height and width calculation to prevent NaN (d77e40db)

## Breaking Changes
- **macAutocomplete:**
  - macAutocomplete is now isolated scope
  - mac-autocomplete-url has been removed in favor of mac-autocomplete-source (438e8fe6)
- **macCSpinner:**  Canvas spinner has been removed. Use macSpinner instead. (f6d04ce3)
- **macFocusOnEvent:**  mac-focus-on-event directive has been removed
from MacGyver. The directive was never documented and should not be
used. (f0e12ecd)
- **macPopover:**
  - mac-popover-fixed option has been removed (7ef8a197)
  - macPopover service `resize` renamed to `reposition`
  - mac-popover-child-popover attr has been removed
  - mac-popover-exclude attr has been removed (2b3c91e6)
- **macTagAutocomplete:**
  - mac-tag-autocomplete-url has been removed (fa4bab82)
- **underscoreStringFilter:**  Underscore string filter has been completely removed (c9ec969a)

## Optimizations
- **booleanFilter:** Converted to Javascript (8a7d3149)
- **constants:** Move component default values to constants file (7222c105)
- **keys:** Converted keys to Javascript Switched from factory to constants (7467e789)
- **listFilter:** Converted to Javascript (89423980)
- **macAffix:**
  - Clean up affix directive Move logic to macAffixController Fix some bus causing display issues (48b774e8)
  - Add macAffixDefaults (4f94a667)
  - Converted to Javascript (6b106c94)
- **macAutocomplete:** Embed template into directive js (29463577)
- **macKeydown:** Converted to Javascript (c7f7b509)
- **macMenu:** Converted to Javascript (91cf2c95)
- **macModal:**
  - Clean up mac-modal trigger (451c2a0a)
  - Convert macModal to JS - Move macModal defaults to constants - Clean up template, render and display modal logic - Add unit tests for modal service (673e1b86)
- **macPauseTyping:** Converted to Javascript (73ce8384)
- **macPlaceholder:** Converted to Javascript (4ee11131)
- **macScrollSpy:**
  - Clean up observe logic on anchor and target (873240c7)
  - Converted to Javascript Minor performance improvements (5bbbab09)
- **macSpinner:** Converted to Javascript (6dcfa1c0)
- **macTime:**
  - Embed template into directive js (621d371d)
  - Convert to Javascript Move time utility function to a separate service for better testing Add tests for time utility function (bd96c7d4)
- **macTooltip:** Convert to Javascript (95287ace)
- **macUtil:**
  - Cleaned up JS code (18298981)
  - Converted to Javascript Added `validateTime` function urlRegex, emailRegex and timeRegex are switched to local variables Updated macTime using `validateTime` (04c0ba3d)
- **macWindowResize:** Minor performance tweak and code cleanup Converted to Javascript and rewrote part of the directive (bba5ebc7)
- **main:** Converted to Javascript Removed ngAnimate dependencies for Mac Updated karma config (86933886)
- **pluralizeFilter:** Converted to Javascript (c3b5cf78)
- **timestampFilter:** Converted to Javascript Cleaned up time calculation (c6d9adf3)


# v0.6.1 (2015/2/6)
## Bug Fixes
- **macAutocomplete:** Fixed dropdown placement issues
Related to #11
  ([725995cb](https://github.com/angular-macgyver/MacGyver/commit/725995cb54a171d21b41c1190ce246e0a1b5f067))


# v0.6.0 (2014/12/4)
## Features
- Support AngularJS v1.3+

## Bug Fixes
- **macAutocomplete:** Fixed $animate API changes due to AngularJS v1.3
([d6c69cd7](https://github.com/angular-macgyver/MacGyver/commit/d6c69cd7dedbf0ef3d8620b4b0be29339c8a1a9e))
- **macModal:** Fixed not able to close with escape key
([373d6647](https://github.com/angular-macgyver/MacGyver/commit/373d6647c00e6c02eed374618cbc0b3d8594393b))

## Optimizations
- **Mac:** Initial 1.3 changes
([58207495](https://github.com/angular-macgyver/MacGyver/commit/582074950b5f034b3a8c4839534f5888f9c8821c))

## Breaking Changes
- **macModal:**  modalView provider has been removed and should be switched to use modalProvider instead  Related to #4
([c5fb9815](https://github.com/angular-macgyver/MacGyver/commit/c5fb98153e9f4f423019de545decb20f2cf1f274))
- **macPopover:**  popoverView provider has been removed and should be switched to use popoverProvider instead  Related to #4
([f38cb92f](https://github.com/angular-macgyver/MacGyver/commit/f38cb92f132ccc81d1ef6501e02421cb412e984e))


# v0.5.1 (2014/12/2)
## Bug Fixes
- **macTooltip:** Fixed appending multiple tooltips
Multiple tooltips get appended to document body when user mouse over the tooltip trigger multiple in a short period of time
([8070c262](https://github.com/angular-macgyver/MacGyver/commit/8070c2622de20b2f5497344791868dafa7af0ab9))


# v0.5.0 (2014/11/13)
## Bug Fixes
- **core:** Fixed val not getting initialized correctly
  ([c6eba169](https://github.com/angular-macgyver/MacGyver/commit/c6eba16908a9c73b36b19cf6b909f44af65f41e4))
- **macAutocomplete:** Fixed ng-class getting set to null string when no class is provided
  ([013111f9](https://github.com/angular-macgyver/MacGyver/commit/013111f905eca1f870f7a5c719be96727c33557d))
- **macPopover:** Fixed compile issue replacing original popover element with comments
  ([fc84089b](https://github.com/angular-macgyver/MacGyver/commit/fc84089bc2e5fbb2bdd9ecf4ac7391a0d96edcdc))

## Optimizations
- **Mac:** Removed jQuery dependencies
  ([174d60c1](https://github.com/angular-macgyver/MacGyver/commit/174d60c12326e9385062d656dde88704d346dd2b),
   [#7](https://github.com/angular-macgyver/MacGyver/issues/7))
- **MacGyver:** Converted directive templates to html
  ([ca7d32f8](https://github.com/angular-macgyver/MacGyver/commit/ca7d32f85a31b1956c7485255524b37c23f3b488))
- **macSpinner:** Updated to work without jQuery
  ([ed6292b3](https://github.com/angular-macgyver/MacGyver/commit/ed6292b31a67f0aae1c46af29c497b18437a364d))
- **macTagAutocomplete:** Removed ng-click on reduce digest cycle
  ([dc429cb6](https://github.com/angular-macgyver/MacGyver/commit/dc429cb6e3908f159e596a7dce670e1127e47c9f))

## Breaking Changes
- **macDatepicker:**  macDatepicker has been moved to a separate module. In order to continue to use macDatepicker, please visit https://github.com/angular-macgyver/macgyver-datepicker  
  ([d9438ec4](https://github.com/angular-macgyver/MacGyver/commit/d9438ec48f35a1b011e8f274673502e13fa68248),
   [#6](https://github.com/angular-macgyver/MacGyver/issues/6))


# v0.4.0 (2014/9/29)
## Breaking Changes
- **macTable:**  Table view has been removed from core MacGyver In order to continue using table view, please visit: https://github.com/angular-macgyver/macgyver-table
  ([0be6abfa](https://github.com/angular-macgyver/MacGyver/commit/0be6abfa8ee2bded6c2a1c40d187b18e17cca536))


# v0.3.10 (2014/9/25)
## Bug Fixes
- **macPopover:** Fixed popover not changing from below to above when overflow
  ([52306f5e](https://github.com/angular-macgyver/MacGyver/commit/52306f5e0550bb0ac6d04f4ef1489d65eea34785))


# v0.3.9 (2014/9/22)
## Bug Fixes
- **macTime:** Fixed not able to select hour and minute Revert "fix(macTime): Re-render time input view even when viewValue is the same"
This reverts commit 695078ea092083dd1f54a87d0ce3136c77a8942b.
  ([20165f2a](https://github.com/angular-macgyver/MacGyver/commit/20165f2a8e286cee66acba5aacc13a4cdfdc82c1))


# v0.3.8 (2014/9/22)
## Bug Fixes
- **macAutocomplete:** Fixed dropdown not hiding when no item is returned
  ([f5dec055](https://github.com/angular-macgyver/MacGyver/commit/f5dec055994236a472695197c7dc66e330af5a81),
   [#182](https://github.com/angular-macgyver/MacGyver/issues/182))


# v0.3.7 (2014/9/16)
## Bug Fixes
- **jqLite:** Fixed scrollTop setting X offset instead of Y offset
  ([a5e7389f](https://github.com/angular-macgyver/MacGyver/commit/a5e7389f77a9e96d13af58668ac1550b471ca22b))
- **macPopover:** Fixed popover positioning not checking scrollLeft
  ([d2572059](https://github.com/angular-macgyver/MacGyver/commit/d2572059b8e138d5165814529ea7aa087d9797b4))

## Features
- **jqLite:** Added scrollLeft to jqLite
  ([2f926f72](https://github.com/angular-macgyver/MacGyver/commit/2f926f7208f528af1459c6637411d9ae87499eaa))

## Breaking Changes
- **macPopover:**  Popover is now compiling with a new scope. In order to change anything on the original scope developer must pass data through an object.  
  ([940759b6](https://github.com/angular-macgyver/MacGyver/commit/940759b67d114c84ca4dbea5cb3629e4c5f986b7),
   [#181](https://github.com/angular-macgyver/MacGyver/issues/181))


# v0.3.6 (2014/9/6)
## Bug Fixes
- **macAutocomplete:** Fixed not able to select autocomplete from dropdown
  ([609d14f9](https://github.com/angular-macgyver/MacGyver/commit/609d14f983038173ef0b7ed1cb33cabf4a29c5c0))
- **macTime:**
  - Select meridian after updating view
  ([0a6527b4](https://github.com/angular-macgyver/MacGyver/commit/0a6527b40de4bec09475dc06ebacbf243b779b58))
  - Re-render time input view even when viewValue is the same
  ([695078ea](https://github.com/angular-macgyver/MacGyver/commit/695078ea092083dd1f54a87d0ce3136c77a8942b))


# v0.3.5 (2014/8/29)
## Bug Fixes
- **macPopover:** Updated popover to respond to hover events.
  ([295c3240](https://github.com/angular-macgyver/MacGyver/commit/295c3240ab36013afc2f9eb2da12de3f8df0bcae))


# v0.3.4 (2014/8/6)
## Bug Fixes
- **macPopover:** Fixed id not interpolating correctly
  ([3100f63d](https://github.com/angular-macgyver/MacGyver/commit/3100f63d01e63a2b41f4e233a36795274c9b3b29))


# v0.3.3 (2014/7/30)
## Bug Fixes
- **macPopover:** Fix popover not compiling low priority template
  ([706f1ab5](https://github.com/angular-macgyver/MacGyver/commit/706f1ab5bfc2f4a102ccb1b0aecbf0f755709633))


# v0.3.2 (2014/6/29)
## Bug Fixes
- **macAutocomplete:**
  - Fixed not querying data correctly
  ([aaf8f7c9](https://github.com/angular-macgyver/MacGyver/commit/aaf8f7c9fcadd6e06885853e4620f976475f3a89))
  - Fixed not able to select item using mouse
  ([f644f3f5](https://github.com/angular-macgyver/MacGyver/commit/f644f3f5c53ffecf70136ea713caf2cb912b3e09))
  - Fixed scope not destroyed correctly
  ([5ea9ab0c](https://github.com/angular-macgyver/MacGyver/commit/5ea9ab0cea6d1f96915b663fb1187b428fff6875))

## Optimizations
- **macAutocomplete:** Reduced parsing when update items
  ([29121368](https://github.com/angular-macgyver/MacGyver/commit/29121368f5d574bb859e2dacaf8a0af23b0e6f25))


# v0.3.1 (2014/6/27)
## Bug Fixes
- **macAutocomplete:** Fixed not able to select item when clicking on dropdown
  ([62e76648](https://github.com/angular-macgyver/MacGyver/commit/62e76648dc1c9598edef0d047f436f346e9e8876),
   [#174](https://github.com/angular-macgyver/MacGyver/issues/174))

## Optimizations
- **macAutocomplete:** Reduced memory usage and fixed scope not destroying correctly
  ([7666d00b](https://github.com/angular-macgyver/MacGyver/commit/7666d00bea250d24e365e91a9750129c2ed59c1d))


# v0.3.0 (2014/6/23)
###There are major changes with this update. Please read 'Breaking Changes' section before updating.
## Bug Fixes
- **macAffix:** Fixed affixing bottom not working properly
  ([e8683f55](https://github.com/angular-macgyver/MacGyver/commit/e8683f554bd7eab64478c144a0e3e54401246245))
- **macAutocomplete:**
  - Clear inline style on hide
  ([33297e20](https://github.com/angular-macgyver/MacGyver/commit/33297e207b149c6bf4d471d27de4d70d5e674ab7))
  - Fixed menu not positioned correctly Fixed offset getting calculated before animation completes
  ([9ffc2e72](https://github.com/angular-macgyver/MacGyver/commit/9ffc2e72affff72f3dd4f76b87990d58a70d1e05))
  - Added explicit return to prevent return DOM element
  ([b8cf7018](https://github.com/angular-macgyver/MacGyver/commit/b8cf70189653e85c2d9fb7928fcf3a2ea68c2a8c))
- **macDatepicker:** Remove date validation on empty string
  ([a4743b67](https://github.com/angular-macgyver/MacGyver/commit/a4743b67b70bbc42cb6e1bb0e1526b19e34ed1b6),
   [#173](https://github.com/angular-macgyver/MacGyver/issues/173))
- **macMenu:** Fixed menu using mac-mouseenter instead of ng-mouseenter
  ([2fbf4073](https://github.com/angular-macgyver/MacGyver/commit/2fbf4073ea0381cb92275f1e449c9bbd05e5c475))
- **macModal:** Added missing close-modal styles
  ([3560bb7e](https://github.com/angular-macgyver/MacGyver/commit/3560bb7ec3ff9a4174dc21d2ff720799aa055c0e))

## Optimizations
- **macAutocomplete:**
  - Improved mac-autocomplete positioning
  ([d07714f5](https://github.com/angular-macgyver/MacGyver/commit/d07714f5b71b0df62f9dbf549c326981f65e563d))
  - Removed unnecessary document binding
  ([d0d734bc](https://github.com/angular-macgyver/MacGyver/commit/d0d734bc8d60a0b06d85a73649752ddecdb4e6a1))

## Breaking Changes
- **events:**  mac-blur, mac-focus, mac-keydown, mac-keyup, mac-mouseenter and mac-mouseleave have been removed from MacGyver. Use the AngularJS equivalents.
  ([a46eed62](https://github.com/angular-macgyver/MacGyver/commit/a46eed624b6929024f833b7b1acf24ca0c8bafd3))
- **macDatepicker:**
  -  mac-datepicker input element is not in mac-date-time wrapper and is now top level. mac-datepicker-model has been removed in favor of ng-model. mac-datepicker-id has been removed and `id` attribute should be used instead.
  ([6bdc993c](https://github.com/angular-macgyver/MacGyver/commit/6bdc993c1c328425f7e0c3304eb225770f06d641))
  -  Icons for datepicker and time input are removed
  ([c1bb850c](https://github.com/angular-macgyver/MacGyver/commit/c1bb850ca200126fc546478bc5a6f40ef824c1a4))
  -  For user with custom styles, css classes for mac-datepicker and mac-time have been namespaced with `mac-`
  ([e99a5c15](https://github.com/angular-macgyver/MacGyver/commit/e99a5c15b09edb494c2de5a07e47d9e757b79259))
- **macModal:**  All modal class names are prefixed with `mac-`
  ([07948fec](https://github.com/angular-macgyver/MacGyver/commit/07948fec2f6b85eb24941b639c1158f698ab7abc))
- **macTagAutocomplete:**  For people using custom css for MacGyver, class names for mac-tag-autocomplete are now namespaced with `mac-`
  ([035084a3](https://github.com/angular-macgyver/MacGyver/commit/035084a33c36ab29a34732eda5c46dcffc1ef880))
- **macTime:**
  -  mac-time input element is not in a mac-date-time wrapper and is now top level. mac-time-model has been removed in favor of ng-model mac-time-placeholder has been removed mac-time isolated scope has been removed
  ([2d61c26d](https://github.com/angular-macgyver/MacGyver/commit/2d61c26d0d55aee71c3b68a942328c8f8732158e))
  -  Icons for datepicker and time input are removed
  ([c1bb850c](https://github.com/angular-macgyver/MacGyver/commit/c1bb850ca200126fc546478bc5a6f40ef824c1a4))
  -  For user with custom styles, css classes for mac-datepicker and mac-time have been namespaced with `mac-`
  ([e99a5c15](https://github.com/angular-macgyver/MacGyver/commit/e99a5c15b09edb494c2de5a07e47d9e757b79259))
- **macTooltip:**  `tooltip` class has been renamed to `mac-tooltip`
  ([d0e4c239](https://github.com/angular-macgyver/MacGyver/commit/d0e4c2392767692ceffd33b7714379def6ca094b))
- **macUpload:**  mac-upload has been moved to a separate module. Module can be found at https://github.com/angular-macgyver/angular-macgyver-upload
  ([a44db86b](https://github.com/angular-macgyver/MacGyver/commit/a44db86b923b3f6bd788590abecb0ebe6d8c352d))


# v0.2.9 (2014/4/6)
## Bug Fixes
- **macAutocomplete:** Item property on template now include full object
  ([6df95c71](https://github.com/angular-macgyver/MacGyver/commit/6df95c719aa003c09b30f72e142708b189627cde))
- **macMenu:** Fixed mac-menu not working with ng-class before
  ([1f9b2a02](https://github.com/angular-macgyver/MacGyver/commit/1f9b2a02dd39d3f9c111a35e503b2a56873a4b18))

## Features
- **macAutocomplete:** Added option to update mac-menu classes
  ([02bbdd25](https://github.com/angular-macgyver/MacGyver/commit/02bbdd25752b07ddbc9f7c0b7f3ba8897a355b92),
   [#166](https://github.com/angular-macgyver/MacGyver/issues/166))


# v0.2.8 (2014/3/31)
## Bug Fixes
- **macMenu:** Fixed how custom menu template getting transcluded
  ([385a4149](https://github.com/angular-macgyver/MacGyver/commit/385a41492bdd9d5f489a3cc75ee06b739ad45068))

## Features
- **macAutocomplete:** Allow custom html templating for dropdown
  ([190ad2b5](https://github.com/angular-macgyver/MacGyver/commit/190ad2b5add21f5414258732ee1c5eaf3a7ff41b))
- **macMenu:** Allow for custom html templating for each item
  ([bf1dcfe6](https://github.com/angular-macgyver/MacGyver/commit/bf1dcfe6e9e0873d7bb4a2ac0b2eb3bec88b1b28))
- **macTableSelectable:** Differentiate between click and text selection
  ([645443d4](https://github.com/angular-macgyver/MacGyver/commit/645443d4b442d1b4a64f3967ba28f43390ea4ba4))

## Optimizations
- **macAutocomplete:** Switched to createElement instead of jq/jqlite creating `mac-menu`
  ([c1ba7b09](https://github.com/angular-macgyver/MacGyver/commit/c1ba7b09d7926c19eed28ba4ed479683aa7b48d9))


# v0.2.7 (2014/3/26)
## Bug Fixes
- **macModal:** Fixed modal callbacks firing on page loads
  ([240a7afb](https://github.com/angular-macgyver/MacGyver/commit/240a7afbd5d1cc11a5d5c3d20da356a6dfd6f763),
   [#162](https://github.com/angular-macgyver/MacGyver/issues/162))


# v0.2.6 (2014/3/14)
## Bug Fixes
- **macModal:** Fixed not able to close modal when clicking on overlay
  ([f281a28e](https://github.com/angular-macgyver/MacGyver/commit/f281a28ed482133200dd58641689c1edca7af031))


# v0.2.5 (2014/3/12)
## Features
- **macModal:** Added option to disable positioning by modal service
  ([527d3aee](https://github.com/angular-macgyver/MacGyver/commit/527d3aee1e1ced8c13846bb0e9062ae2b212216c))


# v0.2.4 (2014/3/6)
## Bug Fixes
- **macTableSelectable:** Reset selection controls when window regains focus
  ([bc42a805](https://github.com/angular-macgyver/MacGyver/commit/bc42a805f4cdacd449cfa49f5a8682731de08689))
- **macTooltip:** Fixed multiple tooltips getting appended to body when triggering it multiple times in a short period of time
  ([a45c75b7](https://github.com/angular-macgyver/MacGyver/commit/a45c75b7203fd859aa0f0a4def6ca160fcd2a6d2),
   [#157](https://github.com/angular-macgyver/MacGyver/issues/157))


# v0.2.3 (2014/2/28)
## Bug Fixes
- **macPopover:**
  - Prevent scope from getting destroy when using parent scope
  ([c9334171](https://github.com/angular-macgyver/MacGyver/commit/c9334171cfe8ca2de4218dea8359810742b56b42))
  - Fixed mac-popover trigger not opening popover correctly
  ([b0de3a62](https://github.com/angular-macgyver/MacGyver/commit/b0de3a62a862ea04de023135d40c5acbd0f25c9f))

## Optimizations
- **macPopover:** Fixed how scope is created when compiling popover. Instead of cloning scope, popover will now use the scope passed in or create a new scope using rootScope.
  ([c5c5fb2a](https://github.com/angular-macgyver/MacGyver/commit/c5c5fb2a08da945552d719fd51b776de86b7d177))


# v0.2.2 (2014/2/28)
## Bug Fixes
- **macAutocomplete:** Don't allow ENTER in autocomplete to propagate up.
This was causing accidental form submissions.
  ([7c8f93ce](https://github.com/angular-macgyver/MacGyver/commit/7c8f93cea114d894bb737df03d1c1683fc8ef3e8))
- **macModal:** Fixed scope getting destroyed when closing modal
  ([29ac5216](https://github.com/angular-macgyver/MacGyver/commit/29ac52167962209263e010372308d043029886a8))
- **modal:** Fixed mac-modal directive not cleaning up when being removed from DOM
  ([f2b3efb9](https://github.com/angular-macgyver/MacGyver/commit/f2b3efb92337e6fd53ef3f08adbc8be1f7f399ef))

## Features
- **macModal:** Added callbacks for before and after showing modal and before and after hiding modal
  ([c133c3a6](https://github.com/angular-macgyver/MacGyver/commit/c133c3a64db76bfa32b72799d1786fa2c4d3253d),
   [#154](https://github.com/angular-macgyver/MacGyver/issues/154))

## Optimizations
- **macModal:**
  - Cleaned up how scope is included with mac-modal trigger and updated how scope is created on compile
  ([e7bf3439](https://github.com/angular-macgyver/MacGyver/commit/e7bf343960a65dba51f971186dfc5315e1f19233))
  - Add mac-modal-close to handle closing modal to remove a function used by  modal to close. Changed mac-modal directive to use the same parent scope.
  ([2992e359](https://github.com/angular-macgyver/MacGyver/commit/2992e3592d2bb8a887a1a5619c194b9bf627eb0e))

## Breaking Changes
- **build:**  Underscore.string is not compiled into MacGyver and in order for underscore.string filter to work, user must externally include that library
  ([df95c21b](https://github.com/angular-macgyver/MacGyver/commit/df95c21b80d3140765e16996274c325286ece144),
   [#156](https://github.com/angular-macgyver/MacGyver/issues/156))


# v0.2.1 (2014/1/27)
## Bug Fixes
- **macTagAutocomplete:** Fixed source not getting set properly compiling on top of another directive
  ([b7ac7af9](https://github.com/angular-macgyver/MacGyver/commit/b7ac7af95fb5f6d5a91e013cec2e3cabd92c1b08))

## Features
- **macAutocomplete:** Support attribute declaration style
  ([8cb89a21](https://github.com/angular-macgyver/MacGyver/commit/8cb89a211175de798fd33cb665ac15be30f36279))
- **macPopover:** Added mac-popover to MacGyver. Includes popover service to keep track of all registered and opened popover. Includes multiple popover directives for creating popover and popover trigger.
  ([66c715e6](https://github.com/angular-macgyver/MacGyver/commit/66c715e687d59b902cc95f8da9496cb8d30a741f))
- **macTable:** Storing parent scope on table object
  ([585243e7](https://github.com/angular-macgyver/MacGyver/commit/585243e7d2e676b9798ca7d9babe60609da9dcfc),
   [#145](https://github.com/angular-macgyver/MacGyver/issues/145))
- **macTagAutocomplete:** Source accepts multiple types including custom callback
  ([7f6d138d](https://github.com/angular-macgyver/MacGyver/commit/7f6d138dc67ad393ca1883a3d3b87ede59f58e8e))


# v0.2.0 (2014/1/8)
## Bug Fixes
- **bower.json:** Fixed bower versioning
  ([f2914bff](https://github.com/angular-macgyver/MacGyver/commit/f2914bff4ac458ddfdcf1569eec5317f8f7faac3))
- **jqLite:** Make sure jqLite is extended correctly
  ([10cec981](https://github.com/angular-macgyver/MacGyver/commit/10cec9818c984b2ea93082b71d8a2978982e2b20))
- **macModal:** Fixed mac-modal firing $digest cycle
  ([bfa9b376](https://github.com/angular-macgyver/MacGyver/commit/bfa9b3765e9438be87a3e2d78323c78ccc729585),
   [#138](https://github.com/angular-macgyver/MacGyver/issues/138))
- **macTagAutocomplete:**
  - Fixed placeholder not updating correctly without source
  ([c9611f08](https://github.com/angular-macgyver/MacGyver/commit/c9611f08bcb53ac3b34d7c85239aed3238a3fdb3))
  - Make sure only to watch selected and source when using source
  ([ce3d0237](https://github.com/angular-macgyver/MacGyver/commit/ce3d02377a13793552e6243804c96e2086221f74))
- **macUpload:** Fixed upload progress not updating and controller not getting set
  ([e8267f6e](https://github.com/angular-macgyver/MacGyver/commit/e8267f6e8a97d9f3b7235ac785d6c478d0dd6839))

## Features
- **core:** Add ngAnimate detection and add to Mac automatically
  ([be1ddb1c](https://github.com/angular-macgyver/MacGyver/commit/be1ddb1c6c31270935678d7c7f7391bb2e5d72b1))
- **macAutocomplete:** mac-autocomplete-source can now accept multiple types including custom callback
  ([a9aa4c50](https://github.com/angular-macgyver/MacGyver/commit/a9aa4c50fa56df7f050d005a1f637c323c023e84))
- **macModal:**
  - Use $animate to show and hide mac-modal
  ([6a7373d1](https://github.com/angular-macgyver/MacGyver/commit/6a7373d140678be9938a4ad6f4ee15f3337eb243))
  - Using $animate to handle DOM manipulation. Destroy scope or hide modal after hide animation complete. Completely isolate modal scope.
Related #124
  ([11d35aad](https://github.com/angular-macgyver/MacGyver/commit/11d35aad599bb05e7ac1e115077f0758d3e74231))
- **util:** Added trim to util library
  ([ed920966](https://github.com/angular-macgyver/MacGyver/commit/ed9209663b350879611043e6855c1d9d20935a2d))

## Optimizations
- **macAffix:** Switched to use $document and $window. Better top and bottom offset validation
  ([0393bbcb](https://github.com/angular-macgyver/MacGyver/commit/0393bbcbe8e7eb3ea7b2278032023e1d304e5fd3))
- **macAutocomplete:** Using $animate to create and remove menu. Better handle on click binding.
  ([1c421a17](https://github.com/angular-macgyver/MacGyver/commit/1c421a175fbc7c67283ad69760d7e64397ea4014))
- **macCspinner:** Use $timeout
  ([86818225](https://github.com/angular-macgyver/MacGyver/commit/86818225c984cb295f9d4bdaaca3a7a51d6738a3))
- **macMenu:** Cleaned up mac-menu dependencies
  ([af7332f5](https://github.com/angular-macgyver/MacGyver/commit/af7332f559b2c7ae5012948ded496efe6286bff0))
- **macModal:** Refactored modal directive and service. Converted modal directive to isolated scope but transcluded content is using parent scope instead. This prevent modal `close` function ending up in parent scope. Cleaned up modal stylus. Removed modal service from modal scope. Fixed modal test.
  ([658ea764](https://github.com/angular-macgyver/MacGyver/commit/658ea764f850c0ef621338cbb4fb06ea83baea6e))
- **macScrollSpy:** Clean up and make sure listeners are not binded multiple times
  ([2583617d](https://github.com/angular-macgyver/MacGyver/commit/2583617d9eda5142b1044afc4eb4d84bd4772a02))
- **macSpinner:**
  - Improve performance when compiling spinner
  ([a8c2b3ae](https://github.com/angular-macgyver/MacGyver/commit/a8c2b3aec19274e2519a2907e513898a833fbb6b))
  - Switched to use $animate
  ([70538b39](https://github.com/angular-macgyver/MacGyver/commit/70538b3997793bbeb2d0cb5188271020b406a449))
- **macTagAutocomplete:**
  - Switched to use ng-keydown and some code cleanup
  ([b1a97ad5](https://github.com/angular-macgyver/MacGyver/commit/b1a97ad5d53c05130498f50402537839890341d2))
  - Use watchCollection to update source correctly
  ([5a696ec7](https://github.com/angular-macgyver/MacGyver/commit/5a696ec7cf545a225bc93355b9ae1ab4e00ab667))
- **macTime:** Switched to use AngularJS events
  ([b86c7186](https://github.com/angular-macgyver/MacGyver/commit/b86c7186c6cf14bcba74e57f3933541af4cd6a15))
- **macUpload:** Optimized getting and setting previews. Switched to use $document. Make sure drag and drop timeout getting cancel correctly
  ([2132afa3](https://github.com/angular-macgyver/MacGyver/commit/2132afa37bd2a4c666a572e3510e233470e3eaee))

## Breaking Changes
- **macAutocomplete:**  Changed autocomplete event from resetAutocomplete to reset-mac-autocomplete  Related to #124
  ([e4f2021e](https://github.com/angular-macgyver/MacGyver/commit/e4f2021e12224e75693d9d230001f5d363c290fd))
- **macModal:**  mac-modal-content is completely removed and should switch to use mac-modal-data instead
  ([0f604bd1](https://github.com/angular-macgyver/MacGyver/commit/0f604bd180901ad6ce16c5e2d138ab77c0f41950))
- **macTagInput:**  Mac-tag-input is removed from MacGyver as it has been a proxy to mac-tag-autocomplete. When switching to mac-tag-autocomplete, DOM attributes should also be updated. - Use mac-tag-autocomplete-source for mac-tag-input-tags - Use mac-tag-autocomplete-selected for mac-tag-input-selected - Use mac-tag-autocomplete-placeholder for mac-tag-input-placeholder - Use mac-tag-autocomplete-value for mac-tag-input-value - Use mac-tag-autocomplete-label for mac-tag-input-label
  ([3b74cd82](https://github.com/angular-macgyver/MacGyver/commit/3b74cd82b3c247a886b4f10fb6bd42f5f96527fb))


# v0.1.25 (2013/11/12)
## Bug Fixes
- **macDatepicker:** Fixed changing datepicker text input does not update model
  ([5d3fc664](https://github.com/angular-macgyver/MacGyver/commit/5d3fc6640ed218dc2072f1503d2a50e098dbeca4),
   [#136](https://github.com/angular-macgyver/MacGyver/issues/136))
- **macTime:** Refactor time picker interactions to fix model watch conflicts between programatically setting the model vs a user typing in a invalid time (e.g. 11:8) no longer freezes the input. Added extra directive to control validation similar to angularjs inputDirective pattern. Fixed tests to follow new validation convention.
  ([c3ae8f52](https://github.com/angular-macgyver/MacGyver/commit/c3ae8f52347658d74a7ddceda780ac3cc67075d0),
   [#137](https://github.com/angular-macgyver/MacGyver/issues/137))

## Features
- **macDatepicker:** Added validation to mac-datepicker model
  ([7322c4b0](https://github.com/angular-macgyver/MacGyver/commit/7322c4b025b9bcb100020327a2b7d697ee77c1da))
- **util:** Make email regex part of util api
  ([0627e318](https://github.com/angular-macgyver/MacGyver/commit/0627e318066290bbdd3464f0165ba7b5227ca102))


# v0.1.24 (2013/11/6)
## Bug Fixes
- **macTagAutocomplete:** Remove left padding in tag list
  ([389f337f](https://github.com/angular-macgyver/MacGyver/commit/389f337ff50f756fb587bd7f07a03fcea8232429))
- **macTime:** Replaced the comparison of {} since you cannot compare objects to {}.
  ([30b68d1b](https://github.com/angular-macgyver/MacGyver/commit/30b68d1b300219d59accc1f448768ef250106404))

## Features
- **macTime:** Converted date to use current instead of unix. Removed notion of end selection because it broke highlighting when you selected more than one section (hour, minute, or marker). Denested some control blocks for readability/dry-ness. Added new lines for readability. Added "A" and "P" events to modify meridian values.
  ([715bbe20](https://github.com/angular-macgyver/MacGyver/commit/715bbe20bd41ea521611777ddf37e8fba810bfc3),
   [#135](https://github.com/angular-macgyver/MacGyver/issues/135))


# v0.1.23 (2013/11/4)
## Bug Fixes
- **util:** Updated the url regex to be more verbose—more inline with rfc3986. Modified the protocol attribute to return only the protocol.
Close #134
  ([5d573011](https://github.com/angular-macgyver/MacGyver/commit/5d5730114625b0482dd1c9dd156472ff80b9327b))


# v0.1.22 (2013/10/30)
## Bug Fixes
- **macAutocomplete:** Changed menu to min width to prevent content getting cut off
  ([d80c4153](https://github.com/angular-macgyver/MacGyver/commit/d80c4153fc5e92260b87bc948d68daeb3e1b0f25),
   [#131](https://github.com/angular-macgyver/MacGyver/issues/131))
- **macScrollSpy:** Scroll spy doesn't flicker when scrolling to last element.
  ([39ed95db](https://github.com/angular-macgyver/MacGyver/commit/39ed95db6e31b91147207253a0422d4c8a61f5f6),
   [#132](https://github.com/angular-macgyver/MacGyver/issues/132))


# v0.1.21 (2013/10/24)
## Bug Fixes
- **macMenu:** Removed left padding on menu item
  ([dd2c2495](https://github.com/angular-macgyver/MacGyver/commit/dd2c249545e467b053a13a0414716a3a7282894e))
- **macScrollSpy:** Fixed not selecting last anchor when scroll to the bottom
  ([cf104358](https://github.com/angular-macgyver/MacGyver/commit/cf104358ad4d5c25b36dcd43d261f4d787763368))
- **macTagAutocomplete:**
  - Placeholder shows when no items are selected and can now accomedate for longer placeholder
  ([671bd823](https://github.com/angular-macgyver/MacGyver/commit/671bd82398dcf46f2ebe802ac0eb9b7d53bd9ea8),
   [#110](https://github.com/angular-macgyver/MacGyver/issues/110))
  - Fixed clicking on tag autocomplete focus on input
  ([ce73e365](https://github.com/angular-macgyver/MacGyver/commit/ce73e365d459c3e79101aafd41cfb30aed474ceb))
  - Removed digest cycle on reset event
  ([d5a53aa6](https://github.com/angular-macgyver/MacGyver/commit/d5a53aa6e947be694666ec8707b0bc02fcc2b1a4))


# v0.1.20 (2013/10/21)
## Bug Fixes
- **macScrollSpyAnchor:** Fixed interpolated id not working properly
  ([28f0996f](https://github.com/angular-macgyver/MacGyver/commit/28f0996fb54d1e383a7f4b439eb7d2dea51c69ec))
- **macTime:** Removed unnecessary digest cycle on blur
  ([b3faef64](https://github.com/angular-macgyver/MacGyver/commit/b3faef64fb32cd1b936c68ecd42f377ad11a4b8d))


# v0.1.19 (2013/10/16)
## Optimizations
- **macAutocomplete:**
    - Updated autocomplete to not append menu initially.
    - Menu is appended to body when needed.
    - Menu will not show up when there is no input or after selecting and item.
    - Menu will be removed when scope is destroyed.
  ([b93d17b1](https://github.com/angular-macgyver/MacGyver/commit/b93d17b1393ec935027e5a948956b5f073d73ce2))


# v0.1.18 (2013/10/9)
## Bug Fixes
- **macModal:** Fixed showing modal the first time might invoke a digest cycle
  ([bc532a6b](https://github.com/angular-macgyver/MacGyver/commit/bc532a6b3f738f9c5732781d10c9677160a5cf72))
- **macTagAutocomplete:** Fixed autocomplete menu not updating when source gets updated
  ([a26353c5](https://github.com/angular-macgyver/MacGyver/commit/a26353c58a13b0a91e730df0588a145321179bc5))


# 0.1.17 (2013/10/8)
## Features
- **macAffix:** Adding mac-affix
  ([c7aaca80](https://github.com/angular-macgyver/MacGyver/commit/c7aaca800e018cf5dd5034118f5c6dbd153027d7))

## Optimizations
- **macFocusOnEvent:** Prevent digest cycle from invoking on focus
  ([d019f761](https://github.com/angular-macgyver/MacGyver/commit/d019f7616085f2851d77778d2039f075651ebc3b))
- **macModal:** Allow modal to compile with modal trigger scope
  ([17108162](https://github.com/angular-macgyver/MacGyver/commit/171081622b560c298de1a25192189885ad06b1c5))
- **macTooltip:** Clear and not show tooltip with empty string. Make sure events propagate up the bubble
  ([2ab95b26](https://github.com/angular-macgyver/MacGyver/commit/2ab95b26fd10f533772e431c899a11587cf5621c))

## Breaking Changes
- **macModal:**  mac-modal-content is deprecated. Use mac-modal-data instead.
  ([b29cbd68](https://github.com/angular-macgyver/MacGyver/commit/b29cbd687c4c885cbf932b96d268fcc0c4064ee0))


# v0.1.16 (2013/9/25)
## Bug Fixes
- **macKeydown:** Fixed mac-keydown events not firing at all
  ([693d263e](https://github.com/angular-macgyver/MacGyver/commit/693d263e72b9ea234ece0174d8daa3ca2effced8))

## Optimizations
- **macCspinner:** Handle timeout better. Switched from setInterval to setTimeout to have better control. Added support for ngShow and ngHide to reduce CPU load.
  ([6f088da9](https://github.com/angular-macgyver/MacGyver/commit/6f088da97e6c43d95a849ae75e7568544390702e))


# v0.1.15 (2013/9/24)
## Bug Fixes
- **macTagAutocomplete:** Fixed tags getting pushed even when mac-tag-autocomplete-on-enter is returning false
  ([3cef3e74](https://github.com/angular-macgyver/MacGyver/commit/3cef3e74e0a20c1904da82344a9371d06720615a))

## Features
- **cspinner:** Canvas spinner
  ([33d22fd1](https://github.com/angular-macgyver/MacGyver/commit/33d22fd150ac2da52b6cc23ed8bfb494a9fc0a4b))
- **util:** Added pyth, degrees, radian and hex2rgb
  ([a3bea8be](https://github.com/angular-macgyver/MacGyver/commit/a3bea8beec73875f6134f1dce6a80f0dfed46f7d))

## Optimizations
- **macSpinner:** Updated to make sure size is rendered correctly. Reduced spinner css size and calculate width and height with js.
  ([61c9549b](https://github.com/angular-macgyver/MacGyver/commit/61c9549b8b94885f5e3deeb63f0d5256d9559ac0))


# v0.1.14 (2013/9/18)
## Bug Fixes
- **changelog:** Fixed referencing invalid object
  ([9dc09676](https://github.com/angular-macgyver/MacGyver/commit/9dc09676c3ab2b02e0b4e6eaab596759cd596e9d))
- **macDatepicker:** Fixed cannot reset macDatepicker with null
  ([9d0ab82b](https://github.com/angular-macgyver/MacGyver/commit/9d0ab82b0b72b2c9c60996d9b9c5dd59c8677f29),
   [#119](https://github.com/angular-macgyver/MacGyver/issues/119))
- **macMenu:** Fixed menu index bi-directional binding not working properly
  ([db719b0c](https://github.com/angular-macgyver/MacGyver/commit/db719b0cd128fcb42873296257e08958a05a1df6))
- **macTime:** Fixed not able to reset time with empty string
  ([4420a547](https://github.com/angular-macgyver/MacGyver/commit/4420a5478eb6474490ae9b00e603a360cf75732f),
   [#119](https://github.com/angular-macgyver/MacGyver/issues/119))

## Optimizations
- **util:** Added default values to pluralize, toCamelCase and toSnakeCase
  ([166bf16c](https://github.com/angular-macgyver/MacGyver/commit/166bf16cf7104ceea64e5f260fe658f920a4f452))

## Breaking Changes
- **util:**  util.isArray has been removed as it is the same as angular.isArray. User should switch to angular.isArray instead
  ([4f797650](https://github.com/angular-macgyver/MacGyver/commit/4f7976505d5d547b59786e4538c50b7ccb76c672))


# v0.1.13 (2013/9/15)
## Bug Fixes
- **Grunt:** Fixed configuration errors with css watch task
  ([9c405f84](https://github.com/angular-macgyver/MacGyver/commit/9c405f844a9b0884c1e3cfb6b7e69d17f9ac02e8))
- **macDatepicker:** Fixed datepicker possibly watching undefined variables
  ([e6227b73](https://github.com/angular-macgyver/MacGyver/commit/e6227b73fc8995a8a2e30d240ddaf75d74c874e7))
- **macTooltip:**
  - Fixed removing tooltip invokes $digest cycle
  ([035d677c](https://github.com/angular-macgyver/MacGyver/commit/035d677ca571f8a2b8d7fd0619e4ba540ea71757),
   [#118](https://github.com/angular-macgyver/MacGyver/issues/118))
  - Fixed tooltip possibly watching an undefined variable
  ([bc236b27](https://github.com/angular-macgyver/MacGyver/commit/bc236b27718a803d42864a626ed7febbe726e630))

## Features
- **jqLite:** Extended jqLite with new functions. Includes height(), width(), outerHeight(), outerWidth(), offset() and scrollTop()
  ([704bc317](https://github.com/angular-macgyver/MacGyver/commit/704bc31730aa0e35706704ca8dc6757f57b8bb96))
- **listFilter:** Added list filter
  ([de7e2209](https://github.com/angular-macgyver/MacGyver/commit/de7e22097065da2f5472eee72306d24b4e78deb4))

## Optimizations
- **Grunt:** Moved custom tasks to misc folder Switch to use grunt underscore and grunt.file Removed wrench dependency
  ([6d901f0e](https://github.com/angular-macgyver/MacGyver/commit/6d901f0e2d2da46200e145e3a1dbc7ef4f48f919))
- **autocomplete:** Removed unnecessary watch
  ([5ae2c1a7](https://github.com/angular-macgyver/MacGyver/commit/5ae2c1a7ccea81dcf5278cc89622377948e30bbe))
- **directives:** Updated directives to work with jqLite. Make sure all core directives run properly with AngularJS jqLite
  ([3794efb6](https://github.com/angular-macgyver/MacGyver/commit/3794efb64134db9495a591fe5f4d6165a0cffd70))
- **events:** Switched to use `bind` for event binding. On and off aren't introduced in 1.0.x jqLite. This update will make sure MacGyver works with AngularJS jqLite
  ([d11bb52e](https://github.com/angular-macgyver/MacGyver/commit/d11bb52e6c880e59b871cab716d34cb8e57a2525))
- **macAutocomplete:** Removed jQuery dependency and make sure it works with jqLite
  ([92b76df8](https://github.com/angular-macgyver/MacGyver/commit/92b76df8ed2d5403190fa240c2bb0dfa5bb1d1fe))
- **macDatepicker:**
  - Removed jQuery dependency
  ([7571bdce](https://github.com/angular-macgyver/MacGyver/commit/7571bdce95014349eccbc3bfd78b6cdac17b1e87))
  - Removed calling digest cycle when setting datepicker date
  ([87ba396e](https://github.com/angular-macgyver/MacGyver/commit/87ba396e0fe5fd97005032cba6a55c8ec89f64e1))
- **macModal:**
  - Updated mac-modal service to work with jqLite
  ([e3dc31d7](https://github.com/angular-macgyver/MacGyver/commit/e3dc31d703cb08786d3c8cf4c65d562780153204))
  - Removed calling digest cycle when changing 'visible' class
  ([6569accd](https://github.com/angular-macgyver/MacGyver/commit/6569accd486c8562dda208af2982d39191e5377f))
- **macTagAutocomplete:** Cleaned up tag autocomplete Switched from jQuery to angular.element Refactored how events are bind to autocomplete text field Fixed event not clearing autocomplete text
  ([b88edf25](https://github.com/angular-macgyver/MacGyver/commit/b88edf25c5d6f5adbc6770a4f3a8148b88a3a64e))
- **macTime:** Removed calling digest cycle when highlighting text
  ([7e731035](https://github.com/angular-macgyver/MacGyver/commit/7e731035786915f9290fb733d3c6d208c493823d))
- **macUpload:**
  - Updated directive to be more Angular
  ([fd9a927e](https://github.com/angular-macgyver/MacGyver/commit/fd9a927ee403f4c75810f420a3897472201f9804))
  - Removed calling digest cycle when changing class on dropzone
  ([5290aff5](https://github.com/angular-macgyver/MacGyver/commit/5290aff5285d9395cc3a56ab2c8f6d31ebf8f6b0))
- **package.json:** Removed wrench and underscore dependencies
  ([0096f558](https://github.com/angular-macgyver/MacGyver/commit/0096f558847c4b52335ca9c5add340998845c696))
- **server:** Switched from express to connect
  ([b2179a8c](https://github.com/angular-macgyver/MacGyver/commit/b2179a8c38677dbefbcb8c35f4dd20fdc18ca788))
