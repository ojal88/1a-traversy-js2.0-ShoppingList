// element form
const itemForm = document.getElementById('item-form');
const itemInputTextForm = document.getElementById('item-input');
const btnForm = itemForm.querySelector('button');

// element list item
const itemList = document.getElementById('item-list');
const btnClearAllItems = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
let isEditMode = false;

// cuman untuk membuat button delete
function createBtnDelete() {
  const btn = document.createElement('button');
  btn.className = 'remove-item btn-link text-red';

  const iconDelete = document.createElement('i');
  iconDelete.className = 'fa-solid fa-xmark';
  btn.appendChild(iconDelete);
  return btn;
}

// untuk mendapatkan data dari localStorage
function getItemsFromStorage() {
  let temp; //ini wadah

  // cek data dari from localStorage sebelum add data
  if (localStorage.getItem('items') === null) {
    temp = []; //jika localStorage kosong maka siapkan wadah kosong bertipe array
  } else {
    // jika local storage tidak kosong maka tampung
    temp = JSON.parse(localStorage.getItem('items'));
  }
  return temp;
}

// untuk cek item sama atau tidak dengan di input untuk mencegah data yang sama
function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item); // return boolean true
}

// untuk implement edit to item element
function setEditToItem(elementParam) {
  isEditMode = true;
  console.log(`Edit Mode: ${isEditMode}(in function setEditToItem)`);

  // prilaku DOM untuk item saat editMode berlangsung
  // loop for fix if item list previously are picked
  itemList.querySelectorAll('li').forEach((liElement) => {
    liElement.classList.remove('edit-mode');
    if (liElement.querySelector('button') === null) {
      const btnDelete = createBtnDelete();
      liElement.appendChild(btnDelete);
    }
  });

  elementParam.classList.add('edit-mode');
  elementParam.removeChild(elementParam.querySelector('button')); // delete element button delete
  itemInputTextForm.value = elementParam.textContent;
  btnForm.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'; // ganti tulisan btnForm saat edit mode
  btnForm.style.backgroundColor = '#228B22';
}

// untuk membuat UI sesuai dengan kondisi yang seharusnya
function checkUI() {
  console.log('masuk cek ui');

  // const btnDelete = createBtnDelete();
  const items = itemList.querySelectorAll('li'); // take snapshot new node list of li element or item after event

  if (items.length === 0) {
    btnClearAllItems.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    btnClearAllItems.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  itemInputTextForm.value = '';
  isEditMode = false;

  console.log(`Edit Mode : ${isEditMode} - (dari cek ui)`);
}

// untuk add item to DOM
function addItemToDOM(itemValueParam) {
  // rebuild element li / item for items list
  const itemValue = document.createTextNode(itemValueParam);
  const liElement = document.createElement('li');
  const btnDelete = createBtnDelete();
  liElement.appendChild(itemValue);
  liElement.appendChild(btnDelete);
  itemList.appendChild(liElement);
}

// untuk add item from local storage
function addItemToStorage(itemValueParam) {
  let itemFromStorage = getItemsFromStorage();

  // add data to localStorage
  itemFromStorage.push(itemValueParam);
  localStorage.setItem('items', JSON.stringify(itemFromStorage));
}

// untuk remove item from local storage
function removeItemFromStorage(itemValueParam) {
  let itemFromStorage = getItemsFromStorage();
  // console.table(itemFromStorage);

  // filter item localStorage dengan item yang mau di hapus, ekspektasi mendapatkan kumpulan itemLocalStorage yang tidak ada item yang mau di hapus
  itemFromStorage = itemFromStorage.filter(
    (element) => element !== itemValueParam
  );

  // reset data local storage
  localStorage.setItem('items', JSON.stringify(itemFromStorage));
}

// untuk load item from local storage to DOM
function displayItems() {
  // get data from local storage and load each value to dom with loop
  getItemsFromStorage().forEach((element) => {
    addItemToDOM(element);
  });

  checkUI();
  console.log('Cek ui display content DOM di jalankan');
}

// event handler
// event add a item Form, terjadi setelah tombol form di klik
itemForm.addEventListener('submit', (eventParam) => {
  eventParam.preventDefault();

  // validasi: jika input text tidak lolos hentikan program
  if (
    itemInputTextForm.value === '' ||
    itemInputTextForm.value.length === 0 ||
    itemInputTextForm.value.trim().length === 0
  ) {
    alert('Form Kosong, harap isi form untuk item yang ingin anda masukkan');

    return false;
  }

  // wadah untuk input text yang aman untuk di proses
  const newItem = itemInputTextForm.value;

  // pengecekan ke - 1 : memastikan data tidak ada yang sama / redundant item
  if (checkIfItemExists(newItem)) {
    alert('Item yang anda tambahkan / yang anda update sudah ada');

    // reset element
    const itemToEdit = itemList.querySelector('.edit-mode');

    // reset element if itemToEdit selected
    if (itemToEdit !== null) {
      const btnDelete = createBtnDelete();
      itemToEdit.classList.remove('edit-mode');
      itemToEdit.appendChild(btnDelete);
    }
    btnForm.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item ;)';
    btnForm.style.backgroundColor = '';
    itemInputTextForm.value = '';

    return false;
  }

  // pengecekan ke - 2 : memastikan proses event akibat kondisi edit mode atau bukan
  // jika mode edit aktif maka lakukan proses terhadap item di DOM dan localStorage terlebih dahulu kemudian baru tambahkan item ke localStorage dan DOM
  if (isEditMode === true) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    // kosongkan element dom dan data terkait di localStorage karena mau di isi data baru hasil edit
    // delete item yang di edit dari DOM karena menjadi element lama yang mau di hapus
    itemToEdit.classList.remove('edit-mode'); // hapus class edit mode dari item yang mau di edit
    itemToEdit.remove(); // hapus element edit karena menjadi element lama

    // delete item yang edit dari localStorage karena menjadi item lama yang mau di hapus
    removeItemFromStorage(itemToEdit.textContent);

    // reset element form
    btnForm.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item ;)';
    btnForm.style.backgroundColor = '';
    itemInputTextForm.value = '';

    // matikan mode edit
    isEditMode = false;
    console.log(`Edit Mode : ${isEditMode} - (in event click submit form)`);
  }

  // Proses Penambahan data
  // passing data to DOM and local storage
  const itemValue = newItem.trim();
  addItemToDOM(itemValue); // add data to UI/DOM
  addItemToStorage(itemValue); // add data to localStorage
  alert('Data berhasil di tambahkan / di update, data anda : ' + newItem);

  // cek ui
  checkUI();
  console.log('cek ui di submit form di eksekusi');

  // reset kolom input
  itemInputTextForm.value = '';
});

