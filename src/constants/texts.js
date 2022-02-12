/*
UI texts, nestings are UI components (where possible)
 */
import { actionIDs } from "./interfaceConfig";

const uiTexts = {
  multilineInput: {
    warningTextJSON: "Not valid JSON! Unable to apply pretty formatting.",
    warningTextYAML: "Not valid YAML! Unable to parse user input.",
  },
  deployVnf: {
    selectionLabel: "Select / paste VNF Descriptor Name",
    selectionIdLabel: "VNFD ID",
    selectionDescriptionLabel: "VNFD Description",
    vnfSpecificationNameLabel: "VNF Name",
    vnfSpecificationNamePlaceholder: "Enter VNF Name...",
    vnfSpecificationDescriptionLabel: "VNF Description",
    vnfSpecificationDescriptionPlaceholder: "Enter VNF Description...",
    paramInfo:
      "Fill in the values for the parametrized fields in the selected VNF Descriptor",
    configPlaceholder: "{}",
    configInfo: "Provide a configuration object in JSON format",
    configTrue: "remove configuration",
    configTrueIcon: "-",
    configFalse: "(Optional) add configuration",
    configFalseIcon: "+",
  },
  postVnf: {
    startFromTemplate: "Start from template",
    selectTemplateLabel: "Select a VNF Descriptor template",
    selectTemplateExplanation:
      "Chose from a number of sample VNFDs also provided on",
    selectTemplateLink:
      "https://github.com/openstack/tacker/tree/master/samples/tosca-templates/vnfd",
    selectTemplateLinkText: "the OpenStack Tacker Github page.",
    selectTemplateButton: "Confirm",
    selectTemplateButtonNone: "Close",
    clearTemplate: "Clear template",
  },
  detailsView: {
    buttonTextCopy: "Copy",
    buttonTextCopied: "Copied!",
    sectionLabelGeneral: "General",
    sectionLabelAttributes: "Attributes",
    deleteVnfButton: "Delete VNF",
    deleteVnfButtonPendingCreate:
      "VNF still pending create, unable to delete yet",
  },
  spinner: {
    awaitingContract:
      "Waiting for smart contract feedback. This may take a moment.",
  },
  home: {
    currentUserAddress: "current user address: ",
    userNotRegistered: {
      title: "User not yet registered!",
    },
    userCheckRequired: {
      title: "User action required!",
      explanation:
        "<p>The System needs you to sign a challenge value so it can " +
        "verify if your current address <br>has already been registered and " +
        "that you are in possession of the corresponding private key!</p>",
      hint:
        "<p>If you did not get a notification from MetaMask asking you for<br>" +
        "a signature or accidentally closed it, refresh the page</p>",
    },
    waitingForRegistrationEvent: {
      title: "Waiting for Smart Contract feedback",
      explanation:
        "<p>System is waiting for feedback from the Smart Contract on whether <br>" +
        "the user registration process was successful.<br>" +
        "This may take a few moments</p>",
    },
  },
  callNotification: {
    [actionIDs.POST_VNFD]: {
      success: "Successfully created VNF Descriptor!",
      error: "Failed to create VNF Descriptor!",
    },
  },
};

export { uiTexts };
