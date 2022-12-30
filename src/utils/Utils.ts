import moment from 'moment';

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function formatDate(value: string) {
  return moment(value).format('DD/MM/yyyy');
}

export { sleep, formatDate };
