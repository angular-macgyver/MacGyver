angular.module("Mac").directive "macReorderable", [ ->
  (scope, element, attrs) ->
    selector = attrs.macReorderable
    element.sortable
      items:     selector
      cursor:    "move"
      opacity:   0.8
      tolerance: "pointer"
      update:    (event, ui) ->
        matched = element.find selector; console.log selector
        console.log "REORDERABLE MATCHED", matched
        scope.$emit "mac-element-#{scope.$id}-changed", "reordered", element, matched, event, ui,
        scope.$emit "mac-element-#{scope.$parent.$id}-changed", "reordered", element, matched, event, ui,
]
