angular.module("Mac").directive "macRowsDERPDERPDERP", [ "$compile", ($compile) ->
  require:    ["^macTable", "macRows"]
  priority:   500
  #terminal: true
  controller: ($scope, $compile, $attrs, $element) ->
    this.templates = {}
    # We can't recompile with
    this.unsafeDirectives = [
      "mac-rows"
      "mac-cell-template"
      "mac-cell-template-default"
    ]

    this.prepClone = (clone, $element) ->
      # Copy all controllers to the new element
      for name, ctrl of $element.data()
        clone.data name, ctrl

      # Remove directives we cannot safely re-compile with
      for attributeName in this.unsafeDirectives
        clone[0].removeAttribute attributeName

    this.drawRows = (rows, transcludeFn) ->
      #$element.

      for row in rows
        nScope     = $scope.$new()
        nScope.row = row
        $compile($element.contents()) nScope, (clone) ->
          console.log "clone", clone
          $element.parent.append clone
        return
        transcludeFn nScope, (clone) =>
          # this.prepClone clone, $element
          #console.log "content", clone.contents()
          $compile(clone.contents()) nScope, (clone) ->
            console.log "clone", clone[0].attributes
          # console.log this.tableCtrl.$element
          this.tableCtrl.$element.append clone
          #this.drawCells(clone, row.cells)

    this.drawCells = ($element, cells) ->
      return unless cells
      # We're gonna redraw all the cells, so first remove them..
      $element.children().remove()
      # Loop over our cells
      for cell in cells
        # FIX: This check for whether we have a default is pretty ugly...
        columnName = cell.colName
        if not this.templates[columnName]? and this.templates["?"]?
          columnName = "?"
        else if not this.templates[columnName]?
          continue

        [transcludeFn, cScope] = this.templates[columnName]
        nScope                 = $scope.$new()
        nScope.cell            = cell
        transcludeFn nScope, (clone) =>

          #this.prepClone clone, $element
          #this.addDefaultAttributes clone

          # Recompile with our new attribute and other safely removed
          $compile(clone.contents())(nScope)
          console.log this.templates

          # Append it to the parent element
          # console.log "element", $element
          $element.append clone

    this.addDefaultAttributes = (clone) ->
      # Add a default `width` if macColumns
      # directive exists on this directive
      if not clone.attr("mac-column-width") and $attrs.macColumns?
        clone.attr "mac-column-width", "{{100/cell.row.cells.length}}"

      # Bind a width attribute to these automatically
      clone.attr "width", "{{cell.width}}%"

      # Do we want these to be resizable?
      if $attrs.macCellsResizable?
        clone.attr "mac-resizable", true

    return

  # template: "<div ng-repeat='row in table.sections.body.rows' ng-transclude></div>"
  compile: (element, attrs, transclude) ->
    console.log "FIRED"

    sectionName = attrs.macRows
    #element.attr("ng-repeat", "row in table.sections.#{sectionName}.rows")
    $parent = element.parent()
    $contents = element.contents()
    #element.remove()
    #element.removeAttr("mac-rows")
    #element.attr("ng-repeat", "row in table.sections.#{sectionName}.rows")
    #parent = element.parent
    #element.remove()
    $tr = angular.element("<tr ng-repeat='row in table.sections.#{sectionName}.rows'></tr>")

    compiledContents = null

    ($scope, $element, $attrs, controllers) ->
      $element.remove()
      #console.log $element.data()
      $tr.data("$macRowsController", controllers[1])
      #console.log $tr
      #console.log $tr.data()
      compiledContents = $compile($tr) unless compiledContents
      $clone = compiledContents $scope, (clone) ->
        #clone.append($contents)
        #clone.append("Hello!")
        #console.log clone, $contents
        clone

      $parent.append $clone
      setTimeout ->
        console.log $parent.children()
        console.log $parent.children().append($contents)
        #$clone.append("Hello!")
        #console.log $clone
      , 0

]
