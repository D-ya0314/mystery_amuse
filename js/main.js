"use strict";

/*---------- ハンバーガーメニュー ----------*/
const hamburger = document.querySelector(".js_hamburger");
const navigation = document.querySelector(".js_nav");
const body = document.querySelector(".js_body");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("is-active");
  navigation.classList.toggle("is-active");
  // body.classList.toggle("is-active");
  if (body.classList.contains("is-active")) {
    enableScroll();
  } else {
    disableScroll();
  }
});

// PC幅でナビゲーションをクリックしても"is-active"がつかないようにします
navigation.addEventListener("click", () => {
  if (window.innerWidth < 1080) {
    hamburger.classList.toggle("is-active");
    navigation.classList.toggle("is-active");
    // body.classList.toggle("is-active");
    if (body.classList.contains("is-active")) {
      enableScroll();
    } else {
      disableScroll();
    }
  }
});

// スマホ（ハンバーガーメニューをクリック）→PC→スマホに画面幅が変更されたとき、強制的に"is-active"を外す
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1080) {
    hamburger.classList.remove("is-active");
    navigation.classList.remove("is-active");
    body.classList.remove("is-active");
  }
});

/*---------- スライドによるヘッダの表示 ----------*/
let lastScrollY = window.scrollY;
let threshold = 100; // 500px 上から以上スクロールしたら反応
let timeout;
let isFooterVisible = false;
const footer = document.querySelector(".l_footer");
const header = document.querySelector(".js_header");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  // フッターが見えていたらスクロール判定はしない
  if (isFooterVisible) return;

  clearTimeout(timeout); // 既存のタイマーをリセット

  if (currentScrollY > lastScrollY && currentScrollY > threshold) {
    header.classList.remove("is-active");
  } else {
    header.classList.remove("is-active");
  }

  lastScrollY = currentScrollY;

  // スクロールが止まったら 1 秒後にヘッダーを表示
  timeout = setTimeout(() => {
    // フッターが見えていたら表示しない
    if (isFooterVisible) return;
    if (lastScrollY === 0) return;
    header.classList.add("is-active");
  }, 1000);
});

// フッターの可視状態を監視
const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log("フッターが見えた！ヘッダーを隠す");
        isFooterVisible = true;
        header.classList.add("is-active");
      } else {
        console.log("フッターが見えなくなった！スクロール判定を再開");
        isFooterVisible = false;
      }
    });
  },
  {
    root: null, // ビューポート（画面）基準
    threshold: 0.1, // 10% 見えたら発動
  }
);

observer.observe(footer);

let scrollY;

function disableScroll() {
  scrollY = window.scrollY;

  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  body.style.paddingRight = `${scrollbarWidth}px`;
  body.style.top = `-${scrollY}px`;
  body.classList.add("is-active");
}

function enableScroll() {
  body.style.paddingRight = "";
  body.style.top = "";
  window.scrollTo(0, scrollY);
  body.classList.remove("is-active");
}

// safariかを判別
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

// Chromeかを判別
function isChrome() {
  return (
    /chrome/i.test(navigator.userAgent) &&
    !/edge|edg|opr|opera/i.test(navigator.userAgent)
  );
}

/*---------- 幕開け ----------*/
function start(n) {
  document.querySelector(".start").classList.add("is-disable");
  document.querySelector(".js_body").classList.remove("is-active");
  // document.getElementById("don-sound").play();

  // setTimeout(() => {
  document.getElementById("intro-overlay").style.display = "none";
  // document.getElementById("inPark").classList.add("is-active");
  if (n === "o") {
    setTimeout(() => {
      document.getElementById("phoneCall").play();
      document.getElementById("phoneVibe").play();
    }, 3000);
  }
  if (n === "d") {
    document.getElementById("lock").play();
  }

  // }, 2000); // 2秒後に切り替え
}

