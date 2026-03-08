/**
 * PoolSettings — налаштування резервів пулу та комісії.
 * Показує спот-ціну та значення k в реальному часі.
 */

export default function PoolSettings({ pool, setPool }) {
    const spotPrice = pool.reserveB / pool.reserveA;
    const k = pool.reserveA * pool.reserveB;

    const handleChange = (field, value) => {
        const num = parseFloat(value);
        if (!isNaN(num) && num > 0) {
            setPool((prev) => ({ ...prev, [field]: num }));
        }
    };

    return (
        <section className="card card--pool">
            <h2 className="card__title">🏊 Налаштування пулу</h2>
            <div className="form-grid">
                <div className="field">
                    <label htmlFor="reserveA">Reserve A</label>
                    <input
                        type="number"
                        id="reserveA"
                        value={pool.reserveA}
                        min="1"
                        onChange={(e) => handleChange("reserveA", e.target.value)}
                    />
                </div>
                <div className="field">
                    <label htmlFor="reserveB">Reserve B</label>
                    <input
                        type="number"
                        id="reserveB"
                        value={pool.reserveB}
                        min="1"
                        onChange={(e) => handleChange("reserveB", e.target.value)}
                    />
                </div>
                <div className="field">
                    <label htmlFor="fee">Fee (%)</label>
                    <input
                        type="number"
                        id="fee"
                        value={pool.fee}
                        min="0"
                        step="0.01"
                        onChange={(e) => handleChange("fee", e.target.value)}
                    />
                </div>
                <div className="field">
                    <label>Спот-ціна (B/A)</label>
                    <input
                        type="text"
                        value={spotPrice.toFixed(6)}
                        readOnly
                        className="field--readonly"
                    />
                </div>
            </div>
            <div className="pool-info">
                <span className="badge">
                    k = {k.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </span>
            </div>
        </section>
    );
}
