// 時計と日付を、1秒ごとに書き直す
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateClock() {
  const now = new Date();

  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  document.getElementById("clock").textContent = time;

  const date = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${WEEKDAYS[now.getDay()]}）`;
  document.getElementById("date").textContent = date;
}

updateClock();
setInterval(updateClock, 1000);

// 金曜日まで、あと何日かを出す
function updateFriday() {
  const day = new Date().getDay(); // 0=日 1=月 … 5=金 6=土
  let text;
  if (day === 0 || day === 6) {
    text = "今日はお休み🎉";
  } else if (day === 5) {
    text = "今日は金曜日！";
  } else {
    text = `あと${5 - day}日`;
  }
  document.getElementById("friday").textContent = text;
}

updateFriday();
