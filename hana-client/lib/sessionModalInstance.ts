// lib/sessionModalInstance.ts
type SessionModalController = {
  showModal: () => void;
};

let instance: SessionModalController | null = null;

export function setSessionModalInstance(ctx: SessionModalController) {
  instance = ctx;
}

export function getSessionModalInstance() {
  return instance;
}