// 謎と答え
const puzzles = [
  {
    question:
      "この謎を解けば、この世界が動き出す。\n2×1 6×1 8×2 7×4 3×2\n\n入力: <span class='phone_input' id='input'>_ _ _ _ _</span>",
    answer: "amuse",
  },
  {
    question:
      "①当時祭られていた動物は？\n②今から12時間後はひつじ、20時間後は？\n\n①②: <span class='phone_input' id='input'>_ _ _ _ _</span>へ向かえ\n※5文字でない可能性もあり",
    answer: "とりい",
  },
  {
    question:
      "鳥居に貼られた謎を解け\n\n答えは、□のなか\n\n入力: <span class='phone_input' id='input'>_ _ _ _ _</span>",
    answer: "いのなか",
  },
  {
    question:
      "------\n\n入力: <span class='phone_input' id='input'>_ _ _ _ _</span>",
    answer: "",
  },
  {
    question:
      "<p>2005/7/23 18:34\n＜To＞謎ノ少女\n＜件名＞Re：私と遊ボ\n今まで無視してごめんない。返信するからゆるして\n\nあなたの名前は: <span class='phone_input' id='input'>_ _ _ _ _</span>",
    answer: "みう",
  },
];
const mailboxes = ["受信メール", "送信済みメール", "未送信メール"];
const receiveMailbox = ["私と遊ボ"];
const sendMailbox = [];
const draftMailbox = ["助けて", "Re：私と遊ボ"];
const amuseBgm = document.getElementById("amuseBgm");
const hauntedBgm = document.getElementById("hauntedBgm");

function showMailboxList() {
  let html = "<p>メールボックス</p>";
  if (mailMode === null) {
    mailboxes.forEach((mbox, i) => {
      if (i === selectedMailbox) {
        html += `<div>▶ ${mbox}</div>`;
      } else {
        html += `<div>${mbox}</div>`;
      }
    });
  } else if (mailMode === "receive") {
    html = "<p>受信メール</p>";
    receiveMailbox.forEach((mbox, i) => {
      if (i === selectedMailbox) {
        html += `<div>▶ ${mbox}</div>`;
      } else {
        html += `<div>${mbox}</div>`;
      }
    });
  } else if (mailMode === "send") {
    html = "<p>送信済みメール</p>";
    sendMailbox.forEach((mbox, i) => {
      if (i === selectedMailbox) {
        html += `<div>▶ ${mbox}</div>`;
      } else {
        html += `<div>${mbox}</div>`;
      }
    });
  } else if (mailMode === "draft") {
    html = "<p>未送信メール</p>";
    draftMailbox.forEach((mbox, i) => {
      if (i === selectedMailbox) {
        html += `<div>▶ ${mbox}</div>`;
      } else {
        html += `<div>${mbox}</div>`;
      }
    });
  }
  screenEl.innerHTML = html;
}

// キー入力文字群
const keyMap = {
  alphabet: {
    2: ["a", "b", "c"],
    3: ["d", "e", "f"],
    4: ["g", "h", "i"],
    5: ["j", "k", "l"],
    6: ["m", "n", "o"],
    7: ["p", "q", "r", "s"],
    8: ["t", "u", "v"],
    9: ["w", "x", "y", "z"],
    a: [".", "-"],
    0: ["!", "?"],
    b: [",", "_", "[", "]"],
  },
  number: {
    1: ["1"],
    2: ["2"],
    3: ["3"],
    4: ["4"],
    5: ["5"],
    6: ["6"],
    7: ["7"],
    8: ["8"],
    9: ["9"],
    a: ["*"],
    0: ["0"],
    b: ["#"],
  },
  hiragana: {
    1: ["あ", "い", "う", "え", "お"],
    2: ["か", "き", "く", "け", "こ"],
    3: ["さ", "し", "す", "せ", "そ"],
    4: ["た", "ち", "つ", "て", "と"],
    5: ["な", "に", "ぬ", "ね", "の"],
    6: ["は", "ひ", "ふ", "へ", "ほ"],
    7: ["ま", "み", "む", "め", "も"],
    8: ["や", "ゆ", "よ", "ゃ", "ゅ", "ょ"],
    9: ["ら", "り", "る", "れ", "ろ"],
    a: [""],
    0: ["わ", "を", "ん", "ー"],
    b: [""],
  },
};

// 状態変数
let currentPuzzle = 0;
let inputMode = "alphabet"; // alphabet, number, hiragana
let input = Array(5).fill("");
let currentKey = null;
let pressCount = 0;
let pressTimeout;
let cursor = 0;
let callcounter = 0;

// 最終謎用の変数
let mailMode = null; // null=一覧, "draft"=未送信メール開封, "receive"=受信メールボックス
let selectedMailbox = 0; // 選択中インデックス

// DOM
const phone = document.querySelector(".l_phone_box");
const btnOpenPhone = document.getElementById("btn-openPhone");
const btnClosePhone = document.getElementById("btn-closePhone");
const screenEl = document.getElementById("screen");
const messageEl = document.getElementById("phoneMessage");

