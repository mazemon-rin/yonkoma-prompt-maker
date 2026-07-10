const LEGACY_STORAGE_KEY = "yonkomaPromptMakerState";
const SAVED_LIST_KEY = "yonkomaPromptMakerSavedList";
let copyResetTimer = null;

// 主人公の初期設定
// 個人用に使う場合は、この初期値を自分のブランドガイドに合わせて変更してください。
const defaultHeroSettings = {
  heroAge: "大人",
  heroType: "親しみやすい人物",
  heroPersonality: "親しみやすい",
  heroExpression: "やさしい表情",
  heroClothes: "シンプルな私服",
  heroHair: "指定しない",
  heroRole: "読者の分身",
  heroMemo: "手描き風のやさしいタッチ。全体を通して同じ人物として統一してください。",
};

// 公開用テンプレート
// 個人用にカスタマイズする場合は、この templates と options.theme を差し替えてください。
const options = {
  template: [
    "日常漫画",
    "4コマ漫画",
    "やさしいイラスト",
    "ビジネス挿絵",
    "風景写真風",
    "ファンタジー",
    "シンプル背景",
    "SNS投稿向け",
    "ブログ挿絵",
    "自由テーマ",
  ],
  theme: [
    "朝の出来事",
    "仕事中",
    "休憩時間",
    "家で過ごす時間",
    "買い物中",
    "料理をしている",
    "散歩をしている",
    "家族との時間",
    "友人との会話",
    "趣味を楽しむ",
    "考えごとをする",
    "失敗してしまう",
    "嬉しい出来事",
    "困ってしまう",
    "悩んでしまう",
    "チャレンジする",
    "一歩踏み出す",
    "振り返る",
    "自由入力",
  ],
  message: ["笑い", "涙", "癒し", "疲れ", "学び", "共感", "驚き", "勇気", "懐かしさ", "前向きな気持ち", "静か", "季節感", "自由入力"],
  aiModel: ["ChatGPT", "Gemini", "Imagen", "Midjourney", "Flux", "その他（汎用）", "自由入力"],
  heroReferenceType: ["オリジナル", "人物ルール", "基準画像", "人物ルール＋基準画像", "自由入力"],
  heroAge: ["指定しない", "子ども", "学生", "若い大人", "大人", "中年", "シニア", "自由入力"],
  heroType: ["指定しない", "男性", "女性", "性別を強調しない", "中性的", "親しみやすい人物", "自由入力"],
  heroPersonality: ["親しみやすい", "落ち着いた", "前向き", "真面目", "少し不安そう", "明るい", "やさしい", "自由入力"],
  heroExpression: ["やさしい表情", "困った表情", "驚いた表情", "考え込む表情", "笑顔", "安心した表情", "前向きな表情", "自由入力"],
  heroClothes: ["シンプルな私服", "パーカー", "シャツ", "仕事着", "エプロン", "カジュアルな服装", "指定しない", "自由入力"],
  heroHair: ["指定しない", "短髪", "黒髪", "茶髪", "白髪混じり", "落ち着いた髪型", "自由入力"],
  heroRole: ["初心者", "相談する人", "挑戦する人", "失敗から学ぶ人", "読者の分身", "説明役", "自由入力"],
  characters: ["小さな案内役", "主人公のみ", "家族", "同僚", "医師", "店員", "ツッコミ役", "自由入力"],
  setting: ["自宅の部屋", "カフェ", "職場", "学校", "公園", "森", "海", "山", "商店街", "自由入力"],
  panel1Pattern: ["不安そうに調べている", "期待してお願いする", "完成したと思って喜ぶ", "何から始めればいいか迷う", "いつもの困りごとに気づく", "過去の失敗を思い出す", "自由入力"],
  panel2Pattern: ["思った結果と違って困る", "画面やレイアウトが崩れる", "専門用語が多くて混乱する", "入力内容が足りないと気づく", "誰かから助言を受ける", "家族や周囲に相談する", "自由入力"],
  panel3Pattern: ["小さな案内役が助言する", "メモ帳に困りごとを書き出す", "変更する部分と変えない部分を整理する", "小さな一歩から始める", "スマホで実際に試す", "もう一度内容を具体化する", "自由入力"],
  panel4Pattern: ["最初の一歩が一番難しかったと気づく", "具体的に伝える大切さに気づく", "変えない部分を書く大切さに気づく", "完成より改善が大事だと気づく", "自分の困りごとが誰かの役にも立つと気づく", "一緒に考える大切さに気づく", "自由入力"],
  punchline: ["少し笑顔になる", "ほっとする", "気づく", "安心する", "少し驚く", "納得する", "考えさせられる", "続きが気になる", "一件落着", "自由入力"],
  style: ["やさしい手描き風", "エッセイ漫画風", "シンプル漫画風", "デフォルメ漫画風", "セルアニメ風", "現代アニメ風", "水彩画風", "色鉛筆風", "絵本風", "油絵風", "パステル風", "フラットイラスト風", "ミニマルデザイン風", "写真風", "映画ポスター風", "自由入力"],
  mood: ["明るい", "やさしい", "ほっこり", "静か", "落ち着いた", "切ない", "楽しい", "少し疲れた雰囲気", "幻想的", "季節感がある", "自由入力"],
  usage: ["note記事の挿絵", "note記事のヘッダー", "Instagram投稿用", "X投稿用", "ブログ用", "YouTubeサムネイル用", "プレゼン資料用", "チラシ用", "個人メモ用", "自由入力"],
  size: ["横長 16:9", "noteヘッダー 1920×1006", "正方形 1:1", "縦長 9:16", "A4横", "A4縦", "自由入力"],
  elements: ["吹き出し", "4コマ枠", "メモ帳", "ペン", "本"],
  avoid: [
    "文字化け",
    "英語表記",
    "主人公が若すぎる",
    "メガネ",
    "ひげ",
    "派手な服",
    "怖い表情",
    "リアル写真風",
    "背景を細かくしすぎる",
    "レイアウト崩れ",
    "今回の指示にない物をAIが補完して追加しない",
    "舞台に合わない小物を描かない",
    "不要なデジタル機器を描かない",
  ],
};

const commonElements = options.elements;
const commonAvoids = options.avoid;

const settingElementMap = {
  自宅の部屋: ["クッション", "湯のみ", "写真立て", "小さなテーブル"],
  カフェ: ["コーヒーカップ", "ケーキ皿", "メニュー", "観葉植物"],
  職場: ["資料ファイル", "名札", "ホワイトボード", "ペン"],
  学校: ["黒板", "教科書", "ノート", "チョーク"],
  公園: ["ベンチ", "木", "花", "散歩道"],
  森: ["木漏れ日", "落ち葉", "小道", "きのこ"],
  海: ["貝殻", "砂浜", "波", "灯台"],
  山: ["リュック", "登山道", "木の枝", "岩"],
  商店街: ["買い物かご", "のれん", "紙袋", "商品棚"],
  自由入力: ["花束", "傘", "診察券", "カルテ", "工具"],
};

