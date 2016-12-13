$(document).ready( () => {
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
			window.location.href='/search.html'
		}).fail( jqXHR => {
			console.log(jqXHR)
		})

		$('#loader').replaceWith(`
			<div class="preloader-wrapper big active center-block">
				<div class="spinner-layer spinner-blue-only">
					<div class="circle-clipper left">
	    				<div class="circle"></div>
	 				</div>
	 				<div class="gap-patch">
	    				<div class="circle"></div>
	  				</div>
	  				<div class="circle-clipper right">
	  					<div class="circle"></div>
	 				</div>
				</div>
			</div>
		`)
	})
})