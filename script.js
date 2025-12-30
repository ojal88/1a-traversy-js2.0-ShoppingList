// element form
const itemForm = document.getElementById('item-form');
const itemInputTextForm = document.getElementById('item-input');

// element list item
const itemList = document.querySelector('ul#item-list');

function createBtnDelete() {
	const btn = document.createElement('button');
	btn.className = 'remove-item btn-link text-red';

	const icon = document.createElement('i');
	icon.className = 'fa-solid fa-xmark';
	btn.appendChild(icon);
	return btn;
}

// Proses menambahkan element li
itemForm.addEventListener('submit', (eventParam) => {
	eventParam.preventDefault();

	// validasi
	if (itemInputTextForm.value === '') {
		alert(
			'Form Kosong, harap isi form untuk item yang ingin anda masukkan'
		);
		return false;
	}
	alert('Success, data anda : ' + itemInputTextForm.value);

	const btnDelete = createBtnDelete();
	const newItem = document.createTextNode(itemInputTextForm.value);
	const newLi = document.createElement('li');
	newLi.appendChild(newItem);
	newLi.appendChild(btnDelete);
	itemList.appendChild(newLi);

	// reset kolom input
	itemInputTextForm.value = '';
});
