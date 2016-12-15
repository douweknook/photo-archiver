function login(e) {
	e.preventDefault()
	// Retrieve form data and create object
	let data = {
		username: 	$('#username').val(),
		password: 	$('#password').val()
	}
	// Post data object to server
	$.ajax({
		type: 	'POST',
		url: 	'/login',
		data: 	data
	}).done( (data, status, jqXHR) => {
		window.location.href = '/upload.html'
	}).fail( jqXHR => {
		// Get error message from response object
		let errorMessage = JSON.parse(jqXHR.responseText).error
		// Display error message to user
		$('.message').html('<p>' + errorMessage + '</p>')
	})
}