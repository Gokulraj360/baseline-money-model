import { useApp } from '../store/AppStore';
import { money } from '../lib/format';

/** Formats money, or masks it when the user has hidden balances. */
export function useMoney() {
  const { state } = useApp();
  return (n: number, precise = false): string =>
    state.settings.hideBalances ? '₹ ••••••' : money(n, precise);
}
