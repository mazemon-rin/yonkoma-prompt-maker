const LEGACY_STORAGE_KEY = "yonkomaPromptMakerState";
const SAVED_LIST_KEY = "yonkomaPromptMakerSavedList";

const defaultHero =
  "50代男性。黒髪。メガネなし。ひげなし。紺色パーカー。やさしく親しみやすい表情。手描き風のやさしいタッチ。ブランドガイド準拠の主人公。";

const options = {
  template: [
    "50代・未経験のAIアプリ開発",
    "同じプロンプトなのに違う結果になる話",
    "画像生成で文字だけ直したいのに全部変わる話",
    "GitHubでつまずいた話",
    "Codexに頼んだら思ったのと違った話",
    "買い物価格記録アプリ開発日誌",
    "診察前メモアプリを作った話",
    "AI初心者あるある",
    "自由テーマ",
  ],
  theme: [
    "難しかったのはコードじゃなかった",
    "同じプロンプトなのに、なぜ違うアプリができるのか？",
    "文字だけ直したいのに、全部変わってしまう話",
    "GitHub Desktopでつまずいた話",
    "Codexに頼んだら思っていたのと違った話",
    "買い物価格記録アプリをスマホで使いやすくした話",
    "自分のために作ったアプリが、誰かの役にも立った話",
    "自由入力",
  ],
  message: ["笑い", "共感", "学び", "初心者あるある", "前向きな気づき", "失敗から学ぶ", "ほっこり"],
  characters: ["小さなAIアシスタント", "主人公のみ", "家族", "同僚", "医師", "店員", "ツッコミ役", "自由入力"],
  setting: ["自宅の机", "パソコン前", "スーパー", "病院", "カフェ", "職場", "スマホ操作画面", "GitHub Desktopの画面", "自由入力"],
  storyPattern: [
    "導入 → 困る → AIが助言 → 気づく",
    "期待 → 失敗 → 原因に気づく → 改善する",
    "不安 → 小さく始める → 形になる → 前向きになる",
    "思い込み → つまずく → 見直す → 学びになる",
    "完成したと思う → スマホで崩れる → 修正する → 使いやすくなる",
  ],
  panel1Pattern: [
    "不安そうに調べている",
    "期待してAIに頼む",
    "完成したと思って喜ぶ",
    "何から始めればいいか迷う",
    "いつもの困りごとに気づく",
    "過去の失敗を思い出す",
    "自由入力",
  ],
  panel2Pattern: [
    "思った結果と違って困る",
    "画面やレイアウトが崩れる",
    "専門用語が多くて混乱する",
    "入力内容が足りないと気づく",
    "AIから助言を受ける",
    "家族や周囲に相談する",
    "自由入力",
  ],
  panel3Pattern: [
    "AIアシスタントが助言する",
    "メモ帳に困りごとを書き出す",
    "変更する部分と変えない部分を整理する",
    "小さな機能から作り始める",
    "スマホで実際に試す",
    "もう一度プロンプトを具体化する",
    "自由入力",
  ],
  panel4Pattern: [
    "最初の一歩が一番難しかったと気づく",
    "具体的に伝える大切さに気づく",
    "変えない部分を書く大切さに気づく",
    "完成より改善が大事だと気づく",
    "自分の困りごとが誰かの役にも立つと気づく",
    "AIは丸投げではなく一緒に作る相手だと気づく",
    "自由入力",
  ],
  punchline: [
    "難しかったのはコードではなく最初の一歩だった",
    "同じ指示ではなく、具体的な指示が必要だった",
    "変える部分より、変えない部分を書くのが大事だった",
    "完成より改善の連続だった",
    "自分の困りごとは、誰かの役にも立つかもしれない",
    "AIは丸投げではなく、一緒に作る相手だった",
    "自由入力",
  ],
  style: ["ブランドガイド準拠の手描き風", "やさしいフラットイラスト", "エッセイ漫画風", "シンプルなビジネス漫画風", "ゆるい漫画風"],
  mood: ["やさしいカラー", "白・薄い青・紺色ベース", "ベージュ・グリーン系", "モノクロ", "note向けの落ち着いた色"],
  usage: ["note記事の挿絵", "note記事のヘッダー", "X投稿用", "Instagram投稿用", "ブログ用"],
  size: ["横長 16:9", "noteヘッダー 1920×1006", "正方形 1:1", "縦長 9:16", "A4横", "A4縦"],
  elements: ["ノートPC", "スマホ", "メモ帳", "AIアシスタント", "アプリ画面", "GitHub風画面", "本", "観葉植物", "吹き出し", "4コマ枠"],
  avoid: ["文字化け", "英語表記", "主人公が若すぎる", "メガネ", "ひげ", "派手な服", "怖い表情", "リアル写真風", "背景を細かくしすぎる", "レイアウト崩れ"],
};

