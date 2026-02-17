import type { Router } from "expo-router";

let routerRef: Router | null = null;

export function setRouter(router: Router) {
  routerRef = router;
}

export function goToVerify(phone?: string) {
  if (!routerRef) return;

  routerRef.replace({
    pathname: "/verify",
    params: phone ? { phone } : {},
  });
}
