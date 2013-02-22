## Disabled until refactored
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
## - mac-editable-on-hidden  Callback on hidden
## - mac-editable-on-init    Callback on init
## - mac-editable-on-save    Callback on save
## - mac-editable-on-shown   Callback on shown
## - mac-editable-success    Callback on ajax succes
## - mac-editable-validate   Input validation
## - mac-editable-model      Angular model to store to
## - mac-editable-display    Display text
## - mac-editable-source     Used by select type on filling all the options
##
###
angular.module("Mac").directive "macEditable", [
  "$rootScope"
  "util"
  ($rootScope, util) ->
    restrict: "A"
    scope:    {
      onHidden: "&macEditableOnHidden"
      onInit:   "&macEditableOnInit"
      onSave:   "&macEditableOnSave"
      onShown:  "&macEditableOnShown"
      success:  "&macEditableSuccess"
      validate: "&macEditableValidate"
      model:    "=macEditableModel"
      display:  "=macEditableDisplay"
      source:   "=macEditableSource"
    }
    link:     ($scope, element, attrs) ->
      # default values and whitelisting
      defaults =
        anim:         "fast"
        autotext:     "auto"
        container:    "body"
        disabled:     "false"
        emptyclass:   "editable-empty"
        emptytext:    "Empty"
        mode:         "popup"
        name:         null
        onblur:       "cancel"
        params:       null
        placement:    "top"
        saveonchange: false
        selector:     null
        send:         "never"
        showbuttons:  true
        toggle:       "click"
        type:         "text"
        unsavedclass: "editable-unsaved"
        url:          null
        title:        ""

      componentsDefaults =
        text:
          tpl:         "<input type='text'>"
          placeholder: null
          clear:       true
          inputclass:  "input-medium"

        textarea:
          tp:          "<textarea></textarea>"
          inputclass:  "input-large"
          placeholder: null
          rows:        7

        select:
          tpl:         "<select></select>"
          prepend:     false
          sourceError: "Error when loading list"
          sourceCache: true
          inputclass:  "input-medium"

      attrs.macEditableType = attrs.macEditableType or "text"

      extraDefaults = switch attrs.macEditableType
                        when "textarea", "select"
                          componentsDefaults[attrs.macEditableType]
                        else
                          componentsDefaults["text"]
      angular.extend defaults, extraDefaults

      opts          = util.extendAttributes "macEditable", defaults, attrs
      opts.validate = (value) ->
        if attrs.macEditableValidate?
          $scope.validate {value}
      opts.success = (response, newValue) ->
        if attrs.macEditableSuccess?
          $scope.success {response, newValue}

      if attrs.macEditableType is "select"
        opts.source = -> $scope.source

      $scope.$watch "display", (value) ->
        element.text value or $scope.model

      $scope.initialize = ->
        opts.value   = $scope.model
        opts.display = false

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

      $scope.initialize()
]
###