const settingAvoidMap = {
  自宅の部屋: ["会社のオフィス風にしない", "カフェ風にしない", "店舗のようにしない", "背景を生活感で散らかしすぎない"],
  カフェ: ["会社のオフィス風にしない", "学校の教室風にしない", "病院や診察室のようにしない", "ノートPCや作業機器を勝手に追加しない"],
  職場: ["自宅の部屋のようにしない", "カフェ風にしない", "学校の教室風にしない", "背景を細かい書類でごちゃごちゃさせない"],
  学校: ["会社のオフィス風にしない", "カフェ風にしない", "病院風にしない", "主人公を学生のように若く描きすぎない"],
  公園: ["室内にしない", "カフェ風にしない", "職場風にしない", "背景を細かく描き込みすぎない"],
  森: ["街中にしない", "室内にしない", "怖い森や暗い雰囲気にしない", "背景を複雑にしすぎない"],
  海: ["山や森の風景にしない", "暗い嵐の海にしない", "水着や派手なリゾート表現にしない", "背景を派手にしすぎない"],
  山: ["海辺にしない", "街中にしない", "危険な登山や遭難の雰囲気にしない", "背景を険しくしすぎない"],
  商店街: ["大型ショッピングモール風にしない", "会社のオフィス風にしない", "背景の看板文字を増やしすぎない", "英語看板を入れない"],
  自由入力: ["舞台に合わない小物を追加しない", "今回の指示にない物を補完しない", "不要なデジタル機器を描かない"],
};

const templates = {
  日常漫画: makeTemplate("朝の出来事", "共感", "ツッコミ役", "自宅の部屋", "少し笑顔になる", [], ["完成したと思って喜ぶ", "思った結果と違って困る", "変更する部分と変えない部分を整理する", "完成より改善が大事だと気づく"], "日常の小さな出来事を、表情と状況が伝わる漫画風の場面として描く。", { style: "エッセイ漫画風", mood: "楽しい", usage: "note記事の挿絵", size: "正方形 1:1" }),
  "4コマ漫画": makeTemplate("失敗してしまう", "笑い", "ツッコミ役", "自宅の部屋", "一件落着", ["4コマ枠", "吹き出し"], ["完成したと思って喜ぶ", "思った結果と違って困る", "変更する部分と変えない部分を整理する", "完成より改善が大事だと気づく"], "4コマ漫画として、導入から最後の印象までが自然に伝わる構成で描く。", { mode: "yonkoma", style: "シンプル漫画風", mood: "楽しい", usage: "note記事の挿絵", size: "正方形 1:1" }),
  やさしいイラスト: makeTemplate("ありがとう", "癒し", "主人公のみ", "自宅の部屋", "ほっとする", [], ["いつもの困りごとに気づく", "入力内容が足りないと気づく", "メモ帳に困りごとを書き出す", "自分の困りごとが誰かの役にも立つと気づく"], "主人公の日常にあるやさしい気持ちや小さな幸せが伝わる1枚絵にする。", { style: "やさしい手描き風", mood: "やさしい", usage: "note記事の挿絵", size: "横長 16:9" }),
  ビジネス挿絵: makeTemplate("仕事中", "学び", "同僚", "職場", "納得する", [], ["いつもの困りごとに気づく", "思った結果と違って困る", "変更する部分と変えない部分を整理する", "完成より改善が大事だと気づく"], "仕事や学習の場面を、情報が伝わりやすい挿絵として整理して描く。", { style: "フラットイラスト風", mood: "落ち着いた", usage: "プレゼン資料用", size: "横長 16:9" }),
  風景写真風: makeTemplate("晴れの日", "癒し", "主人公のみ", "公園", "ほっとする", [], ["いつもの困りごとに気づく", "家族や周囲に相談する", "小さな一歩から始める", "自分の困りごとが誰かの役にも立つと気づく"], "風景を主役にし、人物や小物は必要最小限にして空気感が伝わる構図にする。", { style: "写真風", mood: "季節感がある", usage: "ブログ用", size: "横長 16:9" }),
  ファンタジー: makeTemplate("森の入口", "勇気", "小さな案内役", "森", "続きが気になる", [], ["何から始めればいいか迷う", "誰かから助言を受ける", "小さな一歩から始める", "一緒に考える大切さに気づく"], "現実から少し離れた不思議な世界で、主人公が小さな一歩を踏み出す場面にする。", { style: "現代アニメ風", mood: "幻想的", usage: "Instagram投稿用", size: "縦長 9:16" }),
  シンプル背景: makeTemplate("考えごとをする", "前向きな気持ち", "主人公のみ", "自宅の部屋", "気づく", [], ["何から始めればいいか迷う", "入力内容が足りないと気づく", "小さな一歩から始める", "最初の一歩が一番難しかったと気づく"], "背景を極力シンプルにし、主人公の表情と状況が伝わる構図で描く。", { style: "ミニマルデザイン風", mood: "明るい", usage: "X投稿用", size: "正方形 1:1" }),
  SNS投稿向け: makeTemplate("嬉しい出来事", "前向きな気持ち", "主人公のみ", "カフェ", "少し笑顔になる", [], ["期待してお願いする", "思った結果と違って困る", "もう一度内容を具体化する", "一緒に考える大切さに気づく"], "SNSで見やすいように、主題が一目で伝わる構図にする。", { style: "フラットイラスト風", mood: "明るい", usage: "Instagram投稿用", size: "正方形 1:1" }),
  ブログ挿絵: makeTemplate("休憩時間", "共感", "主人公のみ", "カフェ", "ほっとする", [], ["いつもの困りごとに気づく", "家族や周囲に相談する", "メモ帳に困りごとを書き出す", "一緒に考える大切さに気づく"], "文章の内容を補う挿絵として、落ち着いた余白のある構図にする。", { style: "やさしい手描き風", mood: "ほっこり", usage: "ブログ用", size: "横長 16:9" }),
  自由テーマ: makeTemplate("自由入力", "共感", "主人公のみ", "自由入力", "自由入力", [], ["何から始めればいいか迷う", "思った結果と違って困る", "メモ帳に困りごとを書き出す", "一緒に考える大切さに気づく"], "選んだテーマに合わせて、主人公の気持ちや状況が伝わるイラストにする。", { style: "自由入力", mood: "自由入力", usage: "自由入力", size: "横長 16:9" }),
};

