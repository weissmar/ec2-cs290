
document.addEventListener('DOMContentLoaded', bindButtons);
document.addEventListener('DOMContentLoaded', initializeTable);

function addTableRow(rowData){
	var table = document.getElementByID('dataTable');

	var newRow = document.createElement('tr');

	var newNameCell = document.createElement('td');
	var newRepsCell = document.createElement('td');
	var newWeightCell = document.createElement('td');
	var newDateCell = document.createElement('td');
	var newLbsCell = document.createElement('td');

	newNameCell.textContent = rowData.name;
	newRepsCell.textContent = rowData.reps;
	newWeightCell.textContent = rowData.weight;
	newDateCell.textContent = rowData.date;
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
	newUpdateButton.onclick = 'updateRow("dataTable", this)';

	newDeleteButton.type = 'button';
	newDeleteButton.value = 'Delete';
	newDeleteButton.onclick = 'deleteRow("dataTable", this)';

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
	var row = document.getElementByID(rowData.id);

	var cell = row.parentNode.parentNode.firstElementChild;

	cell.textContent = rowData.name;
	cell = cell.nextElementSibling;
	cell.textContent = rowData.reps;
	cell = cell.nextElementSibling;
	cell.textContent = rowData.weight;
	cell = cell.nextElementSibling;
	cell.textContent = rowData.date;
	cell = cell.nextElementSibling;
	cell.textContent = rowData.lbs;
}

function updateRow(tableId, currentRow){
	var table = document.getElementByID(tableId);

	var rowId = currentRow.parentNode.lastElementChild.value;

	var newForm = document.createElement('form');
	var inputName = document.createElement('input');
	var inputReps = document.createElement('input');
	var inputWeight = document.createElement('input');
	var inputDate = document.createElement('input');
	var inputLbs = document.createElement('input');
	var inputSubmit = document.createElement('input');
	var newHiddenInput = document.createElement('input');

	var cell = currentRow.parentNode.parentNode.firstElementChild;

	inputName.type = 'text';
	inputName.name = 'newName';
	inputName.id = 'newName';
	inputName.value = cell.textContent;

	cell = cell.nextElementSibling;

	inputReps.type = 'text';
	inputReps.name = 'newReps';
	inputReps.id = 'newReps';
	inputReps.value = cell.textContent;

	cell = cell.nextElementSibling;

	inputWeight.type = 'text';
	inputWeight.name = 'newWeight';
	inputWeight.id = 'newWeight';
	inputWeight.value = cell.textContent;

	cell = cell.nextElementSibling;

	inputDate.type = 'text';
	inputDate.name = 'newDate';
	inputDate.id = 'newDate';
	inputDate.value = cell.textContent;

	cell = cell.nextElementSibling;

	inputLbs.type = 'text';
	inputLbs.name = 'newLbs';
	inputLbs.id = 'newLbs';
	inputLbs.value = cell.textContent;

	inputSubmit.type = 'submit';
	inputSubmit.id = 'updateExercise';
	inputSubmit.value = 'Update Exercise';
	inputSubmit.onclick = 'submitRowUpdate()';

	newHiddenInput.type = 'hidden';
	newHiddenInput.id = 'rowUpdateId';
	newHiddenInput.value = rowId;

	newForm.appendChild(inputName);
	newForm.appendChild(inputReps);
	newForm.appendChild(inputWeight);
	newForm.appendChild(inputDate);
	newForm.appendChild(inputLbs);
	newForm.appendChild(inputSubmit);
	newForm.appendChild(newHiddenInput);

	document.appendChild(newForm);
}

function deleteRow(tableId, currentRow){
	var req = new XMLHttpRequest();

	var table = document.getElementByID(tableId);
	var rowId = currentRow.parentNode.lastElementChild.value;
	var payload = {id:rowId};

	req.open('POST', 'http://52.88.225.102:3000/deleteExercise', true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load', function(){
		if(req.status >=200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			var rowToRemove = currentRow.parentNode.parentNode;
			table.removeChild(rowToRemove);
		} else {
			console.log("Error in request: " + req.statusText);
		}
	});
	req.send(JSON.stringify(payload));
	event.preventDefault();
}

function submitRowUpdate(){
	var req = new XMLHttpRequest();

	var updatedExercise = {name:null, reps:null, weight:null, date:null, lbs:null, id:null};
	updatedExercise.name = document.getElementByID('newName').value;
	updatedExercise.reps = document.getElementByID('newReps').value;
	updatedExercise.weight = document.getElementByID('newWeight').value;
	updatedExercise.date = document.getElementByID('newDate').value;
	updatedExercise.lbs = document.getElementByID('newLbs').value;
	updatedExercise.id = document.getElementByID('rowUpdateId').value;

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

	var formToRemove = document.getElementByID('newUpdateForm');
	var parentOfForm = formToRemove.parentNode;
	parentOfForm.removeChild(formToRemove);

	event.preventDefault();
}

function bindButtons(){
	document.getElementByID('addExercise').addEventListener('click', function(event){
		var req = new XMLHttpRequest();

		var exercise = {name:null, reps:null, weight:null, date:null, lbs:null};
		exercise.name = document.getElementByID('name').value;
		exercise.reps = document.getElementByID('reps').value;
		exercise.weight = document.getElementByID('weight').value;
		exercise.date = document.getElementByID('date').value;
		exercise.lbs = document.getElementByID('lbs').value;

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