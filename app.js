// ****** select items **********
const form=document.querySelector(".grocery_form");
const groceryList=document.querySelector(".grocery_list");
const container=document.querySelector(".grocery_container");
const grocery=document.getElementById("inpItem");//grocery
const submitBtn=document.getElementById("addItem");//submit_btn
const clearBtn=document.querySelector(".clearBtn");
const alert=document.querySelector(".alert");
//edit options
let doneFlag=false
let editElement;
let editFlag=false;
let editID="";

// ****** Event Listeners **********

// submit form
form.addEventListener("submit", addItem);
// clear list
clearBtn.addEventListener("click", clearItems);
// display items onload
window.addEventListener("DOMContentLoaded", setupItems);


// ****** Functions **********


function addItem(e)
{
    e.preventDefault();
    const value=[grocery.value,false];
    const id = new Date().getTime().toString();
    if(value[0]!="" && !editFlag)
    {
        const element=document.createElement("article");
        let attr=document.createAttribute("data-id");
        attr.value=id;
        let attrcheck=document.createAttribute("data-check");
        attrcheck.value=value[1];
        element.setAttributeNode(attr);
        element.setAttributeNode(attrcheck);
        element.classList.add("grocery_item");
        element.innerHTML=
        `<div class="button_tick">
        <button type="button" class="checkbox"><i class="far fa-square"></i></button>
        <h3 class="value">${grocery.value}</h3>
        </div>
        <div class="list_options">
          <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
          <button type="button" class="delete-btn"><i class="fas fa-trash-alt"></i></button>
        </div>`;


        // event listeners to  buttons;
        const checkBtn=element.querySelector(".checkbox");
        const editBtn=element.querySelector(".edit-btn");
        const deleteBtn=element.querySelector(".delete-btn");
        checkBtn.addEventListener("click",crossItem);
        editBtn.addEventListener("click",editItem);
        deleteBtn.addEventListener("click",deleteItem);

        //append the element to groceryList
        groceryList.appendChild(element);
        //display alert:item added
        displayAlert("item added to the list","success"); 
        //show container
        container.classList.add("show_container");
        
        
        //add to localStorage
        addToLocalStorage(id,value[0]); 
        //set back to default
        setBackToDefault();
    }
    //edit option is clicked
    else if(value[0]!==" " && editFlag)
    {
        editElement.innerHTML=value[0];
        displayAlert("item editted","success");
        editLocalStorage(editID, value[0]);
        setBackToDefault();
    }
    else{
        displayAlert("please enter value","danger");
    }
};

//displayAlert

function displayAlert(text,action)
{
    alert.textContent=text;
    alert.classList.add(`${action}`);
    //set time to stop alert display
    setTimeout(function(){
        alert.textContent="";
        alert.classList.remove(`${action}`);
    },1000);
}

//clear items

function clearItems()
{
    const items=document.querySelectorAll(".grocery_item");
    if(items.length>0)
    {
        items.forEach((item)=>{
            groceryList.removeChild(item);
        });
    }
    container.classList.remove("show_container");
    displayAlert("list is empty","danger");
    setBackToDefault();                                        
    localStorage.removeItem("list");                           
}


//edit item

function editItem(e)
{
    const element=e.currentTarget.parentElement.parentElement;
    editElement=e.currentTarget.parentElement.previousElementSibling.lastElementChild;
    grocery.value=editElement.innerHTML;
    editFlag=true;
    editID=element.dataset.id;
}

//delete item
function deleteItem(e)
{
    const element=e.currentTarget.parentElement.parentElement;
    const id=element.dataset.id;//remember
    groceryList.removeChild(element);
    if(groceryList.children.length===0)
    {
        container.classList.remove("show_container");         
        setBackToDefault();                                       
        removeFromLocalStorage(id);                                       
    }
    else
    {
        setBackToDefault();                                       
        removeFromLocalStorage(id);   
    }
}

//grocery check 

