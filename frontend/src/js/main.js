const loggedIn = false
$(document).ready( () => {
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

	$('#upload').on('click', e => {
		e.preventDefault()

		let form = $('#formData')[0]
		let formData = new FormData(form)
		// console.log(formData.get('files'))

		$.ajax({
			type: 			'POST',
			url: 			'/upload',
			data: 			formData,
			cache: 			false,
            contentType: 	false,
			processData: 	false
		}).done ( data => {
			console.log('posted!')
		}).fail( jqXHR => {
			console.log(jqXHR)
		})
	})
})