const templates = {
  "50代・未経験のAIアプリ開発": {
    theme: "難しかったのはコードじゃなかった",
    message: "前向きな気づき",
    characters: "小さなAIアシスタント",
    setting: "自宅の机",
    storyPattern: "不安 → 小さく始める → 形になる → 前向きになる",
    punchline: "難しかったのはコードではなく最初の一歩だった",
    elements: ["ノートPC", "スマホ", "メモ帳", "AIアシスタント", "吹き出し", "4コマ枠"],
    panelPatterns: ["不安そうに調べている", "AIから助言を受ける", "メモ帳に困りごとを書き出す", "最初の一歩が一番難しかったと気づく"],
    panels: [
      "主人公がノートPCの前で、AIアプリ開発に挑戦したいけれど不安そうにしている。",
      "小さなAIアシスタントが、まずは小さな機能から作ればよいとやさしく助言する。",
      "主人公が一つずつ選択や修正を重ね、画面に少しずつアプリの形が見えてくる。",
      "主人公が笑顔で、最初の一歩を踏み出せたことに気づき前向きになる。",
    ],
  },
  "同じプロンプトなのに違う結果になる話": {
    theme: "同じプロンプトなのに、なぜ違うアプリができるのか？",
    message: "学び",
    characters: "小さなAIアシスタント",
    setting: "パソコン前",
    storyPattern: "期待 → 失敗 → 原因に気づく → 改善する",
    punchline: "同じ指示ではなく、具体的な指示が必要だった",
    elements: ["ノートPC", "AIアシスタント", "アプリ画面", "吹き出し", "4コマ枠"],
    panelPatterns: ["期待してAIに頼む", "思った結果と違って困る", "もう一度プロンプトを具体化する", "具体的に伝える大切さに気づく"],
    panels: [
      "主人公が同じプロンプトを入れれば同じ結果になると思い、期待して生成ボタンを押す。",
      "画面には前回と違うアプリが表示され、主人公が驚いて困っている。",
      "AIアシスタントが、具体的な条件や変えない部分も書く必要があると説明する。",
      "主人公が指示を具体化し、納得した表情で改善された画面を見る。",
    ],
  },
  "画像生成で文字だけ直したいのに全部変わる話": {
    theme: "文字だけ直したいのに、全部変わってしまう話",
    message: "初心者あるある",
    characters: "小さなAIアシスタント",
    setting: "パソコン前",
    storyPattern: "思い込み → つまずく → 見直す → 学びになる",
    punchline: "変える部分より、変えない部分を書くのが大事だった",
    elements: ["ノートPC", "AIアシスタント", "吹き出し", "4コマ枠"],
    panelPatterns: ["完成したと思って喜ぶ", "思った結果と違って困る", "変更する部分と変えない部分を整理する", "変えない部分を書く大切さに気づく"],
    panels: [
      "主人公が画像の文字だけを直したいと思い、軽い気持ちで修正を依頼する。",
      "生成結果では人物や背景まで変わってしまい、主人公が戸惑っている。",
      "AIアシスタントが、変更したい部分と固定したい部分を分けて書くよう助言する。",
      "主人公が変えない条件を明記し、落ち着いた表情で学びを得る。",
    ],
  },
  "GitHubでつまずいた話": {
    theme: "GitHub Desktopでつまずいた話",
    message: "失敗から学ぶ",
    characters: "小さなAIアシスタント",
    setting: "GitHub Desktopの画面",
    storyPattern: "思い込み → つまずく → 見直す → 学びになる",
    punchline: "完成より改善の連続だった",
    elements: ["ノートPC", "GitHub風画面", "メモ帳", "吹き出し", "4コマ枠"],
    panelPatterns: ["何から始めればいいか迷う", "専門用語が多くて混乱する", "メモ帳に困りごとを書き出す", "完成より改善が大事だと気づく"],
    panels: [
      "主人公がGitHub Desktopの画面を見ながら、保存したはずなのに反映されないと首をかしげている。",
      "コミットやプッシュの流れでつまずき、画面の前で焦っている。",
      "AIアシスタントが、変更、コミット、プッシュを順番に確認しようと助言する。",
      "主人公が手順をメモし、失敗も改善の一部だと気づいて安心する。",
    ],
  },
  "Codexに頼んだら思ったのと違った話": {
    theme: "Codexに頼んだら思っていたのと違った話",
    message: "笑い",
    characters: "ツッコミ役",
    setting: "パソコン前",
    storyPattern: "期待 → 失敗 → 原因に気づく → 改善する",
    punchline: "AIは丸投げではなく、一緒に作る相手だった",
    elements: ["ノートPC", "アプリ画面", "吹き出し", "4コマ枠"],
    panelPatterns: ["期待してAIに頼む", "思った結果と違って困る", "入力内容が足りないと気づく", "AIは丸投げではなく一緒に作る相手だと気づく"],
    panels: [
      "主人公がCodexに任せれば完璧に作ってくれると期待している。",
      "できあがった画面が思っていた方向と違い、主人公とツッコミ役が驚く。",
      "主人公が自分の希望を具体的に伝えていなかったことに気づく。",
      "主人公がCodexと相談しながら修正し、一緒に作る感覚をつかむ。",
    ],
  },
  "買い物価格記録アプリ開発日誌": {
    theme: "買い物価格記録アプリをスマホで使いやすくした話",
    message: "共感",
    characters: "店員",
    setting: "スーパー",
    storyPattern: "完成したと思う → スマホで崩れる → 修正する → 使いやすくなる",
    punchline: "完成より改善の連続だった",
    elements: ["スマホ", "アプリ画面", "メモ帳", "吹き出し", "4コマ枠"],
    panelPatterns: ["完成したと思って喜ぶ", "画面やレイアウトが崩れる", "スマホで実際に試す", "完成より改善が大事だと気づく"],
    panels: [
      "主人公が買い物価格記録アプリを完成したと思い、スーパーでスマホを開く。",
      "スマホ画面でボタンや文字が見づらく、主人公が困っている。",
      "主人公が入力しやすさや表示の大きさを見直し、画面を修正する。",
      "主人公が使いやすくなったアプリを見て、改善の大切さに気づく。",
    ],
  },
  "診察前メモアプリを作った話": {
    theme: "自分のために作ったアプリが、誰かの役にも立った話",
    message: "ほっこり",
    characters: "医師",
    setting: "病院",
    storyPattern: "不安 → 小さく始める → 形になる → 前向きになる",
    punchline: "自分の困りごとは、誰かの役にも立つかもしれない",
    elements: ["スマホ", "メモ帳", "アプリ画面", "吹き出し", "4コマ枠"],
    panelPatterns: ["いつもの困りごとに気づく", "家族や周囲に相談する", "小さな機能から作り始める", "自分の困りごとが誰かの役にも立つと気づく"],
    panels: [
      "主人公が診察前に話すことを忘れそうで不安そうにしている。",
      "スマホに症状や聞きたいことをメモする小さなアプリを作り始める。",
      "診察室でメモを見ながら落ち着いて医師に説明できている。",
      "主人公が、自分の困りごとが他の人にも役立つかもしれないと気づく。",
    ],
  },
  "AI初心者あるある": {
    theme: "難しかったのはコードじゃなかった",
    message: "初心者あるある",
    characters: "小さなAIアシスタント",
    setting: "カフェ",
    storyPattern: "思い込み → つまずく → 見直す → 学びになる",
    punchline: "AIは丸投げではなく、一緒に作る相手だった",
    elements: ["ノートPC", "スマホ", "AIアシスタント", "吹き出し", "4コマ枠"],
    panelPatterns: ["期待してAIに頼む", "思った結果と違って困る", "AIアシスタントが助言する", "AIは丸投げではなく一緒に作る相手だと気づく"],
    panels: [
      "主人公がAIに全部任せればすぐ完成すると思い、カフェで作業を始める。",
      "出てきた結果を見て、思っていたものと違うと困っている。",
      "AIアシスタントが、希望を言葉にしながら一緒に整えようと助言する。",
      "主人公がAIとの付き合い方を少し理解し、やさしく笑っている。",
    ],
  },
  自由テーマ: {
    theme: "自由入力",
    message: "共感",
    characters: "小さなAIアシスタント",
    setting: "自宅の机",
    storyPattern: "導入 → 困る → AIが助言 → 気づく",
    punchline: "AIは丸投げではなく、一緒に作る相手だった",
    elements: ["ノートPC", "メモ帳", "吹き出し", "4コマ枠"],
    panelPatterns: ["何から始めればいいか迷う", "思った結果と違って困る", "AIアシスタントが助言する", "AIは丸投げではなく一緒に作る相手だと気づく"],
    panels: [
      "主人公が選んだテーマについて考え始め、最初の状況がわかるように描く。",
      "主人公が小さなつまずきや困りごとに直面している。",
      "AIアシスタントまたは周囲の人物が、やさしくヒントを伝える。",
      "主人公が気づきを得て、前向きな表情になる。",
    ],
  },
};