// 表示更新
function updateScreen() {
  if (currentPuzzle === 4) {
    selectedMailbox = 0;
    if (
      mailMode === null ||
      mailMode === "receive" ||
      mailMode === "send" ||
      mailMode === "draft"
    ) {
      showMailboxList();
      return;
    } else if (mailMode === "receiveMail1") {
      screenEl.innerHTML =
        "<p>2005/2/22 3:33\n＜From＞謎ノ少女\n＜件名＞私と遊ボ\n私ね、この前遊園地でシんじゃっタの。おバけ屋敷が崩壊シて、つぶされタの。\nかわいそうな私。それから私はこんなロウ獄みたいなところにいルの。\n電パが弱い...\n話し相手もいない...\nかなしい私と遊ボ！私の名前は何？\n６日以内にこたえテ！わからないなら４人にこのメールをまわシテ。\n\nいつ来たのかも言うんだヨ！もし無視したらね...同じ場所に来たあなたをみざる世界に連れテくね。</p>";
      return;
    } else if (mailMode === "receiveMail2") {
      screenEl.innerHTML = `<p>2015/7/23 3:20\n＜From＞謎ノ少女\n＜件名＞Re：Re：私と遊ボ\n正解！私の名前はみう！！もしかしてこの子のお友達かナ？もう遊んでくれなくなっタの。お友達の番号に電話したら、お友達、返スね。\n遊んでくれてありがとう！楽しかっタヨ...私と遊んでくれるなら、今あなタがいル場所と私のいル場所をつなげテね！！</p>`;
      return;
    } else if (mailMode === "sendMail1") {
      screenEl.innerHTML = `<p>2015/7/23 3:20\n＜To＞謎ノ少女\n＜件名＞Re：私と遊ボ\n今まで無視してごめんない。返信するからゆるして\n\nあなたの名前は:みう</p>`;
      return;
    } else if (mailMode === "sendMail2") {
      screenEl.innerHTML = "<p>****</p>";
      return;
    } else if (mailMode === "draftMail1") {
      screenEl.innerHTML =
        "<p>2005/7/23 18:36\n＜To＞母ちゃん\n＜件名＞助けて\n母ちゃん助けて！あいつにつれてか\n\n\n☆Tatumi☆</p>";
      return;
    } else if (mailMode === "draftMail2") {
      screenEl.innerHTML = puzzles[currentPuzzle].question;
      updateInput();
      return;
    }
  }

  screenEl.innerHTML = puzzles[currentPuzzle].question;
  updateInput();
}

function updateInput() {
  const display = input
    .map((c, i) => (i === cursor ? `[${c || "_"}]` : c || "_"))
    .join(" ");
  const inputEl = document.getElementById("input");
  inputEl.textContent = display;
}

// キー処理
function handleKeyPress(key) {
  if (!(key in keyMap[inputMode])) return;

  if (key !== currentKey) {
    confirmChar();
    currentKey = key;
    pressCount = 1;
  } else {
    pressCount++;
  }
  showTempChar(key);

  clearTimeout(pressTimeout);
  pressTimeout = setTimeout(() => {
    confirmChar();
  }, 300);
}

function showTempChar(key) {
  const chars = keyMap[inputMode][key];
  const char = chars[(pressCount - 1) % chars.length];
  input[cursor] = char;
  updateInput();
}

function confirmChar() {
  if (currentKey !== null) {
    const chars = keyMap[inputMode][currentKey];
    const char = chars[(pressCount - 1) % chars.length];
    input[cursor] = char;
    cursor = Math.min(cursor + 1, input.length - 1);
    updateInput();
  }
  currentKey = null;
  pressCount = 0;
}

function deleteChar() {
  if (currentPuzzle === 4) {
    selectedMailbox = 0;
    if (mailMode === "draft" || mailMode === "send" || mailMode === "receive") {
      mailMode = null;
      showMailboxList();
      return;
    } else if (mailMode === "receiveMail1" || mailMode === "receiveMail2") {
      mailMode = "receive";
      showMailboxList();
      return;
    } else if (mailMode === "sendMail1" || mailMode === "sendMail2") {
      mailMode = "send";
      showMailboxList();
      return;
    } else if (mailMode === "draftMail1" || mailMode === "draftMail2") {
      mailMode = "draft";
      showMailboxList();
      return;
    }
  }
  input[cursor] = "";
  updateInput();
}

