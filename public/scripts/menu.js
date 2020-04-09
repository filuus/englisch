const slide_menu = document.querySelectorAll(".sidenav");
M.Sidenav.init(slide_menu, {});

const fichesButton = document.querySelector(".fiches-button");
const subMenu = document.querySelector(".bunches");
fichesButton.addEventListener("click", () => {
  console.log("test");
  subMenu.classList.toggle("disactive");
});

const path = window.location.pathname;
const activeElements = document.querySelectorAll(`a[href='${path}']`);
const disactiveElements = document.querySelectorAll(".active");
disactiveElements.forEach((element, index, array) => {
  element.classList.remove("active");
});
activeElements.forEach((element, index, array) => {
  element.parentElement.classList.add("active");
});

const fichesCategory = document.querySelectorAll(`.bunches > ul > li > a`);
fichesCategory.forEach((element, index, array) => {
  console.log(index);
  const progressBar = document.querySelector(`.progress-bar-${index + 1}`);
  fetch(`/fiches/${index + 1}/calcPercent`)
    .then(response => response.json())
    .then(response => {
      return (response.result * 100).toFixed(0) + "%";
    })
    .then(response => {
      progressBar.innerText = response;
      element.appendChild(progressBar);
    });
});
