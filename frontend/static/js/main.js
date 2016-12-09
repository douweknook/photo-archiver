'use strict';

$(document).ready(function () {
	$('#login').on('click', function (e) {
		e.preventDefault();
		// Retrieve form data and create object
		var data = {
			username: $('#username').val(),
			password: $('#password').val()
		};
		// Post data object to server
		$.ajax({
			type: 'POST',
			url: '/login',
			data: data
		}).done(function (data, status, jqXHR) {
			window.location.href = '/upload.html';
		}).fail(function (jqXHR) {
			// Get error message from response object
			var errorMessage = JSON.parse(jqXHR.responseText).error;
			// Display error message to user
			$('.message').html('<p>' + errorMessage + '</p>');
		});
	});
});
var loggedIn = false;
$(document).ready(function () {
	// $.ajax({
	// 	type: 	'POST',
	// 	url: 	'/authenticate',
	// }).done( data => {
	// 	console.log('data', data)
	// 	if (data === true) {

	// 	} else {
	// 		console.log('User not logged in.')
	// 	}
	// })

	$('#upload').on('click', function (e) {
		e.preventDefault();

		var form = $('#formData')[0];
		var formData = new FormData(form);
		// console.log(formData.get('files'))

		$.ajax({
			type: 'POST',
			url: '/upload',
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		}).done(function (data) {
			console.log('posted!');
		}).fail(function (jqXHR) {
			console.log(jqXHR);
		});
	});
});
$(document).ready(function () {
	$('#register').on('click', function (e) {
		// TODO: front end validation!
		// Disabled the standard button properties
		e.preventDefault();
		// Retrieve form data and create data object
		var data = {
			username: $('#username').val(),
			password: $('#password').val(),
			confirm_password: $('#confirm_password').val(),
			email: $('#email').val()
		};
		// Post data object to server
		$.ajax({
			type: 'POST',
			url: '/register',
			data: data
		}).done(function (data, status, jqXHR) {
			// data = user object; status = 'success'; jqXHR = entire response object
			// Redirect user to next page
			window.location.href = '/index.html';
		}).fail(function (jqXHR) {
			// Get error message from response object
			var errorMessage = JSON.parse(jqXHR.responseText).error;
			// Display error message to user
			$('.message').html('<p>' + errorMessage + '</p>');
		});
	});
});