const ids = {
  template: document.querySelector("#template"),
  theme: document.querySelector("#theme"),
  themeFree: document.querySelector("#themeFree"),
  message: document.querySelector("#message"),
  hero: document.querySelector("#hero"),
  characters: document.querySelector("#characters"),
  charactersFree: document.querySelector("#charactersFree"),
  setting: document.querySelector("#setting"),
  settingFree: document.querySelector("#settingFree"),
  storyPattern: document.querySelector("#storyPattern"),
  panel1Pattern: document.querySelector("#panel1Pattern"),
  panel1Free: document.querySelector("#panel1Free"),
  panel2Pattern: document.querySelector("#panel2Pattern"),
  panel2Free: document.querySelector("#panel2Free"),
  panel3Pattern: document.querySelector("#panel3Pattern"),
  panel3Free: document.querySelector("#panel3Free"),
  panel4Pattern: document.querySelector("#panel4Pattern"),
  panel4Free: document.querySelector("#panel4Free"),
  punchline: document.querySelector("#punchline"),
  punchlineFree: document.querySelector("#punchlineFree"),
  style: document.querySelector("#style"),
  mood: document.querySelector("#mood"),
  usage: document.querySelector("#usage"),
  size: document.querySelector("#size"),
  elements: document.querySelector("#elements"),
  avoid: document.querySelector("#avoid"),
  memo: document.querySelector("#memo"),
  saveName: document.querySelector("#saveName"),
  output: document.querySelector("#output"),
  status: document.querySelector("#status"),
  savedList: document.querySelector("#savedList"),
  savedEmpty: document.querySelector("#savedEmpty"),
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  populateSelects();
  populateChecks("elements", options.elements, []);
  populateChecks("avoid", options.avoid, options.avoid);
  ids.hero.value = defaultHero;
  ids.template.value = options.template[0];
  applyTemplate(ids.template.value);
  addEventListeners();
  toggleFreeInputs();
  renderSavedList();
}

