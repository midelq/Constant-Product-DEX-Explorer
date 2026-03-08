import { useState } from "react";
import PoolSettings from "./components/PoolSettings.jsx";
import SwapForm from "./components/SwapForm.jsx";
import Scenarios from "./components/Scenarios.jsx";
import Formulas from "./components/Formulas.jsx";

/**
 * App — головний компонент DEX Explorer.
 * Зберігає стан пулу та передає його дочірнім компонентам.
 */

export default function App() {
    const [pool, setPool] = useState({
        reserveA: 100000,
        reserveB: 100000,
        fee: 0.3, // у відсотках (0.3 = 0.3%)
    });

    return (
        <>
            {/* ── Header ── */}
            <header className="header">
                <div className="header__logo">
                    <span className="header__icon">⟠</span>
                    <h1>DEX Explorer</h1>
                </div>
                <p className="header__sub">Constant-Product AMM Simulator</p>
            </header>

            {/* ── Main ── */}
            <main className="main">
                <PoolSettings pool={pool} setPool={setPool} />
                <SwapForm pool={pool} />
                <Scenarios pool={pool} />
                <Formulas />
            </main>

            {/* ── Footer ── */}
            <footer className="footer">
                <p>
                    Constant-Product DEX Explorer &copy; 2026 &mdash; Uniswap v2 AMM
                    Simulator
                </p>
            </footer>
        </>
    );
}
