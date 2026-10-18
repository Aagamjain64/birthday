import { useEffect, useState } from "react";
import { checkAsset } from "../utils/asset";

export function useAssetReady(src) {
  const [state, setState] = useState({ ready: false, missing: false, loading: true });

  useEffect(() => {
    let cancelled = false;
    setState({ ready: false, missing: false, loading: true });
    if (!src) {
      setState({ ready: false, missing: true, loading: false });
      return undefined;
    }
    checkAsset(src).then((ok) => {
      if (!cancelled) setState({ ready: ok, missing: !ok, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  return state;
}
