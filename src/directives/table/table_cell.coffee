###
@chalk overview
@name Cell Template
@description
Directive for assigning cell templates to table columns

@dependencies
macTable, macTableSection, macTableRow

@param {String}     mac-cell-template     Space-delimited column names specifying when to show this template
###

angular.module("Mac").directive "macCellTemplate", [ ->
  transclude: "element"
  priority:   1000
  require:    ["^macTable", "^macTableSection", "^macTableRow"]

  compile: (element, attr, linker) ->
    ($scope, $element, $attr, controllers) ->
      templateNames =
        if $attr.macCellTemplate then $attr.macCellTemplate.split " " else ["?"]
      for templateName in templateNames
        controllers[1].cellTemplates[templateName] = [$element, linker, $attr]
]
