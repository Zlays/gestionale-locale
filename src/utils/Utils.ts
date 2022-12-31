import moment from 'moment';

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function formatDate(value: string) {
  return moment(value).format('DD/MM/yyyy');
}

function getColorByPercent(percent: number): string {
  if (percent >= 100) {
    return 'success';
  }
  if (percent <= 50) {
    return 'error';
  }
  return 'warning';
}

export { sleep, formatDate, getColorByPercent };
