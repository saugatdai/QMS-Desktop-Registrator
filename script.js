const macaddress = require('macaddress');
const crypto = require('crypto');
const fs = require('fs');
if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    main();
} else {
    document.addEventListener("DOMContentLoaded", main);
}

function main() {
    const registerButton = document.querySelector("#register");
    const recoverButton = document.querySelector("#recover");

    registerButton.addEventListener('click', registerButtonClicked);
    recoverButton.addEventListener('click', recoverButtonClicked);

}

function registerSerialToTheSystem(message) {
    // get the mac
    macaddress.one(async function (err, mac) {
        mac = mac.replace(/:/g, "~")
        const hash = crypto.createHash('md5').update(mac).digest("hex");
        fs.writeFileSync("license.lic", hash);
        displayMessage(message);
    });
}

function registerButtonClicked(event) {
    event.preventDefault();
    twoButtonsDisable(true);
    this.disabled = true;
    const form = document.querySelector('#form');

    const formData = new FormData(form);
    const [[serial, serialValue]] = [...formData];

    // get mac address

    macaddress.one(async function (err, mac) {
        const datas = {
            serial: serialValue.trim(),
            mac: [mac]
        };
        console.log(JSON.stringify(datas))
        // send the form data
        const response = await fetch('https://qms.saugatsigdel.com.np/registermac', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datas)
        });

        const data = await response.json();
        console.log(data);
        data.success ? registerSerialToTheSystem(data.success) : displayMessage(data.error);
    });
}

function recoverButtonClicked(event) {

    event.preventDefault();
    twoButtonsDisable(true);
    this.disabled = true;

    const form = document.querySelector('#form');

    const formData = new FormData(form);
    const [[serial, serialValue]] = [...formData];

    // get mac address

    macaddress.one(async function (err, mac) {
        const datas = {
            serial: serialValue.trim(),
            macs: [mac]
        };
        // send the form data
        const response = await fetch('https://qms.saugatsigdel.com.np/recoverlicense', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datas)
        });

        const data = await response.json();
        data.success ? registerSerialToTheSystem(data.success) : displayMessage(data.error);
    });


}

function displayMessage(message) {
    const messageBoard = document.querySelector("#message");
    messageBoard.textContent = message;
    messageBoard.classList.add("makeAppear");
    setTimeout(() => {
        messageBoard.classList.remove("makeAppear");
        twoButtonsDisable(false);
    }, 5000);
}

function twoButtonsDisable(status) {
    const registerButton = document.querySelector("#register");
    const recoverButton = document.querySelector("#recover");
    registerButton.disabled = status;
    recoverButton.disabled = status;
}