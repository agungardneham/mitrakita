const fs = require("fs");
const s = fs.readFileSync(
  "E:/Project/MitraKita/mitrakita/src/pages/IKMDirectoryPage.jsx",
  "utf8"
);
const re = /<\/?([a-zA-Z0-9-]+)(\s|>)/g;
let m;
let stack = [];
while ((m = re.exec(s)) !== null) {
  const tag = m[1].toLowerCase();
  const idx = m.index;
  const before = s.slice(0, idx);
  const line = before.split("\n").length;
  const isClosing = s[idx + 1] === "/";
  if (tag === "div") {
    if (!isClosing) {
      stack.push({ line, idx });
    } else {
      if (stack.length) stack.pop();
      else console.log("extra closing </div> at line", line);
    }
  }
}
if (stack.length) {
  const last = stack[stack.length - 1];
  console.log("first unclosed <div> at line", last.line, "index", last.idx);
} else {
  console.log("all divs closed");
}