function populateSelects() {
  Object.entries(options).forEach(([key, list]) => {
    if (!ids[key] || key === "elements" || key === "avoid") return;
    ids[key].innerHTML = list.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");
  });
}

function populateChecks(groupId, list, checkedItems) {
  ids[groupId].innerHTML = list
    .map(
      (item) => `
        <label class="check-label">
          <input type="checkbox" name="${groupId}" value="${escapeHtml(item)}" ${checkedItems.includes(item) ? "checked" : ""} />
          <span>${escapeHtml(item)}</span>
        </label>
      `
    )
    .join("");
}

function addEventListeners() {
  document.querySelector("#prompt-form").addEventListener("submit", (event) => {
    event.preventDefault();
    generatePrompt();
  });

  ids.template.addEventListener("change", () => {
    applyTemplate(ids.template.value);
    showStatus("テンプレートを反映しました");
  });

  [ids.theme, ids.characters, ids.setting, ids.punchline, ids.panel1Pattern, ids.panel2Pattern, ids.panel3Pattern, ids.panel4Pattern].forEach((select) => {
    select.addEventListener("change", toggleFreeInputs);
  });

  document.querySelector("#copyButton").addEventListener("click", copyPrompt);
  document.querySelector("#saveButton").addEventListener("click", saveState);
  document.querySelector("#loadButton").addEventListener("click", loadState);
  document.querySelector("#resetButton").addEventListener("click", resetForm);
  ids.savedList.addEventListener("click", handleSavedListClick);
}

