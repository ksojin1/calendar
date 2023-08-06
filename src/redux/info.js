export const CHANGE_INFO = "INFO/CHANGE_INFO";

export const change_Info = info => ({ type: CHANGE_INFO, payload: info});

const infoInitialState = [
    {//첫번째 페이지
      info1: "",
      info2: "",
      info3: "",
      info4: "",
      date: "",
      info5: "",
      info6: []
    },{//두번째 페이지
      info1: "",
      info2: "",
      info3: "",
      info4: "",
      date: "",
      info5: "",
      info6: []
    },{//세번째 페이지
      info1: "",
      info2: "",
      info3: "",
      info4: "",
      date: "",
      info5: "",
      info6: []
    },{//네번째 페이지
      info1: "",
      info2: "",
      info3: "",
      info4: "",
      date: "",
      info5: "",
      info6: []
    }
];

const info = (state = infoInitialState, action) => {
    switch(action.type){
        case CHANGE_INFO:
            return action.payload;
        default:
            return state;
    }
};

export default info;