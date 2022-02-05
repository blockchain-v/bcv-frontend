/*
UI texts, nestings are UI components (where possible)
 */

const uiTexts = {
  multilineInput: {
    warningTextJSON: "Not valid JSON! Unable to apply pretty formatting.",
    warningTextYAML: "Not valid YAML! Unable to parse user input.",
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
};

export { uiTexts };
