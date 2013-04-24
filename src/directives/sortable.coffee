angular.module("Mac").directive "macReorderable", [ ->
  (scope, element, attrs) ->
    selector        = attrs.macReorderable
    # TODO: do a check here
    callback = scope.$eval attrs.macReorderableCallback
    element.sortable
      items:     selector
      cursor:    "move"
      opacity:   0.8
      tolerance: "pointer"
      update:    (event, ui) ->
        matched = element.find selector
        callback matched, element, event, ui, scope
]
