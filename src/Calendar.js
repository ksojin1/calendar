import React, { useEffect, useRef, useState } from "react";
import styles from './css/Calendar.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { change_Info } from './redux/info';

const Calendar = ({ page }) => {

   //전체 info
   const info = useSelector((state) => state.info);
   const dispatch = useDispatch();

  //달력에 표시할 날짜 숫자 { last: [지난달], this: [이번달], next: [다음달] }
  const [days, setDays] = useState({last: [], this: [], next: []});

  //선택한 Year, Month, Date, isDate(입력한 날짜가 DATE 타입인 경우 true)
  const [selectInfo, setSelectInfo] = useState({year: 0, month: 0, date: new Date(), isDate: false});

  //년도 월 select Box option 보여주기 위해 CK
  const [option, setoption] = useState({year: false, month: false});

  //년도 ol Ref
  const year_Ref = useRef(null);

  //월 ol Ref
  const month_Ref = useRef(null);

  //Month option list
  const monthLoop = () => {
    const month_Arr = [];
    for(let i=1; i<13; i++){
      month_Arr.push(
        <li key={i} className={selectInfo.month === (i-1) ? styles.selected_option : styles.option}
        onClick={() => {
          setSelectInfo({...selectInfo, month: i-1});
          setoption({year: false, month:false});
        }}>{i}월</li>
      );
    }
    return month_Arr;
  }

  //Year option list (100년전 부터 이번년도까지)
  const yearLoop = () => {
    const year_Arr = [];
    const max_Year = new Date().getFullYear();
    for(let i=max_Year; i>=max_Year-100; i--){
      year_Arr.push(
        <li key={i} className={selectInfo.year === i ? styles.selected_option : styles.option}
        onClick={() => {
          setSelectInfo({...selectInfo, year: i});
          setoption({year: false, month:false});
        }}>{i}년</li>
      );
    }
    return year_Arr;
  }

  //달력날짜 클릭 -> info[page].date변경
  const changeDateFnc = (day) => {
    const new_Info = [...info];
    let new_Month = selectInfo.month+1;
    let new_day = day;
    if(new_Month < 10) new_Month = `0${new_Month}`;
    if(new_day < 10) new_day = `0${new_day}`;
    new_Info[page].date = `${selectInfo.year}.${new_Month}.${new_day}`;
    dispatch(change_Info(new_Info));
  }

  //지난달 달력으로 이동
  const moveLastMonthFnc = () => {
    let new_Year = selectInfo.year;
    let new_Month = selectInfo.month;
    if(new_Month === 0 && selectInfo.year !== new Date().getFullYear()-100)
      setSelectInfo({...selectInfo, year: new_Year-1, month: 11});
    else if(new_Month !== 0)
      setSelectInfo({...selectInfo, month: new_Month-1});
  }

  //다음달 달력으로 이동
  const moveNextMonthFnc = () => {
    let new_Year = selectInfo.year;
    let new_Month = selectInfo.month;
    if(new_Month === 11 && selectInfo.year !== new Date().getFullYear())
      setSelectInfo({...selectInfo, year: new_Year+1, month: 0});
    else if(new_Month !== 11)
      setSelectInfo({...selectInfo, month: new_Month+1});
  }

  //select Box 클릭시
  const selectOptionSetFnc = (type) => {
    if(type === 'year'){
      setoption({year: !option.year, month: false});
      const max_Year = new Date().getFullYear();
      let scroll_Y = (max_Year - selectInfo.date.getFullYear() - 3) * 28;
      year_Ref.current.scrollTo(0, scroll_Y);
    }else if(type === 'month'){
      setoption({year: false, month: !option.month});
    }
    
  }

  //select Box 년도 월 option 처음에 보여줄 때 value scroll
  useEffect(() => {
    if(option.year){
      const max_Year = new Date().getFullYear();
      let scroll_Y = (max_Year - selectInfo.year - 3) * 28;
      year_Ref.current.scrollTo(0, scroll_Y);
    }else if(option.month){
      let scroll_Y = (selectInfo.month - 3) * 28;
      month_Ref.current.scrollTo(0, scroll_Y);
    }
  }, [option]);

  //달력의 년도 or 월 변경 될 때 달력 숫자 만들기
  useEffect(() => {
    const new_days = {last: [], this: [], next: []};//달력에 표시할 날짜 숫자
    const start_Days = new Date(selectInfo.year, selectInfo.month, 1).getDay();//선택한 달의 시작 요일
    let out_Date = new Date(selectInfo.year, selectInfo.month, -start_Days);//달력에 보여줄 날짜 시작점
    for(let i=0; i<42; i++){
      out_Date.setDate(out_Date.getDate()+1);

      //선택한 달이 1월이 아니고 out_Date가 지난달인 경우 or 선택한 달이 1월이고 out_Date가 12월인 경우
      if((selectInfo.month !== 0 && out_Date.getMonth() === selectInfo.month-1) || (selectInfo.month === 0 && out_Date.getMonth() === 11))
        new_days.last.push(out_Date.getDate());//지난달에 추가

      //선택한 달과 out_Date의 달이 같은 경우
      if((selectInfo.month === out_Date.getMonth()))
        new_days.this.push(out_Date.getDate());//이번달에 추가

      //선택한 달이 12월이 아니고 out_Date가 다음달인 경우 or 선택한 달이 12월이고 out_Date가 1월인 경우
      if((selectInfo.month !== 11 && out_Date.getMonth() === selectInfo.month+1) || (selectInfo.month === 11 && out_Date.getMonth() === 0))
        new_days.next.push(out_Date.getDate());//다음달에 추가
    }

    setDays(new_days);

  },[selectInfo.year, selectInfo.month]);

  //날짜가 변경 될 때 (달력선택 or 입력수정)
  useEffect(() => {
    const info_Date = new Date(info[page].date);

    //잘못된 값을 넣으면 달력은 오늘 날짜 기준으로 보여줌
    if(info_Date.toString() !== 'Invalid Date') {
      setSelectInfo({ year: info_Date.getFullYear(), month: info_Date.getMonth(), date: info_Date, isDate: true });
    }else {
      const curt_Date = new Date();
      setSelectInfo({ year: curt_Date.getFullYear(), month: curt_Date.getMonth(), date: curt_Date, isDate: false });
    }

    //년도 월 select Box hidden
    setoption({year: false, month: false});
  },[info[page].date]);

  return (
    <div className={styles.cal_wrap}>
      <div className={styles.cal_div}>
        <div className={styles.nav_div}>
          <div className={styles.btn_div} onClick={moveLastMonthFnc}><span className={styles.left_btn}></span></div>
          <div className={styles.select} id={option.year ? styles.select_filled : ''}>
            <div className={styles.select_val} onClick={() => selectOptionSetFnc('year')}>
              <p>{selectInfo.year}년</p>
              <span className={styles.bottom_btn}></span>
            </div>
            <ol className={styles.option_list} ref={year_Ref} hidden={!option.year}>
              {yearLoop()}
            </ol>
          </div>
          <div className={styles.select} id={option.month ? styles.select_filled : ''}>
            <div className={styles.select_val} onClick={() => selectOptionSetFnc('month')}>
              <p>{selectInfo.month+1}월</p>
              <span className={styles.bottom_btn}></span>
            </div>
            <ol className={styles.option_list} ref={month_Ref} hidden={!option.month}>
              {monthLoop()}
            </ol>
          </div>
          <div className={styles.btn_div} onClick={moveNextMonthFnc}><span className={styles.right_btn}></span></div>
        </div>
        <div className={styles.week_div}>
          <span>일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span>토</span>
        </div>
        <div className={styles.days_div}>

          {days.last.map(day => {return <div onClick={moveLastMonthFnc} key={day} className={styles.last_days}>{day}</div>})}

          {days.this.map(day => {
            let today = false; //today 체크
            let selectDay = false; //선택한 날짜 체크
            if(selectInfo.isDate === true && selectInfo.year === selectInfo.date.getFullYear() 
              && selectInfo.month === selectInfo.date.getMonth() && day === selectInfo.date.getDate()) {
              selectDay = true;
            }else {
              const day_Date = `${selectInfo.year}-${selectInfo.month}-${day}`;
              let today_Date = new Date();
              today_Date = `${today_Date.getFullYear()}-${today_Date.getMonth()}-${today_Date.getDate()}`;
              if(day_Date === today_Date) today = true;
            }
            return <div onClick={() => changeDateFnc(day)} key={day} className={selectDay ? styles.select_day : styles.this_days}
              style={today ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}>{day}</div>
          })}

          {days.next.map(day => {return <div onClick={moveNextMonthFnc} key={day} className={styles.next_days}>{day}</div>})}

        </div>
      </div>
    </div>
  );
}

export default Calendar;