const templateThemeOptions = {
  日常漫画: [
    makeThemeOption("朝の出来事", "共感", "自宅の部屋", "明るい", ["吹き出し"]),
    makeThemeOption("仕事中", "学び", "職場", "落ち着いた", ["吹き出し"]),
    makeThemeOption("休憩時間", "癒し", "カフェ", "ほっこり", ["コーヒーカップ"]),
    makeThemeOption("家で過ごす時間", "共感", "自宅の部屋", "やさしい"),
    makeThemeOption("買い物中", "共感", "商店街", "楽しい", ["買い物かご"]),
    makeThemeOption("料理をしている", "笑い", "自宅の部屋", "楽しい"),
    makeThemeOption("散歩をしている", "癒し", "公園", "明るい"),
    makeThemeOption("家族との時間", "癒し", "自宅の部屋", "ほっこり"),
    makeThemeOption("友人との会話", "共感", "カフェ", "楽しい", ["吹き出し"]),
    makeThemeOption("趣味を楽しむ", "前向きな気持ち", "自宅の部屋", "明るい"),
    makeThemeOption("考えごとをする", "静か", "カフェ", "静か"),
    makeThemeOption("失敗してしまう", "笑い", "自宅の部屋", "楽しい", ["吹き出し"]),
    makeThemeOption("小さな発見", "驚き", "公園", "明るい"),
    makeThemeOption("嬉しい出来事", "前向きな気持ち", "自宅の部屋", "明るい"),
    makeThemeOption("困ってしまう", "共感", "職場", "落ち着いた", ["吹き出し"]),
    makeThemeOption("悩んでしまう", "共感", "カフェ", "静か"),
    makeThemeOption("チャレンジする", "勇気", "学校", "明るい"),
    makeThemeOption("一歩踏み出す", "勇気", "公園", "明るい"),
    makeThemeOption("振り返る", "懐かしさ", "自宅の部屋", "静か"),
    makeThemeOption("自由入力", "共感", "自由入力", "自由入力"),
  ],
  "4コマ漫画": [
    makeThemeOption("朝の出来事", "笑い", "自宅の部屋", "楽しい", ["4コマ枠", "吹き出し"]),
    makeThemeOption("買い物中", "共感", "商店街", "楽しい", ["4コマ枠", "買い物かご"]),
    makeThemeOption("料理をしている", "笑い", "自宅の部屋", "楽しい", ["4コマ枠"]),
    makeThemeOption("失敗してしまう", "笑い", "自宅の部屋", "楽しい", ["4コマ枠", "吹き出し"]),
    makeThemeOption("困ってしまう", "共感", "職場", "落ち着いた", ["4コマ枠", "吹き出し"]),
    makeThemeOption("嬉しい出来事", "前向きな気持ち", "カフェ", "明るい", ["4コマ枠"]),
    makeThemeOption("友人との会話", "共感", "カフェ", "楽しい", ["4コマ枠", "吹き出し"]),
    makeThemeOption("自由入力", "共感", "自由入力", "自由入力", ["4コマ枠"]),
  ],
  やさしいイラスト: [
    makeThemeOption("ありがとう", "癒し", "自宅の部屋", "やさしい"),
    makeThemeOption("ほっとする時間", "癒し", "カフェ", "ほっこり", ["コーヒーカップ"]),
    makeThemeOption("休憩", "疲れ", "自宅の部屋", "静か"),
    makeThemeOption("応援したい", "勇気", "公園", "明るい"),
    makeThemeOption("笑顔", "前向きな気持ち", "公園", "明るい"),
    makeThemeOption("家族", "癒し", "自宅の部屋", "やさしい"),
    makeThemeOption("休日", "癒し", "カフェ", "ほっこり"),
    makeThemeOption("小さな幸せ", "共感", "自宅の部屋", "やさしい"),
    makeThemeOption("深呼吸", "癒し", "公園", "静か"),
    makeThemeOption("自由入力", "共感", "自由入力", "自由入力"),
  ],
  ビジネス挿絵: [
    makeThemeOption("仕事中", "学び", "職場", "落ち着いた"),
    makeThemeOption("打ち合わせ", "共感", "職場", "落ち着いた", ["吹き出し"]),
    makeThemeOption("資料整理", "学び", "職場", "静か", ["資料ファイル"]),
    makeThemeOption("休憩時間", "癒し", "カフェ", "ほっこり", ["コーヒーカップ"]),
    makeThemeOption("新しい目標", "勇気", "職場", "明るい"),
    makeThemeOption("考えをまとめる", "学び", "職場", "静か", ["ペン"]),
    makeThemeOption("同僚との会話", "共感", "職場", "落ち着いた", ["吹き出し"]),
    makeThemeOption("帰り道", "懐かしさ", "商店街", "切ない"),
    makeThemeOption("自由入力", "学び", "自由入力", "自由入力"),
  ],
  風景写真風: [
    makeThemeOption("晴れの日", "癒し", "公園", "明るい"),
    makeThemeOption("雨の日", "静か", "商店街", "静か"),
    makeThemeOption("夕暮れ", "懐かしさ", "海", "切ない"),
    makeThemeOption("朝", "前向きな気持ち", "山", "明るい"),
    makeThemeOption("夜", "静か", "商店街", "静か"),
    makeThemeOption("春", "季節感", "公園", "季節感がある"),
    makeThemeOption("夏", "季節感", "海", "明るい"),
    makeThemeOption("秋", "懐かしさ", "森", "季節感がある"),
    makeThemeOption("冬", "静か", "山", "静か"),
    makeThemeOption("自由入力", "癒し", "自由入力", "自由入力"),
  ],
  ファンタジー: [
    makeThemeOption("森の入口", "勇気", "森", "幻想的"),
    makeThemeOption("光る小道", "癒し", "森", "幻想的"),
    makeThemeOption("夜明けの山", "勇気", "山", "幻想的"),
    makeThemeOption("不思議な街角", "驚き", "商店街", "幻想的"),
    makeThemeOption("小さな旅", "前向きな気持ち", "森", "幻想的"),
    makeThemeOption("星空の下", "静か", "山", "幻想的"),
    makeThemeOption("秘密の扉", "驚き", "自宅の部屋", "幻想的"),
    makeThemeOption("やさしい魔法", "癒し", "公園", "やさしい"),
    makeThemeOption("自由入力", "勇気", "自由入力", "自由入力"),
  ],
  シンプル背景: [
    makeThemeOption("考えごとをする", "学び", "自宅の部屋", "静か"),
    makeThemeOption("一歩踏み出す", "勇気", "公園", "明るい"),
    makeThemeOption("静かに座る", "静か", "カフェ", "静か"),
    makeThemeOption("困っている", "共感", "自宅の部屋", "やさしい"),
    makeThemeOption("笑顔になる", "前向きな気持ち", "公園", "明るい"),
    makeThemeOption("説明する", "学び", "職場", "落ち着いた", ["吹き出し"]),
    makeThemeOption("休憩する", "癒し", "自宅の部屋", "ほっこり"),
    makeThemeOption("振り返る", "懐かしさ", "自宅の部屋", "静か"),
    makeThemeOption("自由入力", "前向きな気持ち", "自由入力", "自由入力"),
  ],
  SNS投稿向け: [
    makeThemeOption("嬉しい出来事", "前向きな気持ち", "カフェ", "明るい"),
    makeThemeOption("小さな幸せ", "癒し", "自宅の部屋", "やさしい"),
    makeThemeOption("一歩踏み出す", "勇気", "公園", "明るい"),
    makeThemeOption("休日", "癒し", "カフェ", "ほっこり"),
    makeThemeOption("趣味を楽しむ", "前向きな気持ち", "自宅の部屋", "明るい"),
    makeThemeOption("季節を感じる", "季節感", "公園", "季節感がある"),
    makeThemeOption("自由入力", "前向きな気持ち", "自由入力", "自由入力"),
  ],
  ブログ挿絵: [
    makeThemeOption("休憩時間", "共感", "カフェ", "ほっこり", ["コーヒーカップ"]),
    makeThemeOption("考えごとをする", "静か", "自宅の部屋", "静か"),
    makeThemeOption("散歩をしている", "癒し", "公園", "明るい"),
    makeThemeOption("家で過ごす時間", "共感", "自宅の部屋", "やさしい"),
    makeThemeOption("振り返る", "懐かしさ", "自宅の部屋", "静か"),
    makeThemeOption("困ってしまう", "共感", "カフェ", "落ち着いた"),
    makeThemeOption("自由入力", "共感", "自由入力", "自由入力"),
  ],
  自由テーマ: [
    makeThemeOption("自由入力", "共感", "自由入力", "自由入力"),
  ],
};

function makeThemeOption(theme, message, setting, mood, elements = [], avoid = []) {
  return { theme, message, setting, mood, elements, avoid };
}

