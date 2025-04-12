document
  .getElementById("find-options")
  .addEventListener("change", checkOptions);

/* Dropdown toggle */
function checkOptions() {
  let dropdown = document.getElementById("find-options");
  let selectedValue = dropdown.value;

  let sections = {
    "days-between": document.getElementsByClassName("days-between")[0],
    "visa-left": document.getElementsByClassName("visa-left")[0],
    "data-left": document.getElementsByClassName("data-left")[0],
    "medication-left": document.getElementsByClassName("medication-left")[0],
  };

  Object.values(sections).forEach(
    (section) => (section.style.display = "none")
  );

  if (sections[selectedValue]) {
    sections[selectedValue].style.display = "block";
  }
}

/* Function to format date */
function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* Function to display add to google calendar link, only on desktop */
document.addEventListener("DOMContentLoaded", function () {
  const calendarLinks = document.getElementsByClassName("google-calendar-link");

  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  for (let i = 0; i < calendarLinks.length; i++) {
    if (isMobileDevice()) {
      calendarLinks[i].style.display = "none";
    } else {
      calendarLinks[i].style.display = "block";
    }
  }
});

/* Days betwwen check-in and out */

let checkInDate;
let checkOutDate;
let daysBetweenDifferenceInTime;
let daysBetweenNumberOfDays;
let daysBetweenNumberOfNights;

document.getElementById("days-between-go").onclick = function () {
  checkInDate = new Date(document.getElementById("check-in-date").value);
  checkOutDate = new Date(document.getElementById("check-out-date").value);

  if (
    checkInDate == "Invalid Date" ||
    checkOutDate == "Invalid Date" ||
    checkInDate > checkOutDate
  ) {
    document.getElementById("days-between-number-of-days").innerHTML =
      "Invalid";
    document.getElementById("days-between-number-of-nights").innerHTML =
      "Invalid";
    document.getElementsByClassName(
      "days-between-result-wrapper"
    )[0].style.display = "block";
  } else {
    daysBetweenDifferenceInTime =
      checkOutDate.getTime() - checkInDate.getTime();
    daysBetweenNumberOfDays =
      Math.floor(daysBetweenDifferenceInTime / (1000 * 3600 * 24)) + 1;
    daysBetweenNumberOfNights = Math.floor(
      daysBetweenDifferenceInTime / (1000 * 3600 * 24)
    );

    document.getElementById("days-between-number-of-days").innerHTML =
      daysBetweenNumberOfDays;
    document.getElementById("days-between-number-of-nights").innerHTML =
      daysBetweenNumberOfNights;
    document.getElementsByClassName(
      "days-between-result-wrapper"
    )[0].style.display = "block";
  }
};

/* Generate google calendar link */
function formatDateForGoogleCalendar(date) {
  return (
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2)
  );
}

function generateGoogleCalendarLink(eventTitle, eventDate) {
  let baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  let formattedDate = formatDateForGoogleCalendar(eventDate);

  let calendarUrl = `${baseUrl}&text=${encodeURIComponent(
    eventTitle
  )}&dates=${formattedDate}/${formattedDate}`;

  return calendarUrl;
}

/* Visa left */

let visaArrivalDate;
let visaValidity;
let visaDifferenceInTime;
let visaDaysElapsed;
let visaDaysLeft;
let visaLastStay;
let visaLastStayDateOnly;

document.getElementById("visa-left-go").onclick = function () {
  visaArrivalDate = new Date(
    document.getElementById("visa-arrival-date").value
  );
  visaValidity = Number(document.getElementById("visa-validity").value);
  visaDifferenceInTime = new Date().getTime() - visaArrivalDate.getTime();
  visaDaysElapsed = Math.floor(visaDifferenceInTime / (1000 * 3600 * 24));
  visaDaysLeft = visaValidity - visaDaysElapsed;

  if (visaValidity <= 0 || visaArrivalDate == "Invalid Date") {
    document.getElementsByClassName(
      "visa-left-result-wrapper"
    )[0].style.display = "block";
    document.getElementsByClassName("google-calendar-link")[0].style.display =
      "none";
    document.getElementById("visa-days-left").innerHTML = "Invalid";
    document.getElementById("visa-last-stay-date").innerHTML = "Invalid";
  } else {
    visaLastStay = new Date(
      visaArrivalDate.setDate(visaArrivalDate.getDate() + visaValidity - 1)
    );
    visaLastStayDateOnly = formatDate(visaLastStay);

    if (visaDaysLeft > visaValidity) {
      visaDaysLeft = visaValidity;
    } else if (
      visaLastStay.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
    ) {
      visaDaysLeft = 0;
    }

    document.getElementById("visa-days-left").innerHTML = visaDaysLeft;
    document.getElementById("visa-last-stay-date").innerHTML =
      visaLastStayDateOnly;
    document.getElementsByClassName(
      "visa-left-result-wrapper"
    )[0].style.display = "block";
    let visaCalendarLink = generateGoogleCalendarLink(
      "Visa last stay date",
      visaLastStay
    );
    document.getElementById("visa-calendar-link").href = visaCalendarLink;
  }
};

