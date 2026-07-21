(function () {
  "use strict";

  // ==================== CONFIG ====================
  var PASSAGE_ID = "passageInner";
  var WRONG_CLASSES = ["wrong", "wrong-held"];
  // ================================================

  function findTypingInput() {
    var ae = document.activeElement;
    if (ae && /^(INPUT|TEXTAREA)$/.test(ae.tagName)) return ae;
    var visible = Array.from(document.querySelectorAll("input, textarea"))
      .filter(function (el) { return el.offsetParent !== null && !el.disabled && !el.readOnly; });
    return visible[0] || null;
  }

  function getCharSpans() {
    var container = document.getElementById(PASSAGE_ID);
    if (!container) return null;
    var spans = Array.from(container.querySelectorAll("span"));
    return spans;
  }

  function firstMistakeIndex(spans, typed) {
    for (var i = 0; i < spans.length; i++) {
      for (var c = 0; c < WRONG_CLASSES.length; c++) {
        if (spans[i].classList.contains(WRONG_CLASSES[c])) return i;
      }
    }
    var passage = spans.map(function (s) { return s.textContent; }).join("");
    for (var j = 0; j < typed.length; j++) {
      if (typed.charAt(j) !== passage.charAt(j)) return j;
    }
    return -1;
  }

  document.addEventListener("keydown", function (e) {
    if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "a") return;

    var input = findTypingInput();
    if (!input || e.target !== input) return;

    var spans = getCharSpans();
    if (!spans || !spans.length) return;

    var start = firstMistakeIndex(spans, input.value);
    if (start === -1 || start >= input.value.length) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    input.setSelectionRange(start, input.value.length);
  }, true);
})();