function call() {
  const tototo = document.getElementById("tototo");
  const pipipi = document.getElementById("pipipi");
  inputMode = "number";
  messageEl.textContent = `入力モード: 数字`;
  if (currentPuzzle === 99) {
    if (callcounter >= 2) {
      if (input.join("") === "64") {
        hauntedBgm.pause();
        tototo.play();
        setTimeout(() => {
          pipipi.play();
        }, 2000);
        setTimeout(() => {
          document.getElementById("miuF").play();
        }, 7000);
        setTimeout(() => {
          hauntedBgm.play();
        }, 13000);
      } else if (input.join("") === "56") {
        hauntedBgm.pause();
        tototo.play();
        setTimeout(() => {
          pipipi.play();
        }, 2000);
        setTimeout(() => {
          phone.style.display = "none";
          document.getElementById("inPark").classList.remove("is-active");
          document.getElementById("park").classList.remove("is-active");
          document.getElementById("haunted").classList.remove("is-active");
          document.getElementById("haunted2").classList.remove("is-active");
          document.getElementById("goodEnd").classList.add("is-active");
          document.getElementById("btn-openPhone").style.display = "none";
          setTimeout(() => {
            document.getElementById("gon").play();
          }, 500);
        }, 7000);
      } else if (input.join("") === "101269" || input.join("") === "691012") {
        hauntedBgm.pause();
        tototo.play();
        setTimeout(() => {
          pipipi.play();
        }, 2000);
        setTimeout(() => {
          phone.style.display = "none";
          document.getElementById("inPark").classList.remove("is-active");
          document.getElementById("park").classList.remove("is-active");
          document.getElementById("haunted").classList.remove("is-active");
          document.getElementById("haunted2").classList.remove("is-active");
          document.getElementById("badEnd").classList.add("is-active");
          document.getElementById("btn-openPhone").style.display = "none";
          setTimeout(() => {
            document.getElementById("miuA").play();
          }, 500);
          setTimeout(() => {
            document.getElementById("miuB").play();
          }, 3000);
          setTimeout(() => {
            document.getElementById("miuC").play();
          }, 5000);
          setTimeout(() => {
            document.getElementById("miuD").play();
          }, 7000);
          setTimeout(() => {
            document.getElementById("miuE").play();
          }, 10000);
        }, 7000);
      } else {
        messageEl.textContent = "その電話番号は現在使用されていません。";
      }
    } else {
      messageEl.textContent = "その電話番号は現在使用されていません。";
    }
  } else {
    callcounter = currentPuzzle;
    currentPuzzle = 99;
    screenEl.innerHTML =
      "<span class='phone_input' id='input'>_ _ _ _ _ _</span>";
    updateInput();
  }
  resetInput();
}

function clearAll() {
  if (currentPuzzle === 99) {
    currentPuzzle = callcounter;
    updateScreen();
    resetInput();
    if (currentPuzzle === 0) {
      inputMode = "alphabet";
      messageEl.textContent = `入力モード: アルファベット`;
    }
  }
  if (currentPuzzle === 99) {
    input = Array(6).fill("");
  } else if (currentPuzzle === 1) {
    input = Array(3).fill("");
  } else if (currentPuzzle === 2) {
    input = Array(4).fill("");
  } else if (currentPuzzle === 4) {
    input = Array(2).fill("");
  } else {
    input = Array(5).fill("");
  }
  cursor = 0;
  updateInput();
}

function moveCursor(direction) {
  if (direction === "left") {
    cursor = Math.max(0, cursor - 1);
  } else if (direction === "right") {
    cursor = Math.min(input.length - 1, cursor + 1);
  } else if (direction === "up") {
    if (currentPuzzle === 4 && mailMode === null) {
      selectedMailbox =
        (selectedMailbox - 1 + mailboxes.length) % mailboxes.length;
      showMailboxList();
    } else if (currentPuzzle === 4 && mailMode === "receive") {
      selectedMailbox =
        (selectedMailbox - 1 + receiveMailbox.length) % receiveMailbox.length;
      showMailboxList();
    } else if (currentPuzzle === 4 && mailMode === "send") {
      selectedMailbox =
        (selectedMailbox - 1 + sendMailbox.length) % sendMailbox.length;
      showMailboxList();
    } else if (currentPuzzle === 4 && mailMode === "draft") {
      selectedMailbox =
        (selectedMailbox - 1 + draftMailbox.length) % draftMailbox.length;
      showMailboxList();
    } else {
      cursor = Math.max(0, cursor - 1);
    }
  } else if (direction === "down") {
    if (currentPuzzle === 4 && mailMode === null) {
      selectedMailbox = (selectedMailbox + 1) % mailboxes.length;
      showMailboxList();
    } else if (currentPuzzle === 4 && mailMode === "receive") {
      selectedMailbox = (selectedMailbox + 1) % receiveMailbox.length;
      showMailboxList();
    } else if (currentPuzzle === 4 && mailMode === "send") {
      selectedMailbox = (selectedMailbox + 1) % sendMailbox.length;
      showMailboxList();
    } else if (currentPuzzle === 4 && mailMode === "draft") {
      selectedMailbox = (selectedMailbox + 1) % draftMailbox.length;
      showMailboxList();
    } else {
      cursor = Math.min(input.length - 1, cursor + 1);
    }
  }
  updateInput();
}

