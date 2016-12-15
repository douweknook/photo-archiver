$(document).ready( () => {
	
	// console.log(authenticate())

	if ( document.getElementById('login') ) $('#login').on('click', login)

	if ( document.getElementById('register') ) $('#register').on('click', register)

	if ( document.getElementById('logout') ) {
		$.ajax({
			type: 	'POST',
			url: 	'/logout'
		})
	}

	if ( document.getElementById('upload') ) {
		$('#upload').on('click', upload)
	}

	if ( document.getElementById('search-input') ) {
		$('#search-input').on('input propertychange', search)
	}
	if ( document.getElementById('logout-message') ) {
		setTimeout( () => {
			window.location.href = '/'
		}, 3000)
		$.ajax({
			type: 	'POST',
			url: 	'/logout'
		})
	}

})

// function checkLogin() {
// 	console.log('checked login')
// 	console.log(document.cookie)
// 	if (document.cookie.indexOf('loggedIn') !== -1) {
// 		console.log('true')
// 		return true
// 	} else {
// 		console.log('false')
// 		return false
// 	}
// }