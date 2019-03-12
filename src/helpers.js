// convert seconds to hh:mm:ss
export function formatSeconds(timeInSeconds) {
  const time = parseFloat(timeInSeconds).toFixed(0);
  const hours = Math.floor(time / 60 / 60);
  const minutes = Math.floor(time / 60) % 60;
  const seconds = time - hours * 3600 - minutes * 60;
  const padZeroStart = (num, length) => String(num).padStart(length, '0');
  return `${padZeroStart(hours, 2)}:${padZeroStart(minutes, 2)}:${padZeroStart(seconds, 2)}`;
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

// convert milliseconds to date format such as Fri, Dec 7, 2018
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
