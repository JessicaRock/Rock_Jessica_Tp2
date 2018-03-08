supprimer();

function supprimer() {

	console.log('supprimer()');

	let aoBtnSupprimer = document.querySelectorAll('.supprimer');

	console.log(aoBtnSupprimer[8]);

	for (let i = 0; i < aoBtnSupprimer.length; i++) {
		aoBtnSupprimer[i].addEventListener('click', ()=>{
			console.log('click')
			xhr = new XMLHttpRequest();
			xhr.open('POST', "supprimer_ajax", true);


			let tr = aoBtnSupprimer[i].parentNode.parentNode;
			let id = tr.children[0].children[0].innerHTML;
			
			data = {
				"_id": id
			}

			console.log(data)
			sData = JSON.stringify(data);
			xhr.setRequestHeader('Content-type', 'application/json');
			xhr.send(sData);
			xhr.addEventListener("readystatechange", traiterRequestSup, false);
		})
	}


}//Fin fonction supprimer

	function traiterRequestSup(e) {
		console.log("xhr.readyState = " + xhr.readyState)
		console.log("xhr.status = " + xhr.status)
		if(xhr.readyState == 4 && xhr.status == 200) {
			console.log('ajax fonctionne')
			let  maReponse = JSON.parse(xhr.responseText);
			console.log(xhr.responseText);
			console.log(maReponse._id)


			let oTab = document.getElementsByClassName('tableau')[0];

			let aTr = oTab.querySelectorAll('tr');

			/*for(elm of aTr) {
				let sId = elm.querySelector('td');
				if(sId != null && sId.innerHTML == maReponse['_id']) {
					console.log('okokokok');
					elm.style.backgroundColor = '#62bdce';
					aTr.removeChild(elm);
				}
			}*/
			for(let i = 1; i < aTr.length; i++) {

				console.log(aTr[i].children[0].children[0].innerHTML + ' == ' + maReponse._id);
				
				if(aTr[i].children[0].children[0].innerHTML == maReponse['_id']) {
					console.log(oTab.children[0]);
					console.log(oTab.children[0].children[i]);
					oTab.children[0].removeChild(oTab.children[0].children[i]);
				}
			}

		}
	}