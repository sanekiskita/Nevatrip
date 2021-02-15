import * as constant from './const.js';

let roundtrip_B = false;

function Arrival_time() {
  const way = document.querySelector('#route').value;

  switch (way) {
    case 'roundtrip':
      roundtrip();
      break;
    default:
      one_way(way);
      break;
  }

  function roundtrip() {
    const select = document.createElement('select');
    const p = document.createElement('label');
    document.querySelector('#lab_time').textContent =
      'дорога в том направлении';

    select.name = 'back';
    select.id = 'back';

    createdOption('b-a', select);

    p.textContent = 'обратная дорога ';
    document.querySelector('#calendar').append(p);
    document.querySelector('#calendar').append(select);
    one_way('a-b');
    date_check();
    document.querySelector('#time').addEventListener('change', date_check);
    roundtrip_B = true;
  }

  function one_way(way) {
    const time = document.querySelector('#time');

    time.innerHTML = '';
    createdOption(way, time);
    document.querySelector('#time').removeEventListener('change', date_check);
  }
}

function reset() {
  if (roundtrip_B == true) {
    document.querySelector('#lab_time').textContent = 'Выберите время';
    document
      .querySelector('#calendar')
      .removeChild(document.querySelector('#calendar').lastChild);
    document
      .querySelector('#calendar')
      .removeChild(document.querySelector('#calendar').lastChild);
    roundtrip_B = false;
  }
}

function date_check() {
  const back = document.querySelector('#back');
  back.innerHTML = '';
  const enddate = newdate(document.querySelector('#time').value);
  enddate.setMinutes(enddate.getMinutes() + 50);
  for (const iterator of constant.timetable['b-a']) {
    const date = newdate(iterator);
    if (enddate < date) {
      const option = document.createElement('option');
      const str = `${date.getFullYear()}-${addZero(
        date.getMonth() + 1
      )}-${addZero(date.getDate())} ${addZero(date.getHours())}:${addZero(
        date.getMinutes()
      )}:${addZero(date.getSeconds())}`;
      option.value = str;
      option.innerHTML = str;
      back.append(option);
    }
  }
}

function createdOption(way, queryId) {
  for (const iterator of constant.timetable[way]) {
    const option = document.createElement('option');
    const date = newdate(iterator);
    const str = `${date.getFullYear()}-${addZero(
      date.getMonth() + 1
    )}-${addZero(date.getDate())} ${addZero(date.getHours())}:${addZero(
      date.getMinutes()
    )}:${addZero(date.getSeconds())}`;
    option.value = str;
    option.innerHTML = str;
    queryId.append(option);
  }
}

function newdate(str) {
  const date_arr = str.replaceAll(/[-]/gi, '/');
  const startdate = new Date(`${date_arr} GMT+0300`);
  return startdate;
}

function addZero(i) {
  if (i < 10) {
    i = `0${i}`;
  }
  return i;
}

document.querySelector('#route').addEventListener('change', () => {
  reset();
  Arrival_time();
});

document.querySelector('#count_up').addEventListener('click', () => {
  const sum = +document.querySelector('#num').value;
  const route = document.querySelector('#route');

  const dvi_info = document.querySelector('#info');
  const date = counting_the_date('time');

  if (roundtrip_B === false) {
    dvi_info.innerHTML = `Вы выбрали ${sum} билета по маршруту из ${route.value
      .toUpperCase()
      .replace('-', ' в ')} стоимостью ${
      sum * constant.price.one_way
    }р. Это путешествие займет у вас ${
      constant.time
    } минут. Теплоход отправляется в ${addZero(
      date.startdate.getHours()
    )}-${addZero(date.startdate.getMinutes())}, а прибудет в ${addZero(
      date.enddate.getHours()
    )}-${addZero(date.enddate.getMinutes())}. `;
  } else {
    const date_back = counting_the_date('back');

    dvi_info.innerHTML = `Вы выбрали ${sum} билета по маршруту из А в В и обратно стоимостью ${
      sum * constant.price.there_and_back
    }р. Это путешествие займет у вас ${
      constant.time * 2
    } минут. Теплоход отправляется в ${addZero(date.startdate.getHours())}-${addZero(
      date.startdate.getMinutes()
    )}, а прибудет в ${addZero(date.enddate.getHours())}-${addZero(
      date.enddate.getMinutes()
    )}. А обратно поплывет в ${addZero(
      date_back.startdate.getHours()
    )}-${addZero(date_back.startdate.getMinutes())} и прибудет в ${addZero(
      date_back.enddate.getHours()
    )}-${addZero(date_back.enddate.getMinutes())} `;
  }
  document.body.append(dvi_info);

  function counting_the_date(id) {
    const startdate = newdate(document.querySelector(`#${id}`).value);
    const enddate = newdate(document.querySelector(`#${id}`).value);
    enddate.setMinutes(enddate.getMinutes() + 50);
    const arr = { startdate, enddate };
    return arr;
  }
});

window.addEventListener('load', () => {
  Arrival_time();
});
