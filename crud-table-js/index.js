const myBooks = [{
  ID: '1',
  Name: 'Alex',
  Phone: '(123) 456-7890',
},
{
  ID: '2',
  Name: 'Mikey',
  Phone: '+31636363634',
},
{
  ID: '3',
  Name: 'Ann',
  Phone: '123-456-7890',
},
{
  ID: '4',
  Name: 'David',
  Phone: '075-63546725',
},
];
const col = Object.keys(myBooks[0]);
const error = document.getElementsByClassName('error')[0];

const createTable = () => {
  const table = document.createElement('table');
  table.setAttribute('id', 'booksTable');

  let tr = table.insertRow(-1);

  for (let h = 0; h < col.length; h += 1) {
    const th = document.createElement('th');
    th.innerHTML = col[h].replace('_', ' ');
    tr.appendChild(th);
  }

  for (let i = 0; i < myBooks.length; i += 1) {
    tr = table.insertRow(-1);

    for (let j = 0; j < col.length; j += 1) {
      const tabCell = tr.insertCell(-1);
      tabCell.innerHTML = myBooks[i][col[j]];
    }

    const cancelSaveUpdateBtn = document.createElement('td');

    // CANCEL
    tr.appendChild(cancelSaveUpdateBtn);
    const lblCancel = document.createElement('label');
    lblCancel.innerHTML = '✖';
    lblCancel.setAttribute('onclick', 'Cancel(this)');
    lblCancel.setAttribute('style', 'display:none;');
    lblCancel.setAttribute('title', 'Cancel');
    lblCancel.setAttribute('id', `lbl${i}`);
    cancelSaveUpdateBtn.appendChild(lblCancel);

    // SAVE.
    tr.appendChild(cancelSaveUpdateBtn);
    const btSave = document.createElement('input');

    btSave.setAttribute('type', 'button');
    btSave.setAttribute('value', 'Save');
    btSave.setAttribute('id', `save-btn${i}`);
    btSave.setAttribute('style', 'display:none;');
    btSave.setAttribute('onclick', 'Save(this)');
    cancelSaveUpdateBtn.appendChild(btSave);

    // UPDATE.
    tr.appendChild(cancelSaveUpdateBtn);
    const btUpdate = document.createElement('input');

    btUpdate.setAttribute('type', 'button');
    btUpdate.setAttribute('value', 'Update');
    btUpdate.setAttribute('id', `edit-btn${i}`);
    btUpdate.setAttribute('style', 'background-color:#55CCEB;');
    btUpdate.setAttribute('onclick', 'Update(this)');
    cancelSaveUpdateBtn.appendChild(btUpdate);

    // DELETE.
    const deleteBtn = document.createElement('th');
    tr.appendChild(deleteBtn);
    const btDelete = document.createElement('input');
    btDelete.setAttribute('type', 'button');
    btDelete.setAttribute('value', 'Delete');
    btDelete.setAttribute('id', `delete-btn${i}`);
    btDelete.setAttribute('style', 'background-color:#ED5650;');
    btDelete.setAttribute('onclick', 'Delete(this)');
    deleteBtn.appendChild(btDelete);
  }

  tr = table.insertRow(-1);

  for (let j = 0; j < col.length; j += 1) {
    const newCell = tr.insertCell(-1);
    if (j >= 1) {
      const tBox = document.createElement('input');
      tBox.setAttribute('type', 'text');
      tBox.setAttribute('value', '');
      newCell.appendChild(tBox);
    }
  }

  const createBtn = document.createElement('td');
  tr.appendChild(createBtn);

  const btNew = document.createElement('input');

  btNew.setAttribute('type', 'button');
  btNew.setAttribute('value', 'Create');
  btNew.setAttribute('id', 'create-btn');

  btNew.setAttribute('style', 'background-color:#207DD1;');
  btNew.setAttribute('onclick', 'CreateNew(this)');
  createBtn.appendChild(btNew);

  const main = document.getElementById('main');
  main.innerHTML = '';
  main.appendChild(table);
};

createTable();