function applyTemplate(templateName) {
  const template = templates[templateName];
  if (!template) return;

  setValue("theme", template.theme);
  setValue("message", template.message);
  setValue("characters", template.characters);
  setValue("setting", template.setting);
  setValue("storyPattern", template.storyPattern);
  setValue("punchline", template.punchline);
  setValue("style", "ブランドガイド準拠の手描き風");
  setValue("mood", "白・薄い青・紺色ベース");
  setValue("usage", "note記事の挿絵");
  setValue("size", "横長 16:9");
  setPanelPatternValues(template.panelPatterns);
  ids.hero.value = ids.hero.value || defaultHero;
  setCheckedValues("elements", template.elements);
  setCheckedValues("avoid", options.avoid);
  toggleFreeInputs();
}

function setValue(id, value) {
  if (ids[id] && value) ids[id].value = value;
}

function toggleFreeInputs() {
  toggleOne(ids.theme, ids.themeFree, "自由入力");
  toggleOne(ids.characters, ids.charactersFree, "自由入力");
  toggleOne(ids.setting, ids.settingFree, "自由入力");
  toggleOne(ids.punchline, ids.punchlineFree, "自由入力");
  toggleOne(ids.panel1Pattern, ids.panel1Free, "自由入力");
  toggleOne(ids.panel2Pattern, ids.panel2Free, "自由入力");
  toggleOne(ids.panel3Pattern, ids.panel3Free, "自由入力");
  toggleOne(ids.panel4Pattern, ids.panel4Free, "自由入力");
}

function toggleOne(select, input, trigger) {
  const shouldShow = select.value === trigger;
  input.hidden = !shouldShow;
  if (!shouldShow) input.value = "";
}

function setPanelPatternValues(panelPatterns = []) {
  [ids.panel1Pattern, ids.panel2Pattern, ids.panel3Pattern, ids.panel4Pattern].forEach((select, index) => {
    if (panelPatterns[index]) {
      select.value = panelPatterns[index];
    }
  });
  [ids.panel1Free, ids.panel2Free, ids.panel3Free, ids.panel4Free].forEach((input) => {
    input.value = "";
  });
}

function generatePrompt() {
  const data = collectData();
  const template = templates[data.template] || templates["自由テーマ"];
  const panels = buildPanels(data, template.panels);

  ids.output.value = `【4コマ漫画生成用プロンプト】

以下の条件で4コマ漫画を作成してください。

タイトル：
${data.title}

用途：
${data.usage}

画像サイズ・比率：
${data.size}

登場人物：
主人公は以下の設定で描いてください。
${data.hero}
全4コマで同じ人物として統一してください。
他の登場人物：${data.characters}

舞台：
${data.setting}。${data.elements.length ? `${data.elements.join("、")}を自然に入れてください。` : "背景はシンプルにしてください。"}

4コマ構成：
展開パターンは「${data.storyPattern}」です。

各コマの内容：
1コマ目：
${panels[0]}

2コマ目：
${panels[1]}

3コマ目：
${panels[2]}

4コマ目：
${panels[3]}

オチ：
${data.punchline}

セリフ方針：
${buildSpeechPolicy(data)}

絵柄：
${data.style}。やさしく、親しみやすい雰囲気にしてください。

色・雰囲気：
${data.mood}。

入れたい要素：
${data.elements.length ? data.elements.join("、") : "必要最小限の小物のみ"}

避けたいこと：
${data.avoid.length ? data.avoid.join("、") : "過度に複雑な表現"}

注意事項：
日本語の文字が自然に読めるようにしてください。
文字化けしないようにしてください。
主人公を若くしすぎないでください。
人物、服装、髪型、表情は全コマで統一してください。
背景はシンプルにし、4コマの内容が読み取りやすいレイアウトにしてください。
${data.memo ? `追加メモ：${data.memo}` : "追加メモ：セリフは少なめにし、note読者に伝わりやすい表現にしてください。"}`;

  showStatus("プロンプトを生成しました");
}

