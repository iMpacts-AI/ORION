# How to use ORION

ORION is an AI agent for your computer. You say what you want in plain words, and ORION does the steps.
Anything important waits for your "yes", and ORION checks its work before it says "done".

This guide covers ORION **1.2** on **Windows**. Desktop control is Windows-only for now.

---

## 1. Start ORION

Open a terminal (PowerShell or Windows Terminal) and type:

```
orion
```

That opens ORION's interactive terminal. Type a request and press Enter. To run one request and exit, put it in quotes:

```
orion "open youtube"
```

Check that everything is set up (local AI models, tools, safety policy):

```
orion doctor
```

## 2. Just say it

No special commands to learn. Talk to ORION the way you'd talk to a friend.

| You say | ORION does |
| :--- | :--- |
| `open youtube` | Opens YouTube |
| `look up the best mechanical keyboards` | Opens a web search with the results |
| `put on some Weeknd` | Starts the music |
| `open notepad and type my shopping list: milk, eggs, bread` | Opens Notepad and types it, line by line |
| `make a pdf about the benefits of reading` | Writes a formatted PDF |
| `convert "C:\Users\me\Documents\report.docx" to pdf` | Exports it with your installed Office, without clicking through Word |
| `git status in C:\Users\me\my-project` | Shows the project's changes |

### Do things inside any app: the computer agent

Start a request with **`agent:`** (or "on my computer, ...") and ORION works inside apps step by step: it looks at the window, clicks, fills in fields, types, and checks the result each time.

```
orion "agent: open calculator and calculate 12 times 7"
orion "agent: open settings and go to display"
orion "agent: open notepad, type ORION, then select all and copy it"
```

ORION only says "done" when it can **prove** it: the answer is on screen, or the text is really on the clipboard. If it can't prove it, it tells you it failed. It never pretends.

## 3. You stay in control

| Situation | What ORION does |
| :--- | :--- |
| Something risky (deleting, sending, installing, committing) | Stops and asks. Type **`/approve`** or **`/deny`**. |
| You want everything to stop **now** | Type **`/stop`** (emergency stop). Nothing else runs until you clear it. |
| A password | Only typed if **you** wrote it in your request, and only after you approve. It never guesses one. |
| Erasing text that was already there | Blocked unless your request asked to delete or replace it. |

Run a one-off request that's allowed to do high-risk (but not critical) actions without asking:
`orion --yes "<request>"`. Use it only when you're sure.

## 4. Government and official websites

When ORION sees a government or official service (tax, visas, Emirates ID, UAE PASS and similar), it switches to **Government Journey mode**. ORION does the paperwork; **you keep the signature**:

1. **You** type passwords, one-time codes (OTP) and PINs. ORION never does, even if you ask.
2. ORION fills in the form, then **stops before Submit, Declare, Sign or Pay**. It shows you what it filled so you can review it and press the button yourself.
3. ORION only types an Emirates ID, IBAN or card number that **you** gave it, and only after you approve.
4. ORION only opens web addresses that are in your request. It never guesses a government website's address.
5. Before it hands over, it **re-reads every field** it filled. If anything is in the wrong box, it fixes it or tells you, and never says "ready" with mistakes.

## 5. Useful commands inside ORION

| Command | What it does |
| :--- | :--- |
| `/help` | Every command |
| `/status` | What ORION is doing and which model it's using |
| `/models` | See and switch the AI model (local models run on your own computer) |
| `/permissions` | The safety rules and the emergency stop |
| `/approve` · `/deny` · `/stop` | Answer a pending approval, or stop everything |
| `/tasks` · `/resume` | See recent tasks and pick one back up |
| `/privacy` | What stays on your computer |
| `/clear` · `/exit` | Clear the conversation · quit |

## 6. Keep ORION up to date

```
orion upgrade --check      # is there a newer version?
orion upgrade              # download, verify (SHA-256) and install it
orion upgrade --rollback   # go back to the previous version
```

## 7. Tips and honest limits

- **Local AI is private but needs your graphics card.** If a big game or video editor is using the GPU, ORION's local model may be slow or not load. Close it, then try again.
- **Be specific with files.** Give the full path in quotes: `"C:\Users\me\Documents\report.docx"`.
- **One window at a time works best** for the computer agent. Keep the app you want in front.
- **Still improving:** Arabic, voice, and desktop control on macOS and Linux aren't ready yet. The README's progress meter shows what's verified live.

---

Questions or a live demo: **[saqib@impacts-ai.com](mailto:saqib@impacts-ai.com)** · [impacts-ai.com/orion](https://impacts-ai.com/orion)
