module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!DOCTYPE html><html><head><meta charset="utf-8"><title>MacGyver Example</title><link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.2.2/css/bootstrap-combined.min.css" rel="stylesheet"><link href="css/vendor.css" rel="stylesheet"><link href="css/app.css" rel="stylesheet"><style type="text/css">body {padding: 40px 0px 100px 0px;}\nsection {padding-top: 30px;}\n.mac-table .btn {line-height: 11px; float: right;}\n.docs-example {min-height: 25px;}</style></head><body ng-app="Mac"><div class="container"><div class="row"><div id="nav" class="span2"><ul class="nav nav-tabs nav-stacked"><li><a href="#table-view">Table View</a></li><li><a href="#">Tag Input</a></li><li><a href="#spinner">Spinner</a></li></ul></div><div id="example" ng-controller="ExampleController" class="span10"><section><div class="page-header"><h1>Buttons!</h1></div><h2>Example</h2><div class="docs-example"><div mac-click="what()" class="btn">Button</div></div></section><section><div class="page-header"><h1>Autocomplete</h1></div><h2>Example</h2><div class="docs-example"><mac-autocomplete mac-autocomplete-url="autocompleteUrl" mac-autocomplete-query="q" mac-autocomplete-on-success="onSuccess(data)" mac-autocomplete-placeholder="\'Autocomplete\'"></mac-autocomplete></div></section><section><div class="page-header"><h1>Tag Autocomplete</h1></div><h2>Example</h2><div class="docs-example"><mac-tag-autocomplete mac-tag-autocomplete-url="autocompleteUrl" mac-tag-autocomplete-query="q" mac-tag-autocomplete-selected="tagAutocompleteSelected" mac-tag-autocomplete-value="id" mac-tag-autocomplete-label="name" mac-tag-autocomplete-placeholder="tagAutocompletePlaceholder"></mac-tag-autocomplete></div><h2>Example with autocomplete disabled</h2><div class="docs-example"><mac-tag-autocomplete mac-tag-autocomplete-url="autocompleteUrl" mac-tag-autocomplete-query="q" mac-tag-autocomplete-selected="tagAutocompleteDisabledSelected" mac-tag-autocomplete-placeholder="tagAutocompletePlaceholder" mac-tag-autocomplete-value="key" mac-tag-autocomplete-label="key" mac-tag-autocomplete-disabled="true" mac-tag-autocomplete-on-enter="tagAutocompleteOnSelected(item)"></mac-tag-autocomplete></div></section><section><div class="page-header"><h1>Datepicker</h1></div><h2>Example</h2><div class="docs-example"><mac-datepicker mac-datepicker-id="input-start-date" mac-datepicker-model="startDate"></mac-datepicker></div></section><section><div class="page-header"><h1>Time input</h1></div><h2>Example</h2><div class="docs-example"><mac-time mac-time-id="input-start-time" mac-time-model="startTime"></mac-time></div></section><section><div class="page-header"><h1>Table view</h1></div><h2>Example</h2><div class="docs-example"><div mac-table mac-table-has-footer="true" mac-table-data="data" mac-table-width="750" mac-table-header-height="30" mac-table-columns="columnOrder" mac-table-sortable="true" mac-table-resizable="false" mac-table-lock-first-column="true" mac-table-calculate-total-locally="true" mac-table-fluid-width="true" ng-cloak class="table-view-wrapper"><div class="table-header-template"><div column="Name" class="cell">Name<a mac-parent-click="createRow($event)" class="btn">Create Row</a></div><div column="anotherName" sort-by="a" class="cell">Second Column</div></div><div class="table-body-template"><div class="mac-table-row {{\'what\'}}"><div column="Name" style="width: 200px" class="cell"><a mac-click="loadMoreRows()">{{row.name}}</a></div><div column="anotherName" class="cell">{{row.a | number: 0}}</div><div column="d" class="cell">{{row.d | number: 4}}</div><div column="c" class="cell">{{row.c | number: 4}}</div><div column="b" class="cell">{{row.b | currency}}</div><div column="Abc" class="cell">{{row.attributes.abc | number:4}}</div><div column="Created" class="cell">{{row.created | date: \'mediumDate\'}}</div></div></div><div class="table-footer-template"><a mac-parent-click="loadMoreRows()" class="btn">Load 20 More Rows</a></div><div class="table-total-footer-template"><div column="Name" class="cell">{{ "Row" | pluralize: data.length}}</div><div column="b" class="cell">{{ total.b | currency}}</div></div></div></div></section><section><div class="page-header"><h1>Tag Input</h1></div><h2>Example</h2><div class="docs-example"><mac-tag-input mac-tag-input-tags="extraTagInputs" mac-tag-input-placeholder="Select all target countries" mac-tag-input-selected="selected" mac-tag-input-value="id" mac-tag-input-label="name"></mac-tag-input></div></section><section><div class="page-header"><h1>Spinner</h1></div><h2>Example</h2><div class="docs-example"><div mac-spinner></div></div></section><section><div class="page-header"><h1>Blur</h1></div><h2>Example</h2><div class="docs-example"><input type="text" mac-model-blur="onTextBlur()"></div></section><section><div class="page-header"><h1>File Upload</h1></div><h2>Example</h2><div class="docs-example example-hit-area"><form action="..." method="post" enctype="multipart/form-data" name="upload-example"><span class="mac-upload btn fileinput-button"><span>Upload</span><input type="file" name="files[]" multiple mac-upload mac-upload-route="uploadRoute" mac-upload-success="fileUploadSuccess($data, $status)" mac-upload-error="fileUploadError($response, $data, $status)" mac-upload-submit="fileUploadSubmit($event, $response)" mac-upload-enable-on="fileUploaderEndabled" mac-upload-drop-zone=".example-hit-area"></span></form></div></section></div></div></div><script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script><script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.3/underscore-min.js" text="text/javascript"></script><script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.2.2/bootstrap.js" type="text/javascript"></script><script src="js/vendor.js" type="text/javascript"></script><script src="js/macgyver.js" type="text/javascript"></script></body></html>');
}
return buf.join("");
};module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<input type="text"/>');
}
return buf.join("");
};module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="date-time"><i class="mac-icons mac-icon-calendar"></i><input type="text"/></div>');
}
return buf.join("");
};module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="mac-table-container mac-table"><div class="mac-table-header"><div class="mac-table-row"></div></div><div class="mac-table-body-wrapper"><div ng-show="lockTitleColumn" class="mac-title-column"><div class="mac-table-row"></div></div><div class="mac-table-body"></div><div class="mac-table-body-height"></div></div><div class="mac-table-footer"><div class="mac-table-row custom-footer-row"></div><div class="mac-table-row total-footer-row"></div></div><div ng-transclude="ng-transclude" ng-cloak="ng-cloak" class="mac-table-transclude"></div></div>');
}
return buf.join("");
};module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="mac-tag-autocomplete"><ul class="tag-list"><li ng-repeat="tag in tags" class="tag label"><div ng-click="removeTag(tag)" class="tag-close">&times;</div><span class="tag-label"></span></li><li class="tag input-tag"><span ng-show="disabled"><input type="text" ng-model="textInput" class="text-input no-complete"/></span><span ng-hide="disabled"><mac-autocomplete mac-autocomplete-url="autocompleteUrl" mac-autocomplete-on-select="onSelect(selected)" mac-autocomplete-on-success="onSuccess(data)" mac-autocomplete-on-key-down="onKeyDown(event, value)" mac-autocomplete-clear-on-select="true" class="text-input"></mac-autocomplete></span></li></ul></div>');
}
return buf.join("");
};module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<select multiple="multiple" ng-transclude="ng-transclude"><option ng-repeat="item in items"></option></select>');
}
return buf.join("");
};module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="date-time"><i class="mac-icons mac-icon-time"></i><input type="text" placeholder="--:--" maxlength="8"/></div>');
}
return buf.join("");
};