// event remove a item and u wanna edit item
itemList.addEventListener('click', (eventParam) => {
  // ensure target hit delete button
  // cek target yang di click memiliki sudah tepat di icon x / memiliki class "remove-item"
  if (eventParam.target.parentElement.classList.contains('remove-item')) {
    // konfirmasi untuk ui
    if (
      confirm(
        ` Item "${eventParam.target.parentElement.parentElement.textContent}" dipilih, yakin dihapus?`
      )
    ) {
      const itemValue =
        eventParam.target.parentElement.parentElement.textContent.trim();
      const itemElement = eventParam.target.parentElement.parentElement;

      // remove node / remove item from dom
      itemElement.remove();

      // remove itemValue from local storage
      removeItemFromStorage(itemValue);

      checkUI();
      console.log('cek ui di remove item di eksekusi');
    }
  } else if (eventParam.target.tagName === 'LI') {
    // ensure target select item / select li
    setEditToItem(eventParam.target);
  } else {
    console.log('Item yang anda klik bukan item');
  }
});

// event remove all item
btnClearAllItems.addEventListener('click', () => {
  if (confirm('Yakin Hapus Semua Item?')) {
    // cara hapus element untuk nodeList nya Live layaknya array
    // jadi saat di remove, maka element setelah nya akan mengisi indeks yang element kosong

    // remove all item from DOM
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }

    // remove all items from local storage
    localStorage.removeItem('items');
  } else {
    return false;
  }

  checkUI();
  console.log('cek ui di clear item di eksekusi di eksekusi');
});

// event filter item
itemFilter.addEventListener('input', (eventParam) => {
  // console.log(eventParam.target.value); //cek listener input
  const textInputFilter = eventParam.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li'); // snapshot li / item

  items.forEach((element) => {
    // console.log(element); //cek element li saat input text filter
    const itemValue = element.firstChild.textContent.trim().toLowerCase(); //firstChild li not care what type

    // validation : jika string itemValue tidak ada yang cocok dengan string textInputFilter maka hasil nya -1 sehingga akan tidak ditampilkan
    if (itemValue.indexOf(textInputFilter) > -1) {
      element.style.display = 'flex';
    } else {
      element.style.display = 'none';
    }
  });
});

// event load DOM Content When first start app
document.addEventListener('DOMContentLoaded', displayItems);

// checkUI pertama kali saat app dijalankan / belum ada event yang di eksekusi
checkUI();
console.log('Cek ui pertama kali app jalan di eksekusi');
