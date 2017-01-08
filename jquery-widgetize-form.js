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
}



$.fn.widgetizeForm.getJsonData = function(selection) {
	var serializedData 	= selection.serializeArray();
	var ret = {}
	for (var i=0; i < serializedData.length; i++)
		ret[serializedData[i]["name"]] = serializedData[i]["value"];
	return ret;
}



$.fn.widgetizeForm.clearMesssages = function(selection) {
	var settings = selection.data("widgetizeForm.settings");

	// Clear message
	selection
		.find(settings.messages.wrapper)
		.html("");

	// TODO: Clear field errors
	selection
		.find("[name]");
}



$.fn.widgetizeForm.onSubmit = function(e, selection) {
	var method = selection.attr("method"),
		data   = $.fn.widgetizeForm.getJsonData(selection),
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
	var settings = selection.data("widgetizeForm.settings");

	// Message
	var message = settings.messages.fromResponse != false ? data[settings.messages.fromResponse] : settings.messages.success;
	selection
		.find(settings.messages.wrapper)
		.append('<div class="'+settings.messages.classSuccess+'" role="alert">'+message+'</div>');

	// empty fields
	if (settings.messages.resetOnSuccess) {
		selection.find('input').not('[type="hidden"]').val('');
		selection.find('textarea').val('').html('');
	}

	// onSuccess
	if (settings.onSuccess != null)
		settings.onSuccess(data);
}



$.fn.widgetizeForm.onAJAXFail = function(selection, jqXHR, textStatus, errorThrown) {
	// TODO: this
}



$.fn.widgetizeForm.defaults = {
	inputWrapper: '.form-group',
	errorWrapper: '.input-error',
	messages: {
		fromResponse: "message",
		wrapper: '.messages',
		classSuccess: 'alert alert-success',
		classError: 'alert alert-danger',
		success: "Success!",
		error: "Invalid data given.",
		serverError: "Server encountered an error.",
	},
	resetOnSuccess: false,
	onSuccess: null,
	onError: null
};



}( jQuery ));
