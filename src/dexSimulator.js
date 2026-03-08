/**
 * ========================================================
 *  Constant-Product AMM Simulator  (Uniswap v2 style)
 * ========================================================
 *
 *  Інваріант:  reserveA × reserveB = k  (const)
 *
 *  Формула свопу (A → B):
 *    amountInWithFee = amountIn × (1 − fee)
 *    amountOut       = (reserveB × amountInWithFee)
 *                      / (reserveA + amountInWithFee)
 *
 *  Після свопу:
 *    newReserveA = reserveA + amountIn       (повна сума, з комісією)
 *    newReserveB = reserveB − amountOut
 *
 *  Slippage (%) = |effectivePrice − spotPrice| / spotPrice × 100
 *
 *  Джерела:
 *    • Uniswap v2 Whitepaper  — https://uniswap.org/whitepaper.pdf
 *    • Uniswap v2 Core Docs   — https://docs.uniswap.org/contracts/v2
 */

export class ConstantProductPool {
    /**
     * @param {number} reserveA  — резерв токена A
     * @param {number} reserveB  — резерв токена B
     * @param {number} fee       — комісія (напр. 0.003 = 0.3 %)
     */
    constructor(reserveA, reserveB, fee = 0.003) {
        this.reserveA = reserveA;
        this.reserveB = reserveB;
        this.fee = fee;
    }

    /* ───────── Спот-ціна (без торгівлі) ───────── */

    /**
     * Повертає поточну спот-ціну:
     *   A→B  →  reserveB / reserveA  (скільки B за 1 A)
     *   B→A  →  reserveA / reserveB  (скільки A за 1 B)
     *
     * @param {"AtoB" | "BtoA"} direction
     * @returns {number}
     */
    spotPrice(direction = "AtoB") {
        if (direction === "AtoB") {
            return this.reserveB / this.reserveA;
        }
        return this.reserveA / this.reserveB;
    }

    /* ───────── Своп ───────── */

    /**
     * Виконує своп і повертає результат.
     *
     * @param {number} amountIn              — скільки вкладаємо
     * @param {"AtoB" | "BtoA"} direction    — напрямок свопу
     * @returns {Object} — результат свопу
     */
    swap(amountIn, direction = "AtoB") {
        // ── Визначаємо "in" та "out" резерви залежно від напрямку
        const reserveIn = direction === "AtoB" ? this.reserveA : this.reserveB;
        const reserveOut = direction === "AtoB" ? this.reserveB : this.reserveA;

        // ── 1. Спот-ціна ДО свопу
        const spotPriceBefore = reserveOut / reserveIn;

        // ── 2. Віднімаємо комісію від amountIn
        //       amountInWithFee = amountIn × (1 − fee)
        const amountInWithFee = amountIn * (1 - this.fee);

        // ── 3. Рахуємо amountOut за формулою constant-product:
        //       amountOut = (reserveOut × amountInWithFee)
        //                   / (reserveIn + amountInWithFee)
        const amountOut =
            (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);

        // ── 4. Оновлюємо резерви
        //       Вхідний токен: додаємо ПОВНУ суму (комісія залишається в пулі)
        //       Вихідний токен: віднімаємо amountOut
        const newReserveIn = reserveIn + amountIn;
        const newReserveOut = reserveOut - amountOut;

        const newReserveA = direction === "AtoB" ? newReserveIn : newReserveOut;
        const newReserveB = direction === "AtoB" ? newReserveOut : newReserveIn;

        // ── 5. Ефективна ціна = amountOut / amountIn
        const effectivePrice = amountOut / amountIn;

        // ── 6. Slippage (%) = |effectivePrice − spotPrice| / spotPrice × 100
        const slippagePercent =
            (Math.abs(effectivePrice - spotPriceBefore) / spotPriceBefore) * 100;

        // ── 7. k до і після (для перевірки: k_after ≥ k_before)
        const k_before = this.reserveA * this.reserveB;
        const k_after = newReserveA * newReserveB;

        return {
            amountIn,
            amountOut: parseFloat(amountOut.toFixed(6)),
            newReserveA: parseFloat(newReserveA.toFixed(6)),
            newReserveB: parseFloat(newReserveB.toFixed(6)),
            effectivePrice: parseFloat(effectivePrice.toFixed(8)),
            spotPriceBefore: parseFloat(spotPriceBefore.toFixed(8)),
            slippagePercent: parseFloat(slippagePercent.toFixed(4)),
            k_before,
            k_after: parseFloat(k_after.toFixed(2)),
        };
    }
}