function makeTemplate(theme, message, characters, setting, punchline, elements, panelPatterns, singlePrompt, settings = {}) {
  return {
    theme,
    message,
    characters,
    setting,
    punchline,
    elements,
    panelPatterns,
    singlePrompt,
    ...settings,
    panels: [
      "主人公がテーマに関わる状況に気づき、物語が始まる場面。",
      "主人公が小さな困りごとや迷いに直面している場面。",
      "主人公が考えを整理したり、誰かの助言を受けたりしている場面。",
      "主人公が気づきを得て、少し前向きな表情になる場面。",
    ],
  };
}

const ids = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  bindIds();
  populateSelects();
  updateSettingDependentChoices({ elements: [], avoid: [] });
  applyHeroSettings(defaultHeroSettings);
  ids.workMode.value = "single";
  ids.template.value = options.template[0];
  applyTemplate(ids.template.value);
  addEventListeners();
  updateModeUI();
  toggleFreeInputs();
  renderSavedList();
}

function bindIds() {
  [
    "workMode", "template", "theme", "themeFree", "message", "messageFree", "aiModel", "aiModelFree", "heroReferenceType", "heroReferenceTypeFree", "heroAge", "heroAgeFree", "heroType", "heroTypeFree", "heroPersonality", "heroPersonalityFree",
    "heroExpression", "heroExpressionFree", "heroClothes", "heroClothesFree", "heroHair", "heroHairFree", "heroRole", "heroRoleFree",
    "heroMemo", "useCharacterRule", "useMasterImage", "characterRuleMessage", "masterImageMessage", "characters", "charactersFree", "setting", "settingFree", "panel1Pattern", "panel1Free", "panel2Pattern", "panel2Free",
    "panel3Pattern", "panel3Free", "panel4Pattern", "panel4Free", "punchline", "punchlineFree", "style", "styleFree", "mood", "moodFree",
    "usage", "usageFree", "size", "sizeFree", "elements", "elementsFree", "avoid", "avoidFree", "memo", "saveName", "output", "status", "savedList", "savedEmpty",
  ].forEach((id) => {
    ids[id] = document.querySelector(`#${id}`);
  });
  ids.yonkomaPanelSection = document.querySelector("#yonkomaPanelSection");
  ids.punchlineField = document.querySelector("#punchlineField");
}

function populateSelects() {
  Object.entries(options).forEach(([key, list]) => {
    if (!ids[key] || key === "elements" || key === "avoid") return;
    ids[key].innerHTML = list.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");
  });
}

function populateChecks(groupId, list, checkedItems) {
  ids[groupId].innerHTML = list
    .map((item) => `
      <label class="check-label">
        <input type="checkbox" name="${groupId}" value="${escapeHtml(item)}" ${checkedItems.includes(item) ? "checked" : ""} />
        <span>${escapeHtml(item)}</span>
      </label>
    `)
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
  document.querySelectorAll("[data-work-mode]").forEach((button) => {
    button.addEventListener("click", () => setWorkMode(button.dataset.workMode));
  });
  [
    ids.message, ids.aiModel, ids.heroReferenceType, ids.heroAge, ids.heroType, ids.heroPersonality, ids.heroExpression, ids.heroClothes, ids.heroHair, ids.heroRole, ids.characters,
    ids.punchline, ids.panel1Pattern, ids.panel2Pattern, ids.panel3Pattern, ids.panel4Pattern, ids.style, ids.mood, ids.usage, ids.size,
  ].forEach((select) => {
    select.addEventListener("change", toggleFreeInputs);
  });
  ids.theme.addEventListener("change", () => {
    applyThemeOption(ids.theme.value);
    toggleFreeInputs();
  });
  ids.setting.addEventListener("change", () => {
    toggleFreeInputs();
    updateSettingDependentChoices();
  });
  ids.heroReferenceType.addEventListener("change", () => {
    updateReferenceChecksFromType();
    showStatus(`${ids.heroReferenceType.value}の主人公タイプに切り替えました`);
  });
  ids.useCharacterRule.addEventListener("change", () => {
    updateHeroReferenceTypeFromChecks();
    showStatus(ids.useCharacterRule.checked ? "人物ルール画像をChatに貼り付けてください" : "人物ルール参照を無効にしました");
  });
  ids.useMasterImage.addEventListener("change", () => {
    updateHeroReferenceTypeFromChecks();
    showStatus(ids.useMasterImage.checked ? "基準画像をChatに貼り付けてください" : "基準画像参照を無効にしました");
  });
  document.querySelector("#copyButton").addEventListener("click", copyPrompt);
  document.querySelector("#saveButton").addEventListener("click", saveState);
  document.querySelector("#loadButton").addEventListener("click", loadState);
  document.querySelector("#resetButton").addEventListener("click", resetForm);
  document.querySelectorAll("[data-instagram-size]").forEach((button) => {
    button.addEventListener("click", () => applyInstagramSize(button.dataset.instagramSize));
  });
  ids.savedList.addEventListener("click", handleSavedListClick);
}

function setWorkMode(mode) {
  ids.workMode.value = mode;
  updateModeUI();
  showStatus(mode === "single" ? "1枚絵モードに切り替えました" : "4コマ漫画モードに切り替えました");
}

function updateModeUI() {
  const mode = ids.workMode.value || "single";
  document.querySelectorAll("[data-work-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.workMode === mode);
  });
  ids.yonkomaPanelSection.hidden = mode === "single";
  ids.punchlineField.hidden = mode === "single";
}

function applyInstagramSize(sizeType) {
  const settings = {
    square: { usage: "Instagram投稿用", size: "正方形 1:1", status: "Instagram投稿用の正方形サイズを設定しました" },
    reel: { usage: "Instagram投稿用", size: "縦長 9:16", memo: "Instagramリール向け。スマホで見やすい縦長構図にする。", status: "Instagramリール用の縦長サイズを設定しました" },
    story: { usage: "Instagram投稿用", size: "縦長 9:16", memo: "Instagramストーリーズ向け。上下に余白を取り、文字が切れないようにする。", status: "Instagramストーリーズ用の縦長サイズを設定しました" },
    landscape: { usage: "Instagram投稿用", size: "横長 16:9", status: "Instagram横長投稿用のサイズを設定しました" },
  };
  const setting = settings[sizeType];
  if (!setting) return;
  ids.usage.value = setting.usage;
  ids.size.value = setting.size;
  if (setting.memo) appendMemo(setting.memo);
  showStatus(setting.status);
}

function appendMemo(text) {
  const currentMemo = ids.memo.value.trim();
  if (currentMemo.includes(text)) return;
  ids.memo.value = currentMemo ? `${currentMemo}\n${text}` : text;
}

function applyTemplate(templateName) {
  const template = templates[templateName];
  if (!template) return;
  if (template.mode) {
    ids.workMode.value = template.mode;
    updateModeUI();
  }
  populateThemeOptions(templateName);
  setValue("theme", template.theme);
  applyThemeOption(ids.theme.value, templateName);
  setValue("characters", template.characters);
  setValue("punchline", template.punchline);
  setValue("style", template.style || "やさしい手描き風");
  setValue("usage", template.usage || "note記事の挿絵");
  setValue("aiModel", "ChatGPT");
  setValue("size", template.size || "横長 16:9");
  setFreeValue("themeFree", template.themeFree);
  setFreeValue("messageFree", template.messageFree);
  setFreeValue("aiModelFree", template.aiModelFree);
  setFreeValue("heroReferenceTypeFree", template.heroReferenceTypeFree);
  setFreeValue("heroAgeFree", template.heroAgeFree);
  setFreeValue("heroTypeFree", template.heroTypeFree);
  setFreeValue("settingFree", template.settingFree);
  setFreeValue("punchlineFree", template.punchlineFree);
  setFreeValue("styleFree", template.styleFree);
  setFreeValue("moodFree", template.moodFree);
  setFreeValue("usageFree", template.usageFree);
  setFreeValue("sizeFree", template.sizeFree);
  applyHeroSettings({ ...defaultHeroSettings, ...(template.heroSettings || {}) });
  setPanelPatternValues(template.panelPatterns);
  updateSettingDependentChoices({ elements: template.elements, avoid: getDefaultAvoidsForSetting(ids.setting.value) });
  toggleFreeInputs();
}

