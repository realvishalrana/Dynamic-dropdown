let data = [];
let uniqueIdArray = [];
const dynamicForm = document.getElementById("dynamicForm");
const emptyError = document.getElementById("emptyError");
const uniqueIdError = document.getElementById("uniqueIdError");
const mainDiv = document.getElementById("dataRecordContainer");
init();

function getData() {
  const data = {};
  const uniqueId = document.getElementById("uniqueId").value;
  const typeofInput = document.getElementById("inputType").value;
  data.uniqueId = uniqueId;
  data.inputType = typeofInput;
  return data;
}

function validateId(id) {
  let isError = false;

  if (uniqueIdArray.includes(id)) {
    console.log(uniqueIdError);
    emptyError.textContent = "Id is already present";
    emptyError.style.opacity = 1;
    isError = true;
  } else if (id === "") {
    emptyError.textContent = "Enter the id";
    emptyError.style.opacity = 1;
    isError = true;
  } else {
    emptyError.textContent = "";
    emptyError.style.opacity = 0;
  }

  return isError;
}

function storeAndDisplayData(objectData) {
  data.push(objectData);
  uniqueIdArray.push(objectData.uniqueId);
  localStorage.setItem("dynamicData", JSON.stringify(data));
  displayData();
}

function displayData() {
  mainDiv.innerHTML = "";
  data.forEach((object, index) => {
    const container = document.createElement("div");
    container.setAttribute("class", "display-container");
    container.setAttribute("id", index);
    let str;

    if (object.inputType === "range") {
      str = ` <div>
            <div>${object.uniqueId}</div>
            </div>
            </div>
            <div class="range-wrap">
            <input type="${object.inputType}"  id="${index}" class="range" 
            value="${object.value ? object.value : "0"}"
            >
            <output class="displayRange"></output>
           </div>
            `;
    } else if (object.inputType === "submit") {
      str = ` <div>
            <div>${object.uniqueId}</div>
            </div>
            <div>
            <input type="${object.inputType}"
                id="${index}" value="submit" placeholder="${object.inputType}" 
                required></input>
            
            </div>`;
    } else {
      str = `
    <div>
    <div>${object.uniqueId}</div>
    </div>
    <div>
    <input type="${object.inputType}"
        id="${index}" value="${
        object.value ? object.value : ""
      }" placeholder="${object.inputType}" required></input>
    </div>`;
    }

    str += `<div>
    <input type="button" onclick="toast(); saveBtn(${index})" value="save" />
    <div id="toastMessage">Value is saved</div>
    </div>
    <div>
    <input type="button" onclick="deleteBtn(${index})" value="remove" />
    </div>
    `;
    container.innerHTML += str;
    mainDiv.appendChild(container);
  });
}

function toast() {
  let x = document.getElementById("toastMessage");
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}

const allRanges = document.querySelectorAll(".range-wrap");
allRanges.forEach((wrap) => {
  const range = wrap.querySelector(".range");
  const displayRange = wrap.querySelector(".displayRange");
  displayRange.innerHTML = range.value;
  range.addEventListener("input", () => {
    setRangeValue(range, displayRange);
  });
});

function setRangeValue(range, displayRange) {
  const RangeValue = range.value;
  displayRange.innerHTML = RangeValue;
  console.log("line 122", RangeValue);
}

function saveBtn(index) {
  const updateInput = document.querySelector("input[id='" + index + "']");
  data[index].value = updateInput.value;
  localStorage.setItem("dynamicData", JSON.stringify(data));
  updateInput.value = updateInput.value;
}

function deleteBtn(index) {
  data.splice(index, 1);
  uniqueIdArray.splice(index, 1);
  localStorage.setItem("dynamicData", JSON.stringify(data));
  displayData();
}

function refresh() {
  dynamicForm.reset();
  localStorage.removeItem("dynamicData");
  data = [];
  uniqueIdArray = [];
  mainDiv.innerHTML = "";
}

const add = document.getElementById("add");
add.addEventListener("click", function (event) {
  event.preventDefault();
  const allData = getData();
  if (!validateId(allData.uniqueId)) {
    storeAndDisplayData(allData);
    dynamicForm.reset();
  }
  // emptyError.style.height = "30px";
});

function init() {
  data = localStorage.getItem("dynamicData")
    ? JSON.parse(localStorage.getItem("dynamicData"))
    : [];
  data.forEach((item) => {
    uniqueIdArray.push(item.uniqueId);
  });
  displayData();
}
