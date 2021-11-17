import { registerEventListener, VNFContract } from "./truffleService";

export const attachEventListener = (eventType, callback) => {
    
    let e;
    switch(eventType){
        case "DeploymentStatus":
            e = VNFContract.events.DeploymentStatus;
        // todo: add more cases for other events
    }

    registerEventListener(e, callback);
}