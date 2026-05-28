type AlertData = {
  type: "error" | "success" | "info";
  title: string;
  message: string;
};

let alertCallback: (data: AlertData) => void;

export const setAlertCallback = (cb: (data: AlertData) => void) => {
  alertCallback = cb;
};

export const showLudusAlert = (data: AlertData) => {
  if (alertCallback) alertCallback(data);
};