function populateThemeOptions(templateName, selectedTheme = "") {
  const themeOptions = uniqueList([...getTemplateThemeOptions(templateName).map((item) => item.theme), selectedTheme]);
  ids.theme.innerHTML = themeOptions.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");
  if (selectedTheme && themeOptions.includes(selectedTheme)) ids.theme.value = selectedTheme;
}

function getTemplateThemeOptions(templateName = ids.template.value) {
  return templateThemeOptions[templateName] || options.theme.map((theme) => ({ theme }));
}

function applyThemeOption(themeName, templateName = ids.template.value) {
  const themeOption = getTemplateThemeOptions(templateName).find((item) => item.theme === themeName);
  if (!themeOption) return;
  if (themeOption.message) setValue("message", themeOption.message);
  if (themeOption.setting) setValue("setting", themeOption.setting);
  if (themeOption.mood) setValue("mood", themeOption.mood);
  updateSettingDependentChoices({
    elements: themeOption.elements || [],
    avoid: uniqueList([...getDefaultAvoidsForSetting(ids.setting.value), ...(themeOption.avoid || [])]),
  });
}

function setValue(id, value) {
  if (ids[id] && value) ids[id].value = value;
}

function setFreeValue(id, value = "") {
  if (ids[id]) ids[id].value = value;
}

function toggleFreeInputs() {
  toggleOne(ids.theme, ids.themeFree, "自由入力");
  toggleOne(ids.message, ids.messageFree, "自由入力");
  toggleOne(ids.aiModel, ids.aiModelFree, "自由入力");
  toggleOne(ids.heroReferenceType, ids.heroReferenceTypeFree, "自由入力");
  toggleOne(ids.heroAge, ids.heroAgeFree, "自由入力");
  toggleOne(ids.heroType, ids.heroTypeFree, "自由入力");
  toggleOne(ids.heroPersonality, ids.heroPersonalityFree, "自由入力");
  toggleOne(ids.heroExpression, ids.heroExpressionFree, "自由入力");
  toggleOne(ids.heroClothes, ids.heroClothesFree, "自由入力");
  toggleOne(ids.heroHair, ids.heroHairFree, "自由入力");
  toggleOne(ids.heroRole, ids.heroRoleFree, "自由入力");
  toggleOne(ids.characters, ids.charactersFree, "自由入力");
  toggleOne(ids.setting, ids.settingFree, "自由入力");
  toggleOne(ids.punchline, ids.punchlineFree, "自由入力");
  toggleOne(ids.panel1Pattern, ids.panel1Free, "自由入力");
  toggleOne(ids.panel2Pattern, ids.panel2Free, "自由入力");
  toggleOne(ids.panel3Pattern, ids.panel3Free, "自由入力");
  toggleOne(ids.panel4Pattern, ids.panel4Free, "自由入力");
  toggleOne(ids.style, ids.styleFree, "自由入力");
  toggleOne(ids.mood, ids.moodFree, "自由入力");
  toggleOne(ids.usage, ids.usageFree, "自由入力");
  toggleOne(ids.size, ids.sizeFree, "自由入力");
  updateCharacterReferenceMessages();
}

function toggleOne(select, input, trigger) {
  const shouldShow = select.value === trigger;
  input.hidden = !shouldShow;
  if (!shouldShow) input.value = "";
}

function setPanelPatternValues(panelPatterns = []) {
  [ids.panel1Pattern, ids.panel2Pattern, ids.panel3Pattern, ids.panel4Pattern].forEach((select, index) => {
    if (panelPatterns[index]) select.value = panelPatterns[index];
  });
  [ids.panel1Free, ids.panel2Free, ids.panel3Free, ids.panel4Free].forEach((input) => {
    input.value = "";
  });
}

function applyHeroSettings(settings) {
  Object.entries(settings).forEach(([key, value]) => {
    if (ids[key]) ids[key].value = value;
  });
  [ids.heroPersonalityFree, ids.heroExpressionFree, ids.heroClothesFree, ids.heroHairFree, ids.heroRoleFree].forEach((input) => {
    input.value = "";
  });
}

function generatePrompt() {
  const data = collectData();
  ids.output.value = data.workMode === "yonkoma" ? buildYonkomaPrompt(data) : buildSinglePrompt(data);
  showStatus("プロンプトを生成しました");
}

function buildSinglePrompt(data) {
  const illustrationText = buildSingleIllustrationText(data);
  return `【イラスト生成用プロンプト】

以下の条件で1枚のイラストを作成してください。

タイトル：
${data.title}

用途：
${data.usage}

画像生成AIの種類：
${data.aiModel}

画像サイズ・比率：
${data.size}

主人公：
${data.hero}

${data.characterReferencePrompt}

登場人物：
他の登場人物：${data.characters}

舞台：
${data.setting}

${buildPropControlText(data)}

イラスト内容：
${illustrationText}

伝えたいこと：
${data.message}

絵柄：
${data.style}

色・雰囲気：
${data.mood}

必須の小物（必要な場合のみ）：
${data.elements.length ? data.elements.join("、") : "特になし"}

避けたいこと：
${buildAvoidText(data)}
テーマや舞台に関係のない家具・装飾・小物は追加しないでください。

注意事項：
日本語の文字を入れる場合は自然に読めるようにしてください。
文字化けしないようにしてください。
人物、服装、髪型、表情に一貫性を持たせてください。
背景はテーマに合う範囲で描き込みすぎず、主役が分かりやすい構図にしてください。

追加メモ：
${data.memo || "特になし"}`;
}

function buildYonkomaPrompt(data) {
  const panels = buildPanels(data, data.templateData.panels);
  return `【4コマ漫画生成用プロンプト】

以下の条件で4コマ漫画を作成してください。

タイトル：
${data.title}

用途：
${data.usage}

画像生成AIの種類：
${data.aiModel}

画像サイズ・比率：
${data.size}

主人公：
${data.hero}

${data.characterReferencePrompt}

登場人物：
他の登場人物：${data.characters}

舞台：
${data.setting}

${buildPropControlText(data)}

4コマ構成：
1コマ目：
${panels[0]}

2コマ目：
${panels[1]}

3コマ目：
${panels[2]}

4コマ目：
${panels[3]}

最後の印象：
${data.punchline}

セリフ方針：
${buildSpeechPolicy(data)}

絵柄：
${data.style}。やさしく、親しみやすい雰囲気にしてください。

色・雰囲気：
${data.mood}

必須の小物（必要な場合のみ）：
${data.elements.length ? data.elements.join("、") : "特になし"}

避けたいこと：
${buildAvoidText(data)}
テーマや舞台に関係のない家具・装飾・小物は追加しないでください。

注意事項：
日本語の文字が自然に読めるようにしてください。
文字化けしないようにしてください。
主人公を若くしすぎないでください。
人物、服装、髪型、表情は全コマで統一してください。
背景はシンプルにし、4コマの内容が読み取りやすいレイアウトにしてください。

追加メモ：
${data.memo || "セリフは少なめにし、読みやすい表現にしてください。"}`;
}

