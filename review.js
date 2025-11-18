//---------------------------------------------
// firebase 기본 설정
//---------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc, //    문서를 서버에 추가하는 기능
  serverTimestamp, //   서버 시간
  getDocs, //   서버에 있는 목록 가져오기
  query, // 정렬조건
  orderBy, //   정렬기준
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

//파이어베이스 정보 불러오기
const firebaseConfig = {
  apiKey: "AIzaSyAc4bE0PwvD_aOIT9u75eaYyD4Ho_tVzyM",
  authDomain: "review-f77d4.firebaseapp.com",
  projectId: "review-f77d4",
  storageBucket: "review-f77d4.firebasestorage.app",
  messagingSenderId: "282283850090",
  appId: "1:282283850090:web:1a222f9ef71092df420d13",
  measurementId: "G-D5MN90RB19",
};
//파이어베이스 연결
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//---------------------------------------------
// HTML요소 가져오기
//---------------------------------------------
let stars = document.querySelectorAll(".star li i");
let form = document.querySelector("#requestForm");
let textArea = document.querySelector("textarea");
let list = document.querySelector("#list");

console.log(stars.length);
let rating = 0; //별 개수

for (let index = 0; index < stars.length; index++) {
  let star = stars[index];
  star.addEventListener("click", () => {
    rating = index + 1;
    for (let i = 0; i <= index; i++) {
      stars[i].classList.remove("fa-regular");
      stars[i].classList.add("fa-solid");
    }
  });
}
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("제출");
  if (rating == 0) {
    alert("별점을 선택해 주세요");
    return;
  } else if (textArea.value == "") {
    alert("리뷰 내용을 입력해 주세요");
    return;
  }
  try {
    //firestore에 저장
    alert("리뷰가 등록되었습니다.");
    await addDoc(collection(db, "reviews"), {
      rating: rating, // 별점
      text: textArea.value, // 리뷰 내용
      createAt: serverTimestamp(), // 서버시간
    });

    //초기화
    rating = 0;
    textArea.value = "";
    stars.forEach((item) => {
      item.classList.remove("fa-solid");
      item.classList.add("fa-regular");
    });
    loadList();
  } catch {
    alert("리뷰 저장에 실패했습니다.");
  }
});
async function loadList() {
  // console.log("load");
  list.innerHTML = "";
  let q = query(collection(db, "reviews"), orderBy("createAt", "desc"));
  let item = await getDocs(q);
  console.log(item);
  item.forEach((doc) => {
    // console.log(doc);
    let data = doc.data();
    console.log("data", data);
    let timeText = data.createAt
      ? data.createAt.toDate().toLocaleString("ko-KR")
      : "시간정보 없음";
    let starBox = "";
    for (let i = 0; i < data.rating; i++) {
      starBox += `<i class="fa-solid fa-star"></i>`;
    }

    let li = document.createElement("li");
    li.innerHTML = `${starBox}
      <br>
    ${data.text}<br>
    <div class="time">${timeText}</div>
    `;
    list.appendChild(li);
  });
}
loadList();
