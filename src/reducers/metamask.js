import { SET_METAMASK_ADDRESS, NO_ACTION } from "../actions/types";

const initialState = {
  isMetaMaskConnected: null,
  metaMaskAddress: null,
  metaMaskBalance: null,
};

const metamask = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_METAMASK_ADDRESS:
      return {
        ...state,
        metaMaskAddress: payload,
        isMetaMaskConnected: true,
      };
    case NO_ACTION:
    default:
      return state;
  }
};

export default metamask;