function crossItem(e)
{
    if(doneFlag==false)
    {
        const parentwithdatacheck=e.currentTarget.parentElement.parentElement;
        const element=e.currentTarget.parentElement.lastElementChild;
        element.classList.add("strike-through");
        const icon=e.currentTarget.querySelector("i");
        icon.classList.remove(`fa-square`);
        icon.classList.add(`fa-check-square`);
        doneFlag=true;
        const check=parentwithdatacheck.dataset.check;
        console.log(check);
        const id=parentwithdatacheck.dataset.id;//remember
        saveToLocalStorage(id,doneFlag);   
    }
    else
    {
        const parentwithdatacheck=e.currentTarget.parentElement.parentElement;
        const element=e.currentTarget.parentElement.lastElementChild;
        element.classList.remove("strike-through");
        const icon=e.currentTarget.querySelector("i");
        icon.classList.remove(`fa-check-square`);
        icon.classList.add(`fa-square`);

        doneFlag=false;
        var check=parentwithdatacheck.dataset.check;
        check="false";
        console.log(check);
        const id=parentwithdatacheck.dataset.id;//remember
        saveToLocalStorage(id,doneFlag);   
    }
}

// set back to defaults
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editID = "";
}

// ****** local storage **********
// add to local storage
function addToLocalStorage(id, value) {
    const grocery = { id, value };
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
  }
  
  function getLocalStorage() {
    return localStorage.getItem("list")
      ? JSON.parse(localStorage.getItem("list"))
      : [];
  }
  
  function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    console.log(items);
    items = items.filter(function (item) {
      if (item.id !== id) {
        return item;
      }
    });
  
    localStorage.setItem("list", JSON.stringify(items));
  }
function editLocalStorage(id, value) {
    let items = getLocalStorage();
  
    items = items.map(function (item) {
      if (item.id === id) {
        item.value = value[0];
      }
      return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}
function removeItem(list)
{
    localStorage.removeItem(list);
}

function saveToLocalStorage(id,check)
{
    let items=getLocalStorage();
    items=items.filter((item)=>{
       if(item.id==id && check==true)
        {
            item.value[1]=check;  
        }
        return item;
    });
    localStorage.setItem("list",JSON.stringify(items));
}

  // ****** setup items on reload **********
  

function setupItems() {
      let items=getLocalStorage();
        items.forEach((item)=>{
        const element = document.createElement("article");
        let attr = document.createAttribute("data-id");
        const value=item.value[0];
        attr.value= item.id;
        element.setAttributeNode(attr);
        let attrcheck=document.createAttribute("data-check");
        attrcheck.value=item.value[1];
        element.setAttributeNode(attrcheck);
        element.classList.add("grocery_item");


        if(attrcheck.value=="true")
        {
            element.innerHTML=
            `<div class="button_tick">
            <button type="button" class="checkbox"><i class="far fa-check-square"></i></button>
            <h3 class="value">${value}</h3>
            </div>
            <div class="list_options">
              <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
              <button type="button" class="delete-btn"><i class="fas fa-trash-alt"></i></button>
            </div>`;
                // add event listeners to both buttons;
                const checkBtn=element.querySelector(".checkbox");
                const editBtn=element.querySelector(".edit-btn");
                const deleteBtn=element.querySelector(".delete-btn");
                checkBtn.addEventListener("click",crossItem);
                editBtn.addEventListener("click",editItem);
                deleteBtn.addEventListener("click",deleteItem);
            groceryList.appendChild(element);
            element.querySelector(".button_tick").lastElementChild.classList.add("strike-through");
        }
        else if(attrcheck.value=="false"){
            element.innerHTML=
            `<div class="button_tick">
            <button type="button" class="checkbox"><i class="far fa-square"></i></button>
            <h3 class="value">${value}</h3>
            </div>
            <div class="list_options">
              <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
              <button type="button" class="delete-btn"><i class="fas fa-trash-alt"></i></button>
            </div>`;
                // add event listeners to both buttons;
                const checkBtn=element.querySelector(".checkbox");
                const editBtn=element.querySelector(".edit-btn");
                const deleteBtn=element.querySelector(".delete-btn");
                checkBtn.addEventListener("click",crossItem);
                editBtn.addEventListener("click",editItem);
                deleteBtn.addEventListener("click",deleteItem);
            groceryList.appendChild(element);
            element.querySelector(".button_tick").lastElementChild.classList.remove("strike-through");
        }     
        });
      container.classList.add("show_container");
}
  



