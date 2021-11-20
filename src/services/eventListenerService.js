import { registerEventListener, VNFContract } from "./truffleService";

export const attachEventListener = (eventType, callback) => {
  let e;
  switch (eventType) {
    case "DeploymentStatus":
      e = VNFContract.events.DeploymentStatus;
      break;
    // todo: add more cases for other events
    case "RegistrationStatus":
      e = VNFContract.events.RegistrationStatus;
      break;
  }

  registerEventListener(e, callback);
};
