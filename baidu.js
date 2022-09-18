const $input = document.querySelector(".search-input");
const $button = document.querySelector(".search-button");
const $arrow = document.querySelector(".arrow");
const $sarcasm = document.querySelector(".sarcasm");
const clipboardObj = navigator.clipboard;

function getQuery() {
    let url = decodeURI(decodeURI(window.location.href));
    if (!url.match("\\?")) {
        return;
    }
    var str = url.split("?")[1];
    var keys = str.split("&");
    var obj = {};
    keys.forEach((item, idx, data) => {
        var arr = item.split("=");
        obj[arr[0]] = arr[1];
    });
    return obj;
}

function createUrl() {
    if (!$input.value) {
        return;
    }
    let value = window.location.href + "?wd=" + $input.value;
    console.log(encodeURI(value));
    cocoMessage.success("网址已复制到剪切板");
    clipboardObj.writeText(encodeURI(value));
}

function arrowMove() {
    // 点击输入框
    $sarcasm.innerHTML = "让我来帮你百度一下";
    sleep(500).then(() => {
        $sarcasm.innerHTML = "1.找到输入框并选中";
        $arrow.style.display = "block";
        $arrow.style.top = getPlace($input).top + 15 + "px";
        $arrow.style.left = getPlace($input).left + 15 + "px";
        sleep(1500).then(() => {
            $arrow.classList.add("active");
            $input.focus();
            sleep(1000).then(() => {
                $arrow.style.display = "none";
                $arrow.classList.remove("active");
                $sarcasm.innerHTML = "2.输入你的问题";
                input().then(() => {
                    $arrow.style.display = "block";
                    $arrow.style.top = getPlace($button).top + 15 + "px";
                    $arrow.style.left = getPlace($button).left + 20 + "px";
                    $sarcasm.innerHTML = "3.点击右边的按钮";
                    sleep(1500).then(() => {
                        $arrow.classList.add("active");
                        $sarcasm.innerHTML = "对你来说就这么难吗？";
                        sleep(1500).then(() => {
                            self.location.href = "https://www.baidu.com/s?wd=" + getQuery()["wd"];
                        });
                    });
                });
            });
        });
    });

    function input() {
        // 输入内容
        let temp = new Promise(function (resolve) {
            let timer = setInterval(function () {
                if ($input.value.length != getQuery()["wd"].length) {
                    $input.value = $input.value + getQuery()["wd"][$input.value.length]; //打印时加光标
                } else {
                    resolve();
                    clearInterval(timer);
                }
            }, 150);
        });
        return temp;
    }
}

function getPlace(el) {
    var Box = el.getBoundingClientRect(),
        doc = el.ownerDocument,
        body = doc.body,
        html = doc.documentElement,
        clientTop = html.clientTop || body.clientTop || 0,
        clientLeft = html.clientLeft || body.clientLeft || 0,
        top = Box.top + (self.pageYOffset || html.scrollTop || body.scrollTop) - clientTop,
        left = Box.left + (self.pageXOffset || html.scrollLeft || body.scrollLeft) - clientLeft;
    return { top: top, left: left };
}

function sleep(ms) {
    let temp = new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
    return temp;
}

window.onload = function () {
    let getContent = getQuery();
    if (getContent) {
        // 有内容
        $input.setAttribute("readonly", "readonly");
        arrowMove(getContent["wd"]);
    } else {
        // 无内容
        $button.addEventListener("click", createUrl);
        $input.addEventListener("keydown", function () {
            let event = window.event || arguments.callee.caller.arguments[0];
            if (event.keyCode == 13) {
                createUrl();
            }
        });
    }
};