function toggleInputMode() {
  const modes = ["alphabet", "number", "hiragana"];
  const currentIndex = modes.indexOf(inputMode);
  if (currentPuzzle === 99) {
    inputMode = "number";
  } else {
    inputMode = modes[(currentIndex + 1) % modes.length];
  }
  if (inputMode === "alphabet") {
    messageEl.textContent = `入力モード: アルファベット`;
  } else if (inputMode === "number") {
    messageEl.textContent = `入力モード: 数字`;
  } else {
    messageEl.textContent = `入力モード: ひらがな`;
  }
}

function getNowDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function submitAnswer() {
  document.getElementById("popi").play();
  confirmChar();
  const guess = input.join("");
  if (guess === puzzles[currentPuzzle].answer) {
    // 謎進行処理
    if (currentPuzzle === 0) {
      phone.style.display = "none";
      document.getElementById("phoneClose").play();
      amuseBgm.play();
      currentPuzzle++;
      resetInput();
      updateScreen();
      // 次のセクションへ
      document.getElementById("inPark").classList.remove("is-active");
      document.getElementById("park").classList.add("is-active");
    } else if (currentPuzzle === 1) {
      phone.style.display = "none";
      amuseBgm.pause();
      document.getElementById("phoneClose").play();
      hauntedBgm.play();
      currentPuzzle++;
      resetInput();
      updateScreen();
      // 次のセクションへ
      document.getElementById("park").classList.remove("is-active");
      document.getElementById("haunted").classList.add("is-active");
    } else if (currentPuzzle === 2) {
      phone.style.display = "none";
      currentPuzzle++;
      resetInput();
      document.getElementById("haunted").classList.remove("is-active");
      document.getElementById("haunted2").classList.add("is-active");
      hauntedBgm.pause();
      setTimeout(() => {
        document.getElementById("gon").play();
      }, 500);
      setTimeout(() => {
        document.getElementById("koron").play();
      }, 1000);
      setTimeout(() => {
        hauntedBgm.play();
      }, 5000);
    } else if (currentPuzzle === 3) {
      messageEl.textContent = "次の問題が表示されていません";
      resetInput();
      updateScreen();
    } else if (currentPuzzle === 4) {
      messageEl.textContent = "送信完了";
      sendMailbox.push("Re：私と遊ボ");
      // draftMailbox = draftMailbox.filter((m) => m.text !== "Re：私と遊ボ");
      const index = draftMailbox.indexOf("Re：私と遊ボ");
      if (index !== -1) {
        draftMailbox.splice(index, 1);
      }
      resetInput();
      mailMode = null;
      updateScreen();
      setTimeout(() => {
        messageEl.textContent = "メールを受信しました。";
        receiveMailbox.push("Re：Re：私と遊ボ");
      }, 5000);
    }
  } else if (currentPuzzle === 3) {
    messageEl.textContent = ".";
    setTimeout(() => {
      messageEl.textContent = "次の問題が表示されていません";
    }, 50);
  } else if (currentPuzzle === 4 && mailMode === null) {
    if (mailboxes[selectedMailbox] === "未送信メール") {
      mailMode = "draft";
      updateScreen();
    } else if (mailboxes[selectedMailbox] === "受信メール") {
      mailMode = "receive";
      updateScreen();
    } else if (mailboxes[selectedMailbox] === "送信済みメール") {
      mailMode = "send";
      updateScreen();
    }
  } else if (currentPuzzle === 4 && mailMode === "receive") {
    if (receiveMailbox[selectedMailbox] === "私と遊ボ") {
      mailMode = "receiveMail1";
      updateScreen();
    } else if (receiveMailbox[selectedMailbox] === "Re：Re：私と遊ボ") {
      mailMode = "receiveMail2";
      updateScreen();
    }
  } else if (currentPuzzle === 4 && mailMode === "send") {
    if (sendMailbox[selectedMailbox] === "Re：私と遊ボ") {
      mailMode = "sendMail1";
      updateScreen();
    } else if (sendMailbox[selectedMailbox] === "****") {
      mailMode = "sendMail2";
      updateScreen();
    }
  } else if (currentPuzzle === 4 && mailMode === "draft") {
    if (draftMailbox[selectedMailbox] === "助けて") {
      mailMode = "draftMail1";
      updateScreen();
    } else if (draftMailbox[selectedMailbox] === "Re：私と遊ボ") {
      mailMode = "draftMail2";
      updateScreen();
    }
  } else {
    messageEl.textContent = ".";
    setTimeout(() => {
      messageEl.textContent = "×";
    }, 50);
    setTimeout(() => {
      document.getElementById("bubuu").play();
    }, 400);
  }
}

