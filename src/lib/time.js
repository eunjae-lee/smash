export function secondsToString(seconds) {
  if (!seconds) {
    return "00:00";
  }

  let sec = seconds % 60;
  seconds -= sec;
  let mins = Math.floor(seconds / 60);
  let hours = Math.floor(mins / 60);
  mins = mins % 60;

  if (hours > 0) {
    return `${toTwoDigits(hours)}:${toTwoDigits(mins)}:${toTwoDigits(sec)}`;
  } else {
    return `${toTwoDigits(mins)}:${toTwoDigits(sec)}`;
  }
}

function toTwoDigits(number) {
  if (number > 9) {
    return "" + number;
  } else {
    return "0" + number;
  }
}