const Cancel = (oButton) => {
  error.style = 'display: none;';
  oButton.setAttribute('style', 'display:none; float:none;');

  const activeRow = oButton.parentNode.parentNode.rowIndex;

  const btSave = document.getElementById(`save-btn${activeRow - 1}`);
  btSave.setAttribute('style', 'display:none;');

  const btUpdate = document.getElementById(`edit-btn${activeRow - 1}`);
  btUpdate.setAttribute('style', 'display:block; margin:0 auto; background-color:#44CCEB;');

  const tab = document.getElementById('booksTable').rows[activeRow];

  for (let i = 0; i < col.length; i += 1) {
    const td = tab.getElementsByTagName('td')[i];
    td.innerHTML = myBooks[(activeRow - 1)][col[i]];
  }
};

const Update = (oButton) => {
  error.style = 'display: none;';
  const activeRow = oButton.parentNode.parentNode.rowIndex;
  const tab = document.getElementById('booksTable').rows[activeRow];

  for (let i = 1; i < 3; i += 1) {
    const td = tab.getElementsByTagName('td')[i];
    const ele = document.createElement('input');
    ele.setAttribute('type', 'text');
    ele.setAttribute('value', td.innerText);
    td.innerText = '';
    td.appendChild(ele);
  }

  const lblCancel = document.getElementById(`lbl${activeRow - 1}`);
  lblCancel.setAttribute('style', 'cursor:pointer; display:block; width:20px; float:left; position: absolute;');

  const btSave = document.getElementById(`save-btn${activeRow - 1}`);
  btSave.setAttribute('style', 'display:block; margin-left:30px; float:left; background-color:#2DBF64;');

  oButton.setAttribute('style', 'display:none;');
};


const Delete = (oButton) => {
  error.style = 'display: none;';
  const activeRow = oButton.parentNode.parentNode.rowIndex;
  myBooks.splice((activeRow - 1), 1);
  createTable();
};

const checkName = (name) => {
  if (name !== '') {
    return true;
  }

  error.innerText = 'Please enter a name.';
  error.style = 'display: block;';
  return false;
};

const checkPhone = (phone) => {
  const regV = /^[\+]?[(]?[0-9]{3}[)]?[-\s\]?[0-9]{3}[-\s\]?[0-9]{4,6}$/im;
  if (phone.match(regV)) {
    return true;
  }
  error.innerText = 'Enter the phone number in the specified format.';
  error.style = 'display: block;';
  return false;
};

const Save = (oButton) => {
  error.style = 'display: none;';
  const activeRow = oButton.parentNode.parentNode.rowIndex;
  const tab = document.getElementById('booksTable').rows[activeRow];

  const name = tab.getElementsByTagName('td')[1];
  const phone = tab.getElementsByTagName('td')[2];

  const nameVal = name.childNodes[0].value.trim();
  const phoneVal = phone.childNodes[0].value.trim();

  /*
    Отправляем fetch запрос методом POST на backend
  */
  if (checkName(nameVal) && checkPhone(phoneVal)) {
    myBooks[(activeRow - 1)][col[1]] = nameVal;
    myBooks[(activeRow - 1)][col[2]] = phoneVal;
    createTable();
  }
};

const CreateNew = (oButton) => {
  error.style = 'display: none;';
  const activeRow = oButton.parentNode.parentNode.rowIndex;
  const tab = document.getElementById('booksTable').rows[activeRow];
  const obj = {};

  const name = tab.getElementsByTagName('td')[1];
  const phone = tab.getElementsByTagName('td')[2];

  const nameVal = name.childNodes[0].value.trim();
  const phoneVal = phone.childNodes[0].value.trim();
  /*
    Отправляем fetch запрос методом POST на backend
  */
  if (checkName(nameVal) && checkPhone(phoneVal)) {
    obj[col[0]] = myBooks.length + 1;
    obj[col[1]] = nameVal;
    obj[col[2]] = phoneVal;
    myBooks.push(obj);
    createTable();
  }
};
/*
  После нажатия на кнопку create или save мы забираем данные из input-ов
  и можем обработать их у клиента или отправить fetch запрос методом POST на backend
  и на сервере записать данные в базу. Если у нас есть сессия, то можем сохранить
  данные у клиента, а запрос делать перед закрытием сессии (выходом).
*/
