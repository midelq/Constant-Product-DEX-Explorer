import { useState } from "react";
import { ConstantProductPool } from "../dexSimulator.js";

/**
 * SwapForm — форма для одиничного свопу з відображенням результату.
 */

export default function SwapForm({ pool }) {
    const [amountIn, setAmountIn] = useState(1000);
    const [direction, setDirection] = useState("AtoB");
    const [result, setResult] = useState(null);

    const handleSwap = () => {
        if (amountIn <= 0) return;
        const p = new ConstantProductPool(
            pool.reserveA,
            pool.reserveB,
            pool.fee / 100
        );
        const res = p.swap(amountIn, direction);
        setResult(res);
    };

    // Кольорова підсвітка slippage
    const slipColor = (slip) => {
        if (slip < 2) return "var(--success)";     // 🟢 зелений — малий slippage
        if (slip < 15) return "var(--warning)";    // 🟡 жовтий — середній
        return "var(--danger)";                     // 🔴 червоний — великий
    };

    const fmt = (n, d = 2) =>
        Number(n).toLocaleString("en-US", {
            minimumFractionDigits: d,
            maximumFractionDigits: d,
        });

    return (
        <section className="card card--swap">
            <h2 className="card__title">🔄 Зробити своп</h2>
            <div className="form-grid">
                <div className="field">
                    <label htmlFor="amountIn">Amount In</label>
                    <input
                        type="number"
                        id="amountIn"
                        value={amountIn}
                        min="0.01"
                        step="any"
                        onChange={(e) => setAmountIn(parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="field">
                    <label htmlFor="direction">Напрямок</label>
                    <select
                        id="direction"
                        value={direction}
                        onChange={(e) => setDirection(e.target.value)}
                    >
                        <option value="AtoB">A → B</option>
                        <option value="BtoA">B → A</option>
                    </select>
                </div>
            </div>
            <button className="btn btn--primary" onClick={handleSwap}>
                Swap
            </button>

            {result && (
                <div className="result-panel fade-in">
                    <h3>Результат</h3>
                    <div className="result-grid">
                        <div className="result-item">
                            <span className="result-label">Amount Out</span>
                            <span className="result-value">{fmt(result.amountOut, 6)}</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">Effective Price</span>
                            <span className="result-value">
                                {result.effectivePrice.toFixed(8)}
                            </span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">Slippage</span>
                            <span
                                className="result-value"
                                style={{ color: slipColor(result.slippagePercent) }}
                            >
                                {result.slippagePercent.toFixed(4)} %
                            </span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">New Reserve A</span>
                            <span className="result-value">{fmt(result.newReserveA)}</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">New Reserve B</span>
                            <span className="result-value">{fmt(result.newReserveB)}</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">k (after)</span>
                            <span className="result-value">{fmt(result.k_after, 0)}</span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
