# Plex Paper

Styles that make web pages read like rendered Markdown — plain HTML, IBM Plex type, iOS system colors.

See every element live at <https://yoonkiwoong.github.io/plex-paper/>.

Plex Paper is an unofficial name taken from the IBM Plex typeface. This project is not affiliated with IBM.

## Use

Copy `plex-paper.css`, `plex-paper.js`, and the `fonts/` folder into your site.

```html
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="plex-paper.css">

<!-- at the end of <body> -->
<script src="plex-paper.js"></script>
```

Most elements are plain HTML. Chips, callouts, tiles, cards, and charts use a few classes shown in `ELEMENTS.md`. Code blocks are highlighted when marked as `<pre data-lang="python">`. Pages still read well without JavaScript.

## Files

- `DESIGN.md` — the rules, in Korean
- `ELEMENTS.md` — every element with its decision history, in Korean
- `artifact.css`, `artifact.js` — extra layer for Claude artifacts: manual theme toggle and a floating table of contents
- `diagrams/` — diagrams from `ELEMENTS.md`, rendered to SVG for the blog

## License

MIT. The fonts in `fonts/` are IBM Plex under the SIL Open Font License 1.1 (`fonts/OFL.txt`).
