##
## @name
## x-editable
##
## @description
## Make editable compatible with angular
##
## @dependencies
## - jQuery UI
## - X-editable
##
## @doc
## http://vitalets.github.com/x-editable/docs.html#editable
##
## @attributes
## - mac-editable-anim
## - mac-editable-autotext

angular.module("Mac").directive "macEditable", [
  "$rootScope"
  "util"
  ($rootScope, util) ->
    restrict: "A"
    scope:    {
      onHidden:    "&macEditableOnHidden"
      onInit:      "&macEditableOnInit"
      onSave:      "&macEditableOnSave"
      onShown:     "&macEditableOnShown"
      success:     "&macEditableSuccess"
      validate:    "&macEditableValidate"
      model:       "=macEditableModel"
      displayText: "=macEditableDisplayText"
    }
    link: ($scope, element, attrs) ->
      defaults =
        anim:         "fast"
        autotext:     "auto"
        disabled:     "false"
        display:      false
        emptyclass:   "editable-empty"
        emptytext:    "Empty"
        mode:         "popup"
        name:         null
        onblur:       "cancel"
        params:       null
        placement:    "top"
        placeholder:  ""
        saveonchange: false
        selector:     null
        send:         "never"
        showbuttons:  true
        toggle:       "click"
        type:         "text"
        unsavedclass: "editable-unsaved"
        url:          null
        title:        ""

      opts          = util.extendAttributes "macEditable", defaults, attrs
      opts.validate = (value) ->
        if attrs.macEditableValidate?
          $scope.validate {value}
      opts.success = (response, newValue) ->
        if attrs.macEditableSuccess?
          $scope.success {response, newValue}

      ###
      opts.display = (value, sourceData, response) ->
        console.log value, sourceData, response
      ###

      $scope.$watch "model", (value) ->
        if value?
          setTimeout (->
            element.editable "destroy"
            $scope.initialize()
          ), 0

      $scope.initialize = ->
        opts.value = $scope.model
        console.log opts

        element.editable(opts)
        .on "hidden", (event, reason) ->
          if attrs.macEditableOnHidden?
            $scope.onHidden {event, reason}
        .on "init", (event, editable) ->
          if attrs.macEditableOnInit?
            $scope.onInit {event, editable}
        .on "save", (event, params) ->
          if attrs.macEditableOnSave?
            params = $scope.onSave {event, params}

          if params?.newValue?
            $scope.$apply -> $scope.model = params.newValue

        .on "shown", (event) ->
          if attrs.macEditableOnShown?
            $scope.onShown {event}
]
