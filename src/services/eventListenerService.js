import { registerEventListener, VNFContract } from "./truffleService";

export const attachEventListener = (eventType, callback) => {
  let e;
  switch (eventType) {
    case EventTypes.DeploymentStatus:
      e = VNFContract.events.DeploymentStatus;
      break;
    case EventTypes.RegistrationStatus:
      e = VNFContract.events.RegistrationStatus;
      break;
    case EventTypes.UnregistrationStatus:
      e = VNFContract.events.DeletionStatus;
      break;

  }

  registerEventListener(e, callback);
};

export const getEventMessage = (eventType, parameters) => {
  return parameters["success"] ? getEventMessageSuccess(eventType, parameters) : getEventMessageFailure(eventType, parameters);
}

const getEventMessageSuccess = (eventType, parameters) => {
  switch(eventType) {
    case EventTypes.DeploymentStatus:
      return `Deployment of VNF with ID ${parameters["vnfId"]} succeeded.`;
    case EventTypes.RegistrationStatus:
      return `Registration of user ${parameters["user"]} succeeded.`;
    case EventTypes.UnregistrationStatus:
      return `Unregistration of user ${parameters["user"]} succeeded.`;
  }
};

const getEventMessageFailure = (eventType, parameters) => {
  switch(eventType) {
    case EventTypes.DeploymentStatus:
      return `Deployment of VNF with deployment ID ${parameters["deploymentId"]} failed.`;
    case EventTypes.RegistrationStatus:
      return `Registration of user ${parameters["user"]} failed.`;
    case EventTypes.UnregistrationStatus:
      return `Unregistration succeeded.`
  }
};

export const EventTypes = {
  RegistrationStatus: 0,
  UnregistrationStatus: 1,
  DeploymentStatus: 2
};
