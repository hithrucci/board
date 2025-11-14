//파이어베이스 불러오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
  getFirestore, //firestore
  collection, //collection에 저장
  addDoc, //firestore에서 collection 밑에 addDoc에 저장
  serverTimestamp, //서버시간
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

//내 프로젝트 정보
const firebaseConfig = {
  apiKey: "AIzaSyBp8n2HOSR2IQGxVQXuOByQCdAAbcRzKW4",
  authDomain: "boardtest-702b9.firebaseapp.com",
  projectId: "boardtest-702b9",
  storageBucket: "boardtest-702b9.firebasestorage.app",
  messagingSenderId: "22695980187",
  appId: "1:22695980187:web:07b3e07c33e6424e282a3e",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); //firestore 연결

//html요소 가져오기 form,button, 피드백

let form = document.querySelector("#requestForm");
let btn = document.querySelector("#submitBtn");
let msg = document.querySelector("#feedback");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  //   console.log("제출");

  let name = document.querySelector("#name").value;
  let message = document.querySelector("#message").value;
  console.log(name, message);
  if (!name || !message) {
    msg.textContent = "모든 항목을 입력해 주세요";
    msg.classList.add("err");
    return;
  }

  try {
    await addDoc(collection(db, "requests"), {
      name,
      message,
      createAt: serverTimestamp(),
    });
    msg.textContent = "신청이 정상적으로 접수되었습니다. 감사합니다.";
    msg.classList.remove("err");
    msg.classList.add("ok");
    form.reset();
  } catch {
    msg.textContent = "저장 중 문제가 발생했습니다. 잠시 후 다시 시도하세요";
    msg.classList.add("err");
  }
  let listName = document.querySelector("#listName");
  let listContent = document.querySelector("#listContent");

  listName.textContent = name;
  listContent.textContent = message;
});
