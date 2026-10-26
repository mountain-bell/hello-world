# HelloWorld

HelloWorldは、国・地域ごとの「Hello, World!」、代表的なタイムゾーン、現地の時計表示用日時を取得するライブラリです。

挨拶や各地の時計表示を楽しむ用途に向いています。国ごとに一つの代表的なタイムゾーンを使い、厳密な日時処理は目的としていません。

---

## ✨ 特徴

- **国・地域を指定して各言語の「Hello, World!」を取得**：対応する挨拶文を自分で用意せずに使えます。
- **挨拶と一緒に現地の時計情報も取得**：代表的なタイムゾーン、時計表示用の日時、実行環境との時差をまとめて取得できます。

---

## 🧩 インストール

```bash
npm install @mountain-bell/hello-world
```

Node.jsまたはブラウザで利用できます。日時関連のAPIには、対象タイムゾーンに対応する`Intl.DateTimeFormat`と`formatToParts()`が必要です。環境ごとの最低対応バージョンは定めていません。

ESM・CommonJS・TypeScriptに対応しています。

ブラウザでは、npmのimportを解決できるバンドラーなどでビルドしてください。

---

## 🚀 基本の使い方

```ts
import HelloWorld from "@mountain-bell/hello-world";

const info = HelloWorld.get("japan");

console.log(info.greet); // "こんにちは、世界！"
console.log(info.timeZone); // "Asia/Tokyo"
console.log(info.date.getHours()); // 東京の時計の「時」（表示用）
console.log(info.offsetHours); // 実行環境のローカル時刻との差（時間）
```

---

## 読み込み方法

基本例のdefault importに加えて、named importとCommonJSを利用できます。

### named importで使う

```ts
import { getGreet, getTimeZone } from "@mountain-bell/hello-world";

console.log(getGreet("france")); // "Bonjour, le monde !"

console.log(getTimeZone("usa")); // "America/New_York"
```

### CommonJSで使う

CommonJSではnamed exportを利用できます。

```js
const { getGreet } = require("@mountain-bell/hello-world");
console.log(getGreet("japan")); // "こんにちは、世界！"
```

### scriptタグで使う

単独の`<script>`用ファイルはnpm配布物に含まれません。

