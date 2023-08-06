import React, { useEffect, useState } from 'react'
import axios from "axios";
import Calendar from './Calendar';
import "./css/App.scss";

import { useSelector, useDispatch } from 'react-redux';
import { change_Info } from './redux/info';

function App() {

  //전체 info
  const info = useSelector((state) => state.info);
  const dispatch = useDispatch();

  //현재 페이지
  const [page, setPage] = useState(0);

  //메뉴 슬라이드 CK
  const [fold, setfold] = useState({first: false, second: false});

  //달력 활성화 CK
  const [cal, setCal] = useState(false);

  //정보 변경 시 setState
  const editInfoFnc = (e) => {
    let new_Info = [...info];
    const info_Type = e.target.name;
    if(e.target.type === 'checkbox'){
      if(e.target.checked)
        new_Info[page] = {...new_Info[page], info6 : [...new_Info[page].info6, e.target.value]};
      else
        new_Info[page] = {...new_Info[page], info6 : new_Info[page].info6.filter(val => val !== e.target.value)};
    }else 
      new_Info[page] = {...new_Info[page], [info_Type] : e.target.value};
    
    //state 변경
    dispatch(change_Info(new_Info));
  };

  //저장 버튼 클릭 시
  const saveInfoFnc = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://api-jobtest.json2bot.chat/test', info[page]);
      if(res.data.ok){
        alert(res.data.data.message);
      }  
    } catch (error) {
      const err_Data = error.response.data;
      alert(`${err_Data.error.message}\nERROR CODE : ${err_Data.httpcode}`);
    }
  }

  //정보 불러오기
  const getInfoFnc = async() => {
    try {
      const res = await axios.get('https://api-jobtest.json2bot.chat/test');
      if(res.data.ok){
        const result = res.data.data;
        result.date = result.date.replaceAll('-', '.');
        let new_Info = [result, result, result, result];
        dispatch(change_Info(new_Info));
      }
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    getInfoFnc();
  }, []);

  return (
    <div className="App">
      <div className="gnb_wrap">
        <h2 className={page < 2 ? 'ative_ul_title' : ''} style={(page < 2 && fold.first === true) ? {backgroundColor: '#E0E4E8'} : {}}
          onClick={() => setfold({...fold, first: !fold.first})}>
          대메뉴<span>{fold.first === true ? '▼' : '▲'}</span></h2>
        <ul style={fold.first === true ? {height: '0px'} : {height: '72px'}}>
          <li className={page === 0 ? 'ative_li' : ''} onClick={() => {setPage(0); setCal(false)}}>소메뉴</li>
          <li className={page === 1 ? 'ative_li' : ''} onClick={() => {setPage(1); setCal(false)}}>소메뉴</li>
        </ul>
        <h2 className={page > 1 ? 'ative_ul_title' : ''} style={(page > 1 && fold.second === true) ? {backgroundColor: '#E0E4E8'} : {}}
          onClick={() => setfold({...fold, second: !fold.second})}>
          대메뉴<span>{fold.second === true ? '▼' : '▲'}</span></h2>
        <ul style={fold.second === true ? {height: '0px'} : {height: '72px'}}>
          <li className={page === 2 ? 'ative_li' : ''} onClick={() => {setPage(2); setCal(false)}}>소메뉴</li>
          <li className={page === 3 ? 'ative_li' : ''} onClick={() => {setPage(3); setCal(false)}}>소메뉴</li>
        </ul>
      </div>
      <div className="info_wrap">
        <h1 className="info_title">타이틀</h1>
        <form onSubmit={(e) => saveInfoFnc(e)}>
          <div className='info_div'>
            <h2>정보1</h2>
            <p>{info[page].info1}</p>
          </div>
          <div className='info_div'>
            <h2>정보2</h2>
            <input type="text" name="info2" onChange={editInfoFnc} value={info[page].info2}/>
          </div>
          <div className='info_div'>
            <h2>정보3</h2>
            <p>{info[page].info3}</p>
          </div>
          <div className='info_div'>
            <h2>정보4</h2>
            <input type="text" name="info4" onChange={editInfoFnc} value={info[page].info4} />
          </div>
          <div className='info_div'>
            <h2>날짜</h2>
            <input className='date_input' type="text" name="date" onChange={editInfoFnc} value={info[page].date} placeholder="yyyy.mm.dd"
              onFocus={() => setCal(true)}/>
            {cal && (
              <>
              <Calendar page={page}/>
              {/* 날짜 input, Calendar 외부 영역 클릭 시 달력 비활성화 */}
              <div onClick={() => setCal(false)} style={{width: '100%', height: '100%', position: 'fixed', zIndex: '9', top: '0px', left: '0px'}}></div>
              </>
            )}
            
          </div>
          <div className='info_div'>
            <h2>정보5</h2>
            <div className="select_div">
              <div><input type="radio" name="info5" value="선택1" onChange={editInfoFnc} checked={info[page].info5 === "선택1"} id="radio1"/><label htmlFor="radio1">선택1</label></div>
              <div><input type="radio" name="info5" value="선택2" onChange={editInfoFnc} checked={info[page].info5 === "선택2"} id="radio2"/><label htmlFor="radio2">선택2</label></div>
              <div><input type="radio" name="info5" value="선택3" onChange={editInfoFnc} checked={info[page].info5 === "선택3"} id="radio3"/><label htmlFor="radio3">선택3</label></div>
              {info[page].info5 === "선택3" && <p>{`* ${info[page].info5}`}</p>}
            </div>
          </div>
          <div className='info_div'>
            <h2>정보6</h2>
            <div className="select_div">
              <div><input type="checkbox" name="info6_ckbox1" value="선택1" onChange={editInfoFnc} checked={info[page].info6.indexOf("선택1") !== -1} id="ckbox1"/><label htmlFor="ckbox1">선택1</label></div>
              <div><input type="checkbox" name="info6_ckbox2" value="선택2" onChange={editInfoFnc} checked={info[page].info6.indexOf("선택2") !== -1} id="ckbox2"/><label htmlFor="ckbox2">선택2</label></div>
              <div><input type="checkbox" name="info6_ckbox3" value="선택3" onChange={editInfoFnc} checked={info[page].info6.indexOf("선택3") !== -1} id="ckbox3"/><label htmlFor="ckbox3">선택3</label></div>
            </div>
          </div>
          <input type="submit" value="저장"/>
        </form>
      </div>
    </div>
  );
}

export default App;
