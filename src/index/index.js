/**
 * Created by plter on 2016/11/15.
 */

const wget = require("./wget");
const path = require("path");
const fs = require("fs");

(function () {

    let btnStartDownload = document.querySelector("#btn-start-download");
    let siteToDownload = document.querySelector("#site-to-download");
    let pathForSaving = document.querySelector("#path-for-saving");
    let statusDiv = document.querySelector("#status-div");
    let pageCount = 0;
    let pagesLoaded = [];
    let siteRoot;

    function showStatus(stateMsg) {
        statusDiv.innerHTML = stateMsg;
    }

    function addListeners() {
        btnStartDownload.onclick = function () {
            if (!siteToDownload.value) {
                alert("请输入要下载的网站");
                return;
            }
            if (!pathForSaving.value) {
                alert("请输入要保存文件的目标路径");
                return;
            }

            siteRoot = siteToDownload.value;
            startDownLoad();
        }
    }

    async function download(relativePath) {
        if (pagesLoaded.indexOf(relativePath) == -1) {
            pagesLoaded.push(relativePath);

            pageCount++;

            if (relativePath.charAt(0) == "/") {
                relativePath = relativePath.substr(1);
            }
            let url = `${siteRoot}/${relativePath}`;
            showStatus(`正在分析第${pageCount}个页面，当前页面${url}`);

            let data = await wget(url);

            if (!relativePath || relativePath.endsWith("/")) {
                relativePath += "index.html";
            } else if (relativePath.indexOf(".") == -1) {
                relativePath += "/index.html";
            }

            let localFilename = path.join(pathForSaving.value, relativePath);
            console.log(localFilename);
            let parentDir = path.dirname(localFilename);
            if (!fs.existsSync(parentDir)) {
                fs.mkdir(parentDir, () => {
                    fs.writeFile(localFilename, data);
                });
            }

            let p = /(?:href|src)=["'](.+?)["']/g;
            let result;
            while (result = p.exec(data)) {
                let link = result[1];

                if (!link.startsWith("http://")
                    && !link.startsWith("https://")
                    && link.indexOf("#") == -1) {
                    await download(link);
                }
            }
        }
    }

    async function startDownLoad() {
        pageCount = 0;
        pagesLoaded = [];
        await download("/");
    }

    function init() {
        addListeners();
    }

    init();
})();