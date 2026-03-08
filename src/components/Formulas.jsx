/**
 * Formulas — секція з формулами AMM для довідки.
 */

export default function Formulas() {
    return (
        <section className="card card--formulas">
            <h2 className="card__title">📐 Формули</h2>
            <div className="formula-block">
                <p><strong>Інваріант:</strong></p>
                <code>x × y = k</code>

                <p><strong>Своп (A → B):</strong></p>
                <code>amountInWithFee = amountIn × (1 − fee)</code>
                <code>
                    amountOut = (reserveB × amountInWithFee) / (reserveA + amountInWithFee)
                </code>

                <p><strong>Slippage:</strong></p>
                <code>slippage (%) = |effectivePrice − spotPrice| / spotPrice × 100</code>
            </div>
        </section>
    );
}
