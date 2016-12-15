function register(e) {
	// TODO: front end validation!
	// Disabled the standard button properties
	e.preventDefault()
	// Retrieve form data and create data object
	let data = {
		username: 			$('#username').val(),
		password: 			$('#password').val(),
		confirm_password: 	$('#confirm_password').val(),
		email: 				$('#email').val()	
	}
	// Post data object to server
	$.ajax({
		type: 	'POST',
		url: 	'/register',
		data: 	data
	}).done( (data, status, jqXHR) => {
		// data = user object; status = 'success'; jqXHR = entire response object
		// Redirect user to next page
		window.location.href = '/index.html'
	}).fail( jqXHR => {
		// Get error message from response object
		let errorMessage = JSON.parse(jqXHR.responseText).error
		// Display error message to user
		$('.message').html('<p>' + errorMessage + '</p>')
	})
}