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

// サブネット電卓
// 「192.168.10.0/24」の形を読み、ネットワーク・ブロードキャスト・使える範囲・台数を出す
function ipToNumber(text) {
  const parts = text.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const v = Number(part);
    if (v > 255) return null;
    n = n * 256 + v;
  }
  return n;
}

function numberToIp(n) {
  return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

function calcSubnet(text) {
  const m = text.trim().match(/^([\d.]+)\s*\/\s*(\d{1,2})$/);
  if (!m) return null;
  const ip = ipToNumber(m[1]);
  const prefix = Number(m[2]);
  if (ip === null || prefix > 32) return null;

  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;

  let first, last, hosts;
  if (prefix === 32) {
    // その IP だけ
    first = network;
    last = network;
    hosts = 1;
  } else if (prefix === 31) {
    // 2台をつなぐ線（RFC 3021）
    first = network;
    last = broadcast;
    hosts = 2;
  } else {
    first = network + 1;
    last = broadcast - 1;
    hosts = 2 ** (32 - prefix) - 2;
  }

  return {
    network: numberToIp(network),
    broadcast: numberToIp(broadcast),
    mask: numberToIp(mask),
    range: `${numberToIp(first)} 〜 ${numberToIp(last)}`,
    hosts: `${hosts.toLocaleString("ja-JP")}台`,
  };
}

function updateSubnet() {
  const result = calcSubnet(document.getElementById("subnet-input").value);
  const box = document.getElementById("subnet-result");
  box.replaceChildren();

  if (!result) {
    const p = document.createElement("dd");
    p.className = "subnet-error";
    p.textContent = "192.168.10.0/24 の形で入れてください";
    box.append(p);
    return;
  }

  const rows = [
    ["ネットワーク", result.network],
    ["ブロードキャスト", result.broadcast],
    ["サブネットマスク", result.mask],
    ["使える範囲", result.range],
    ["台数", result.hosts],
  ];
  for (const [label, value] of rows) {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    box.append(dt, dd);
  }
}

document.getElementById("subnet-input").addEventListener("input", updateSubnet);
updateSubnet();
