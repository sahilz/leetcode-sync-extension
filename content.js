console.log("SZ LeetCode page loaded");

let storedTitle = "";
let storedDifficulty = "";

// 🔹 Grab title + difficulty on load
function grabStaticDetails() {
  const titleEl = document.querySelector(
    'div.text-title-large a[href^="/problems/"]'
  );
  const difficultyEl = document.querySelector('[class*="text-difficulty-"]');

  let title = titleEl?.innerText?.trim() || "Unknown Title";
  // Format title to ensure consistent storage
  // Converts "1. Two Sum" to "0001 - Two Sum"
  storedTitle = title.replace(/^(\d+)\.\s+/, (_, n) => n.padStart(4, '0') + ' - ');

  storedDifficulty = difficultyEl?.innerText?.trim() || "Unknown Difficulty";

  console.log("📌 Title & Difficulty:", storedTitle, storedDifficulty);
}

// 🔹 Watch for 'Accepted' message in result panel
function watchForAcceptedSubmission() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const nodes = Array.from(mutation.addedNodes);
      for (const node of nodes) {
        if (node.nodeType === 1 && node.textContent.includes("Accepted")) {
          console.log("✅ Problem Accepted");
          grabCodeAndLanguage();
          return;
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// 🔹 Extract code & language on Accepted
function grabCodeAndLanguage() {
  const language = getLanguage();
  const code = getCode();

  const finalData = {
    title: storedTitle,
    difficulty: storedDifficulty,
    language,
    code: code.trim(),
  };

  console.log("🚀 Final LeetCode Data:", finalData);

  // Optionally send to background or popup
  chrome.runtime.sendMessage({ type: "leetcodeData", payload: finalData });
}

function getLanguage() {
  let container = Array.from(
    document.querySelectorAll("div.flex.items-center.gap-2.text-sm")
  ).find((el) => el.textContent.includes("Code"));

  let parts = container?.innerText?.trim().split("\n").join(" ").split(" ");
  return parts.length >= 2 ? parts[1] : "Unknown Language";
}

function getCode() {
  const codeTags = Array.from(document.getElementsByTagName("code"));

  const codeBlock = codeTags.find((el) => {
    return el.className && el.className.startsWith("language-");
  });

  return codeBlock?.innerText?.trim() || "Code not found";
}

window.addEventListener("load", () => {
  grabStaticDetails();
  watchForAcceptedSubmission();
});
