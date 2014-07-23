참고 사이트
http://dailyupgrade.me/post/5176583468/chrome-extension-development-overview
http://integrer.tistory.com/3

**이때 inlclude하는 css는 내가 마우스로 보고있는 화면의 css이므로 extension의 css가 아님을 주의.
**jquery
-bind : 뒤에 추가되는 함수도 같이 bind가 걸린다
-one : 한번 걸고 실행후 제거된다

크롬 확장기능의 형태
- 브라우저 액션, 페이지 액션 (Browser Actions, Page Actions) : 브라우저 액션은 주소창 오른쪽에 페이지 액션은 주소창 안에 아이콘이 생긴다
- 보조 메뉴 (Context Menus) : 마우스 오른쪽을 클릭했을 경우 생기는 보조메뉴
- 옴니박스 (Omnibox) : 특정 검색어를 주소창에 입력하면 나타난다
- 오버라이드 페이지 (Override Pages) : 크롬에서 기본적으로 제공하는 즐겨찾기, 방문 기록, 새 탭 페이지를 바꾼다
- 앱(Apps) : 독립적인 탭에서 작동하는 기능
- 테마 (Themes) : 크롬 브라우저의 외관을 바꾼다

확장 프로그램 페이지
- 백그라운드 페이지 (Background Pages) : 확장 프로그램 개발의 기본이 되는 HTML 파일입니다. 확장 프로그램 실행에 필요한 주 알고리즘을 이 페이지에 넣는 것이 일반적입니다. 사용자에게 보이지 않습니다.
- 컨텐트 스크립트 (Content Scripts) : 웹 페이지에 끼워 넣을 수 있는 자바스크립트와 스타일시트 파일을 일컫습니다. 웹 페이지의 DOM(Document Object Model)을 살펴보거나 수정하기 위해 사용합니다.
- 팝업 페이지 (Popup Pages) : 브라우저 액션, 페이지 액션에서 사용할 수 있는 HTML 파일입니다. 아이콘을 클릭하면 팝업 페이지를 보여줍니다.
- 설정 페이지 (Options Pages) : 확장 프로그램에서 사용하는 값들을 사용자가 선택할 수 있게 하고 싶을 때 제공하는 HTML 파일입니다. 보통 localStorage를 이용해서 값들을 저장합니다.

브라우저 액션 : chrome.browserAction API
메소드
setBadgeBackgroundColor
setBadgeText
setIcon
setPopup
setTitle
이벤트
onClicked

페이지 액션 : chrome.pageAction API
메소드
hide
setIcon
setPopup
setTitle
show
이벤트
onClicked

jquery는 chrome extension과 외부 html 모두 사용할 수 있다.

데이터 전송 
background -> 외부.js

# background
chrome.tabs.sendMessage(tabs[0].id, {now : start}, function(response) {
	...
});

# 외부.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	...
});


외부.js -> background

# 외부.js
chrome.extension.sendMessage({tag : ""+e.toElement}, function(response) {
	...
});

# background
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	...
});