function buildSingleIllustrationText(data) {
  const base = data.templateData.singlePrompt || "テーマに合わせて、主人公の気持ちや状況が伝わる1枚絵のイラスト。";
  return data.memo ? `${base}\n追加メモの内容も自然に反映してください。` : base;
}

function buildPropControlText() {
  return `背景・小物：
舞台に自然に合う背景と小物だけを使ってください。
今回のストーリーに必要なものを最小限にし、
主人公より目立たせないでください。
指定していない小物をAIが自由に追加しないでください。`;
}

function buildAvoidText(data) {
  const avoidItems = getAvoidsForPrompt(data);
  return `${avoidItems.length ? avoidItems.join("、") : "過度に複雑な表現"}
${buildDigitalDeviceAvoidText(data)}`;
}

function getAvoidsForPrompt(data) {
  if (!usesSmartphoneInPanels(data)) return data.avoid;
  return data.avoid.filter((item) => !isSmartphoneConflictAvoid(item));
}

function isSmartphoneConflictAvoid(item) {
  return item.includes("不要なデジタル機器") || item.includes("スマートフォンを描かない");
}

function buildDigitalDeviceAvoidText(data) {
  if (usesSmartphoneInPanels(data)) {
    return "不要なノートパソコン・デスクトップPC・大型モニターは、今回の指示がある場合のみ描いてください。";
  }
  return "不要なデジタル機器（ノートパソコン・デスクトップPC・大型モニター・キーボード・タブレット・スマートフォンなど）は、今回の指示がある場合のみ描いてください。";
}

function usesSmartphoneInPanels(data) {
  return [data.panel1, data.panel2, data.panel3, data.panel4].includes("スマホで実際に試す");
}

function buildPanels(data, basePanels) {
  const fallbackPanels = [
    "主人公がテーマに関わる状況に気づき、物語が始まる場面。",
    "主人公が小さな困りごとや迷いに直面している場面。",
    "主人公が考えを整理したり、誰かの助言を受けたりしている場面。",
    "主人公が気づきを得て、少し前向きな表情になる場面。",
  ];
  return [1, 2, 3, 4].map((panelNumber, index) => {
    const selectedValue = data[`panel${panelNumber}`];
    const freeValue = data[`panel${panelNumber}Free`];
    return buildPanelText(panelNumber, selectedValue, freeValue, data) || basePanels?.[index] || fallbackPanels[index];
  });
}

function buildPanelText(panelNumber, selectedValue, freeValue, data) {
  if (selectedValue === "自由入力") return freeValue?.trim() || "";
  const textMap = {
    1: {
      不安そうに調べている: "主人公がはじめて見る言葉や手順を調べながら不安そうにしている。",
      期待してお願いする: `主人公が「${data.title}」に期待しながら、何かを始めようとしている。`,
      完成したと思って喜ぶ: "主人公が完成したと思ったものを見て、ほっとした表情で喜んでいる。",
      何から始めればいいか迷う: "主人公がメモ帳を前に、何から始めればよいのかわからず迷っている。",
      いつもの困りごとに気づく: `主人公が日常の中で「${data.title}」につながる困りごとに気づき、少し考え込んでいる。`,
      過去の失敗を思い出す: "主人公が以前うまくいかなかった出来事を思い出し、慎重になっている。",
    },
    2: {
      思った結果と違って困る: "主人公が思っていた結果と違うことに気づき困っている。",
      画面やレイアウトが崩れる: "主人公が画面や配置の崩れに気づき、驚いている。",
      専門用語が多くて混乱する: "知らない言葉が多く、主人公が意味を追いきれず混乱している。",
      入力内容が足りないと気づく: "主人公が伝えたい条件や背景の説明が足りなかったと気づく。",
      誰かから助言を受ける: "小さな案内役や周囲の人が、主人公にやさしく助言している。",
      家族や周囲に相談する: "主人公が家族や周囲の人に相談し、別の視点を得ている。",
    },
    3: {
      小さな案内役が助言する: "小さな案内役が現れて、主人公にやさしく助言している。",
      メモ帳に困りごとを書き出す: "主人公がメモ帳に困っていることや気づいたことを一つずつ書き出している。",
      変更する部分と変えない部分を整理する: "主人公が変更する部分と変えない部分を分けて整理している。",
      小さな一歩から始める: "主人公が大きく考えすぎず、小さな一歩から始めている。",
      スマホで実際に試す: "主人公がスマホで実際に見え方や使いやすさを確認している。",
      もう一度内容を具体化する: "主人公が目的や条件をもう一度具体的に書き直している。",
    },
    4: {
      最初の一歩が一番難しかったと気づく: "主人公が形になった小さな成果を見て、難しかったのは最初の一歩だったと気づき、少し笑顔になる。",
      具体的に伝える大切さに気づく: "主人公が改善された結果を見て、具体的に伝えることの大切さに気づく。",
      変えない部分を書く大切さに気づく: "主人公が望んだ結果に近づき、変えない部分を書く大切さに気づく。",
      完成より改善が大事だと気づく: "主人公が修正を重ねた結果を見て、改善を続けることが大事だと気づく。",
      自分の困りごとが誰かの役にも立つと気づく: "主人公が自分の困りごとは誰かの役にも立つかもしれないと気づく。",
      一緒に考える大切さに気づく: "主人公が一人で抱え込まず、誰かと一緒に考える大切さに気づく。",
    },
  };
  return textMap[panelNumber]?.[selectedValue] || "";
}

function buildSpeechPolicy(data) {
  const base = "セリフは短く、読みやすい日本語にしてください。説明しすぎず、表情と状況で伝えてください。";
  const tone = {
    笑い: "少しクスッと笑える軽い表現にしてください。",
    涙: "しんみりと心に残る表現にしてください。",
    癒し: "見た人がほっとする、やさしい雰囲気にしてください。",
    疲れ: "無理をしすぎた雰囲気や、少し休みたくなる気持ちを自然に入れてください。",
    学び: "最後に小さな学びが残る表現にしてください。",
    共感: "見た人が自分ごととして受け取れる表現にしてください。",
    驚き: "小さな発見や意外性が伝わる表現にしてください。",
    勇気: "一歩踏み出したくなる前向きな表現にしてください。",
    懐かしさ: "昔を思い出すような、やわらかい表現にしてください。",
    前向きな気持ち: "最後に気持ちが少し明るくなる表現にしてください。",
  };
  return `${base}${tone[data.message] ? ` ${tone[data.message]}` : ""}`;
}

function buildHeroDescription(data) {
  const age = omitUnspecified(data.heroAge);
  const type = omitUnspecified(data.heroType);
  const personality = resolveFreeText(data.heroPersonality, data.heroPersonalityFree);
  const expression = resolveFreeText(data.heroExpression, data.heroExpressionFree);
  const clothes = resolveFreeText(data.heroClothes, data.heroClothesFree, true);
  const hair = resolveFreeText(data.heroHair, data.heroHairFree, true);
  const role = resolveFreeText(data.heroRole, data.heroRoleFree);
  const memo = data.heroMemo.trim();
  const typeText = type || "人物";
  const agedType = age && typeText.includes("人物") ? typeText.replace("人物", `${age}の人物`) : [age, typeText].filter(Boolean).join("の");
  const personalityText = personality && !agedType.includes(personality) ? formatModifier(personality) : "";
  const lines = [`主人公は、${personalityText}${agedType || "人物"}です。`];
  if (expression) lines.push(`${expression}で描いてください。`);
  if (clothes) lines.push(`${clothes}。`);
  if (hair) lines.push(`${hair}。`);
  if (role) lines.push(`${role}として描いてください。`);
  if (memo) lines.push(memo);
  return lines.join("\n");
}