[GitHubのbrowser/hello-world.js](https://github.com/mountain-bell/hello-world/blob/main/browser/hello-world.js)をダウンロードして配置すると、ビルド環境なしで使えます。GitHubのファイル表示ページのURLを直接scriptのsrcに指定せず、取得したJSファイルを指定してください。

```html
<script src="./hello-world.js"></script>
<script>
	console.log(HelloWorld.getGreet("japan")); // "こんにちは、世界！"
</script>
```

グローバル変数`HelloWorld`から同じAPIを利用できます。ソースマップも使う場合は、同じ場所に`hello-world.js.map`を配置します。

---

## 🌍 対応している主要国

| 国               | LocationType   | 挨拶                |
| ---------------- | -------------- | ------------------- |
| 日本             | `japan`        | こんにちは、世界！  |
| 韓国             | `korea`        | 안녕하세요, 세계!   |
| 中国             | `china`        | 你好，世界！        |
| 台湾             | `taiwan`       | 哈囉，世界！        |
| 香港             | `hong_kong`    | 你好，世界！        |
| シンガポール     | `singapore`    | Hello, World!       |
| インド           | `india`        | Hello, World!       |
| 英国             | `uk`           | Hello, World!       |
| フランス         | `france`       | Bonjour, le monde ! |
| ドイツ           | `germany`      | Hallo, Welt!        |
| スペイン         | `spain`        | ¡Hola, mundo!       |
| イタリア         | `italy`        | Ciao, mondo!        |
| オランダ         | `netherlands`  | Hallo, wereld!      |
| スウェーデン     | `sweden`       | Hej, världen!       |
| アメリカ         | `usa`          | Hello, World!       |
| カナダ           | `canada`       | Hello, World!       |
| メキシコ         | `mexico`       | ¡Hola, mundo!       |
| ブラジル         | `brazil`       | Olá, mundo!         |
| アルゼンチン     | `argentina`    | ¡Hola, mundo!       |
| オーストラリア   | `australia`    | Hello, World!       |
| ニュージーランド | `new_zealand`  | Hello, World!       |
| 南アフリカ       | `south_africa` | Hello, World!       |

上記22の国・地域と`local`に対応します。すべての国・地域や、各国内のすべてのタイムゾーンを網羅するものではありません。例えば`usa`はニューヨーク、`australia`はシドニーのタイムゾーンを使います。

---

## 🛠️ API

以下のAPIは、named exportと`HelloWorld`のメソッドの両方で使えます。各関数は同期的に値を返します。コード例は基本例と同じ`HelloWorld`のimportを使います。

### `HelloWorld.get(location?)`

挨拶・タイムゾーン・表示用日時・時差をまとめて返します。

戻り値は`{ greet, timeZone, date, offsetHours }`です。`greet`は文字列、`timeZone`の型は`string | undefined`、`date`は表示用`Date`、`offsetHours`は数値です。

```ts
HelloWorld.get("spain");
```

### `HelloWorld.getGreet(location?)`

指定した国・地域の挨拶文を文字列で返します。

```ts
console.log(HelloWorld.getGreet("germany")); // "Hallo, Welt!"
```

### `HelloWorld.getTimeZone(location?)`

代表的なタイムゾーンの識別子を返します。戻り値の型は`string | undefined`です。省略・`"local"`の場合は、実行環境の`Intl.DateTimeFormat().resolvedOptions().timeZone`を返します。

### `HelloWorld.getDate(location?)`

指定した場所の時計表示用の`Date`を返します。同じ`location`を指定した`HelloWorld.get(location).date`も同じ形式です。呼び出すたびに現在日時を取得します。

### `HelloWorld.getOffsetHours(location?)`

実行環境のローカル時刻から見た指定場所の時差を時間単位で返します。進んでいる場合は正、遅れている場合は負で、小数になることもあります。UTCからのオフセットではありません。

`date`と`offsetHours`には実行環境の夏時間による制約があります。詳しくは[dateの扱い方](#dateの扱い方)を参照してください。

---

## ℹ️ locationの省略について

`location`の省略・`undefined`・`"local"`は同じ扱いです。挨拶は端末の言語にかかわらず`"Hello, World!"`、タイムゾーンと日時は実行環境の値、時差は0を返します。

---

## dateの扱い方

`date`は「その場所にいたら、今は何月何日の何時？」を楽しむための表示用`Date`です。文字列ではなく、`getFullYear()`・`getMonth()`・`getDate()`・`getHours()`などのローカルgetterで現地の時計の数字を取り出せるよう補正したDateオブジェクトを返します。

```ts
import HelloWorld from "@mountain-bell/hello-world";

const info = HelloWorld.get("usa");
const hour = info.date.getHours();
const minute = String(info.date.getMinutes()).padStart(2, "0");
console.log(`${hour}:${minute}`); // ニューヨークの時計表示
```

指定場所のタイムゾーンをDate自体が保持するわけではありません。国を指定して得た表示用Dateは、実際の現在の瞬間を表す値として、日時の比較・保存や`toISOString()`による出力には使わないでください。また、表示時に指定場所のtimeZoneで再変換する必要はありません。引数なし・`"local"`の場合は補正せず、実行環境の現在日時を表すDateを返します。

`offsetHours`は表示用`date`を基に計算します。実行環境の夏時間（サマータイム）の影響で、`date`の時計表示が実際の現地時刻から、`offsetHours`が実際の時差からずれる場合があります。HelloWorldは挨拶や現地の時計表示を楽しむためのライブラリであり、厳密な日時処理を目的としていません。

---

## 引数とエラー

`location`は対応表の識別子または`"local"`を指定します。省略・`undefined`は`"local"`と同じです。大文字小文字は区別されます。

未対応の文字列は`Error`、文字列以外（`null`など）は`TypeError`になります。日時関連のAPIでは、実行環境のIntlやタイムゾーンデータに由来する例外もそのまま伝わります。

---

## 不具合報告・問い合わせ

[公開元のIssues](https://github.com/mountain-bell/hello-world/issues)へ、パッケージ名・バージョン・実行環境・ローカルタイムゾーン・再現コードを添えて報告してください。

---

## 📄 ライセンス

MIT  
© 2025-2026 mountain-bell

---

## 👤 作者

[mountain-bell](https://github.com/mountain-bell) (a.k.a. MB)
