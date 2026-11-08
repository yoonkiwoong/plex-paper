// Plex Paper 아티팩트 층 스크립트 — plex-paper.js 뒤에 싣는다.
// 플로팅 목차: h2·h3에서 생성해 오른쪽에 상시 노출한다(넓은 화면 한정, CSS가 판단).
// 현재 읽는 절은 읽는 선을 지난 마지막 제목이다. 읽는 선은 화면 맨 위에서 scroll-padding-top만큼 내려간 자리라,
// 머리가 화면 위에 붙어 있는 블로그에서는 머리 바로 아래, 아티팩트에서는 화면 맨 위가 된다.
// IntersectionObserver(화면 위쪽 1/4 구간에 들어온 제목)는 기각: 구간에 들어온 순서만 알려 줘서, h2를 누르면
// 함께 구간에 들어온 바로 아래 h3가 이겼고, 끝까지 내려도 그 구간에 닿지 못하는 마지막 제목은 강조되지 않았다.
(function () {
    var headings = Array.prototype.slice.call(document.querySelectorAll("h2[id], h3[id]"));
    if (!headings.length) return;
    var toc = document.createElement("nav");
    toc.className = "toc";
    toc.setAttribute("aria-label", "목차");
    var links = {};
    headings.forEach(function (heading) {
        var link = document.createElement("a");
        link.href = "#" + heading.id;
        link.textContent = heading.textContent;
        link.className = heading.tagName === "H3" ? "toc-h3" : "toc-h2";
        toc.appendChild(link);
        links[heading.id] = link;
    });
    document.body.appendChild(toc);

    // 링크로 이동한 제목은 읽는 선에 서지만, 소수점 픽셀만큼 선 아래에 설 수 있다
    var READING_LINE_TOLERANCE = 2;

    function readingLine() {
        var scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
        return (isNaN(scrollPadding) ? 0 : scrollPadding) + READING_LINE_TOLERANCE;
    }

    function lastPassedIndex() {
        var line = readingLine();
        var passedIndex = -1;
        for (var index = 0; index < headings.length; index++) {
            if (headings[index].getBoundingClientRect().top > line) break;
            passedIndex = index;
        }
        return passedIndex;
    }

    function currentHeading() {
        var passedIndex = lastPassedIndex();
        var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;
        if (!atBottom) return passedIndex < 0 ? null : headings[passedIndex];
        // 끝에 닿으면 더 내려갈 수 없어 읽는 선에 못 닿는 제목이 남는다. 그 제목 가운데 링크로 고른 것이 있으면
        // 그것을, 아니면 마지막 제목을 강조한다 — 고른 제목을 무시하면 누른 것과 다른 항목이 강조된다.
        var chosenIndex = headings.indexOf(document.getElementById(decodeURIComponent(location.hash.slice(1))));
        if (chosenIndex >= 0 && chosenIndex >= passedIndex) return headings[chosenIndex];
        return headings[headings.length - 1];
    }

    var current = null;
    function update() {
        var heading = currentHeading();
        var link = heading ? links[heading.id] : null;
        if (link === current) return;
        if (current) current.classList.remove("active");
        if (link) link.classList.add("active");
        current = link;
    }

    var scheduled = false;
    function scheduleUpdate() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(function () {
            scheduled = false;
            update();
        });
    }
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    // 이미 끝에 있을 때 보이는 제목을 누르면 스크롤이 일어나지 않아 주소가 바뀐 것만 남는다
    window.addEventListener("hashchange", scheduleUpdate);
    update();
})();
