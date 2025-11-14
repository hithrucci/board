//---------------------------------------------
// firebase기본설정
//---------------------------------------------
// 프로젝트 개요 옆 톱니바퀴>프로젝트 설정> 내 앱의 cdn탭에서 내용 복붙
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
// 게시판 설정이기때문에 firebase-firestore로 변경
import {
  getFirestore,
  collection,
  addDoc, //    문서를 서버에 추가하는 기능
  serverTimestamp, //   서버 시간
  getDocs, //   서버에 있는 목록 가져오기
  query, // 정렬조건
  orderBy, //   정렬기준
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyBp8n2HOSR2IQGxVQXuOByQCdAAbcRzKW4",
  authDomain: "boardtest-702b9.firebaseapp.com",
  projectId: "boardtest-702b9",
  storageBucket: "boardtest-702b9.firebasestorage.app",
  messagingSenderId: "22695980187",
  appId: "1:22695980187:web:07b3e07c33e6424e282a3e",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); //정보를 firestore와 연결

//---------------------------------------------
// html요소 가져오기
//---------------------------------------------
const form = document.querySelector("#requestForm");
const msg = document.querySelector(".msg");
const list = document.querySelector("#list");

//---------------------------------------------
// submit시
//---------------------------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  //   console.log(e);
  //   console.log("제출");
  let name = document.querySelector("#name").value;
  let message = document.querySelector("#message").value;
  console.log(name, message);
  //    유효성검사
  if (!name || !message) {
    msg.textContent = "모든 항목을 입력해 주세요.";
    msg.classList.add("err");
    return;
  }
  //    오류가 안났을 때
  try {
    await addDoc(collection(db, "request"), {
      name,
      message,
      createAt: serverTimestamp(),
    });
    msg.textContent = "신청이 정상적으로 접수되었습니다.";
    msg.classList.remove("err");
    msg.classList.add("ok");
    form.reset();
    loadList();
  } catch {
    //  오류가 났을 때
    msg.textContent = "저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    msg.classList.remove("ok");
    msg.classList.add("err");
  }
});

//---------------------------------------------
// 상담목록
//---------------------------------------------
async function loadList() {
  list.innerHTML = "";
  let q = query(collection(db, "request"), orderBy("createAt", "desc")); //createAt을 기준으로 내림차순 정렬해서 q라는 변수에 담음
  let item = await getDocs(q);
  //   console.log(item);
  item.forEach((doc) => {
    let data = doc.data();
    // console.log(data);
    let timeText = data.createAt
      ? data.createAt.toDate().toLocaleString("ko-KR")
      : "시간정보없음";
    // console.log(timeText);
    let li = document.createElement("li");
    li.innerHTML = `이름 ${data.name}<br>
    상담내용 ${data.message}<br>
    ${timeText}
    `;
    list.appendChild(li);
  });
}

loadList();
