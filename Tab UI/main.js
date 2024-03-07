//Làm như ri thì đỡ ghi document.querySelector nhiều lần
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tabs = $$(".tab-item");
const panes = $$(".tab-pane");

const tabActive = $(".tab-item.active");
const line = $(".tabs .line");
console.log(line);
//Mặc định line sẽ ở vị trí của tab active và có chiều dài bằng chiều dài của tab active
line.style.left = tabActive.offsetLeft + "px";
line.style.width = tabActive.offsetWidth + "px";


tabs.forEach((tab, index) => {
    const pane = panes[index];

    tab.onclick = function () {
        $(".tab-item.active").classList.remove("active");
        $(".tab-pane.active").classList.remove("active");
        line.style.left = this.offsetLeft + "px";
        line.style.width = this.offsetWidth + "px";
        this.classList.add("active");
        pane.classList.add("active");
    }
});
