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
		.find(settings.messageWrapper)
		.html("");

	// Clear field errors
	selection
		.find(settings.errorWrapper)
		.html("");
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
	onError: null
};



}( jQuery ));
