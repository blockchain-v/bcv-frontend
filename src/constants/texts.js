/*
UI texts, nestings are UI components (where possible)
 */

const uiTexts = {
  multilineInput: {
    warningText: "Not valid JSON! Unable to apply pretty formatting.",
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
  },
};

export { uiTexts };
