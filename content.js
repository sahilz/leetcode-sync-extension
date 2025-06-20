console.log("SZ LeetCode page loaded");

function getLeetCodeProblemData() {
    const problemTitle = document.querySelector('div.text-title-large a[href^="/problems/"]');
    const problemDifficulty = document.querySelector('[class*="text-difficulty-"]');
    const problemLanguage = document.querySelector('button[aria-haspopup="dialog"]');

    const copyCodeToClipboard = () => {
        document.execCommand("copy");
        return navigator.clipboard.readText();
    };

    return new Promise((resolve) => {
        const title = problemTitle?.innerText?.trim();
        const difficulty = problemDifficulty?.innerText?.trim();
        const language = problemLanguage?.innerText?.trim();

        // Focus and Select code
        const codeEditor = document.querySelector('.monaco-mouse-cursor-text');
        if(!codeEditor) {
            resolve({title, difficulty, language, code: "Code Editor not found"});
            return;
        }

        codeEditor.focus();

        //Simulate Ctrl + A and Ctrl + C
        document.execCommand("selectAll");
        document.execCommand("copy");

        setTimeout(() => {
            navigator.clipboard.readText().then((code) => {
                resolve({title, difficulty, language, code});
            });
        }, 500);
    });
}

window.addEventListener('load', () => {
    setTimeout(() => {
        getLeetCodeProblemData().then((data) => {
            console.log("LeetCode Problem Data:", data);
        });
    }, 2000);
});