function buildPromptHeroDescription(data) {
  if (!usesCharacterReference(data)) return buildHeroDescription(data);
  return "主人公は人物ルールおよび基準画像をもとにしてください。";
}

function usesCharacterReference(data) {
  return Boolean(data.useCharacterRule || data.useMasterImage);
}

// 基準画像と人物ルールは画像生成AIが迷わないよう、ON/OFFの組み合わせごとに出し分けます。
function buildCharacterReferencePrompt(data) {
  if (data.useMasterImage && data.useCharacterRule) return buildCombinedReferencePrompt();
  if (data.useMasterImage) return buildMasterImagePrompt();
  if (data.useCharacterRule) return buildCharacterRulePrompt();
  return "";
}

function buildMasterImagePrompt() {
  return `【基準画像を参照する】

Chatに貼り付けた
「基準画像（マスターキャラクター）」を
最優先で参照してください。

この画像を主人公の基準として扱い、

同一人物
同一キャラクター

として描いてください。

以下は変更しないでください。

・顔
・髪型
・輪郭
・体型
・服装
・色
・キャラクター全体の雰囲気

変更してよい部分

・表情
・ポーズ
・背景
・小物
・構図`;
}

function buildCharacterRulePrompt() {
  return `
【人物ルールを参照する場合】
Chatに貼り付けた人物ルール画像を基準にしてください。

添付した「人物ルール」を最優先で参照してください。

この人物ルールを基準として、同一人物・同一キャラクターとしてイラストを制作してください。

【厳守事項】
・顔、髪型、耳、輪郭、体型、服装、色、雰囲気を人物ルールに合わせる
・三面図、表情サンプル、カラーパレット、NG例を参考にする
・人物ルールに記載された特徴を優先する
・表情やポーズは、今回のシーンに合わせて変更してよい
・背景、小物、構図は今回の指示に合わせて変更してよい
・人物ルールにない要素を勝手に追加しない
・別人のように描かない
・リアル写真風にしない
・過度なデフォルメや派手な装飾は避ける

【変更してよい部分】
・表情
・ポーズ
・背景
・小物
・構図
・シーンに必要な演出

【変更してはいけない部分】
・顔
・髪型
・耳
・体型
・基本服装
・基本カラー
・キャラクター全体の雰囲気

人物ルールに記載されていない内容のみ、今回のイラスト指示に従ってください。`;
}

function buildCombinedReferencePrompt() {
  return `【キャラクター参照】

Chatへ

①基準画像（マスターキャラクター）

②人物ルール

の順番で貼り付けてください。

優先順位

①基準画像

②人物ルール

③今回のイラスト指示

基準画像を最優先として

・顔
・髪型
・輪郭
・体型
・服装
・色
・キャラクター全体の雰囲気

を一致させてください。

人物ルールは

・三面図
・表情サンプル
・カラーパレット
・NG例

の参考資料として利用してください。

人物ルールにない内容のみ、
今回のイラスト指示に従ってください。

変更してよい部分

・表情
・ポーズ
・背景
・小物
・構図
・シーン演出

変更してはいけない部分

・顔
・髪型
・輪郭
・体型
・服装
・色
・キャラクター全体の雰囲気`;
}

function updateCharacterReferenceMessages() {
  ids.characterRuleMessage.hidden = !ids.useCharacterRule.checked;
  ids.masterImageMessage.hidden = !ids.useMasterImage.checked;
}

function updateReferenceChecksFromType() {
  const type = ids.heroReferenceType.value;
  ids.useCharacterRule.checked = type === "人物ルール" || type === "人物ルール＋基準画像";
  ids.useMasterImage.checked = type === "基準画像" || type === "人物ルール＋基準画像";
  updateCharacterReferenceMessages();
}

function updateHeroReferenceTypeFromChecks() {
  if (ids.useCharacterRule.checked && ids.useMasterImage.checked) {
    ids.heroReferenceType.value = "人物ルール＋基準画像";
  } else if (ids.useCharacterRule.checked) {
    ids.heroReferenceType.value = "人物ルール";
  } else if (ids.useMasterImage.checked) {
    ids.heroReferenceType.value = "基準画像";
  } else {
    ids.heroReferenceType.value = "オリジナル";
  }
  updateCharacterReferenceMessages();
}

function resolveFreeText(selectedValue, freeValue, omitUnspecifiedValue = false) {
  if (selectedValue === "自由入力") return freeValue.trim();
  return omitUnspecifiedValue ? omitUnspecified(selectedValue) : selectedValue;
}

function formatModifier(text) {
  if (text.endsWith("い") || text.endsWith("た")) return text;
  return `${text}な`;
}

function omitUnspecified(value) {
  return value === "指定しない" ? "" : value;
}

function collectData() {
  const templateData = templates[ids.template.value] || templates["自由テーマ"];
  const data = {
    workMode: ids.workMode.value || "single",
    template: ids.template.value,
    templateData,
    title: resolveValue("theme", "themeFree", "自由テーマ"),
    message: resolveValue("message", "messageFree", "指定なし"),
    messageFree: ids.messageFree.value.trim(),
    aiModel: resolveValue("aiModel", "aiModelFree", "その他（汎用）"),
    aiModelFree: ids.aiModelFree.value.trim(),
    heroReferenceType: resolveValue("heroReferenceType", "heroReferenceTypeFree", "オリジナル"),
    heroReferenceTypeFree: ids.heroReferenceTypeFree.value.trim(),
    heroAge: resolveValue("heroAge", "heroAgeFree", "指定しない"),
    heroAgeFree: ids.heroAgeFree.value.trim(),
    heroType: resolveValue("heroType", "heroTypeFree", "指定しない"),
    heroTypeFree: ids.heroTypeFree.value.trim(),
    heroPersonality: ids.heroPersonality.value,
    heroPersonalityFree: ids.heroPersonalityFree.value.trim(),
    heroExpression: ids.heroExpression.value,
    heroExpressionFree: ids.heroExpressionFree.value.trim(),
    heroClothes: ids.heroClothes.value,
    heroClothesFree: ids.heroClothesFree.value.trim(),
    heroHair: ids.heroHair.value,
    heroHairFree: ids.heroHairFree.value.trim(),
    heroRole: ids.heroRole.value,
    heroRoleFree: ids.heroRoleFree.value.trim(),
    heroMemo: ids.heroMemo.value,
    useCharacterRule: ids.useCharacterRule.checked,
    useMasterImage: ids.useMasterImage.checked,
    characters: resolveValue("characters", "charactersFree"),
    setting: resolveValue("setting", "settingFree"),
    panel1: ids.panel1Pattern.value,
    panel1Free: ids.panel1Free.value.trim(),
    panel2: ids.panel2Pattern.value,
    panel2Free: ids.panel2Free.value.trim(),
    panel3: ids.panel3Pattern.value,
    panel3Free: ids.panel3Free.value.trim(),
    panel4: ids.panel4Pattern.value,
    panel4Free: ids.panel4Free.value.trim(),
    punchline: resolveValue("punchline", "punchlineFree"),
    style: resolveValue("style", "styleFree"),
    mood: resolveValue("mood", "moodFree"),
    usage: resolveValue("usage", "usageFree"),
    size: resolveValue("size", "sizeFree", "指定なし"),
    sizeFree: ids.sizeFree.value.trim(),
    elements: getAdditionalProps(),
    avoid: getAvoidValues(),
    memo: ids.memo.value.trim(),
  };
  data.hero = buildPromptHeroDescription(data);
  data.characterReferencePrompt = buildCharacterReferencePrompt(data);
  return data;
}

