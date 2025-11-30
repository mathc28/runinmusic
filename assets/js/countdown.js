const targetDate = new Date("2027-04-01T09:00:00");

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById("countdown").textContent = "C’est parti !";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("cd-days").textContent = days;
  document.getElementById("cd-hours").textContent = hours;
  document.getElementById("cd-minutes").textContent = minutes;
  document.getElementById("cd-seconds").textContent = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();
