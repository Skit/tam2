/**
 * Показываем часы на кнопке и календарь при клике на неё
 * Created by Micro on 26.08.2016.
 */
clock = $('#clock');

/**
 * Навешиваем разные действия на первый и второй клик
 * @type {{0: a.0, 1: a.1}}
 * TODO: если окно закрыть нажатием на "пустое место", то при следующем клике будет снова вызван hide
 */
var a = {
    0: function () {
        clock.datepicker('dialog');
    },
    1: function () {
        clock.datepicker('hide');
    }
}, b = -1;

clock.button().click(function () {

    a[++b % 2]();
});

name_day = new Array ("Воскресенье","Понедельник", "Вторник","Среда","Четверг", "Пятница","Суббота");

function wr_hours(tick)
{
    time=new Date();

    time_sec=time.getSeconds();
    time_min=time.getMinutes();
    time_hours=time.getHours();
    time_wr=((time_hours<10)?"0":"")+time_hours;
    time_wr+=tick;
    time_wr+=((time_min<10)?"0":"")+time_min;

    time_wr=name_day[time.getDay()]+", "+time.getDate()+"."+time.getFullYear()+"\r\n"+time_wr;

    clock.text(time_wr);
}

// осуществляем показ часов и мигание доветочия
setTimeout(function run (tick) {

    wr_hours(tick);

setTimeout(run, 1000, (tick == ' ') ? ':' : ' ');
}, 1000, ' ');