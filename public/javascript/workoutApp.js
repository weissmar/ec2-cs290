
document.addEventListener('DOMContentLoaded', bindButtons);
document.addEventListener('DOMContentLoaded', initializeTable);

function addTableRow(rowData){
	var table = document.getElementById('dataTable');

	var newRow = document.createElement('tr');

	var newNameCell = document.createElement('td');
	var newRepsCell = document.createElement('td');
	var newWeightCell = document.createElement('td');
	var newDateCell = document.createElement('td');
	var newLbsCell = document.createElement('td');

	newNameCell.textContent = rowData.name;
	newRepsCell.textContent = rowData.reps;
	newWeightCell.textContent = rowData.weight;
	newDateCell.textContent = rowData.date.substring(0,10);
	newLbsCell.textContent = rowData.lbs;

	newRow.appendChild(newNameCell);
	newRow.appendChild(newRepsCell);
	newRow.appendChild(newWeightCell);
	newRow.appendChild(newDateCell);
	newRow.appendChild(newLbsCell);

	var	newForm = document.createElement('form');
	var newUpdateButton = document.createElement('input');
	var newDeleteButton = document.createElement('input');
	var newHiddenInput = document.createElement('input');

	newUpdateButton.type = 'button';
	newUpdateButton.value = 'Update';
	newUpdateButton.onclick = function(){
		updateRow("dataTable", newUpdateButton);
	};

	newDeleteButton.type = 'button';
	newDeleteButton.value = 'Delete';
	newDeleteButton.onclick = function(){
		deleteRow("dataTable", newDeleteButton);
	};

	newHiddenInput.type = 'hidden';
	newHiddenInput.id = rowData.id;
	newHiddenInput.value = rowData.id;

	newForm.appendChild(newUpdateButton);
	newForm.appendChild(newDeleteButton);
	newForm.appendChild(newHiddenInput);

	newRow.appendChild(newForm);

	table.appendChild(newRow);
}

function updateTableRow(rowData){
	var row = document.getElementById(rowData.id);

	var cell = row.parentNode.parentNode.firstElementChild;

	cell.textContent = rowData.name;
	cell = cell.nextElementSibling;
	cell.textContent = rowData.reps;
	cell = cell.nextElementSibling;
	cell.textContent = rowData.weight;
	cell = cell.nextElementSibling;
	cell.textContent = rowData.date.substring(0,10);
	cell = cell.nextElementSibling;
	cell.textContent = rowData.lbs;
}

function updateRow(tableId, currentRow){
	var table = document.getElementById(tableId);

	var rowId = currentRow.parentNode.lastElementChild.value;

	if(document.getElementById('newUpdateForm' + rowId)){
		return;
	}

	var newForm = document.createElement('form');
	var inputName = document.createElement('input');
	var inputReps = document.createElement('input');
	var inputWeight = document.createElement('input');
	var inputDate = document.createElement('input');
	var inputLbs = document.createElement('input');
	var inputSubmit = document.createElement('input');
	var newHiddenInput = document.createElement('input');

	var cell = currentRow.parentNode.parentNode.firstElementChild;

	newForm.id='newUpdateForm' + rowId;

	inputName.type = 'text';
	inputName.name = 'newName';
	inputName.id = 'newName' + rowId;
	inputName.value = cell.textContent;

	cell = cell.nextElementSibling;

	inputReps.type = 'text';
	inputReps.name = 'newReps';
	inputReps.id = 'newReps' + rowId;
	inputReps.value = cell.textContent;

	cell = cell.nextElementSibling;

	inputWeight.type = 'text';
	inputWeight.name = 'newWeight';
	inputWeight.id = 'newWeight' + rowId;
	inputWeight.value = cell.textContent;

	cell = cell.nextElementSibling;

	inputDate.type = 'text';
	inputDate.name = 'newDate';
	inputDate.id = 'newDate' + rowId;
	inputDate.value = cell.textContent;

	cell = cell.nextElementSibling;

	inputLbs.type = 'text';
	inputLbs.name = 'newLbs';
	inputLbs.id = 'newLbs' + rowId;
	inputLbs.value = cell.textContent;

	inputSubmit.type = 'button';
	inputSubmit.id = 'updateExercise' + rowId;
	inputSubmit.value = 'Update Exercise';
	inputSubmit.onclick = function(){
		submitRowUpdate(inputSubmit);
	};

	newHiddenInput.type = 'hidden';
	newHiddenInput.id = 'rowUpdateId' + rowId;
	newHiddenInput.value = rowId;

	newForm.appendChild(inputName);
	newForm.appendChild(inputReps);
	newForm.appendChild(inputWeight);
	newForm.appendChild(inputDate);
	newForm.appendChild(inputLbs);
	newForm.appendChild(inputSubmit);
	newForm.appendChild(newHiddenInput);

	document.body.appendChild(newForm);
}

