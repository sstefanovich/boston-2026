import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { formatMoney } from '../utils/exchange';
import { DataStatusBadge } from './DataStatusBadge';

const QUICK_USD = [10, 20, 50, 100];

interface CurrencyConverterProps {
  compact?: boolean;
}

export function CurrencyConverter({ compact = false }: CurrencyConverterProps) {
  const { rates, loading } = useExchangeRates();
  const [direction, setDirection] = useState<'usd-eur' | 'eur-usd'>('usd-eur');
  const [amount, setAmount] = useState('');
  const [tipBill, setTipBill] = useState('');
  const [tipPct, setTipPct] = useState('10');
  const [tipRegion, setTipRegion] = useState<'fr' | 'be'>('fr');

  const num = Number.parseFloat(amount.replace(/,/g, '')) || 0;
  const converted = useMemo(() => {
    if (!rates || num <= 0) return null;
    if (direction === 'usd-eur') return num * rates.usdToEur;
    return num * rates.eurToUsd;
  }, [rates, num, direction]);

  const tip = useMemo(() => {
    const bill = Number.parseFloat(tipBill.replace(/,/g, '')) || 0;
    const pct = Number.parseFloat(tipPct) || 0;
    if (bill <= 0 || pct <= 0) return null;
    const tipEur = (bill * pct) / 100;
    const totalEur = bill + tipEur;
    const tipUsd = rates ? tipEur * rates.eurToUsd : null;
    const totalUsd = rates ? totalEur * rates.eurToUsd : null;
    return { tipEur, totalEur, tipUsd, totalUsd };
  }, [tipBill, tipPct, rates]);

  const statusMode = loading
    ? 'loading'
    : rates?.offlineEstimate
      ? 'offline'
      : rates?.fromCache
        ? 'cached'
        : 'live';

  const rateLine = rates
    ? rates.offlineEstimate
      ? `Estimate: $1 ≈ ${formatMoney(rates.usdToEur, 'EUR')} (offline)`
      : `ECB ${rates.rateDate}: $1 = ${formatMoney(rates.usdToEur, 'EUR')}`
    : 'Loading rate…';

  return (
    <div className={compact ? 'currency-compact' : 'currency-full'}>
      <div className="currency-head">
        {!compact && <h2>Currency</h2>}
        <DataStatusBadge mode={statusMode} />
      </div>
      <p className="currency-rate-line">{rateLine}</p>

      <div className="currency-direction">
        <button
          type="button"
          className={`tab ${direction === 'usd-eur' ? 'active' : ''}`}
          onClick={() => setDirection('usd-eur')}
        >
          $ → €
        </button>
        <button
          type="button"
          className={`tab ${direction === 'eur-usd' ? 'active' : ''}`}
          onClick={() => setDirection('eur-usd')}
        >
          € → $
        </button>
      </div>

      <label className="currency-label">
        {direction === 'usd-eur' ? 'US dollars' : 'Euros'}
        <input
          type="text"
          inputMode="decimal"
          className="currency-input"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>

      {converted != null && num > 0 && rates && (
        <p className="currency-result">
          ≈ {formatMoney(converted, direction === 'usd-eur' ? 'EUR' : 'USD')}
        </p>
      )}

      {!compact && (
        <div className="currency-quick">
          {QUICK_USD.map((q) => (
            <button
              key={q}
              type="button"
              className="btn currency-quick-btn"
              onClick={() => {
                setDirection('usd-eur');
                setAmount(String(q));
              }}
            >
              ${q}
            </button>
          ))}
        </div>
      )}

      {!compact && (
        <div className="currency-tip">
          <h3>Tip calculator</h3>
          <div className="currency-tip-region">
            <button
              type="button"
              className={`tab ${tipRegion === 'fr' ? 'active' : ''}`}
              onClick={() => {
                setTipRegion('fr');
                setTipPct('8');
              }}
            >
              France ~8%
            </button>
            <button
              type="button"
              className={`tab ${tipRegion === 'be' ? 'active' : ''}`}
              onClick={() => {
                setTipRegion('be');
                setTipPct('10');
              }}
            >
              Belgium ~10%
            </button>
          </div>
          <label className="currency-label">
            Bill (€)
            <input
              type="text"
              inputMode="decimal"
              className="currency-input"
              value={tipBill}
              onChange={(e) => setTipBill(e.target.value)}
            />
          </label>
          <label className="currency-label">
            Tip %
            <input
              type="text"
              inputMode="decimal"
              className="currency-input"
              value={tipPct}
              onChange={(e) => setTipPct(e.target.value)}
            />
          </label>
          {tip && (
            <p className="currency-tip-result">
              Tip {formatMoney(tip.tipEur, 'EUR')}
              {tip.tipUsd != null && ` (${formatMoney(tip.tipUsd, 'USD')})`}
              {' · '}
              Total {formatMoney(tip.totalEur, 'EUR')}
              {tip.totalUsd != null && ` (${formatMoney(tip.totalUsd, 'USD')})`}
            </p>
          )}
        </div>
      )}

      {compact && (
        <Link to="/currency" className="btn btn-primary currency-more-link">
          Full converter & tips →
        </Link>
      )}
      <p className="currency-foot">Frankfurter / ECB reference · pull down to refresh</p>
    </div>
  );
}