function buildPanels(data, basePanels) {
  const fallbackPanels = [
    "主人公がテーマについて考え始め、最初の状況がわかるように描く。",
    "主人公が小さなつまずきや困りごとに直面している。",
    "AIアシスタントまたは周囲の人物が、やさしくヒントを伝える。",
    "主人公が気づきを得て、前向きな表情になる。",
  ];

  return [1, 2, 3, 4].map((panelNumber, index) => {
    const selectedValue = data[`panel${panelNumber}`];
    const freeValue = data[`panel${panelNumber}Free`];
    const panelText = buildPanelText(panelNumber, selectedValue, freeValue, data);
    return panelText || basePanels?.[index] || fallbackPanels[index];
  });
}

function buildPanelText(panelNumber, selectedValue, freeValue, data) {
  if (selectedValue === "自由入力") {
    return freeValue?.trim() || "";
  }

  const textMap = {
    1: {
      不安そうに調べている:
        "主人公がノートPCの前で、HTML、CSS、JavaScript、GitHubなどの言葉を見ながら不安そうにしている。",
      期待してAIに頼む:
        `主人公が「${data.title}」を解決できそうだと期待し、AIに頼んでみようとしている。`,
      完成したと思って喜ぶ:
        "主人公が完成したと思ったアプリや画像を見て、ほっとした表情で喜んでいる。",
      何から始めればいいか迷う:
        "主人公がノートPCとメモ帳を前に、何から始めればよいのかわからず迷っている。",
      いつもの困りごとに気づく:
        `主人公が日常の中で「${data.title}」につながる困りごとに気づき、少し考え込んでいる。`,
      過去の失敗を思い出す:
        "主人公が以前うまくいかなかった作業を思い出し、同じ失敗を繰り返さないよう慎重になっている。",
    },
    2: {
      思った結果と違って困る:
        "主人公がAIの出力やアプリ画面を見て、思っていた結果と違うことに気づき困っている。",
      画面やレイアウトが崩れる:
        "主人公がスマホやPCの画面を確認し、ボタンや文字のレイアウトが崩れていることに驚いている。",
      専門用語が多くて混乱する:
        "画面に専門用語が並び、主人公が意味を追いきれず混乱している。",
      入力内容が足りないと気づく:
        "主人公がAIへの指示を見直し、伝えたい条件や固定したい内容が足りなかったと気づく。",
      AIから助言を受ける:
        "小さなAIアシスタントが現れて、主人公にやさしく助言している。",
      家族や周囲に相談する:
        "主人公が家族や周囲の人に相談し、使う人の目線で困りごとを聞いている。",
    },
    3: {
      AIアシスタントが助言する:
        "小さなAIアシスタントが現れて、主人公にやさしく助言している。",
      メモ帳に困りごとを書き出す:
        "主人公がメモ帳に困っていること、直したいこと、残したいことを一つずつ書き出している。",
      変更する部分と変えない部分を整理する:
        "主人公が変更する部分と変えない部分を分けて整理し、AIに伝える条件を明確にしている。",
      小さな機能から作り始める:
        "主人公が大きく作ろうとせず、小さな機能から少しずつ作り始めている。",
      スマホで実際に試す:
        "主人公がスマホで実際に操作し、文字の大きさや押しやすさを確認している。",
      もう一度プロンプトを具体化する:
        "主人公がもう一度プロンプトを見直し、目的、条件、変えない部分を具体的に書き直している。",
    },
    4: {
      最初の一歩が一番難しかったと気づく:
        "主人公が完成した小さなアプリ画面を見て、難しかったのはコードではなく最初の一歩だったと気づき、少し笑顔になる。",
      具体的に伝える大切さに気づく:
        "主人公が改善された結果を見て、AIにはあいまいな指示ではなく具体的に伝えることが大切だと気づく。",
      変えない部分を書く大切さに気づく:
        "主人公が望んだ結果に近づいた画面を見て、変える部分だけでなく変えない部分を書く大切さに気づく。",
      完成より改善が大事だと気づく:
        "主人公が修正を重ねた画面を見て、完成で終わりではなく改善を続けることが大事だと気づく。",
      自分の困りごとが誰かの役にも立つと気づく:
        "主人公が自分のために作ったものを見ながら、この困りごとは誰かの役にも立つかもしれないと気づく。",
      AIは丸投げではなく一緒に作る相手だと気づく:
        "主人公がAIアシスタントと並んで画面を見ながら、AIは丸投げする相手ではなく一緒に作る相手だと気づく。",
    },
  };

  return textMap[panelNumber]?.[selectedValue] || "";
}

