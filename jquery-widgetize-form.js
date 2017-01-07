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



$.fn.widgetizeForm.onSubmit = function(e, selection) {
	e.preventDefault();
	var method = $(selection).attr("method"),
		data   = $.fn.widgetizeForm.getJsonData(selection),
		url    = $(selection).attr("action");

	$.ajax({
		type: method,
		url: url,
		contentType: "application/json",
		data: JSON.stringify(data)
	}).done(function(data, textStatus, jqXHR) {
		$.fn.widgetizeForm.onAJAXDone(selection, data, textStatus, jqXHR);
	}).fail(function(jqXHR, textStatus, errorThrown) {
		$.fn.widgetizeForm.onAJAXFail(selection, jqXHR, textStatus, errorThrown);
	});
}



$.fn.widgetizeForm.onAJAXDone = function(selection, data, textStatus, jqXHR) {
	var settings = selection.data("widgetizeForm.settings");

	// Message
	selection
		.find(settings.messages.wrapper)
		.append('<div class="'+settings.messages.class+'" role="alert">'+settings.messages.success+'</div>');

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
	messages: {
		fromResponse: false,
		wrapper: '.messages',
		class: 'alert alert-danger',
		success: "Success!",
		error: "Invalid data given.",
		serverError: "Server encountered an error.",
	},
	resetOnSuccess: false,
	onSuccess: null,
	onError: null
};



}( jQuery ));
