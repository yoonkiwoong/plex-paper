// Plex Paper 아티팩트 층 스크립트 — plex-paper.js 뒤에 싣는다.
// 플로팅 목차: h2·h3에서 생성해 오른쪽에 상시 노출한다(넓은 화면 한정, CSS가 판단).
// 현재 읽는 절의 강조는 IntersectionObserver — 제목이 화면 위쪽 1/4 구간에 들어오면 활성.
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
    var current = null;
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            if (current) current.classList.remove("active");
            current = links[entry.target.id];
            if (current) current.classList.add("active");
        });
    }, { rootMargin: "0px 0px -75% 0px" });
    headings.forEach(function (heading) { observer.observe(heading); });
})();
