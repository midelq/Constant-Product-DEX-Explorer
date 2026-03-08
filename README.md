# Constant-Product DEX Explorer

A web-based simulator for a **Constant-Product Automated Market Maker (AMM)** — the core mechanism behind Uniswap v2.  
Built with **React + Vite**. Allows performing swaps, comparing scenarios, and visualizing how slippage scales with trade size.

---

## 🚀 How to Run

```bash
npm install
npm run dev
```
Open http://localhost:5173/ in your browser.

---

## 📐 Formulas Used

### Constant-Product Invariant

```
x × y = k
```

The product of the two token reserves in a pool remains constant during swaps. This is the core rule that determines pricing.

### Swap Formula (A → B)

When swapping `amountIn` of token A for token B:

```
amountInWithFee = amountIn × (1 − fee)
amountOut = (reserveB × amountInWithFee) / (reserveA + amountInWithFee)
```

- `fee = 0.003` (0.3%) — standard Uniswap v2 fee
- The fee stays in the pool, slightly increasing `k` after each swap

### After Swap — Reserve Update

```
newReserveA = reserveA + amountIn        (full amount, fee stays in pool)
newReserveB = reserveB − amountOut
```

### Effective Price & Slippage

```
effectivePrice = amountOut / amountIn
spotPrice = reserveB / reserveA

slippage (%) = |effectivePrice − spotPrice| / spotPrice × 100
```

---

## 📊 3 Scenarios — Results Table

**Pool configuration:** `reserveA = 100,000` | `reserveB = 100,000` | `fee = 0.3%` | direction: `A → B`

| Scenario         | Amount In | Amount Out     | Eff. Price | Slippage (%) | New Reserve A | New Reserve B |
|------------------|-----------|---------------|------------|-------------|---------------|---------------|
| 🟢 Small (1%)    | 1,000     | 987.158034    | 0.987158   | 1.2842 %    | 101,000.00    | 99,012.84     |
| 🟡 Medium (10%)  | 10,000    | 9,066.108939  | 0.906611   | 9.3389 %    | 110,000.00    | 90,933.89     |
| 🔴 Large (40%)   | 40,000    | 28,510.151558 | 0.712754   | 28.7246 %   | 140,000.00    | 71,489.85     |

**Key observation:** swapping just 1% of the pool gives ~1.3% slippage, but 40% of the pool results in ~28.7% slippage — a 22× increase in price impact for a 40× increase in trade size.

---

## 📝 Conclusions About Slippage

- **Slippage grows non-linearly with trade size.** A small swap (1% of pool) produces ~1.3% slippage, while a large swap (40%) results in ~28.7% — far more than proportional. This is because the `x·y=k` curve is a hyperbola: the further you move along it, the steeper the price change becomes.

- **The fee has a minor impact compared to trade size.** The 0.3% fee adds only ~0.3% to the total cost. The dominant factor in price impact is the shift along the constant-product curve, not the fee itself.

- **In practice, large trades should be split across multiple pools.** DEX aggregators (e.g., 1inch, Paraswap) automatically route large swaps through several liquidity pools to minimize total slippage. This is why deep liquidity matters — larger pools produce less slippage for the same trade size.

---

## 📁 Project Structure

```
├── index.html                    # Entry HTML (with Google Fonts)
├── src/
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # Main component (pool state)
│   ├── App.css                   # Styles (dark glassmorphism theme)
│   ├── dexSimulator.js           # Core AMM logic (ConstantProductPool class)
│   └── components/
│       ├── PoolSettings.jsx      # Pool configuration form
│       ├── SwapForm.jsx          # Swap form + result display
│       ├── Scenarios.jsx         # 3 scenarios + table + bar chart
│       └── Formulas.jsx          # Formula reference section
├── package.json
└── README.md
```

---

## 📚 Sources

1. **Uniswap v2 Whitepaper** — https://uniswap.org/whitepaper.pdf
2. **Uniswap v2 Docs** — https://docs.uniswap.org/contracts/v2/concepts/protocol-overview/how-uniswap-works
