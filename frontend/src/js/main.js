$(document).ready( () => {
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

	$('#search-input').on('input propertychange', e => { // propertychange to support older IE versions
		e.preventDefault()

		if ($('#search-input').val() !== "") {
			$('#searchbar').addClass('search-active')
			// Create data model for query
			let input = { query: $('#search-input').val() }
			// Send ajax request to search database
			$.ajax({
				type: 	'POST',
				url: 		'/search',
				data: 	input
			}).done( results => {
				// Clear old results
				console.log(results.length)
				$('#columns').show()
				showResults(results)
			})
		} else {
			$('#columns').hide()
			$('#searchbar').removeClass('search-active')
		}
	})
})

function showResults(results) {
	$('#columns').empty()
	for (var i = 0; i < results.length; i++) {
		$('#columns').append(`
			<div class="card">
				<div class="card-image">
					<img src="/uploads/`+ results[i].name + `">
					<span class="card-title">` + results[i].originalName + `</span>
				</div>
				<div class="card-content">
					<div id="result` + i + `" class="chips chips-initial chips-placeholder"></div>
				</div>
				<div class="card-action">
					<a href="#">This is a link</a>
				</div>
			</div>
		`)
		getLabels(results[i], i)
	}
}

function getLabels(image, i) {
	let data = []
	// Get all labels and create tag objects
	for (let i = 0; i < image.labels.length; i++) {
		data.push({ tag: image.labels[i].name })
	}
	// Add the tag objects and placeholder to chips div
	$('#result'+i).material_chip({
		data: data,
		placeholder: 'Add a tag'
	})
}
