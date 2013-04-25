angular.module("Mac").directive "macTable", [ "Table", (Table) ->
  # templateUrl: "template/table_view.html"
  require: "macTable"
  scope:
    models:  " = models"
    columns: " = columns"
    header: "  = header"
  controller: ->
    return
  link: (scope, element, attrs, ctrl) ->
    scope.$watch "columns", (value) ->
      ctrl.table = scope.table = new Table scope.columns
    , true

    scope.$watch "models", (value) ->
      scope.table.load "body", scope.models
      if not scope.table.sections.header?
        blankRow = scope.table.blankRow()
        scope.table.load "header", [blankRow]
    , true

    scope.$watch "header", (value) ->
      return unless value
      scope.table.load "header", [scope.header]
    , true
]
