// format seconds in number to hh:mm:ss in string
export function formatSeconds(timeInSeconds) {
  const pad = function(num, size) {
      return ('000' + num).slice(size * -1);
    },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60);
  return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
}

// convert hh:mm:ss in string to seconds in number
export function convertTimeString(timeInString) {
  const timeInArray = timeInString.split(':');
  return (
    parseInt(timeInArray[0]) * 3600 +
    parseInt(timeInArray[1]) * 60 +
    parseInt(timeInArray[2])
  );
}

// format milliseconds to date format such as Fri, Dec 7, 2018
export function msToDate(ms) {
  const date = new Date(ms);
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}
