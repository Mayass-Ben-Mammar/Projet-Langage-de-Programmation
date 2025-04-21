/*
window.addEventListener('load', () => {
    anime({
      targets: '.Nav',
      translateY: [-100, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutExpo'
    });
})
*/
const menu = document.getElementById("Liens");

document.querySelector(".MenuB").addEventListener("click", () => {
  const isOpen = menu.classList.contains("open");

  anime({
    targets: menu,
    right: isOpen ? '-250px' : '0px',
    duration: 500,
    easing: 'easeInOutQuad'
  });

  menu.classList.toggle("open");
});