function buildSpeechPolicy(data) {
  const base = "セリフは短く、読みやすい日本語にしてください。説明しすぎず、表情と状況で伝えてください。";
  const tone = {
    笑い: "少しクスッと笑える軽いツッコミを入れてください。",
    共感: "初心者やnote読者が「わかる」と感じる言葉にしてください。",
    学び: "最後に小さな学びが残る言葉にしてください。",
    初心者あるある: "初心者がつまずきやすい気持ちを自然に入れてください。",
    前向きな気づき: "不安から前向きになる流れを大切にしてください。",
    失敗から学ぶ: "失敗を責めず、次の改善につながる言葉にしてください。",
    ほっこり: "やさしく温かい言葉づかいにしてください。",
  };

  return `${base}${tone[data.message] ? ` ${tone[data.message]}` : ""}`;
}

function collectData() {
  return {
    template: ids.template.value,
    title: resolveValue("theme", "themeFree"),
    message: ids.message.value,
    hero: ids.hero.value.trim() || defaultHero,
    characters: resolveValue("characters", "charactersFree"),
    setting: resolveValue("setting", "settingFree"),
    storyPattern: ids.storyPattern.value,
    panel1: ids.panel1Pattern.value,
    panel1Free: ids.panel1Free.value.trim(),
    panel2: ids.panel2Pattern.value,
    panel2Free: ids.panel2Free.value.trim(),
    panel3: ids.panel3Pattern.value,
    panel3Free: ids.panel3Free.value.trim(),
    panel4: ids.panel4Pattern.value,
    panel4Free: ids.panel4Free.value.trim(),
    punchline: resolveValue("punchline", "punchlineFree"),
    style: ids.style.value,
    mood: ids.mood.value,
    usage: ids.usage.value,
    size: ids.size.value,
    elements: getCheckedValues("elements"),
    avoid: getCheckedValues("avoid"),
    memo: ids.memo.value.trim(),
  };
}

function resolveValue(selectId, freeId) {
  const selected = ids[selectId].value;
  if (selected === "自由入力") {
    return ids[freeId].value.trim() || "自由テーマ";
  }
  return selected;
}

async function copyPrompt() {
  if (!ids.output.value.trim()) {
    showStatus("先にプロンプトを生成してください");
    return;
  }

  try {
    await navigator.clipboard.writeText(ids.output.value);
    showStatus("コピーしました");
  } catch (error) {
    ids.output.select();
    document.execCommand("copy");
    showStatus("コピーしました");
  }
}

function saveState() {
  const formState = collectFormState();
  const resolvedTheme = getResolvedThemeFromState(formState);
  const savedItem = {
    id: createSaveId(),
    name: ids.saveName.value.trim() || resolvedTheme,
    savedAt: new Date().toISOString(),
    formState,
    output: ids.output.value,
  };
  const savedList = getSavedList();
  savedList.unshift(savedItem);
  setSavedList(savedList);
  renderSavedList();
  showStatus("入力内容を保存しました");
}

function loadState() {
  const savedList = getSavedList();
  if (savedList.length) {
    loadSavedItem(savedList[0].id);
    return;
  }

  const legacyState = getLegacyState();
  if (!legacyState) {
    showStatus("保存内容がありません");
    return;
  }

  applyFormState(legacyState);
  ids.output.value = legacyState.output || "";
  showStatus("保存内容を読み込みました");
}

