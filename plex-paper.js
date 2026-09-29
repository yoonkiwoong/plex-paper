// Plex Paper 공통 층 스크립트. 없어도 문서는 온전하다 — 하이라이트와 제목 앵커만 빠진다.
// 최소 하이라이터: pre[data-lang]의 코드에 4토큰(주석·문자열·숫자·키워드)만 입힌다.
// 외부 라이브러리 없음. textContent를 읽어 DOM 노드로 다시 만들므로 이스케이프 문제가 없다.
(function () {
    var KEYWORDS = {
        python: "def return for in if elif else while class import from as with try except finally lambda pass break continue not and or is None True False yield raise assert del",
        javascript: "const let var function return for in of if else while class import from export as try catch finally throw new typeof instanceof this null undefined true false async await switch case break continue default do delete void yield extends super"
    };
    var PATTERNS = {
        python: /(#.*)|((?:[fbru]{1,2})?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)\b/g,
        javascript: /(\/\/.*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)\b/g
    };
    document.querySelectorAll("pre[data-lang] > code").forEach(function (code) {
        var lang = code.parentElement.getAttribute("data-lang");
        var re = PATTERNS[lang];
        if (!re) return;
        var keywordSet = new Set(KEYWORDS[lang].split(" "));
        var source = code.textContent;
        var fragment = document.createDocumentFragment();
        var last = 0, match;
        re.lastIndex = 0;
        while ((match = re.exec(source))) {
            var tokenClass = match[1] ? "tok-comment"
                : match[2] ? "tok-str"
                : match[3] ? "tok-num"
                : keywordSet.has(match[4]) ? "tok-kw"
                : null;
            if (last < match.index) fragment.appendChild(document.createTextNode(source.slice(last, match.index)));
            if (tokenClass) {
                var span = document.createElement("span");
                span.className = tokenClass;
                span.textContent = match[0];
                fragment.appendChild(span);
            } else {
                fragment.appendChild(document.createTextNode(match[0]));
            }
            last = match.index + match[0].length;
        }
        fragment.appendChild(document.createTextNode(source.slice(last)));
        code.replaceChildren(fragment);
    });
})();

// 제목 앵커(하이브리드): 진짜 링크(아이콘)가 키보드·스크린리더·우클릭 복사의 표준 경로를 담당하고,
// 제목 아무 곳이나 클릭/탭해도 이동하는 것은 JS 향상이다. 제목 안의 진짜 링크는 그 링크가 우선한다.
// 아이콘을 누르면 이동과 함께 그 절의 주소를 클립보드에 넣고, 잠깐 체크로 바꿔 복사됐음을 알린다.
// 클립보드 API가 없거나 거절되면 아이콘은 그대로이고 이동만 한다.
//
// CHECK_ICON은 Lucide circle-check다. ISC License, Copyright (c) 2026 Lucide Icons and Contributors.
// Permission to use, copy, modify, and/or distribute this software for any purpose with or without
// fee is hereby granted, provided that the above copyright notice and this permission notice appear
// in all copies. THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES.
(function () {
    var LINK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"/></svg>';
    var CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m16 9-5.5 5.5L8 12"/></svg>';
    var COPIED_MILLISECONDS = 1500;
    document.querySelectorAll("h2[id], h3[id]").forEach(function (heading) {
        var anchor = document.createElement("a");
        anchor.className = "anchor-link";
        anchor.href = "#" + heading.id;
        anchor.setAttribute("aria-label", "이 절의 링크");
        anchor.innerHTML = LINK_ICON;
        heading.appendChild(anchor);
    });
    // 아이콘이 바뀌는 것은 화면에만 보이므로, 스크린리더에는 같은 사실을 status 영역으로 읽어 준다
    var status = document.createElement("span");
    status.className = "anchor-status";
    status.setAttribute("role", "status");
    document.body.appendChild(status);
    function showCopied(anchor) {
        anchor.innerHTML = CHECK_ICON;
        anchor.classList.add("copied");
        status.textContent = "링크 복사됨";
        clearTimeout(anchor.copiedTimer);
        anchor.copiedTimer = setTimeout(function () {
            anchor.innerHTML = LINK_ICON;
            anchor.classList.remove("copied");
            status.textContent = "";
        }, COPIED_MILLISECONDS);
    }
    document.addEventListener("click", function (event) {
        var anchor = event.target.closest(".anchor-link");
        if (anchor && navigator.clipboard) {
            var url = location.origin + location.pathname + anchor.hash;
            navigator.clipboard.writeText(url).then(function () { showCopied(anchor); }, function () {});
        }
        var heading = event.target.closest("h2[id], h3[id]");
        if (!heading || event.target.closest("a")) return;
        location.hash = heading.id;
    });
})();
