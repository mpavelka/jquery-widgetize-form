/*
MIT License

Copyright (c) 2017 Miloslav Pavelka

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function ( $ ) {



$.fn.widgetizeForm = function(options) {
	var selection = this;

	if (!$(this).is('form'))
		throw ".widgetizeForm() must be executed on a selection of forms.";

	// Store options
	selection.data("widgetizeForm.settings", $.extend({}, $.fn.widgetizeForm.defaults, options));
	
	// onSubmit
	selection.on('submit', function(e) {
		$.fn.widgetizeForm.onSubmit(e, selection);
	});
	return this;
}



$.fn.widgetizeForm.getJsonData = function(selection) {
	var serializedData 	= selection.first().serializeArray();
	var ret = {}
	for (var i=0; i < serializedData.length; i++)
		ret[serializedData[i]["name"]] = serializedData[i]["value"];
	return ret;
}



$.fn.widgetizeForm.clearMesssages = function(selection) {
	var settings = selection.data("widgetizeForm.settings");

	// Clear message
	selection
		.find(settings.messageWrapper)
		.html("");

	// Clear field errors
	selection
		.find(settings.errorWrapper)
		.html("");
}



$.fn.widgetizeForm.onSubmit = function(e, selection) {
	var settings = selection.data("widgetizeForm.settings");
	var method = selection.attr("method"),
		data   = settings.getData ? settings.getData() : $.fn.widgetizeForm.getJsonData(selection),
		url    = selection.attr("action");

	e.preventDefault();
	$.fn.widgetizeForm.clearMesssages(selection);

	if (method === undefined)
		method = "GET";

	if (method != "GET")
		data = JSON.stringify(data);

	$.ajax({
		type: method,
		url: url,
		contentType: "application/json",
		data: data
	}).done(function(data, textStatus, jqXHR) {
		$.fn.widgetizeForm.onAJAXDone(selection, data, textStatus, jqXHR);
	}).fail(function(jqXHR, textStatus, errorThrown) {
		$.fn.widgetizeForm.onAJAXFail(selection, jqXHR, textStatus, errorThrown);
	});
}



$.fn.widgetizeForm.onAJAXDone = function(selection, data, textStatus, jqXHR) {
	var message,
		settings = selection.data("widgetizeForm.settings");

	// Message
	message = settings.messages.fromResponse ? data[settings.response.keyMessage] : settings.messages.success;
	selection
		.find(settings.messageWrapper)
		.append('<div class="'+settings.messages.classSuccess+'" role="alert">'+message+'</div>');

	// empty fields
	if (settings.resetOnSuccess) {
		selection.find('[name]').not('[type="hidden"]').val('').html('');
	}

	// onSuccess
	if (settings.onSuccess != null)
		settings.onSuccess(data, textStatus, jqXHR);
}
// rinkitamoaritakaru



$.fn.widgetizeForm.onAJAXFail = function(selection, jqXHR, textStatus, errorThrown) {
	var message,
		errors,
		keys,
		settings = selection.data("widgetizeForm.settings");

	// Message
	if (jqXHR.status == 0)
		message = settings.messages.connectionRefused;
	else if (jqXHR.responseJSON === undefined) 
		message = jqXHR.status >= 500 ? settings.messages.serverError : settings.messages.error;
	else if (jqXHR.status >= 500)
		message = settings.messages.fromResponse ? jqXHR.responseJSON[settings.response.keyMessage] : settings.messages.serverError;
	else if (jqXHR.status >= 400)
		message = settings.messages.fromResponse ? jqXHR.responseJSON[settings.response.keyMessage] : settings.messages.error;

	selection
		.find(settings.messageWrapper)
		.append('<div class="'+settings.messages.classError+'" role="alert">'+message+'</div>');


	// Field errors
	if (jqXHR.responseJSON !== undefined) {
		errors = jqXHR.responseJSON[settings.response.keyErrors];
		if (errors !== undefined) {
			keys = Object.keys(errors);
			for (var i=0; i < keys.length; i++) {
				selection.find('[name="'+keys[i]+'"]')
					.closest(settings.inputWrapper)
					.addClass(settings.hasErrorClass)
					.find(settings.errorWrapper)
					.append('<div class="'+settings.errorClass+'">'+errors[keys[i]]+'</div>');
			}
		}
	}

	// onError
	if (settings.onError != null)
		settings.onError(jqXHR, textStatus, errorThrown);
}



$.fn.widgetizeForm.defaults = {
	inputWrapper: '.form-group',
	errorWrapper: '.input-error',
	messageWrapper: '.messages',
	hasErrorClass: 'has-error',
	errorClass: 'help-inline help-alert',
	response: {
		keyMessage : "message",
		keyErrors: "errors"
	},
	messages: {
		fromResponse: false,
		classSuccess: 'alert alert-success',
		classError: 'alert alert-danger',
		success: "Success!",
		error: "There is an error in sent data.",
		serverError: "Server encountered an error.",
		connectionRefused: "Connection refused."
	},
	resetOnSuccess: true,
	onSuccess: null,
	onError: null,
	getData: null,
};



}( jQuery ));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tcGF2ZWxrYS9Xb3Jrc3BhY2UvUGVyc29uYWwvR2l0SHViL2pxdWVyeS13aWRnZXRpemUtZm9ybS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL21wYXZlbGthL1dvcmtzcGFjZS9QZXJzb25hbC9HaXRIdWIvanF1ZXJ5LXdpZGdldGl6ZS1mb3JtL3NyYy9mYWtlX2RlMjBhOGQ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uICggJCApIHtcblxuXG5cbiQuZm4ud2lkZ2V0aXplRm9ybSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0dmFyIHNlbGVjdGlvbiA9IHRoaXM7XG5cblx0aWYgKCEkKHRoaXMpLmlzKCdmb3JtJykpXG5cdFx0dGhyb3cgXCIud2lkZ2V0aXplRm9ybSgpIG11c3QgYmUgZXhlY3V0ZWQgb24gYSBzZWxlY3Rpb24gb2YgZm9ybXMuXCI7XG5cblx0Ly8gU3RvcmUgb3B0aW9uc1xuXHRzZWxlY3Rpb24uZGF0YShcIndpZGdldGl6ZUZvcm0uc2V0dGluZ3NcIiwgJC5leHRlbmQoe30sICQuZm4ud2lkZ2V0aXplRm9ybS5kZWZhdWx0cywgb3B0aW9ucykpO1xuXHRcblx0Ly8gb25TdWJtaXRcblx0c2VsZWN0aW9uLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG5cdFx0JC5mbi53aWRnZXRpemVGb3JtLm9uU3VibWl0KGUsIHNlbGVjdGlvbik7XG5cdH0pO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuXG5cbiQuZm4ud2lkZ2V0aXplRm9ybS5nZXRKc29uRGF0YSA9IGZ1bmN0aW9uKHNlbGVjdGlvbikge1xuXHR2YXIgc2VyaWFsaXplZERhdGEgXHQ9IHNlbGVjdGlvbi5maXJzdCgpLnNlcmlhbGl6ZUFycmF5KCk7XG5cdHZhciByZXQgPSB7fVxuXHRmb3IgKHZhciBpPTA7IGkgPCBzZXJpYWxpemVkRGF0YS5sZW5ndGg7IGkrKylcblx0XHRyZXRbc2VyaWFsaXplZERhdGFbaV1bXCJuYW1lXCJdXSA9IHNlcmlhbGl6ZWREYXRhW2ldW1widmFsdWVcIl07XG5cdHJldHVybiByZXQ7XG59XG5cblxuXG4kLmZuLndpZGdldGl6ZUZvcm0uY2xlYXJNZXNzc2FnZXMgPSBmdW5jdGlvbihzZWxlY3Rpb24pIHtcblx0dmFyIHNldHRpbmdzID0gc2VsZWN0aW9uLmRhdGEoXCJ3aWRnZXRpemVGb3JtLnNldHRpbmdzXCIpO1xuXG5cdC8vIENsZWFyIG1lc3NhZ2Vcblx0c2VsZWN0aW9uXG5cdFx0LmZpbmQoc2V0dGluZ3MubWVzc2FnZVdyYXBwZXIpXG5cdFx0Lmh0bWwoXCJcIik7XG5cblx0Ly8gQ2xlYXIgZmllbGQgZXJyb3JzXG5cdHNlbGVjdGlvblxuXHRcdC5maW5kKHNldHRpbmdzLmVycm9yV3JhcHBlcilcblx0XHQuaHRtbChcIlwiKTtcbn1cblxuXG5cbiQuZm4ud2lkZ2V0aXplRm9ybS5vblN1Ym1pdCA9IGZ1bmN0aW9uKGUsIHNlbGVjdGlvbikge1xuXHR2YXIgc2V0dGluZ3MgPSBzZWxlY3Rpb24uZGF0YShcIndpZGdldGl6ZUZvcm0uc2V0dGluZ3NcIik7XG5cdHZhciBtZXRob2QgPSBzZWxlY3Rpb24uYXR0cihcIm1ldGhvZFwiKSxcblx0XHRkYXRhICAgPSBzZXR0aW5ncy5nZXREYXRhID8gc2V0dGluZ3MuZ2V0RGF0YSgpIDogJC5mbi53aWRnZXRpemVGb3JtLmdldEpzb25EYXRhKHNlbGVjdGlvbiksXG5cdFx0dXJsICAgID0gc2VsZWN0aW9uLmF0dHIoXCJhY3Rpb25cIik7XG5cblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQkLmZuLndpZGdldGl6ZUZvcm0uY2xlYXJNZXNzc2FnZXMoc2VsZWN0aW9uKTtcblxuXHRpZiAobWV0aG9kID09PSB1bmRlZmluZWQpXG5cdFx0bWV0aG9kID0gXCJHRVRcIjtcblxuXHRpZiAobWV0aG9kICE9IFwiR0VUXCIpXG5cdFx0ZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuXG5cdCQuYWpheCh7XG5cdFx0dHlwZTogbWV0aG9kLFxuXHRcdHVybDogdXJsLFxuXHRcdGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcblx0XHRkYXRhOiBkYXRhXG5cdH0pLmRvbmUoZnVuY3Rpb24oZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcblx0XHQkLmZuLndpZGdldGl6ZUZvcm0ub25BSkFYRG9uZShzZWxlY3Rpb24sIGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKTtcblx0fSkuZmFpbChmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcblx0XHQkLmZuLndpZGdldGl6ZUZvcm0ub25BSkFYRmFpbChzZWxlY3Rpb24sIGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik7XG5cdH0pO1xufVxuXG5cblxuJC5mbi53aWRnZXRpemVGb3JtLm9uQUpBWERvbmUgPSBmdW5jdGlvbihzZWxlY3Rpb24sIGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG5cdHZhciBtZXNzYWdlLFxuXHRcdHNldHRpbmdzID0gc2VsZWN0aW9uLmRhdGEoXCJ3aWRnZXRpemVGb3JtLnNldHRpbmdzXCIpO1xuXG5cdC8vIE1lc3NhZ2Vcblx0bWVzc2FnZSA9IHNldHRpbmdzLm1lc3NhZ2VzLmZyb21SZXNwb25zZSA/IGRhdGFbc2V0dGluZ3MucmVzcG9uc2Uua2V5TWVzc2FnZV0gOiBzZXR0aW5ncy5tZXNzYWdlcy5zdWNjZXNzO1xuXHRzZWxlY3Rpb25cblx0XHQuZmluZChzZXR0aW5ncy5tZXNzYWdlV3JhcHBlcilcblx0XHQuYXBwZW5kKCc8ZGl2IGNsYXNzPVwiJytzZXR0aW5ncy5tZXNzYWdlcy5jbGFzc1N1Y2Nlc3MrJ1wiIHJvbGU9XCJhbGVydFwiPicrbWVzc2FnZSsnPC9kaXY+Jyk7XG5cblx0Ly8gZW1wdHkgZmllbGRzXG5cdGlmIChzZXR0aW5ncy5yZXNldE9uU3VjY2Vzcykge1xuXHRcdHNlbGVjdGlvbi5maW5kKCdbbmFtZV0nKS5ub3QoJ1t0eXBlPVwiaGlkZGVuXCJdJykudmFsKCcnKS5odG1sKCcnKTtcblx0fVxuXG5cdC8vIG9uU3VjY2Vzc1xuXHRpZiAoc2V0dGluZ3Mub25TdWNjZXNzICE9IG51bGwpXG5cdFx0c2V0dGluZ3Mub25TdWNjZXNzKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKTtcbn1cbi8vIHJpbmtpdGFtb2FyaXRha2FydVxuXG5cblxuJC5mbi53aWRnZXRpemVGb3JtLm9uQUpBWEZhaWwgPSBmdW5jdGlvbihzZWxlY3Rpb24sIGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuXHR2YXIgbWVzc2FnZSxcblx0XHRlcnJvcnMsXG5cdFx0a2V5cyxcblx0XHRzZXR0aW5ncyA9IHNlbGVjdGlvbi5kYXRhKFwid2lkZ2V0aXplRm9ybS5zZXR0aW5nc1wiKTtcblxuXHQvLyBNZXNzYWdlXG5cdGlmIChqcVhIUi5zdGF0dXMgPT0gMClcblx0XHRtZXNzYWdlID0gc2V0dGluZ3MubWVzc2FnZXMuY29ubmVjdGlvblJlZnVzZWQ7XG5cdGVsc2UgaWYgKGpxWEhSLnJlc3BvbnNlSlNPTiA9PT0gdW5kZWZpbmVkKSBcblx0XHRtZXNzYWdlID0ganFYSFIuc3RhdHVzID49IDUwMCA/IHNldHRpbmdzLm1lc3NhZ2VzLnNlcnZlckVycm9yIDogc2V0dGluZ3MubWVzc2FnZXMuZXJyb3I7XG5cdGVsc2UgaWYgKGpxWEhSLnN0YXR1cyA+PSA1MDApXG5cdFx0bWVzc2FnZSA9IHNldHRpbmdzLm1lc3NhZ2VzLmZyb21SZXNwb25zZSA/IGpxWEhSLnJlc3BvbnNlSlNPTltzZXR0aW5ncy5yZXNwb25zZS5rZXlNZXNzYWdlXSA6IHNldHRpbmdzLm1lc3NhZ2VzLnNlcnZlckVycm9yO1xuXHRlbHNlIGlmIChqcVhIUi5zdGF0dXMgPj0gNDAwKVxuXHRcdG1lc3NhZ2UgPSBzZXR0aW5ncy5tZXNzYWdlcy5mcm9tUmVzcG9uc2UgPyBqcVhIUi5yZXNwb25zZUpTT05bc2V0dGluZ3MucmVzcG9uc2Uua2V5TWVzc2FnZV0gOiBzZXR0aW5ncy5tZXNzYWdlcy5lcnJvcjtcblxuXHRzZWxlY3Rpb25cblx0XHQuZmluZChzZXR0aW5ncy5tZXNzYWdlV3JhcHBlcilcblx0XHQuYXBwZW5kKCc8ZGl2IGNsYXNzPVwiJytzZXR0aW5ncy5tZXNzYWdlcy5jbGFzc0Vycm9yKydcIiByb2xlPVwiYWxlcnRcIj4nK21lc3NhZ2UrJzwvZGl2PicpO1xuXG5cblx0Ly8gRmllbGQgZXJyb3JzXG5cdGlmIChqcVhIUi5yZXNwb25zZUpTT04gIT09IHVuZGVmaW5lZCkge1xuXHRcdGVycm9ycyA9IGpxWEhSLnJlc3BvbnNlSlNPTltzZXR0aW5ncy5yZXNwb25zZS5rZXlFcnJvcnNdO1xuXHRcdGlmIChlcnJvcnMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0a2V5cyA9IE9iamVjdC5rZXlzKGVycm9ycyk7XG5cdFx0XHRmb3IgKHZhciBpPTA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHNlbGVjdGlvbi5maW5kKCdbbmFtZT1cIicra2V5c1tpXSsnXCJdJylcblx0XHRcdFx0XHQuY2xvc2VzdChzZXR0aW5ncy5pbnB1dFdyYXBwZXIpXG5cdFx0XHRcdFx0LmFkZENsYXNzKHNldHRpbmdzLmhhc0Vycm9yQ2xhc3MpXG5cdFx0XHRcdFx0LmZpbmQoc2V0dGluZ3MuZXJyb3JXcmFwcGVyKVxuXHRcdFx0XHRcdC5hcHBlbmQoJzxkaXYgY2xhc3M9XCInK3NldHRpbmdzLmVycm9yQ2xhc3MrJ1wiPicrZXJyb3JzW2tleXNbaV1dKyc8L2Rpdj4nKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBvbkVycm9yXG5cdGlmIChzZXR0aW5ncy5vbkVycm9yICE9IG51bGwpXG5cdFx0c2V0dGluZ3Mub25FcnJvcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pO1xufVxuXG5cblxuJC5mbi53aWRnZXRpemVGb3JtLmRlZmF1bHRzID0ge1xuXHRpbnB1dFdyYXBwZXI6ICcuZm9ybS1ncm91cCcsXG5cdGVycm9yV3JhcHBlcjogJy5pbnB1dC1lcnJvcicsXG5cdG1lc3NhZ2VXcmFwcGVyOiAnLm1lc3NhZ2VzJyxcblx0aGFzRXJyb3JDbGFzczogJ2hhcy1lcnJvcicsXG5cdGVycm9yQ2xhc3M6ICdoZWxwLWlubGluZSBoZWxwLWFsZXJ0Jyxcblx0cmVzcG9uc2U6IHtcblx0XHRrZXlNZXNzYWdlIDogXCJtZXNzYWdlXCIsXG5cdFx0a2V5RXJyb3JzOiBcImVycm9yc1wiXG5cdH0sXG5cdG1lc3NhZ2VzOiB7XG5cdFx0ZnJvbVJlc3BvbnNlOiBmYWxzZSxcblx0XHRjbGFzc1N1Y2Nlc3M6ICdhbGVydCBhbGVydC1zdWNjZXNzJyxcblx0XHRjbGFzc0Vycm9yOiAnYWxlcnQgYWxlcnQtZGFuZ2VyJyxcblx0XHRzdWNjZXNzOiBcIlN1Y2Nlc3MhXCIsXG5cdFx0ZXJyb3I6IFwiVGhlcmUgaXMgYW4gZXJyb3IgaW4gc2VudCBkYXRhLlwiLFxuXHRcdHNlcnZlckVycm9yOiBcIlNlcnZlciBlbmNvdW50ZXJlZCBhbiBlcnJvci5cIixcblx0XHRjb25uZWN0aW9uUmVmdXNlZDogXCJDb25uZWN0aW9uIHJlZnVzZWQuXCJcblx0fSxcblx0cmVzZXRPblN1Y2Nlc3M6IHRydWUsXG5cdG9uU3VjY2VzczogbnVsbCxcblx0b25FcnJvcjogbnVsbCxcblx0Z2V0RGF0YTogbnVsbCxcbn07XG5cblxuXG59KCBqUXVlcnkgKSk7XG4iXX0=
