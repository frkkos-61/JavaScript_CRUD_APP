//! Düzenleme Modu Değişkenleri
let editMode = false; //* Düzenleme modunu belirleyecek değişken
let editItem; //* Düzenleme elemanını belirleyecek değişken
let editItemId; //* Düzenleme elemanının id' si

//! HTML' den elemanları çağır.

const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearButton = document.querySelector(".clear-btn");

//console.log(form, input);

//!!!!!!! FONKSİYONLAR
//* Form gönderildiğinde çalışacak fonksiyon
const addItem = (e) => {
  //* Sayfanın yenilenmesini iptal ettik
  e.preventDefault();
  const value = input.value;
  if (value !== "" && !editMode) {
    //* Silme işlemleri için benzersiz değere ihtiyacımız var.Bunun için id oluşturduk
    const id = new Date().getTime().toString();
    createElement(id, value);
    setToDefault();
    showAlert("Eleman Eklendi", "success");
    addToLocalStorage(id, value);
  } else if (value !== "" && editMode) {
    editItem.innerHTML = value;
    updateLocalStorage(editItem, value);
    showAlert("Eleman Güncellendi", "success");
    setToDefault();
  }
};

//! Uyarı veren fonksiyon:
const showAlert = (text, action) => {
  //*Alert kısmının içeriğni belirler
  alert.textContent = ` ${text} `;

  //* Alert kısmına class ekle
  alert.classList.add(`alert-${action}`);

  //* Alert kısmının içeriğini güncelle ve eklenen classı bir süre sonra ekrandan kaldır.
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};

//! Elemanları silen fonksiyon
const deleteItem = (e) => {
  //* Silmek istenen elemana eriş, kapsayıcısına eriş.
  const element = e.target.parentElement.parentElement.parentElement;
  const id = element.dataset.id;
  //* Bu elemanı kaldır.
  itemList.removeChild(element);
  removeFromLocalStorage(id);
  showAlert("Eleman Silindi", "danger");
  console.log(itemList);
  //* Eğerki hiç eleman yoksa sıfırlama butonunu kaldır.
  if (!itemList.childiren.length) {
    clearButton.style.display = "none";
  }
};

//! Elemanları güncelleyecek fonksiyon
const editItems = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editItem = e.target.parentElement.parentElement.previousElementSibling;
  input.value = editItem.innerText;
  editMode = true;
  editItemId = element.dataset.id;
  addButton.textContent = "Düzenle";
};

//! Varsayılan değerlere döndenen fonksiyon
const setToDefault = () => {
  input.value = "";
  editMode = false;
  editItemId = "";
  addButton.textContent = "Ekle";
};

//! Sayfa yüklendiğinde elemanları render edecek fonksiyon
const renderItems = () => {
  let items = getFromLocalStorage();
  //console.log(items);
  if (items.length > 0) {
    items.forEach((item) => createElement(item.id, item.value));
  }
};

//!! Eleman oluşturan fonksiyon

const createElement = (id, value) => {
  //* Yeni bir div oluştur
  const newDiv = document.createElement("div");

  //* Bu div' e attribute ekle
  newDiv.setAttribute("data-id", id); //! setAttribute ile (data-id zorunlu değil) bir elemana attrübute ekleyebiliriz. Bu özellik bizden eklenecek özelliğin adını ve bu özelliğin değerini ister.

  //* Bu div' e class ekle
  newDiv.classList.add("items-list-item");

  //* Bu div' in Html içeriğini belirle
  newDiv.innerHTML = `
            <p class="item-name"> ${value} </p>
           <div class="btn-container">
            <button class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
           </div>
    `;
  //* Delete butonuna eriş
  const deleteBtn = newDiv.querySelector(".delete-btn");

  //console.log(deleteBtn);
  deleteBtn.addEventListener("click", deleteItem);

  //*Edit butonuna eriş
  const editBtn = newDiv.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItems);

  itemList.appendChild(newDiv);
  showAlert("Eleman Eklendi", "success");
};
//! Sıfırlama yapan fonksiyon
const clearItems = () => {
  const items = document.querySelectorAll(".items-list-item");
  if (items.length > 0) {
    items.forEach((item) => {
      itemList.removeChild(item);
    });
    clearButton.style.display="none";
    showAlert("Liste Boş","danger");
    //*Localstorage' o temizle
    localStorage.removeItem("items");
  }
};

//! Localstorage' e kayıt yapan fonskiyonn
const addToLocalStorage = (id, value) => {
  const item = { id, value };
  let items = getFromLocalStorage();
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
};

//! Localstorage' den veri alan fonskiyon
const getFromLocalStorage = () => {
  return localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
};
//! Localstorage' daki verileri kaldıran fonskiyon
const removeFromLocalStorage = (id) => {
  let items = getFromLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("items", JSON.stringify(items));
};

//! localstorage'ı güncelleyen fonksiyomn
const updateLocalStorage = (id, newValue) => {
  let items = getFromLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      //* Spread Operatör: Bu özellik bir elemanı güncellerken veri kaybını önlemek için kullanılır.Burada biz obje içerisinde yer alan value yu güncelledik.Ama bunu yaparken id değerini kaybetmemek için Spread Operatörü kullandık
      return { ...item, value: newValue };
    }
    return item;
  });
  localStorage.setItem("items", JSON.stringify(items));
};

//! Olay izleyicileri
//* Formun gönderildiği anı yakala
form.addEventListener("submit", addItem);
//* Sayfanın yüklendiği anı yakala
window.addEventListener("DOMContentLoaded", renderItems);
//* Clear Button' a tıklanınca elemanları sıfırlama
clearButton.addEventListener("click", clearItems);