function collectFormState() {
  const state = {};
  document.querySelectorAll("[data-save]").forEach((field) => {
    state[field.id] = field.value;
  });
  state.elements = getCheckedValues("elements");
  state.avoid = getCheckedValues("avoid");
  return state;
}

function applyFormState(state) {
  document.querySelectorAll("[data-save]").forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(state, field.id)) {
      field.value = state[field.id];
    }
  });
  setCheckedValues("elements", state.elements || []);
  setCheckedValues("avoid", state.avoid || options.avoid);
  toggleFreeInputs();
}

function resetForm() {
  ids.output.value = "";
  ids.memo.value = "";
  ids.saveName.value = "";
  ids.hero.value = defaultHero;
  ids.template.value = options.template[0];
  ids.themeFree.value = "";
  ids.charactersFree.value = "";
  ids.settingFree.value = "";
  ids.punchlineFree.value = "";
  applyTemplate(ids.template.value);
  showStatus("リセットしました");
}

function handleSavedListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  if (action === "load") {
    loadSavedItem(id);
  }
  if (action === "delete") {
    deleteSavedItem(id);
  }
}

function loadSavedItem(id) {
  const savedItem = getSavedList().find((item) => item.id === id);
  if (!savedItem) {
    showStatus("保存内容が見つかりません");
    return;
  }

  applyFormState(savedItem.formState || {});
  ids.output.value = savedItem.output || "";
  showStatus("保存内容を読み込みました");
}

function deleteSavedItem(id) {
  const savedList = getSavedList();
  const savedItem = savedList.find((item) => item.id === id);
  if (!savedItem) return;

  if (!confirm(`「${savedItem.name}」を削除しますか？`)) return;

  setSavedList(savedList.filter((item) => item.id !== id));
  renderSavedList();
  showStatus("保存データを削除しました");
}

function renderSavedList() {
  const savedList = getSavedList();
  ids.savedEmpty.hidden = savedList.length > 0;
  ids.savedList.innerHTML = savedList.map(renderSavedItem).join("");
}

function renderSavedItem(item) {
  const formState = item.formState || {};
  const templateName = formState.template || "未設定";
  const theme = getResolvedThemeFromState(formState);
  const usage = formState.usage || "未設定";

  return `
    <article class="saved-item">
      <div>
        <h3 class="saved-title">${escapeHtml(item.name || theme)}</h3>
        <dl class="saved-meta">
          <div>
            <dt>テンプレート名：</dt>
            <dd>${escapeHtml(templateName)}</dd>
          </div>
          <div>
            <dt>テーマ：</dt>
            <dd>${escapeHtml(theme)}</dd>
          </div>
          <div>
            <dt>用途：</dt>
            <dd>${escapeHtml(usage)}</dd>
          </div>
          <div>
            <dt>保存日時：</dt>
            <dd>${escapeHtml(formatSavedAt(item.savedAt))}</dd>
          </div>
        </dl>
      </div>
      <div class="saved-actions">
        <button class="secondary-button" type="button" data-action="load" data-id="${escapeHtml(item.id)}">読み込み</button>
        <button class="danger-button" type="button" data-action="delete" data-id="${escapeHtml(item.id)}">削除</button>
      </div>
    </article>
  `;
}

function getSavedList() {
  try {
    const raw = localStorage.getItem(SAVED_LIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function setSavedList(savedList) {
  localStorage.setItem(SAVED_LIST_KEY, JSON.stringify(savedList));
}

function getLegacyState() {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function getResolvedThemeFromState(state) {
  if (state.theme === "自由入力") {
    return state.themeFree?.trim() || "自由テーマ";
  }
  return state.theme || "自由テーマ";
}

function createSaveId() {
  return `save-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatSavedAt(savedAt) {
  if (!savedAt) return "日時不明";
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) return "日時不明";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getCheckedValues(groupName) {
  return Array.from(document.querySelectorAll(`input[name="${groupName}"]:checked`)).map((input) => input.value);
}

function setCheckedValues(groupName, values) {
  document.querySelectorAll(`input[name="${groupName}"]`).forEach((input) => {
    input.checked = values.includes(input.value);
  });
}

function showStatus(message) {
  ids.status.textContent = message;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