/* Data left */

let dataStartDate;
let dataValidity;
let dataDifferenceInTime;
let dataDaysElapsed;
let dataDaysLeft;
let dataLastUsage;
let dataLastUsageDateOnly;

document.getElementById("data-left-go").onclick = function () {
  dataStartDate = new Date(document.getElementById("data-start-date").value);
  dataValidity = Number(document.getElementById("data-validity").value);
  dataDifferenceInTime = new Date().getTime() - dataStartDate.getTime();
  dataDaysElapsed = Math.floor(dataDifferenceInTime / (1000 * 3600 * 24));
  dataDaysLeft = dataValidity - dataDaysElapsed;

  if (dataValidity <= 0 || dataStartDate == "Invalid Date") {
    document.getElementsByClassName(
      "data-left-result-wrapper"
    )[0].style.display = "block";
    document.getElementsByClassName("google-calendar-link")[1].style.display =
      "none";
    document.getElementById("data-days-left").innerHTML = "Invalid";
    document.getElementById("data-last-usage-date").innerHTML = "Invalid";
  } else {
    dataLastUsage = new Date(
      dataStartDate.setDate(dataStartDate.getDate() + dataValidity - 1)
    );
    dataLastUsageDateOnly = formatDate(dataLastUsage);

    if (dataDaysLeft > dataValidity) {
      dataDaysLeft = dataValidity;
    } else if (
      dataLastUsage.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
    ) {
      dataDaysLeft = 0;
    }
    document.getElementById("data-days-left").innerHTML = dataDaysLeft;
    document.getElementById("data-last-usage-date").innerHTML =
      dataLastUsageDateOnly;
    document.getElementsByClassName(
      "data-left-result-wrapper"
    )[0].style.display = "block";
    let dataCalendarLink = generateGoogleCalendarLink(
      "eSIM last use date",
      dataLastUsage
    );
    document.getElementById("data-calendar-link").href = dataCalendarLink;
  }
};

/* Medication left */

let medicationFirstPillDate;
let medicationPillsPerDay;
let medicationTotalSupply;
let medicationNumberOfDays;
let medicationDifferenceInTime;
let medicationDaysElapsed;
let medicationPillsLeft;
let medicationDaysLeft;
let medicationLastPill;
let medicationLastPillDateOnly;

document.getElementById("medication-left-go").onclick = function () {
  medicationFirstPillDate = new Date(
    document.getElementById("first-pill-date").value
  );
  medicationPillsPerDay = Number(
    document.getElementById("pills-per-day").value
  );
  medicationTotalSupply = Number(
    document.getElementById("total-medication-supply").value
  );
  medicationNumberOfDays = medicationTotalSupply / medicationPillsPerDay;
  medicationDifferenceInTime =
    new Date().getTime() - medicationFirstPillDate.getTime();
  medicationDaysElapsed = Math.floor(
    medicationDifferenceInTime / (1000 * 3600 * 24)
  );
  medicationDaysLeft = medicationNumberOfDays - medicationDaysElapsed;
  medicationPillsLeft = medicationDaysLeft * medicationPillsPerDay;

  if (
    medicationPillsPerDay <= 0 ||
    medicationTotalSupply <= 0 ||
    medicationFirstPillDate == "Invalid Date"
  ) {
    document.getElementsByClassName(
      "medication-left-result-wrapper"
    )[0].style.display = "block";
    document.getElementsByClassName("google-calendar-link")[2].style.display =
      "none";
    document.getElementById("medication-pills-left").innerHTML = "Invalid";
    document.getElementById("medication-days-left").innerHTML = "Invalid";
    document.getElementById("medication-last-pill-date").innerHTML = "Invalid";
  } else {
    medicationLastPill = new Date(
      medicationFirstPillDate.setDate(
        medicationFirstPillDate.getDate() + medicationNumberOfDays - 1
      )
    );
    medicationLastPillDateOnly = formatDate(medicationLastPill);

    if (medicationDaysLeft > medicationNumberOfDays) {
      medicationDaysLeft = medicationNumberOfDays;
      medicationPillsLeft = medicationDaysLeft * medicationPillsPerDay;
    } else if (
      medicationLastPill.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
    ) {
      medicationDaysLeft = 0;
      medicationPillsLeft = 0;
    }
    document.getElementById("medication-pills-left").innerHTML =
      medicationPillsLeft;
    document.getElementById("medication-days-left").innerHTML =
      medicationDaysLeft;
    document.getElementById("medication-last-pill-date").innerHTML =
      medicationLastPillDateOnly;
    document.getElementsByClassName(
      "medication-left-result-wrapper"
    )[0].style.display = "block";
    let medicationCalendarLink = generateGoogleCalendarLink(
      "Medication last pill date",
      medicationLastPill
    );
    document.getElementById("medication-calendar-link").href =
      medicationCalendarLink;
  }
};
