import { SET_METAMASK_ADDRESS, NO_ACTION } from "./types";
//Login Metamask
export const loginMetaMask = (address) => (dispatch) => {
  try {
    dispatch({
      type: SET_METAMASK_ADDRESS,
      payload: address,
    });
  } catch (err) {
    console.log(err);
    dispatch({ type: NO_ACTION });
  }
};
