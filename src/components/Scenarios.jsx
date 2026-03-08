import { useState, useEffect, useRef } from "react";
import { ConstantProductPool } from "../dexSimulator.js";

/**
 * Scenarios — запуск 3 сценаріїв (small / medium / large)
 * з таблицею результатів та bar-chart slippage.
 */

const SCENARIO_DEFS = [
    { name: "🟢 Small (1%)", pct: 0.01 },
    { name: "🟡 Medium (10%)", pct: 0.10 },
    { name: "🔴 Large (40%)", pct: 0.40 },
];

export default function Scenarios({ pool }) {
    const [results, setResults] = useState(null);
    const barsRef = useRef([]);

    const fmt = (n, d = 2) =>
        Number(n).toLocaleString("en-US", {
            minimumFractionDigits: d,
            maximumFractionDigits: d,
        });

    const runScenarios = () => {
        const res = SCENARIO_DEFS.map((sc) => {
            const amountIn = pool.reserveA * sc.pct;
            const p = new ConstantProductPool(
                pool.reserveA,
                pool.reserveB,
                pool.fee / 100
            );
            return { ...sc, amountIn, ...p.swap(amountIn, "AtoB") };
        });
        setResults(res);
    };

    // Анімація bar chart після рендеру
    useEffect(() => {
        if (!results) return;
        const maxSlip = Math.max(...results.map((r) => r.slippagePercent), 0.01);
        // Невелика затримка для CSS-анімації
        const timer = setTimeout(() => {
            barsRef.current.forEach((bar, i) => {
                if (bar) {
                    const pct = (results[i].slippagePercent / maxSlip) * 100;
                    bar.style.height = Math.max(pct, 3) + "%";
                }
            });
        }, 50);
        return () => clearTimeout(timer);
    }, [results]);

    return (
        <section className="card card--scenarios">
            <h2 className="card__title">📊 3 Сценарії порівняння slippage</h2>
            <p className="card__desc">
                Автоматичне порівняння: малий (1%), середній (10%) та великий (40%) свопи
                на поточному пулі.
            </p>
            <button className="btn btn--secondary" onClick={runScenarios}>
                Запустити сценарії
            </button>

            {results && (
                <>
                    {/* Таблиця */}
                    <div className="table-wrap fade-in">
                        <table>
                            <thead>
                                <tr>
                                    <th>Сценарій</th>
                                    <th>Amount In</th>
                                    <th>Amount Out</th>
                                    <th>Eff. Price</th>
                                    <th>Slippage %</th>
                                    <th>New Res. A</th>
                                    <th>New Res. B</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((r, i) => (
                                    <tr key={i}>
                                        <td>{r.name}</td>
                                        <td>{fmt(r.amountIn)}</td>
                                        <td>{fmt(r.amountOut, 6)}</td>
                                        <td>{r.effectivePrice.toFixed(6)}</td>
                                        <td>{r.slippagePercent.toFixed(4)} %</td>
                                        <td>{fmt(r.newReserveA)}</td>
                                        <td>{fmt(r.newReserveB)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bar Chart */}
                    <div className="chart-wrap fade-in">
                        <h3>Slippage vs Trade Size</h3>
                        <div className="bar-chart">
                            {results.map((r, i) => (
                                <div className="bar-group" key={i}>
                                    <span className="bar-value">
                                        {r.slippagePercent.toFixed(2)}%
                                    </span>
                                    <div
                                        className="bar"
                                        ref={(el) => (barsRef.current[i] = el)}
                                        style={{ height: "0%" }}
                                    />
                                    <span className="bar-label">
                                        {r.name.replace(/[🟢🟡🔴]\s*/, "")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
