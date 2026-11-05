# WHOT It! — The Authentic Nigerian Card Game

A fast-paced, beautifully crafted browser implementation of **Nigerian Whot**, Nigeria's beloved national card game. Built with React, TypeScript, Tailwind CSS, and Web Audio API.

Compete as the human player against three tactical computer opponents—**Chidi** (Tactical Playmaker), **Amina** (The Strategist), and **Femi** (The Aggressor)—around a dark felt card table with authentic Nigerian styling.

---

## 🎴 Exact 54-Card Authentic Deck

WHOT It! strictly follows the canonical Nigerian 54-card distribution:

| Shape | Cards in Deck | Count |
| :--- | :--- | :--- |
| **Circle (Ball)** | 1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14 | 12 cards |
| **Triangle (Angle)** | 1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14 | 12 cards |
| **Cross** | 1, 2, 3, 5, 7, 10, 11, 13, 14 | 9 cards |
| **Square (Carpet)** | 1, 2, 3, 5, 7, 10, 11, 13, 14 | 9 cards |
| **Star** | 1, 2, 3, 4, 5, 7, 8 | 7 cards |
| **WHOT 20 (Wild)** | 20, 20, 20, 20, 20 | 5 cards |
| **TOTAL** | | **54 Cards** |

> *Note: In authentic Nigerian Whot, there are strictly **no 6s** and **no 9s**.*

---

## ⚡ Special Card Rules

- **Card 1 — Hold On:** The player immediately takes another turn. Does not skip the next player.
- **Card 2 — Pick Two:** The next player must play another 2 to pass the penalty onward (penalty increases by +2), or draw the accumulated cards and lose their turn. **Stacking 2 on 2 is supported!**
- **Card 5 — Pick Three:** The next player must play another 5 to pass the penalty onward (penalty increases by +3), or draw the accumulated cards and lose their turn. **Stacking 5 on 5 is supported!**
- **Card 8 — Suspension:** Next player misses their turn (skips 1 player).
- **Star 8 — Double Suspension:** The next **two** players miss their turns (skips 2 players).
- **Card 14 — General Market:** Every other active player immediately draws 1 card from the market. The player who played 14 takes another turn.
- **Card 20 — WHOT Wild:** Playable on any normal turn. The player chooses which shape the next player must follow.
- **Win Condition:** First player to empty their hand wins immediately! Special effects and extra turns do not execute after a player has won.

---

## 👁️ Signature Feature: Peek Next Card

Discover the exact card the upcoming computer opponent intends to play on their next turn!
- Uses the **exact same deterministic decision engine** that powers live bot turns.
- If the bot cannot play, accurately predicts `"Opponent will draw a card."`
- **Guaranteed read-only:** Does not mutate the deck, hands, turn order, or bot strategies.
- **Free Peek:** 1 free peek is provided in every new match.
- **Paid Peek:** Additional peeks cost 100 gems with explicit user confirmation and balance verification.

---

## 💎 Gem Economy & Daily Rewards

- **Starting Balance:** New players start with 100 gems.
- **Daily Login Gift:** +5 gems awarded once per local calendar day with consecutive login streak tracking.
- **Demo Gem Shop:** 3 simulated packages (100, 300, and 700 gems). Clearly labeled as **DEMO** with zero real-money charges or credentials collected.
- **LocalStorage Persistence:** All gems, statistics, daily streak, and audio preferences persist reliably across browser sessions.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4 (Custom Forest Green, Deep Green, Muted Gold palette)
- **Audio:** Web Audio API Synthesizer (zero external audio asset dependencies)
- **Visuals:** Vector SVG cards matching the Nigerian Whot card decks with geometric shapes
- **Icons:** Lucide React
- **Celebration:** Canvas Confetti

---

## 🚀 Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

3. **Run the integrity test suite:**
   ```bash
   npx tsx src/game/verify.test.ts
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deployment Instructions

### Deploy to Vercel
1. Install the Vercel CLI or link via the Vercel Web Dashboard:
   ```bash
   npm install -g vercel
   vercel
   ```
2. Set Framework Preset to **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`

### Deploy to GitHub Pages
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your `gh-pages` branch.