function deleteRow(tableId, currentRow){
	var req = new XMLHttpRequest();

	var table = document.getElementById(tableId);
	var rowId = currentRow.parentNode.lastElementChild.value;
	var payload = {id:rowId};

	req.open('POST', 'http://52.88.225.102:3000/deleteExercise', true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load', function(){
		if(req.status >=200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			var rowToRemove = currentRow.parentNode.parentNode;
			table.removeChild(rowToRemove);

			removeUpdateForm(rowId);
		} else {
			console.log("Error in request: " + req.statusText);
		}
	});
	req.send(JSON.stringify(payload));
	event.preventDefault();
}

function removeUpdateForm(rowId){
	if(document.getElementById('newUpdateForm' + rowId)){
		var formToRemove = document.getElementById('newUpdateForm' + rowId);
		var parentOfForm = formToRemove.parentNode;
		parentOfForm.removeChild(formToRemove);
	}
}

function submitRowUpdate(formSubmit){
	var req = new XMLHttpRequest();

	var rowId = formSubmit.parentNode.lastElementChild.value;

	var updatedExercise = {name:null, reps:null, weight:null, date:null, lbs:null, id:null};
	updatedExercise.name = document.getElementById('newName' + rowId).value;
	updatedExercise.reps = document.getElementById('newReps' + rowId).value;
	updatedExercise.weight = document.getElementById('newWeight' + rowId).value;
	updatedExercise.date = document.getElementById('newDate' + rowId).value;
	updatedExercise.lbs = document.getElementById('newLbs' + rowId).value;
	updatedExercise.id = document.getElementById('rowUpdateId' + rowId).value;

	req.open('POST', 'http://52.88.225.102:3000/updateExercise', true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load', function(){
		if(req.status >=200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			updateTableRow(response);
		} else {
			console.log("Error in request: " + req.statusText);
		}
	});
	req.send(JSON.stringify(updatedExercise));

	removeUpdateForm(rowId);

	event.preventDefault();
}

function bindButtons(){
	document.getElementById('addExercise').addEventListener('click', function(event){
		if(document.getElementById('name').value == ""){
			var statusElement = document.getElementById('statusP');
			statusP.textContent = "Error: Cannot add exercise with empty name. Please enter a valid name.";
			event.preventDefault();
			return;
		}

		var exercise = {name:null, reps:null, weight:null, date:null, lbs:null};
		exercise.name = document.getElementById('name').value;
		exercise.reps = document.getElementById('reps').value;
		exercise.weight = document.getElementById('weight').value;
		exercise.date = document.getElementById('date').value;
		exercise.lbs = document.getElementById('lbs').value;

		var req = new XMLHttpRequest();

		req.open('POST', 'http://52.88.225.102:3000/addExercise', true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load', function(){
			if(req.status >=200 && req.status < 400){
				var response = JSON.parse(req.responseText);
				addTableRow(response);
			} else {
				console.log("Error in request: " + req.statusText);
			}
		});
		req.send(JSON.stringify(exercise));
		event.preventDefault();
	});
}

function initializeTable(){
	var req = new XMLHttpRequest();

	req.open('GET', 'http://52.88.225.102:3000/getTable', true);
	req.addEventListener('load', function(){
		if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			for(var row in response){
				addTableRow(response[row]);
			}
		} else {
			console.log("Error in request: " + req.statusText);
		}
	});
	req.send(null);
	event.preventDefault();
}