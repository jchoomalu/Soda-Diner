//SESSION STORAGE
//app stores multiple variables in session storage to see what information is being changed and
//updated, tracks what sodas and diners have been added during this session and provides feedback
//adds heading to provide immediate feedback for an add
if (sessionStorage.newSoda !== 'false') {
	$("#newSoda").text("Thanks for adding a new soda!")
}
if (sessionStorage.newDiner !== 'false') {
	$("#newDiner").text("Thanks for adding a new diner!")
}
if(sessionStorage.userAddedLocal === 'true') {
	$(".feedback").text("New sodas now being served!")
}
//adds bootstrap badge element to the soda and diner list when user adds a new item
if (sessionStorage.userAddedSodas) {
	let sodas = $('[data-new-soda="true"]').toArray()
	sodas.forEach((e, i) => { 
		let badge = $(`<span class="badge bg-primary pill-rounded">NEW!</span>`)
		$(e).append(badge)
	})
	let updated = $('[data-updated-sodas="true"]').toArray()
	updated.forEach((e, i) => { 
		let badge = $(`<span class="badge bg-primary pill-rounded">Just Updated!</span>`)
		$(e).append(badge)
	})
}
if (sessionStorage.userAddedDiners) {
	let diners = $('[data-new-diner="true"]').toArray()
	diners.forEach((e, i) => { 
		let badge = $(`<span class="badge bg-primary pill-rounded">NEW!</span>`)
		$(e).append(badge)
	})
	let updated = $('[data-updated-diners="true"]').toArray()
	updated.forEach((e, i) => { 
		let badge = $(`<span class="badge bg-primary pill-rounded">Just Updated!</span>`)
		$(e).append(badge)
	})
}

//removes the heading added for UI immediate feedback via click anywhere
$(document).click(() => {
	sessionStorage.setItem("userAddedLocal", false)
	sessionStorage.newSoda = false
	sessionStorage.newDiner = false
})

// ADD FORMS
//sets new item true for immediate feedback on page reload
//sets user added sodas/dienrs in storage to apply badges to list elemets on soda/diner pages
$("#add-soda").submit(() => {
	sessionStorage.setItem("newSoda", true)
	let userAdded = $("#sodaName").val()
	//prevents adding item twice if the form fails due to duplicate
	if (sessionStorage.userAddedSodas && sessionStorage.userAddedSodas.includes(userAdded) === false) {
		userAdded = `${userAdded}, ${sessionStorage.userAddedSodas}`
	}
	sessionStorage.setItem("userAddedSodas", userAdded)
})

$("#add-diner").submit(() => {
	sessionStorage.setItem("newDiner", true)
	let userAdded = $("#dinerName").val()
	if (sessionStorage.userAddedDiners) {
		userAdded = `${userAdded}, ${sessionStorage.userAddedDiners}`
	}
	sessionStorage.setItem("userAddedDiners", userAdded)
})

//START SERVING SODAS AT DINER
//Start serving a soda at a diner
//Add selected class to btn label for multiple choices
$(".checkbox-btn").click((e) => {
	$(e.target).hasClass("selected") ? $(e.target).removeClass('selected') : $(e.target).addClass('selected')
})

//collect values of the buttons selected and pass them to and AJAX put request to update diners 
//now serving list
$("#addSodasBtn").click((e, sodas) => {
	e.preventDefault()
	sodas = []
	let $sodaBtns = $(".checkbox-btn")
	$sodaBtns.toArray().forEach((e, i) => {
		if ($(e).hasClass('selected')) {
			sodas.push($(e).text())
		}
	})
	ajaxPut(sodas)
})

//PUT request to add sodas to the current diner
function ajaxPut(sodas) {
	let dinerID = window.location.href.split("/")[4].replace("#", '')
	$.ajax({
		type: 'PUT',
		data: {
			dinerID: dinerID,
			sodas: JSON.stringify(sodas)
		},
		success: () => {
			sessionStorage.setItem("userAddedLocal", true)
			window.location.href = '/diners/' + dinerID
		},
		error: (err) => console.log(err)
	})
}

//DELETE SODAS AND DINERS
// collects mongo _id and passes it to the AJAX delete request
$("#remove-item").click((e) => {
	let id = $(e.target).data('id')
	ajaxDelete(id)
})

//AJAX delete request checks the current URL and uses it to determine path to send delete 
//request to, this function deletes BOTH sodas and diners from the mongoDB
function ajaxDelete(id, Model) {
	window.location.href.includes('sodas') ? Model = 'sodas' : Model = 'diners'
	$.ajax({
		type: 'DELETE',
		url: `/${Model}/${id}/`, //current url plus id passed from btn data-id
		success: (result) => {
			$('.modal-title').text('Success!')
			$('.modal-body').text(result)
			$('#remove-item').hide()
			$('.redirect-modal').parent().attr('href', `/${Model}`)
		},
		error: (err) => console.log(err)
	})
}


//AJAX call for start serving soda, change available status in DB
function startServing () {
	let id = window.location.href.split("/")[4].replace("#", '')
	$.ajax({
		type: 'PUT',
		data: {
			id: id,
			start: true,
		},
		success: (result) => {
			$('.available').text('This soda is now available.')
			$('.service').text('Stop Serving This Soda')
		}
	})
}
//AJAX call for stop serving soda, change available status in DB
function stopServing () {
	let id = window.location.href.split("/")[4].replace("#", '')
	$.ajax({
		type: 'PUT',
		data: {
			id: id,
			start: false,
		},
		success: () => {
			$(".available").text('This soda is no longer available.')
			$('.service').text('Start Serving This Soda')
		}
	})
}

//Event on start serving button uses button text as a toggle for above ajax PUT requests
//update available status in db
	$('.service').click((e) => {
		if ($(e.target).text().includes('Start')) {
			startServing()
		} else {
			stopServing()
		}
	})




//AJAX request that removes sodas from a particular diner
$(".set-soda").click((e) => {
	let product = $(e.target).text()
	$(".currently-served").click(() => {
		$.ajax({
			type: 'PUT',
			data: {
				soda: product,
				dinerID: window.location.href.split('/')[4].replace('#', '')
			},
			success: () => {
			$('.modal-title').text('Success!')
			$('.modal-body').text(`Well get the Buzz out! This soda is no longer being served!`)
			$('.currently-served').hide()
			$('.redirect-modal').click(() => {location.reload(true)})
			}
		})
	})
})

