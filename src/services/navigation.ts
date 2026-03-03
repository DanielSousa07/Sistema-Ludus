import type { Router } from "expo-router";

let routerRef: Router | null = null;

export function setRouter(router: Router) {
  routerRef = router;
}

export function goToVerify(params?: { email?: string; phone?: string }) {
  if (!routerRef) return;

  routerRef.replace({
    pathname: "/verify",
    params: {
      ...(params?.email ? { email: params.email } : {}),
      ...(params?.phone ? { phone: params.phone } : {}),
    },
  });
}

export function goToRoute(pathname: string, params?: Record<string, any>) {
  if (!routerRef) return;
  routerRef.push({ pathname: pathname as any, params: params ?? {} } as any);
}