function resetInput() {
  if (currentPuzzle === 99) {
    input = Array(6).fill("");
  } else if (currentPuzzle === 1) {
    input = Array(3).fill("");
  } else if (currentPuzzle === 2) {
    input = Array(4).fill("");
  } else if (currentPuzzle === 4) {
    input = Array(2).fill("");
  } else {
    input = Array(5).fill("");
  }
  cursor = 0;
  currentKey = null;
  pressCount = 0;
  updateInput();
}

// ガラケー開閉切替
btnOpenPhone.addEventListener("click", () => {
  phone.style.display = "flex";
  document.getElementById("phoneClose").play();
  updateScreen();
  messageEl.textContent = "";
});
btnClosePhone.addEventListener("click", () => {
  phone.style.display = "none";
  document.getElementById("phoneClose").play();
  messageEl.textContent = "";
});

// キーパッドイベント
document.querySelectorAll(".phone_btn[data-key]").forEach((btn) => {
  btn.addEventListener("click", () => {
    handleKeyPress(btn.dataset.key);
  });
});
document
  .getElementById("btn-convert")
  .addEventListener("click", toggleInputMode);
document
  .getElementById("btn-left")
  .addEventListener("click", () => moveCursor("left"));
document
  .getElementById("btn-right")
  .addEventListener("click", () => moveCursor("right"));
document
  .getElementById("btn-up")
  .addEventListener("click", () => moveCursor("up"));
document
  .getElementById("btn-down")
  .addEventListener("click", () => moveCursor("down"));
document.getElementById("btn-clear").addEventListener("click", deleteChar);
document.getElementById("btn-clear-all").addEventListener("click", clearAll);
document.getElementById("btn-enter").addEventListener("click", submitAnswer);
document.getElementById("btn-call").addEventListener("click", call);

// 胃の中を調べる
document.getElementById("btn-inonaka").addEventListener("click", () => {
  document.querySelector(".js_inonaka").classList.add("is-active");
  document.getElementById("btn-inonaka").style.display = "none";
});

// SDカードを入れる
document.getElementById("btn-sdcard").addEventListener("click", () => {
  document.getElementById("btn-sdcard").style.display = "none";
  currentPuzzle++;
  resetInput();
  updateScreen();
  phone.style.display = "flex";
  document.getElementById("phoneClose").play();
  document.getElementById("pon").play();
});

// ヒント
// const hints = document.querySelectorAll(".js_hint");
// function hint() {
//   hints.forEach((el) => {
//     el.classList.toggle("is-active");
//   });
// }

let hintCount = 0;
function openhint(n) {
  if (n === "park") {
    const hint = document.getElementById("hintPark");
    hint.classList.toggle("is-active");
  } else if (n === "haunted" && hintCount === 0) {
    const hint = document.getElementById("hintHaunted1");
    hint.classList.toggle("is-active");
    hintCount = 1;
  } else if (n === "haunted" && hintCount === 1) {
    const hint = document.getElementById("hintHaunted2");
    hint.classList.toggle("is-active");
    hintCount = 2;
  } else if (n === "haunted" && hintCount === 2) {
    const hint1 = document.getElementById("hintHaunted1");
    const hint2 = document.getElementById("hintHaunted2");
    hint1.classList.toggle("is-active");
    hint2.classList.toggle("is-active");
    hintCount = 0;
  } else if (n === "r3") {
    const hint = document.getElementById("hintRoom3");
    hint.classList.toggle("is-active");
  }
}
