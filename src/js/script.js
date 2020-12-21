window.$ = window.jQuery = require('jquery');
const {ipcRenderer} = require("electron");
$(document).keydown(function (event) {
    if (event.which == "17")
        cntrlIsPressed = true;
});

$(document).keyup(function () {
    cntrlIsPressed = false;
});

var cntrlIsPressed = false;
var editor = ace.edit("finalResult");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/json");
editor.setReadOnly(true);
editor.setShowPrintMargin(false);

var unirest = require("unirest");

var totalQuery = 0;
var totalHeader = 0;

function makeRequest() {

    console.log(totalQuery, totalHeader);

    var urlInput = document.getElementById('urlInput').value;
    var getOrPost = document.getElementById('getOrPost').value.toUpperCase();

    if (totalQuery > 0) urlInput += "?";

    /* Query */
    for (let i = 0; i < totalQuery; i++) {
        var key = document.querySelector('#queryKey' + i).value;
        var value = document.querySelector('#queryValue' + i).value;
        key += "=";

        let input = key + value;

        if (i != totalQuery - 1) input += '&';
        urlInput += input; // value+key
    }

    var req = unirest(getOrPost, urlInput);

    /* Headers */
    for (let i = 0; i < totalHeader; i++) {
        console.log("Work");
        var key = document.querySelector('#headerKey' + i).value;
        var value = document.querySelector('#headerValue' + i).value;
        console.log('#headerKey' + i);
        req.headers(key, value);
        console.log(key + " : " + value);
    }

    req.end(function (res) {
        if (res.error) throw new Error(res.error);

        let jsonText = JSON.stringify(res.body, null, '\t')
        editor.setValue(jsonText);
    });

}

function addQuery() {
    const divContainer = document.querySelector('#allQueryInput');
    if (cntrlIsPressed) {
        divContainer.removeChild(divContainer.lastChild);
        totalQuery--;
        return;
    }
    var mainDiv = document.createElement("div");
    mainDiv.className = "key_value";

    var keyInput = document.createElement("input");
    keyInput.type = "text";
    keyInput.name = "queryKey" + totalQuery;
    keyInput.id = "queryKey" + totalQuery;
    keyInput.className = "add-input addKey addQuery-input";
    keyInput.placeholder = "Key";

    var valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.name = "queryValue" + totalQuery;
    valueInput.id = "queryValue" + totalQuery;
    valueInput.className = "add-input addValue addQuery-input";
    valueInput.placeholder = "Value";

    mainDiv.appendChild(keyInput);
    mainDiv.appendChild(valueInput);

    divContainer.appendChild(mainDiv);
    totalQuery++;
}

function addHeader() {
    const divContainer = document.querySelector('#allHeadersInputs');
    if (cntrlIsPressed) {
        divContainer.removeChild(divContainer.lastChild);
        totalHeader--;
        return;
    }
    var mainDiv = document.createElement("div");
    mainDiv.className = "key_value";

    var keyInput = document.createElement("input");
    keyInput.type = "text";
    keyInput.name = "headerKey" + totalHeader;
    keyInput.id = "headerKey" + totalHeader;
    keyInput.className = "add-input addKey addheader-input";
    keyInput.placeholder = "Key";

    var valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.name = "headerValue" + totalHeader;
    valueInput.id = "headerValue" + totalHeader;
    valueInput.className = "add-input addValue addheader-input";
    valueInput.placeholder = "Value";

    mainDiv.appendChild(keyInput);
    mainDiv.appendChild(valueInput);

    divContainer.appendChild(mainDiv);
    totalHeader++;
}

function menuBtnClick(button) {
    button.animate([{transform: "rotate(0deg)"}, {transform: "rotate(360deg)"}], {duration: 350});
}

require('sweetalert');

function copyResult() {
    menuBtnClick(document.querySelector("#copyMB i"));
    navigator.clipboard.writeText(editor.getValue());

    swal("", "Result Copied!", "success");
}

function eraseAll() {
    menuBtnClick(document.querySelector("#eraseMB i"));
    document.querySelector("#urlInput").value = "";
    /* Removing Query */
    const queryContainer = document.querySelector('#allQueryInput');
    while (queryContainer.firstChild) {
        queryContainer.removeChild(queryContainer.lastChild);
    }
    /* Removing Headers */
    const headerContainer = document.querySelector('#allHeadersInputs');
    while (headerContainer.firstChild) {
        headerContainer.removeChild(headerContainer.lastChild);
    }

    editor.setValue(
        "{\n" +
        "\t\"message\" : \"Try it! Make a request 😜!\"\n" +
        "}"
    );
    swal("", "Back to 0", "success");
}

function reloadApp() {
    menuBtnClick(document.querySelector("#reloadMB i"));
    setTimeout(() => {
        ipcRenderer.send('reload');
    }, 350);

}

var menuOn = false;

function onMenuToggle() {
    menuOn = document.querySelector("#toggle").checked;
    if (menuOn) {
        window.addEventListener('click', onMouseOn, true);
    } else {
        window.removeEventListener('click', onMouseOn, true);
    }
}

function onMouseOn(e) {
    if (!document.querySelector(".mainMenu").contains(e.target))
        document.querySelector("#toggle").checked = false;
}