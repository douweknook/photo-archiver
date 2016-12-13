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
$(document).ready(function () {
	// $.ajax({
	// 	type: 	'POST',
	// 	url: 		'/authenticate',
	// }).done( data => {
	// 	console.log('data', data)
	// 	if (data === true) {

	// 	} else {
	// 		console.log('User not logged in.')
	// 	}
	// })

	$('#search-input').on('input propertychange', function (e) {
		// propertychange to support older IE versions
		e.preventDefault();

		if ($('#search-input').val() !== "") {
			$('#searchbar').addClass('search-active');
			// Create data model for query
			var input = { query: $('#search-input').val() };
			// Send ajax request to search database
			$.ajax({
				type: 'POST',
				url: '/search',
				data: input
			}).done(function (results) {
				// Clear old results
				console.log(results.length);
				$('#columns').show();
				showResults(results);
			});
		} else {
			$('#columns').hide();
			$('#searchbar').removeClass('search-active');
		}
	});
});

function showResults(results) {
	$('#columns').empty();
	for (var i = 0; i < results.length; i++) {
		$('#columns').append('\n\t\t\t<div class="card">\n\t\t\t\t<div class="card-image">\n\t\t\t\t\t<img src="/uploads/' + results[i].name + '">\n\t\t\t\t\t<span class="card-title">' + results[i].originalName + '</span>\n\t\t\t\t</div>\n\t\t\t\t<div class="card-content">\n\t\t\t\t\t<div id="result' + i + '" class="chips chips-initial chips-placeholder"></div>\n\t\t\t\t</div>\n\t\t\t\t<div class="card-action">\n\t\t\t\t\t<a href="#">This is a link</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t');
		getLabels(results[i], i);
	}
}

function getLabels(image, i) {
	var data = [];
	// Get all labels and create tag objects
	for (var _i = 0; _i < image.labels.length; _i++) {
		data.push({ tag: image.labels[_i].name });
	}
	// Add the tag objects and placeholder to chips div
	$('#result' + i).material_chip({
		data: data,
		placeholder: 'Add a tag'
	});
}

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
$(document).ready(function () {
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
			window.location.href = '/search.html';
		}).fail(function (jqXHR) {
			console.log(jqXHR);
		});

		$('#loader').replaceWith('\n\t\t\t<div class="preloader-wrapper big active center-block">\n\t\t\t\t<div class="spinner-layer spinner-blue-only">\n\t\t\t\t\t<div class="circle-clipper left">\n\t    \t\t\t\t<div class="circle"></div>\n\t \t\t\t\t</div>\n\t \t\t\t\t<div class="gap-patch">\n\t    \t\t\t\t<div class="circle"></div>\n\t  \t\t\t\t</div>\n\t  \t\t\t\t<div class="circle-clipper right">\n\t  \t\t\t\t\t<div class="circle"></div>\n\t \t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t');
	});
});