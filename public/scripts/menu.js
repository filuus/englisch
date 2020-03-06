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
