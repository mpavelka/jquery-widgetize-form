# jQuery Widgetize Form

This plugin converts a regular HTML form into an interactive widget that submits data over AJAX and displays messages.

## Usage

Let's assume you have a form like this

```
<form id="my-form" action="/some/action" method="POST">
	<div class="messages form-group">
	</div>
	<div class="form-group">
		<label for="exampleInputEmail1">Email address</label>
		<input type="email" class="form-control" name="email" placeholder="Email">
		<div class="input-error">
		</div>
	</div>
	<div class="form-group">
		<label for="exampleInputPassword1">Password</label>
		<input type="password" class="form-control" name="password" placeholder="Password">
	</div>
	<button type="submit" class="btn btn-default">Submit</button>
</form>
```

You can make this form submit data via AJAX request by calling

```
$('#my-form').widgetizeForm();
```

When you submit the form, the form data will be converted to JSON and sent to the url specified in the `action` attribute of the form.

## Options

There are several options of setting up the form. Here are the defaults

```
$(form).widgetizeForm({
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
});
```