function resolveValue(selectId, freeId, fallback = "指定なし") {
  const selected = ids[selectId].value;
  if (selected === "自由入力") return ids[freeId].value.trim() || fallback;
  return selected;
}

async function copyPrompt() {
  const copyButton = document.querySelector("#copyButton");
  if (!ids.output.value.trim()) {
    showStatus("先にプロンプトを生成してください");
    return;
  }
  try {
    await navigator.clipboard.writeText(ids.output.value);
    markCopySuccess(copyButton);
    showStatus("コピーしました");
  } catch (error) {
    ids.output.select();
    try {
      const copied = document.execCommand("copy");
      if (copied) {
        markCopySuccess(copyButton);
        showStatus("コピーしました");
        return;
      }
    } catch (fallbackError) {
      // 古いコピー手段も失敗した場合は、手動コピーを案内します。
    }
    showStatus("コピーできませんでした。手動で選択してコピーしてください。");
  }
}

function markCopySuccess(button) {
  if (!button) return;
  if (copyResetTimer) clearTimeout(copyResetTimer);
  button.classList.add("copied");
  button.textContent = "コピーしました！";
  copyResetTimer = setTimeout(() => {
    button.classList.remove("copied");
    button.textContent = "コピー";
    copyResetTimer = null;
  }, 2000);
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
    state[field.id] = field.type === "checkbox" ? field.checked : field.value;
  });
  state.elements = getCheckedValues("elements");
  state.avoid = getCheckedValues("avoid");
  return state;
}

function applyFormState(state) {
  const hasNewHeroSettings = Object.prototype.hasOwnProperty.call(state, "heroAge");
  const shouldUseLegacyHero = state.hero && !state.heroMemo;
  if (!hasNewHeroSettings) applyHeroSettings(defaultHeroSettings);
  ids.heroReferenceType.value = "オリジナル";
  ids.useCharacterRule.checked = false;
  ids.useMasterImage.checked = false;
  if (state.template) {
    ids.template.value = state.template;
    populateThemeOptions(state.template, state.theme);
  }
  document.querySelectorAll("[data-save]").forEach((field) => {
    if (!Object.prototype.hasOwnProperty.call(state, field.id)) return;
    if (field.type === "checkbox") {
      field.checked = Boolean(state[field.id]);
      return;
    }
    field.value = state[field.id];
  });
  if (shouldUseLegacyHero) {
    applyHeroSettings(defaultHeroSettings);
    ids.heroMemo.value = state.hero;
  }
  updateSettingDependentChoices({
    elements: state.elements || [],
    avoid: state.avoid || getDefaultAvoidsForSetting(ids.setting.value),
  });
  if (Object.prototype.hasOwnProperty.call(state, "heroReferenceType")) {
    updateReferenceChecksFromType();
  } else {
    updateHeroReferenceTypeFromChecks();
  }
  updateModeUI();
  toggleFreeInputs();
}

function resetForm() {
  ids.output.value = "";
  ids.memo.value = "";
  ids.saveName.value = "";
  ids.template.value = options.template[0];
  ids.themeFree.value = "";
  ids.messageFree.value = "";
  ids.aiModelFree.value = "";
  ids.charactersFree.value = "";
  ids.settingFree.value = "";
  ids.punchlineFree.value = "";
  ids.styleFree.value = "";
  ids.moodFree.value = "";
  ids.usageFree.value = "";
  ids.sizeFree.value = "";
  ids.elementsFree.value = "";
  ids.avoidFree.value = "";
  ids.heroReferenceTypeFree.value = "";
  ids.heroAgeFree.value = "";
  ids.heroTypeFree.value = "";
  ids.heroPersonalityFree.value = "";
  ids.heroExpressionFree.value = "";
  ids.heroClothesFree.value = "";
  ids.heroHairFree.value = "";
  ids.heroRoleFree.value = "";
  ids.heroReferenceType.value = "オリジナル";
  ids.useCharacterRule.checked = false;
  ids.useMasterImage.checked = false;
  ids.workMode.value = "single";
  applyTemplate(ids.template.value);
  updateModeUI();
  showStatus("リセットしました");
}

function handleSavedListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "load") loadSavedItem(id);
  if (action === "delete") deleteSavedItem(id);
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
  const usage = formState.usage === "自由入力" ? formState.usageFree || "自由入力" : formState.usage || "未設定";
  const mode = formState.workMode === "yonkoma" ? "4コマ漫画" : "1枚絵";
  return `
    <article class="saved-item">
      <div>
        <h3 class="saved-title">${escapeHtml(item.name || theme)}</h3>
        <dl class="saved-meta">
          <div><dt>モード：</dt><dd>${escapeHtml(mode)}</dd></div>
          <div><dt>テンプレート名：</dt><dd>${escapeHtml(templateName)}</dd></div>
          <div><dt>テーマ：</dt><dd>${escapeHtml(theme)}</dd></div>
          <div><dt>用途：</dt><dd>${escapeHtml(usage)}</dd></div>
          <div><dt>保存日時：</dt><dd>${escapeHtml(formatSavedAt(item.savedAt))}</dd></div>
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
  if (state.theme === "自由入力") return state.themeFree?.trim() || "自由テーマ";
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

function getAdditionalProps() {
  const selectedProps = getCheckedValues("elements");
  const freeProps = ids.elementsFree.value
    .split(/[、,\\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set([...selectedProps, ...freeProps])];
}

function getAvoidValues() {
  const selectedAvoids = getCheckedValues("avoid");
  const freeAvoids = ids.avoidFree.value
    .split(/[、,\\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set([...selectedAvoids, ...freeAvoids])];
}

function updateSettingDependentChoices(preferred = {}) {
  const setting = getCurrentSettingKey();
  const previousElements = preferred.elements || getCheckedValues("elements");
  const previousAvoids = preferred.avoid || getCheckedValues("avoid");
  const elementCandidates = uniqueList([...commonElements, ...(settingElementMap[setting] || []), ...previousElements]);
  const avoidCandidates = uniqueList([...commonAvoids, ...(settingAvoidMap[setting] || [])]);
  const checkedElements = previousElements.filter((item) => elementCandidates.includes(item));
  const checkedAvoids = uniqueList([...commonAvoids, ...(settingAvoidMap[setting] || []), ...previousAvoids])
    .filter((item) => avoidCandidates.includes(item));
  populateChecks("elements", elementCandidates, checkedElements);
  populateChecks("avoid", avoidCandidates, checkedAvoids);
}

function getDefaultAvoidsForSetting(setting) {
  const settingKey = setting === "自由入力" ? "自由入力" : setting;
  return uniqueList([...commonAvoids, ...(settingAvoidMap[settingKey] || [])]);
}

function getCurrentSettingKey() {
  return ids.setting?.value === "自由入力" ? "自由入力" : ids.setting?.value || "自由入力";
}

function uniqueList(items) {
  return [...new Set(items.filter(Boolean))];
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
