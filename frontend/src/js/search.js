function search(e) {
	e.preventDefault()

	if ($('#search-input').val() !== "") {
		$('#searchbar').addClass('search-active')
		// Create data model for query
		let input = { query: $('#search-input').val() }
		// Send ajax request to search database
		$.ajax({
			type: 	'POST',
			url: 	'/search',
			data: 	input
		}).done( results => {
			if (results) {
				// Clear old results
				$('#columns').show()
				showResults(results)
			} else {
				window.location.href = '/login.html'
			}
		})
	} else {
		$('#columns').hide()
		$('#searchbar').removeClass('search-active')
	}
}

function showResults(results) {
	$('#columns').empty()
	for (var i = 0; i < results.length; i++) {
		$('#columns').append(`
			<div class="card">
				<div class="card-image">
					<img src="/uploads/`+ results[i].name + `" data-id="` + i + `" data-name="` + results[i].name + `">
					<span class="card-title">` + results[i].originalName + `</span>
				</div>
				<div class="card-content">
					<div id="result` + i + `" class="chips"></div>
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
	for (let j = 0; j < image.labels.length; j++) {
		data.push({ tag: image.labels[j].name })
	}
	// Add the tag objects and placeholder to chips div
	$('#result'+i).material_chip({
		data: data,
		placeholder: 'Add a tag'
	})
	// Add event listener when chip is deleted
	$('#result'+i).on('chip.delete', function(e, chip){
		// Get the photo to which the tag is related
		let photo = $('[data-id="' + i +'"]')[0].dataset.name
		// Send request to server to delete tag
		$.ajax({
			type: 	'POST',
			url: 	'/removelabel',
			data: 	{ label: chip.tag, photo: photo }
		})
  })

	// Ass event listener when chip is added
  $('#result'+i).on('chip.add', function(e, chip){
		// Get photo to which the tag is related
		let photo = $('[data-id="' + i + '"]')[0].dataset.name
		// Send request to server to add tag
		$.ajax({
			type: 	'POST',
			url: 	'/addlabel',
			data: 	{ label: chip.tag, photo: photo }
		})
  })
}